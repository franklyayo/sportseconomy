require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with Nigerian Football talents...');

  const talents = [
    {
      name: "Chinedu Obasi",
      sport: "Football",
      position: "Striker",
      stateOfOrigin: "Lagos",
      age: 18,
      height: 185,
      weight: 78,
      preferredFoot: "Right",
      achievements: ["Top Scorer, U-17 State League", "MVP Lagos Youth Cup 2025"],
      stats: { goals: 24, assists: 8, appearances: 30 },
      mediaUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Tunde Bakare",
      sport: "Football",
      position: "Center Midfielder",
      stateOfOrigin: "Ogun",
      age: 20,
      height: 178,
      weight: 72,
      preferredFoot: "Both",
      achievements: ["Best Midfielder Ogun State Championship"],
      stats: { goals: 5, assists: 15, passAccuracy: "89%" },
      mediaUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Ngozi Okonjo",
      sport: "Football",
      position: "Center Back",
      stateOfOrigin: "Enugu",
      age: 19,
      height: 190,
      weight: 85,
      preferredFoot: "Right",
      achievements: ["Captain, Eastern Youth Academy", "Clean Sheet Record (15)"],
      stats: { tacklesPerGame: 4.5, interceptions: 62 },
      mediaUrl: "https://images.unsplash.com/photo-1518605368461-1eb7b63f2735?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Ibrahim Musa",
      sport: "Football",
      position: "Winger",
      stateOfOrigin: "Kano",
      age: 17,
      height: 172,
      weight: 65,
      preferredFoot: "Left",
      achievements: ["Fastest Sprint Time (Northern Zone)"],
      stats: { goals: 11, assists: 14, successfulDribbles: 85 },
      mediaUrl: "https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=300&auto=format&fit=crop"
    },
    {
      name: "Emeka Ike",
      sport: "Football",
      position: "Goalkeeper",
      stateOfOrigin: "Imo",
      age: 21,
      height: 195,
      weight: 90,
      preferredFoot: "Right",
      achievements: ["Best Goalkeeper, National University Games"],
      stats: { savePercentage: "82%", cleanSheets: 12 },
      mediaUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=300&auto=format&fit=crop"
    }
  ];

  for (const t of talents) {
    const talent = await prisma.talent.create({
      data: t
    });
    console.log(`Created talent: ${talent.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
