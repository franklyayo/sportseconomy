const { PrismaClient } = require('@prisma/client');
const url = "postgresql://neondb_owner:npg_hoJud6Djva7P@ep-damp-breeze-avvcq12j.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require";
const prisma = new PrismaClient({
  datasources: { db: { url } }
});
prisma.$queryRaw`SELECT 1`.then(res => {
  console.log("Success:", res);
  prisma.$disconnect();
}).catch(err => {
  console.error("Error:", err);
  prisma.$disconnect();
});
