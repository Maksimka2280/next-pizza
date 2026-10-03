export interface AddToCartDto {
  token?: string;
  productItemId: number;
  quantity?: number;
  ingredients?: number[];
}

export interface UpdateCartItemDto {
  cartItemId: number;
  quantity: number;
}

export interface RemoveCartItemDto {
  cartItemId: number;
}

export interface MergeCartDto {
  token: string;
  userId: number;
}

export interface CartItemDto {
  id: number;
  quantity: number;
  productItem: {
    id: number;
    price: number;
    product: {
      id: number;
      name: string;
      imageUrl?: string | null;
    };
  };
  ingredients: {
    id: number;
    name: string;
    price: number;
  }[];
}

export interface CartDto {
  id: number;
  token: string;
  items: CartItemDto[];
  totalAmount?: number;
}

export interface CreateOrderDto {
  token: string;
  userId: number | null;
  totalAmount: number;
  items: CartItemDto[];
  fullName: string;
  email: string;
  phone: string;
  address: string;
  comment: string | null;
}

export interface OrderDto extends CreateOrderDto {
  id: number;
  status: string;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
}
