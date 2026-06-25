import { ActionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeSustainableAction } from "@/backend/services/aiService";
import { getSession } from "@/backend/auth/auth";
import { blockchain } from "@/backend/services/blockchain";
import { prisma } from "@/backend/db/prisma";
import { saveEvidenceImage } from "@/backend/services/storage";

const actionSchema = z.object({
  type: z.nativeEnum(ActionType),
  amount: z.coerce.number().positive().max(10000),
  description: z.string().min(8).max(1000)
});

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Sesion requerida." }, { status: 401 });

  const formData = await request.formData();
  const parsed = actionSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    description: formData.get("description")
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos para la accion sustentable." }, { status: 400 });
  }

  const image = formData.get("image");
  let imageUrl: string | null = null;

  if (image instanceof File && image.size > 0) {
    if (!allowedMimeTypes.includes(image.type)) {
      return NextResponse.json({ error: "La imagen debe ser JPG, PNG o WEBP." }, { status: 400 });
    }
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no puede superar 10 MB." }, { status: 400 });
    }
    imageUrl = await saveEvidenceImage(image);
  }

  const ai = analyzeSustainableAction(parsed.data);

  const result = await prisma.$transaction(async (tx) => {
    const action = await tx.action.create({
      data: {
        userId: session.userId,
        type: parsed.data.type,
        amount: parsed.data.amount,
        description: parsed.data.description,
        imageUrl,
        status: ai.aprobado ? "APPROVED" : "REJECTED",
        aiConfidence: ai.confianza,
        aiObservation: ai.observacion,
        co2Compensated: ai.co2Compensado,
        tokensAwarded: ai.tokensOtorgados
      }
    });

    if (!ai.aprobado) return { action, block: null };

    await tx.wallet.upsert({
      where: { userId: session.userId },
      update: { balance: { increment: ai.tokensOtorgados } },
      create: { userId: session.userId, balance: ai.tokensOtorgados }
    });

    return { action, block: null };
  });

  if (!ai.aprobado) {
    return NextResponse.json({ action: result.action, ai });
  }

  const block = await blockchain.addBlock(
    {
      actionId: result.action.id,
      userId: session.userId,
      actionType: result.action.type,
      co2Compensated: ai.co2Compensado,
      tokensAwarded: ai.tokensOtorgados,
      aiConfidence: ai.confianza,
      academicSimulation: true
    },
    result.action.id
  );

  await prisma.transaction.create({
    data: {
      userId: session.userId,
      actionId: result.action.id,
      blockId: block.id,
      amount: ai.tokensOtorgados,
      note: `EcoTokens ganados por ${result.action.type}`
    }
  });

  return NextResponse.json({ action: result.action, ai, block });
}
