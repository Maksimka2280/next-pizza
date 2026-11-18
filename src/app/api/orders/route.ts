import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { prisma } from "../../../../prisma/prisma-client";
import { calculateCheckoutTotal } from "../../../../shared/lib/checkout-pricing";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(30),
  address: z.string().trim().min(3).max(200),
  comment: z.string().trim().max(500).nullable().optional(),
});

const checkoutCartSelect = {
  items: {
    select: {
      id: true,
      quantity: true,
      productItem: {
        select: {
          id: true,
          price: true,
          product: { select: { id: true, name: true, imageUrl: true } },
        },
      },
      ingredients: { select: { id: true, name: true, price: true } },
    },
  },
} satisfies Prisma.CartSelect;
const orderHistorySelect = {
  id: true,
  items: true,
  totalAmount: true,
  status: true,
  createdAt: true,
} satisfies Prisma.OrderSelect;

type CheckoutCart = Prisma.CartGetPayload<{
  select: typeof checkoutCartSelect;
}>;

export async function GET(req: Request) {
  try {
    const orderToken = new URL(req.url).searchParams.get("token");
    if (orderToken) {
      const orders = await prisma.order.findMany({
        where: { token: orderToken },
        orderBy: { createdAt: "desc" },
        select: orderHistorySelect,
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
      select: orderHistorySelect,
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rawBody: unknown = await req.json().catch(() => null);
    const checkout = checkoutSchema.safeParse(rawBody);
    if (!checkout.success) {
      return NextResponse.json({ error: "Invalid checkout details" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;
    const userId = sessionUserId ? Number(sessionUserId) : null;
    if (sessionUserId && (!Number.isSafeInteger(userId) || !userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 401 });
    }

    let token: string | null = null;
    let cart: CheckoutCart | null = null;

    if (userId !== null) {
      cart = await prisma.cart.findUnique({
        where: { userId },
        select: checkoutCartSelect,
      });
      if (cart) token = crypto.randomUUID();
    } else {
      const cookie = req.headers
        .get("cookie")
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("guest_cart_token="));
      try {
        token = cookie
          ? decodeURIComponent(cookie.slice("guest_cart_token=".length))
          : null;
      } catch {
        return NextResponse.json({ error: "Invalid cart token" }, { status: 400 });
      }

      if (token) {
        cart = await prisma.cart.findFirst({
          where: { token, userId: null },
          select: checkoutCartSelect,
        });
      }
    }

    if (!token || !cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }
    if (cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const items = cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      productItem: item.productItem,
      ingredients: item.ingredients,
    })) satisfies Prisma.InputJsonObject[];
    const subtotal = cart.items.reduce((sum, item) => {
      const ingredientsTotal = item.ingredients.reduce(
        (ingredientSum, ingredient) => ingredientSum + ingredient.price,
        0,
      );
      return sum + (item.productItem.price + ingredientsTotal) * item.quantity;
    }, 0);
    const totalAmount = calculateCheckoutTotal(subtotal);

    const order = await prisma.order.create({
      data: {
        token,
        userId,
        totalAmount,
        status: "PENDING",
        paymentId: null,
        items,
        fullName: checkout.data.fullName,
        email: checkout.data.email,
        phone: checkout.data.phone,
        address: checkout.data.address,
        comment: checkout.data.comment ?? null,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error("POST /api/orders:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
