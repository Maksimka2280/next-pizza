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

    const token = req.headers
      .get('cookie')
      ?.split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith('guest_cart_token='))
      ?.slice('guest_cart_token='.length);

    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 },
      );
    }

    const decodedToken = decodeURIComponent(token);

    const guestCart = await prisma.cart.findFirst({
      where: {
        token: decodedToken,
        userId: null,
      },
    });

    if (!guestCart) {
      const response = NextResponse.json({
        ok: true,
        message: 'No guest cart',
      });
      response.cookies.set('guest_cart_token', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
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

    const response = NextResponse.json({ ok: true });
    response.cookies.set('guest_cart_token', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return response;
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}