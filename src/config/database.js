import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Connected via Prisma');
    return prisma;
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    process.exit(1);
  }
};

export default prisma;

