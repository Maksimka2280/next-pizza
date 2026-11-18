import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../../../prisma/prisma-client";

const orderHistorySelect = {
  id: true,
  items: true,
  totalAmount: true,
  status: true,
  createdAt: true,
} satisfies Prisma.OrderSelect;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const orders = await prisma.order.findMany({
      where: { token },
      orderBy: { createdAt: "desc" },
      select: orderHistorySelect,
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Orders not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders/[token]:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}