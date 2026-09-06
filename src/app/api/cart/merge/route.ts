import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma-client';


export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, userId } = body;
    if (!token || !userId) {
      return NextResponse.json({ error: 'Missing token or userId' }, { status: 400 });
    }

    const guestCart = await prisma.cart.findFirst({ where: { token } });
    if (!guestCart) return NextResponse.json({ ok: true, message: 'No guest cart' });

    const userCart = await prisma.cart.findUnique({ where: { userId: Number(userId) } });

    if (!userCart) {
      // simply assign guest cart to user
      await prisma.cart.update({ where: { id: guestCart.id }, data: { userId: Number(userId) } });
      return NextResponse.json({ ok: true });
    }

    // move cart items from guest to user cart
    await prisma.cartItem.updateMany({ where: { cartId: guestCart.id }, data: { cartId: userCart.id } });

    // delete guest cart
    await prisma.cart.delete({ where: { id: guestCart.id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
