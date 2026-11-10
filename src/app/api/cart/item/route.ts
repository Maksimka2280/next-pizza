import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '../../../../../prisma/prisma-client';


export const runtime = 'nodejs';

async function getRequestCartId(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  if (Number.isSafeInteger(userId) && userId > 0) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });
    return cart?.id ?? null;
  }

  const cookie = req.headers
    .get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('guest_cart_token='));
  if (!cookie) return null;

  let token: string;
  try {
    token = decodeURIComponent(cookie.slice('guest_cart_token='.length));
  } catch {
    return null;
  }

  const cart = await prisma.cart.findFirst({
    where: { token, userId: null },
    select: { id: true },
  });
  return cart?.id ?? null;
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { cartItemId, quantity } = body;
    if (!cartItemId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Missing cartItemId or quantity' }, { status: 400 });
    }

    const cartId = await getRequestCartId(req);
    if (!cartId) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: Number(cartItemId), cartId },
      data: { quantity: Number(quantity) },
    });

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { cartItemId } = body;
    if (!cartItemId) return NextResponse.json({ error: 'Missing cartItemId' }, { status: 400 });

    const cartId = await getRequestCartId(req);
    if (!cartId) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: Number(cartItemId), cartId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
