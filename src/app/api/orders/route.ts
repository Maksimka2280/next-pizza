import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: Request) {
  try {
    const orderToken = new URL(req.url).searchParams.get("token");
    if (orderToken) {
      const orders = await prisma.order.findMany({
        where: { token: orderToken, userId: null },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(orders);
    }

    const session = await getServerSession(authOptions);

    const userId = Number(session?.user?.id);
    const guestToken = req.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("guest_cart_token="))
      ?.slice("guest_cart_token=".length);

    const where = Number.isSafeInteger(userId) && userId > 0
      ? { userId }
      : guestToken
        ? { token: decodeURIComponent(guestToken), userId: null }
        : null;

    if (!where) return NextResponse.json([]);

    const orders = await prisma.order.findMany({
      where,
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
    const guestToken = req.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("guest_cart_token="))
      ?.slice("guest_cart_token=".length);
    const userId = session?.user?.id ? Number(session.user.id) : null;
    const token = userId !== null
      ? crypto.randomUUID()
      : guestToken
        ? decodeURIComponent(guestToken)
        : null;

    if (typeof token !== "string" || !token) {
      return NextResponse.json({ error: "Missing cart cookie" }, { status: 401 });
    }

    const order = await prisma.order.create({
      data: {
        token,
        userId,
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