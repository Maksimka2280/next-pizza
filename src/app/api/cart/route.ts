import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';

export const runtime = 'nodejs';

const GUEST_CART_COOKIE = 'guest_cart_token';
const GUEST_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getGuestCartToken(req: Request) {
  const cookie = req.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${GUEST_CART_COOKIE}=`));

  if (!cookie) return null;

  try {
    return decodeURIComponent(cookie.slice(GUEST_CART_COOKIE.length + 1)) || null;
  } catch {
    return null;
  }
}

function setGuestCartCookie(response: NextResponse, token: string) {
  response.cookies.set(GUEST_CART_COOKIE, token, {
    httpOnly: true,
    maxAge: GUEST_CART_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

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
    let guestToken: string | null = null;
    let shouldSetGuestCookie = false;
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
      guestToken = getGuestCartToken(req);
      if (!guestToken) {
        guestToken = crypto.randomUUID();
      }
      shouldSetGuestCookie = true;

      cart = await prisma.cart.findFirst({
        where: {
          token: guestToken,
          userId: null,
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            token: guestToken,
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

    const response = NextResponse.json(
      {
        ok: true,
        cartItem,
        cart: fullCart
          ? {
              id: fullCart.id,
              items: fullCart.items,
              totalAmount: fullCart.totalAmount,
            }
          : null,
      },
      { status: 201 },
    );
    return shouldSetGuestCookie && guestToken
      ? setGuestCartCookie(response, guestToken)
      : response;
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
    let guestToken: string | null = null;
    let shouldSetGuestCookie = false;

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
      guestToken = getGuestCartToken(req);
      if (!guestToken) {
        guestToken = crypto.randomUUID();
      }
      shouldSetGuestCookie = true;

      cart = await prisma.cart.findFirst({
        where: {
          token: guestToken,
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

    const response = NextResponse.json({
      cart: cart
        ? {
            id: cart.id,
            items: cart.items,
            totalAmount: cart.totalAmount,
          }
        : null,
    });
    return shouldSetGuestCookie && guestToken
      ? setGuestCartCookie(response, guestToken)
      : response;

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
    const token = getGuestCartToken(req);

    let cart = null;

    if (session?.user?.id) {
      cart = await prisma.cart.findFirst({
        where: {
          userId: Number(session.user.id),
        },
      });
    } else if (token) {
      cart = await prisma.cart.findFirst({
        where: { token, userId: null },
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