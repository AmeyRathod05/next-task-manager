import "dotenv/config";
import { PrismaClient } from '../generated/prisma/index'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const isProduction = process.env.NODE_ENV === 'production'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: isProduction ? [] : ['query'],
  ...(isProduction && {
    accelerateUrl: process.env.DATABASE_URL,
  }),
})

if (!isProduction) globalForPrisma.prisma = prisma
