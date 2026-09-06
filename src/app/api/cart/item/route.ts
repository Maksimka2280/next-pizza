import { NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma-client';


export const runtime = 'nodejs';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { cartItemId, quantity } = body;
    if (!cartItemId || typeof quantity !== 'number') {
      return NextResponse.json({ error: 'Missing cartItemId or quantity' }, { status: 400 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: Number(cartItemId) },
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

    await prisma.cartItem.delete({ where: { id: Number(cartItemId) } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
