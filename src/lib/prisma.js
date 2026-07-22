import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis;

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is missing. " +
        "Please check your .env file locally, or add it to your Vercel Environment Variables."
      );
    }
    
    let connectionString = process.env.DATABASE_URL;
    if (connectionString.startsWith('"') && connectionString.endsWith('"')) {
      connectionString = connectionString.slice(1, -1);
    } else if (connectionString.startsWith("'") && connectionString.endsWith("'")) {
      connectionString = connectionString.slice(1, -1);
    }
    
    // We use the standard pg driver instead of Neon WebSockets to avoid ETIMEDOUT proxy bugs
    // and correctly support the Neon -pooler URL endpoint.
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

const prisma = new Proxy({}, {
  get: (target, prop) => {
    return getPrismaClient()[prop];
  }
});

export default prisma;

