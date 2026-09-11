import { beforeEach, describe, expect, it, vi } from 'vitest';

const cartFindFirst = vi.fn();
const cartItemDeleteMany = vi.fn();
const cartDelete = vi.fn();

vi.mock('../prisma/prisma-client', () => ({
  prisma: {
    cart: {
      findFirst: cartFindFirst,
      delete: cartDelete,
    },
    cartItem: {
      deleteMany: cartItemDeleteMany,
    },
  },
}));

describe('cart DELETE API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clears cart by token', async () => {
    cartFindFirst.mockResolvedValue({ id: 42, token: 'guest-123' });
    cartItemDeleteMany.mockResolvedValue({ count: 2 });
    cartDelete.mockResolvedValue({ id: 42 });

    const { DELETE } = await import('../src/app/api/cart/route');
    const req = new Request('http://localhost/api/cart?token=guest-123');

    const res = await DELETE(req);
    expect(res.status).toBe(200);
    expect(cartItemDeleteMany).toHaveBeenCalledWith({ where: { cartId: 42 } });
    expect(cartDelete).toHaveBeenCalledWith({ where: { id: 42 } });
  });
});
