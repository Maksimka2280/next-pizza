import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { prisma } from "../../../../prisma/prisma-client";

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  return Number.isSafeInteger(userId) && userId > 0 ? userId : null;
}

export async function GET() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favoriteRows = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  const productIds = favoriteRows.map(({ productId }) => productId);
  const products = productIds.length
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: {
          items: { orderBy: { price: "asc" }, take: 1 },
          category: true,
          ingredients: { select: { name: true } },
        },
      })
    : [];
  const productsById = new Map(products.map((product) => [product.id, product]));

  return NextResponse.json({
    favorites: productIds.flatMap((productId) => {
      const product = productsById.get(productId);
      return product ? [product] : [];
    }),
  });
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const productId =
    typeof body === "object" && body !== null && "productId" in body
      ? Number(body.productId)
      : NaN;

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId },
    update: {},
  });

  return NextResponse.json({ isFavorite: true });
}

export async function DELETE(request: Request) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = Number(new URL(request.url).searchParams.get("productId"));

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({ where: { userId, productId } });

  return NextResponse.json({ isFavorite: false });
}