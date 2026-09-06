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
