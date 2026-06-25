import { ActionType } from "@prisma/client";

export type AiValidationInput = {
  type: ActionType;
  amount: number;
  description: string;
};

export type AiValidationResult = {
  aprobado: boolean;
  confianza: number;
  co2Compensado: number;
  tokensOtorgados: number;
  observacion: string;
};

const factors: Record<ActionType, { label: string; co2PerUnit: number; unit: string }> = {
  RECICLAJE: { label: "Reciclaje", co2PerUnit: 0.5, unit: "kg" },
  BICICLETA: { label: "Bicicleta", co2PerUnit: 0.2, unit: "km" },
  ENERGIA_SOLAR: { label: "Energia Solar", co2PerUnit: 1.5, unit: "kWh" },
  COMPOSTAJE: { label: "Compostaje", co2PerUnit: 0.35, unit: "kg" },
  TRANSPORTE_PUBLICO: { label: "Transporte Publico", co2PerUnit: 0.12, unit: "km" }
};

export function getActionLabel(type: ActionType) {
  return factors[type].label;
}

export function getActionUnit(type: ActionType) {
  return factors[type].unit;
}

export function analyzeSustainableAction(input: AiValidationInput): AiValidationResult {
  const normalizedDescription = input.description.trim();
  const baseFactor = factors[input.type].co2PerUnit;
  const co2Compensado = Number((input.amount * baseFactor).toFixed(2));

  const amountScore = input.amount > 0 ? 34 : 0;
  const descriptionScore = Math.min(28, Math.floor(normalizedDescription.length / 4));
  const typeScore = 24;
  const realismPenalty = input.amount > 10000 ? 45 : input.amount > 1000 ? 20 : 0;
  const confidence = Math.max(8, Math.min(99, amountScore + descriptionScore + typeScore - realismPenalty + 12));

  const aprobado = confidence >= 60 && co2Compensado > 0;
  const tokensOtorgados = aprobado ? Math.round(co2Compensado * 100) : 0;
  const observacion = aprobado
    ? `Accion valida: ${input.amount} ${factors[input.type].unit} de ${factors[input.type].label}.`
    : "Accion rechazada por datos insuficientes o cantidad poco realista.";

  return {
    aprobado,
    confianza: confidence,
    co2Compensado: aprobado ? co2Compensado : 0,
    tokensOtorgados,
    observacion
  };
}
