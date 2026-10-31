import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token");

    if (token) {
      const orders = await prisma.order.findMany({
        where: { token, userId: null },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(orders);
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = Number(session.user.id);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);



    const body = await req.json();
    const order = await prisma.order.create({
      data: {
        token: body.token,
        userId: session?.user?.id
          ? Number(session.user.id)
          : null,
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
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}