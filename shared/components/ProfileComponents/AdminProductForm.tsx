"use client";

import { useAdminProductForm } from "../../hooks/useAdminProductForm";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AdminPizzaVariantsFields } from "./AdminPizzaVariantsFields";
import { AdminProductPreview } from "./AdminProductPreview";

export function AdminProductForm() {
  const {
    categories,
    ingredients,
    name,
    setName,
    imageUrl,
    setImageUrl,
    categoryName,
    changeCategory,
    price,
    setPrice,
    variantPrice,
    setVariantPrice,
    selectedSize,
    setSelectedSize,
    selectedPizzaType,
    setSelectedPizzaType,
    variants,
    addPizzaVariant,
    removePizzaVariant,
    ingredientIds,
    loading,
    saving,
    error,
    created,
    toggleIngredient,
    handleSubmit,
  } = useAdminProductForm();

  return (
    <section className="mx-auto w-full min-w-0 max-w-6xl">
      <header className="mb-4 rounded-2xl bg-gradient-to-r from-[#FE5F00] to-[#FF914D] p-4 text-white shadow-sm sm:mb-6 sm:rounded-3xl sm:p-6">
        <p className="text-sm font-semibold text-white/80">Панель администратора</p>
        <h1 className="mt-1 text-xl font-bold sm:text-3xl">Добавить товар</h1>
      </header>
      {loading ? (
        <p className="rounded-2xl bg-white p-5 text-[#777]">Загружаем данные формы...</p>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:gap-5 sm:p-6">
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Название
              <Input required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-xl px-4 font-normal" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold">
              Ссылка на изображение
              <Input required type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="h-11 rounded-xl px-4 font-normal" placeholder="https://example.com/image.jpg" />
            </label>
            <div className="flex flex-col gap-2 text-sm font-semibold">
              <span>Категория</span>
              <Select
                value={categoryName || null}
                onValueChange={(value) => changeCategory(value ?? "")}
                disabled={categories.length === 0}
              >
                <SelectTrigger aria-label="Категория" className="h-11 w-full rounded-xl px-4 font-normal">
                  <SelectValue placeholder={categories.length ? "Выберите категорию" : "Категории не найдены"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {categoryName === "Пицца" ? (
              <AdminPizzaVariantsFields
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                selectedPizzaType={selectedPizzaType}
                onPizzaTypeChange={setSelectedPizzaType}
                price={variantPrice}
                onPriceChange={setVariantPrice}
                variants={variants}
                onAddVariant={addPizzaVariant}
                onRemoveVariant={removePizzaVariant}
              />
            ) : (
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Цена, ₴
                <Input required type="number" min="1" max="1000000" step="1" value={price} onChange={(event) => setPrice(event.target.value)} className="h-11 rounded-xl px-4 font-normal" />
              </label>
            )}
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-semibold">Ингредиенты (необязательно)</legend>
              <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                {ingredients.map((ingredient) => (
                  <label key={ingredient.id} className="flex min-w-0 items-start gap-2 text-sm">
                    <input type="checkbox" checked={ingredientIds.includes(ingredient.id)} onChange={() => toggleIngredient(ingredient.id)} className="mt-0.5 shrink-0" />
                    {ingredient.name} (+{ingredient.price} ₴)
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            {created && <p role="status" className="text-sm text-green-700">Товар «{created.name}» создан. ID: {created.id}</p>}
            <Button type="submit" disabled={saving || loading || categories.length === 0} className="h-11 w-full rounded-xl px-5 font-bold sm:w-auto">
              {saving ? "Создаём..." : "Создать товар"}
            </Button>
          </form>
          <AdminProductPreview
            name={name}
            imageUrl={imageUrl}
            categoryName={categoryName}
            ingredients={ingredients
              .filter((ingredient) => ingredientIds.includes(ingredient.id))
              .map((ingredient) => ingredient.name)}
            price={categoryName === "Пицца"
              ? String(variants.length ? Math.min(...variants.map((variant) => variant.price)) : Number(variantPrice) || "")
              : price}
          />
        </div>
      )}
    </section>
  );
}
