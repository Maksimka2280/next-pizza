import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '../../../../../prisma/prisma-client';


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const userId = Number(sessionUserId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const token = body.token;

    if (typeof token !== 'string' || !token.trim()) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 },
      );
    }

    const guestCart = await prisma.cart.findFirst({
      where: {
        token,
        userId: null,
      },
    });

    if (!guestCart) {
      return NextResponse.json({
        ok: true,
        message: 'No guest cart',
      });
    }

    await prisma.$transaction(async (tx) => {
      const userCart = await tx.cart.findUnique({
        where: { userId },
      });

      if (!userCart) {
        await tx.cart.update({
          where: { id: guestCart.id },
          data: { userId },
        });

        return;
      }

      await tx.cartItem.updateMany({
        where: { cartId: guestCart.id },
        data: { cartId: userCart.id },
      });

      await tx.cart.delete({
        where: { id: guestCart.id },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}