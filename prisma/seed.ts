import "dotenv/config";
import { hashSync } from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { categoriesSeedData } from "./constants/constants-cateegories";
import { ingredientsSeedData } from "./constants/constants-ingredients";
import { productsSeedData } from "./constants/constants-products";



const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not defined in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function up() {
  await prisma.user.createMany({
    data: [
      {
        fullName: "User Test",
        email: "users@test.com",
        password: hashSync("1111111", 10),
        verified: new Date(),
        role: "USER",
      },
      {
        fullName: "Admin admin",
        email: "admin@test.com",
        password: hashSync("1111111", 10),
        verified: new Date(),
        role: "ADMIN",
      },
      {
        fullName: "Boss Test",
        email: "BossTest@test.com",
        password: hashSync("1111111", 10),
        verified: new Date(),
        role: "ADMIN",
      },
      {
        fullName: "Maksimys Test",
        email: "maksimym@test.com",
        password: hashSync("bebratop228", 10),
        verified: new Date(),
        role: "ADMIN",
      },
    ],
  });

  await prisma.category.createMany({
    data: categoriesSeedData.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.ingredient.createMany({
    data: ingredientsSeedData,
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((category) => [category.name, category]));

  const ingredients = await prisma.ingredient.findMany();
  const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.name, ingredient]));

  for (const productData of productsSeedData) {
    const category = categoryMap.get(productData.category);
    if (!category) continue;

    const createdProduct = await prisma.product.create({
      data: {
        name: productData.name,
        imageUrl: productData.imageUrl,
        categoryId: category.id,
        ingredients: {
          connect: (productData.ingredients ?? []).map((ingredientName) => ({
            id: ingredientMap.get(ingredientName)?.id,
          })).filter((item): item is { id: number } => Boolean(item.id)),
        },
      },
    });

    for (const variant of productData.variants) {
      await prisma.productItem.create({
        data: {
          price: variant.price,
          size: variant.size ?? null,
          pizzaType: variant.pizzaType ?? null,
          productId: createdProduct.id,
        },
      });
    }
  }
}

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
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