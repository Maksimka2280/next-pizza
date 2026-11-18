import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { prisma } from "../../../../prisma/prisma-client";

export const runtime = "nodejs";

const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  imageUrl: z.string().url().max(2048).refine((value) => /^https?:\/\//i.test(value)),
  categoryName: z.string().trim().min(1).max(80),
  variants: z.array(z.object({
    price: z.number().int().positive().max(1_000_000),
    size: z.union([z.literal(20), z.literal(30), z.literal(40)]).nullable(),
    pizzaType: z.union([z.literal(1), z.literal(2)]).nullable(),
  })).min(1).max(6),
  ingredientIds: z.array(z.number().int().positive()).max(50),
}).superRefine((product, context) => {
  const isPizza = product.categoryName === "Пицца";
  if (isPizza && product.variants.some((variant) => variant.size === null || variant.pizzaType === null)) {
    context.addIssue({ code: "custom", path: ["variants"], message: "Pizza variants require size and dough type" });
  }
  if (!isPizza && (product.variants.length !== 1 || product.variants[0].size !== null || product.variants[0].pizzaType !== null)) {
    context.addIssue({ code: "custom", path: ["variants"], message: "Non-pizza products require one plain variant" });
  }
  const keys = product.variants.map(({ size, pizzaType }) => `${size}:${pizzaType}`);
  if (new Set(keys).size !== keys.length) {
    context.addIssue({ code: "custom", path: ["variants"], message: "Duplicate product variants" });
  }
});

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      ingredients: true,
      items: true,
      category: true,
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid product details" }, { status: 400 });
    }

    const result = createProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid product details" }, { status: 400 });
    }

    const { name, imageUrl, categoryName, variants, ingredientIds } = result.data;
    const [category, ingredients] = await Promise.all([
      prisma.category.findUnique({ where: { name: categoryName }, select: { id: true } }),
      prisma.ingredient.findMany({
        where: { id: { in: [...new Set(ingredientIds)] } },
        select: { id: true },
      }),
    ]);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }
    if (ingredients.length !== new Set(ingredientIds).size) {
      return NextResponse.json({ error: "One or more ingredients were not found" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        imageUrl,
        categoryId: category.id,
        ingredients: { connect: ingredients.map(({ id }) => ({ id })) },
        items: { create: variants },
      },
      include: { category: true, ingredients: true, items: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
