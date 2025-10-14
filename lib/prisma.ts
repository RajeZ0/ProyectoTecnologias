import { PrismaClient } from '@/lib/generated/prisma'

type GlobalPrisma = {
  prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis as unknown as GlobalPrisma

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
