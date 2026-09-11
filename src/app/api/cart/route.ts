import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma-client';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, userId, productItemId, quantity = 1, ingredients = [] } = body;
    if (!productItemId) {
      return NextResponse.json({ error: 'Missing productItemId' }, { status: 400 });
    }

    let cart = null;
    let createdToken: string | null = null;

    if (userId) {
      cart = await prisma.cart.findFirst({ where: { userId: Number(userId) } });
      if (!cart) {
        const newToken = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        cart = await prisma.cart.create({ data: { userId: Number(userId), token: newToken } });
      }
    } else if (token) {
      cart = await prisma.cart.findFirst({ where: { token } });
      if (!cart) {
        cart = await prisma.cart.create({ data: { token } });
      }
    } else {
      const newToken = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      cart = await prisma.cart.create({ data: { token: newToken } });
      createdToken = newToken;
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        productItem: { connect: { id: Number(productItemId) } },
        quantity: Number(quantity) || 1,
        ingredients: {
          connect: (ingredients || []).map((id: number) => ({ id: Number(id) })),
        },
      },
    });

    const fullCart = await prisma.cart.findFirst({
      where: { id: cart.id },
      include: {
        items: {
          include: { productItem: { include: { product: true } }, ingredients: true },
        },
      },
    });

    if (createdToken) {
      const res = NextResponse.json({ ok: true, cartItem, cart: fullCart, createdToken }, { status: 201 });
      res.cookies.set('guest_cart_token', createdToken, { path: '/', maxAge: 60 * 60 * 24 * 365 });
      return res;
    }

    return NextResponse.json({ ok: true, cartItem, cart: fullCart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');

    let cart = null;
    if (userId) {
      cart = await prisma.cart.findFirst({
        where: { userId: Number(userId) },
        include: {
          items: {
            include: { productItem: { include: { product: true } }, ingredients: true },
          },
        },
      });
    } else if (token) {
      cart = await prisma.cart.findFirst({
        where: { token },
        include: {
          items: {
            include: { productItem: { include: { product: true } }, ingredients: true },
          },
        },
      });
    } else {
      return NextResponse.json({ cart: null }, { status: 200 });
    }

    return NextResponse.json({ cart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const userId = url.searchParams.get('userId');

    let cart = null;
    if (userId) {
      cart = await prisma.cart.findFirst({ where: { userId: Number(userId) } });
    } else if (token) {
      cart = await prisma.cart.findFirst({ where: { token } });
    }

    if (!cart) {
      return NextResponse.json({ ok: true, cart: null }, { status: 200 });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });

    return NextResponse.json({ ok: true, cart: null }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
