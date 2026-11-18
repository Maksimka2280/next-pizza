import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '../../../../../prisma/prisma-client';
import { z } from 'zod';

const cartItemIdSchema = z.coerce.number().int().positive().max(2_147_483_647);
const updateCartItemSchema = z.object({
  cartItemId: cartItemIdSchema,
  quantity: z.coerce.number().int().positive().max(2_147_483_647),
});
const deleteCartItemSchema = z.object({
  cartItemId: cartItemIdSchema,
});

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
    const body: unknown = await req.json().catch(() => null);
    const parsedBody = updateCartItemSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid cart item details' }, { status: 400 });
    }
    const { cartItemId, quantity } = parsedBody.data;

    const cartId = await getRequestCartId(req);
    if (!cartId) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId, cartId },
      data: { quantity },
    });

    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);
    const parsedBody = deleteCartItemSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid cart item ID' }, { status: 400 });
    }
    const { cartItemId } = parsedBody.data;

    const cartId = await getRequestCartId(req);
    if (!cartId) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: cartItemId, cartId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
