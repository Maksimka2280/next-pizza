"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type ProductResponse = {
  id?: number;
  name?: string;
  imageUrl?: string;
  items?: Array<{ price?: number }>;
  ingredients?: Array<{ name?: string }>;
};

export default function CartProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<ProductResponse[]>("/api/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-wrap gap-[30px]">
      {loading ? (
        <div className="text-sm text-[#B1B1B1]">Завантаження...</div>
      ) : (
        products.map((product) => {
          const productName = product.name ?? "Вкусная пицца";
          const price = product.items?.[0]?.price ?? 449;
          const ingredients = product.ingredients
            ?.map((ingredient) => ingredient.name)
            .filter(Boolean)
            .join(", ");

          return (
            <div key={product.id ?? productName} className="max-w-[285px] w-full">
              <div className="flex flex-col">
                <div className="flex h-[260px] w-[285px] items-center justify-center overflow-hidden rounded-[15px] bg-[#FFF7EE]">
                  <div className="h-[210px] w-[210px]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={productName}
                        className="h-full w-full rounded-[30px] object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[#B1B1B1]">
                        Немає зображення
                      </div>
                    )}
                  </div>
                </div>

                <h1 className="mt-[15px] mb-[7px] text-[22px] font-bold">{productName}</h1>

                <p className="max-w-full break-words text-[14px] text-[#B1B1B1]">
                  {ingredients || "Опис буде доступний після отримання даних"}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[20px]">
                    от <span className="text-[20px] font-bold">{price} ₽</span>
                  </p>
                  <button className="h-[40px] w-[125px] rounded-[15px] bg-[#FFFAF4] text-[15px] font-bold text-[#FE5F00] transition-all duration-300 ease-in-out hover:bg-[#FE5F00] hover:text-[#FFFAF4]">
                    + добавить
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
