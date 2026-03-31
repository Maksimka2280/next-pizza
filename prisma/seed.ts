import "dotenv/config";
import { hashSync } from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";  
import { PrismaClient } from "@prisma/client";


const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);  
const prisma = new PrismaClient({ adapter });  

// Функция для создания пользователей
async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User Test',
        email: "users@test.com",
        password: hashSync('1111111', 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: 'Admin admin',
        email: "admin@test.com",
        password: hashSync('1111111', 10),
        verified: new Date(),
        role: "ADMIN",
      },
      {
        fullName: 'Boss Test',
        email: "BossTest@test.com",
        password: hashSync('1111111', 10),
        verified: new Date(),
        role: "ADMIN",
      }
    ]
  });
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;

}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error("Error during seeding:", e);
  }
}

// Запуск основной функции
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();  // Закрытие пула соединений PostgreSQL
  })
  .catch(async (e) => {
    console.error("Main function error:", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });