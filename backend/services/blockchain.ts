import { createHash } from "crypto";
import { prisma } from "@/backend/db/prisma";

export type BlockPayload = {
  actionId: string;
  userId: string;
  actionType: string;
  co2Compensated: number;
  tokensAwarded: number;
  aiConfidence: number;
  academicSimulation: true;
};

export class Block {
  id: number;
  hash: string;
  previousHash: string;
  timestamp: Date;
  data: string;
  nonce: number;

  constructor(id: number, previousHash: string, data: string, timestamp = new Date()) {
    this.id = id;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return createHash("sha256")
      .update(`${this.id}${this.previousHash}${this.timestamp.toISOString()}${this.data}${this.nonce}`)
      .digest("hex");
  }

  mine(difficulty = 2) {
    const prefix = "0".repeat(difficulty);
    while (!this.hash.startsWith(prefix)) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
  }
}

export class Blockchain {
  async getLatestBlock() {
    return prisma.block.findFirst({ orderBy: { id: "desc" } });
  }

  async addBlock(payload: BlockPayload, actionId: string) {
    const latestBlock = await this.getLatestBlock();
    const previousHash = latestBlock?.hash ?? "0".repeat(64);
    const nextIndex = (latestBlock?.id ?? 0) + 1;
    const block = new Block(nextIndex, previousHash, JSON.stringify(payload));
    block.mine(2);

    return prisma.block.create({
      data: {
        hash: block.hash,
        previousHash: block.previousHash,
        timestamp: block.timestamp,
        data: block.data,
        nonce: block.nonce,
        actionId
      }
    });
  }

  async isValid() {
    const chain = await prisma.block.findMany({ orderBy: { id: "asc" } });
    for (let i = 1; i < chain.length; i += 1) {
      if (chain[i].previousHash !== chain[i - 1].hash) return false;
    }
    return true;
  }
}

export const blockchain = new Blockchain();
