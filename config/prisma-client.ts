import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// make a singleton instance of PrismaClient
let prisma: PrismaClient | null = null;

export default function getClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}