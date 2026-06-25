import { PrismaClient, ActionType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const prisma = new PrismaClient();

const actionTypes = [
  ActionType.RECICLAJE,
  ActionType.BICICLETA,
  ActionType.ENERGIA_SOLAR,
  ActionType.COMPOSTAJE,
  ActionType.TRANSPORTE_PUBLICO
];

const emissionFactors: Record<ActionType, number> = {
  RECICLAJE: 0.5,
  BICICLETA: 0.2,
  ENERGIA_SOLAR: 1.5,
  COMPOSTAJE: 0.35,
  TRANSPORTE_PUBLICO: 0.12
};

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function buildHash(index: number, previousHash: string, timestamp: Date, data: string) {
  let nonce = 0;
  let hash = "";

  do {
    nonce += 1;
    hash = sha256(`${index}${previousHash}${timestamp.toISOString()}${data}${nonce}`);
  } while (!hash.startsWith("00") && nonce < 5000);

  return { hash, nonce };
}

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.block.deleteMany();
  await prisma.action.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("EcoToken123!", 10);
  const names = [
    ["Admin", "EcoToken", "admin@ecotoken.edu", UserRole.ADMIN],
    ["Sofia", "Verde", "sofia@ecotoken.edu", UserRole.USER],
    ["Mateo", "Solar", "mateo@ecotoken.edu", UserRole.USER],
    ["Valentina", "Rio", "valentina@ecotoken.edu", UserRole.USER],
    ["Lucas", "Bosque", "lucas@ecotoken.edu", UserRole.USER],
    ["Martina", "Circular", "martina@ecotoken.edu", UserRole.USER],
    ["Tomas", "Urbano", "tomas@ecotoken.edu", UserRole.USER],
    ["Camila", "Compost", "camila@ecotoken.edu", UserRole.USER],
    ["Nicolas", "Bici", "nicolas@ecotoken.edu", UserRole.USER],
    ["Julieta", "Luz", "julieta@ecotoken.edu", UserRole.USER]
  ] as const;

  const users = [];
  for (const [firstName, lastName, email, role] of names) {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        role,
        wallet: { create: { balance: 0 } }
      }
    });
    users.push(user);
  }

  let previousHash = "0".repeat(64);
  const genesisData = JSON.stringify({
    event: "Genesis EcoToken",
    purpose: "Inicio de cadena simulada academica"
  });
  const genesisDate = new Date("2026-01-01T00:00:00.000Z");
  const genesisHash = buildHash(1, previousHash, genesisDate, genesisData);

  await prisma.block.create({
    data: {
      hash: genesisHash.hash,
      previousHash,
      timestamp: genesisDate,
      data: genesisData,
      nonce: genesisHash.nonce
    }
  });
  previousHash = genesisHash.hash;

  for (let i = 0; i < 99; i += 1) {
    const user = users[i % users.length];
    const type = actionTypes[i % actionTypes.length];
    const amount = Number((2 + (i % 12) * 1.75).toFixed(2));
    const co2 = Number((amount * emissionFactors[type]).toFixed(2));
    const tokens = Math.round(co2 * 100);
    const createdAt = new Date(Date.UTC(2026, i % 6, 1 + (i % 26), 12, i % 60));

    let actionId: string | undefined;
    if (i < 50) {
      const action = await prisma.action.create({
        data: {
          userId: user.id,
          type,
          amount,
          description: `Accion sustentable demo ${i + 1}`,
          imageUrl: "/uploads/demo-evidence.svg",
          status: "APPROVED",
          aiConfidence: 82 + (i % 17),
          aiObservation: "Accion valida segun reglas de simulacion",
          co2Compensated: co2,
          tokensAwarded: tokens,
          createdAt
        }
      });
      actionId = action.id;

      await prisma.wallet.update({
        where: { userId: user.id },
        data: { balance: { increment: tokens } }
      });
    }

    const payload = {
      actionId: actionId ?? null,
      userId: user.id,
      actionType: type,
      co2Compensated: co2,
      tokensAwarded: tokens,
      academicSimulation: true
    };
    const data = JSON.stringify(payload);
    const proof = buildHash(i + 2, previousHash, createdAt, data);
    const block = await prisma.block.create({
      data: {
        hash: proof.hash,
        previousHash,
        timestamp: createdAt,
        data,
        nonce: proof.nonce,
        actionId
      }
    });
    previousHash = proof.hash;

    if (actionId) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          actionId,
          blockId: block.id,
          amount: tokens,
          note: `EcoTokens ganados por ${type}`,
          createdAt
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
