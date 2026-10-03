import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing order token" }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    where: { token },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body.token ||
      !Number.isInteger(body.totalAmount) ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      !body.fullName ||
      !body.email ||
      !body.phone ||
      !body.address
    ) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        token: body.token,
        userId: body.userId ?? null,
        totalAmount: body.totalAmount,
        status: "PENDING",
        paymentId: null,
        items: body.items,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        comment: body.comment ?? null,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}