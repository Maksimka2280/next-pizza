import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export const runtime = 'nodejs';


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;
    const body = await req.json();
    const {
      productItemId,
      quantity = 1,
      ingredients = [],
    } = body;

    const url = new URL(req.url);

    const cookieToken = req.headers
      .get('cookie')
      ?.match(/(?:^|;\s*)guest_cart_token=([^;]+)/)?.[1];

    const token =
      url.searchParams.get('token') ??
      (typeof body.token === 'string' ? body.token : null) ??
      (cookieToken ? decodeURIComponent(cookieToken) : null);

    const productId = Number(productItemId);
    const itemQuantity = Number(quantity);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: 'Invalid productItemId' },
        { status: 400 },
      );
    }

    if (!Number.isSafeInteger(itemQuantity) || itemQuantity <= 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(ingredients) ||
      !ingredients.every(
        (id: unknown) =>
          (typeof id === 'number' || typeof id === 'string') &&
          Number.isSafeInteger(Number(id)) &&
          Number(id) > 0,
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid ingredients' },
        { status: 400 },
      );
    }

    const ingredientIds = [...new Set(ingredients.map(Number))];

    let userId: number | null = null;

    if (sessionUserId) {
      userId = Number(sessionUserId);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 401 },
        );
      }
    }

    let cart;
    console.log('RESOLVED USER ID:', userId);
    console.log('GUEST TOKEN:', token);
    if (userId !== null) {
      cart = await prisma.cart.findUnique({
        where: { userId },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId,
            token: crypto.randomUUID(),
          },
        });
      }
    } else {
      if (!token) {
        console.error('Cart request has no authenticated user or guest token');

        return NextResponse.json(
          { error: 'Missing guest token' },
          { status: 400 },
        );
      }

      cart = await prisma.cart.findFirst({
        where: {
          token,
          userId: null,
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            token,
            userId: null,
          },
        });
      }
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cart: {
          connect: { id: cart.id },
        },
        productItem: {
          connect: { id: productId },
        },
        quantity: itemQuantity,
        ingredients: {
          connect: ingredientIds.map((id) => ({ id })),
        },
      },
    });

    const fullCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            productItem: {
              include: { product: true },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        ok: true,
        cartItem,
        cart: fullCart,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}


export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;

    let cart = null;

    if (sessionUserId) {
      const userId = Number(sessionUserId);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        return NextResponse.json(
          { error: 'Invalid user ID' },
          { status: 401 },
        );
      }

      cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              productItem: {
                include: { product: true },
              },
              ingredients: true,
            },
          },
        },
      });
    } else {
      const url = new URL(req.url);
      const token = url.searchParams.get('token');

      if (!token) {
        return NextResponse.json({ cart: null });
      }

      cart = await prisma.cart.findFirst({
        where: {
          token,
          userId: null,
        },
        include: {
          items: {
            include: {
              productItem: {
                include: { product: true },
              },
              ingredients: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ cart });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );

  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    let cart = null;

    if (session?.user?.id) {
      cart = await prisma.cart.findFirst({
        where: {
          userId: Number(session.user.id),
        },
      });
    } else if (token) {
      cart = await prisma.cart.findFirst({
        where: { token },
      });
    }

    if (!cart) {
      return NextResponse.json(
        { ok: true, cart: null },
        { status: 200 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await prisma.cart.delete({
      where: { id: cart.id },
    });

    return NextResponse.json(
      { ok: true, cart: null },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Internal" },
      { status: 500 }
    );
  }
}