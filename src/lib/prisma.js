import { PrismaClient } from '@/generated/prisma/client';

// PrismaClient'ı singleton olarak kullanmak için
// Development'ta hot reload sırasında yeni instance oluşmasını önler
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}


