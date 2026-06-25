import { prisma } from "@/backend/db/prisma";

export async function getGlobalStats() {
  const [users, actions, blocks, approvedActions] = await Promise.all([
    prisma.user.count(),
    prisma.action.count(),
    prisma.block.count(),
    prisma.action.findMany({ where: { status: "APPROVED" } })
  ]);

  const totalCo2 = approvedActions.reduce((sum, action) => sum + action.co2Compensated, 0);
  const totalTokens = approvedActions.reduce((sum, action) => sum + action.tokensAwarded, 0);

  return {
    users,
    actions,
    blocks,
    totalCo2: Number(totalCo2.toFixed(2)),
    totalTokens
  };
}

export async function getUserStats(userId: string) {
  const [actions, wallet, transactions] = await Promise.all([
    prisma.action.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { blocks: true }
    }),
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { block: true, action: true }
    })
  ]);

  const totalCo2 = actions.reduce((sum, action) => sum + action.co2Compensated, 0);

  return {
    actions,
    transactions,
    totalCo2: Number(totalCo2.toFixed(2)),
    balance: wallet?.balance ?? 0
  };
}
