import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export const runtime = "nodejs";



export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      items: true,
      ingredients: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(products);
}


