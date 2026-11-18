import Image from "next/image";
import ProductCartAction from "../Products/ProductCartAction";

type AdminProductPreviewProps = {
  name: string;
  imageUrl: string;
  categoryName: string;
  ingredients: string[];
  price: string;
};

export function AdminProductPreview({
  name,
  imageUrl,
  categoryName,
  ingredients,
  price,
}: AdminProductPreviewProps) {
  const parsedPrice = Number(price);

  return (
    <aside className="h-fit min-h-[550px] min-w-0 rounded-2xl border border-[#e4e4e4] bg-white p-4 shadow-sm sm:p-5">
      <h2 className="mb-3 text-base font-bold sm:mb-4 sm:text-lg">Предпросмотр товара</h2>
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-[#FFF7EE] p-4 sm:p-6">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name || "Предпросмотр товара"}
            width={400}
            height={400}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-sm text-[#777]">Добавьте ссылку на изображение</span>
        )}
      </div>
      <p className="mt-4 text-sm text-[#777]">{categoryName || "Категория"}</p>
      <h3 className="mt-1 break-words text-lg font-bold sm:text-xl">{name || "Название товара"}</h3>
      <p className="mt-3 min-h-[60px] max-w-full break-words text-sm text-[#B1B1B1]">
        {ingredients.length ? ingredients.join(", ") : "Описание появится после загрузки данных"}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 sm:gap-5">
        <p className="text-base font-bold text-[#FE5F00] sm:text-lg">
          {parsedPrice > 0 ? `${parsedPrice} ₴` : "0 ₴"}
        </p>
        <ProductCartAction />
      </div>

    </aside>
  );
}
