"use client";

import { useEffect, useState, type FormEvent } from "react";
import { type PizzaSize, type PizzaType } from "../constants/Pizza";
import {
  createAdminProduct,
  fetchAdminProductOptions,
  getAdminProductErrorMessage,
  type AdminProductIngredient,
  type AdminProductVariant,
  type CreatedProduct,
} from "../api/admin-products";

export function useAdminProductForm() {
  const [categories, setCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<AdminProductIngredient[]>([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [price, setPrice] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(30);
  const [selectedPizzaType, setSelectedPizzaType] = useState<PizzaType>(1);
  const [variants, setVariants] = useState<AdminProductVariant[]>([]);
  const [ingredientIds, setIngredientIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedProduct | null>(null);

  useEffect(() => {
    fetchAdminProductOptions()
      .then(({ categories: loadedCategories, ingredients: loadedIngredients }) => {
        setCategories(loadedCategories);
        setIngredients(loadedIngredients);
      })
      .catch(() => setError("Не удалось загрузить категории и ингредиенты. Обновите страницу."))
      .finally(() => setLoading(false));
  }, []);

  function toggleIngredient(id: number) {
    setIngredientIds((current) =>
      current.includes(id)
        ? current.filter((ingredientId) => ingredientId !== id)
        : [...current, id],
    );
  }

  function changeCategory(value: string) {
    setCategoryName(value);
    setVariants([]);
    setError("");
  }

  function addPizzaVariant() {
    const parsedPrice = Number(variantPrice);
    if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) {
      setError("Укажите положительную цену для варианта пиццы.");
      return;
    }
    if (variants.some((variant) => variant.size === selectedSize && variant.pizzaType === selectedPizzaType)) {
      setError("Такой размер и тип теста уже добавлены.");
      return;
    }

    setVariants((current) => [...current, {
      price: parsedPrice,
      size: selectedSize,
      pizzaType: selectedPizzaType,
    }]);
    setVariantPrice("");
    setError("");
  }

  function removePizzaVariant(variantToRemove: AdminProductVariant) {
    setVariants((current) => current.filter((variant) => variant !== variantToRemove));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreated(null);

    if (!categoryName) {
      setError("Выберите категорию товара.");
      return;
    }
    const isPizza = categoryName === "Пицца";
    if (isPizza && variants.length === 0) {
      setError("Добавьте хотя бы один вариант размера и теста.");
      return;
    }

    setSaving(true);
    try {
      const data = await createAdminProduct({
        name,
        imageUrl,
        categoryName,
        variants: isPizza
          ? variants
          : [{ price: Number(price), size: null, pizzaType: null }],
        ingredientIds,
      });
      setCreated(data);
      setName("");
      setImageUrl("");
      setPrice("");
      setVariantPrice("");
      setVariants([]);
      setIngredientIds([]);
    } catch (requestError) {
      setError(getAdminProductErrorMessage(
        requestError,
        "Не удалось создать товар. Проверьте данные и попробуйте снова.",
      ));
    } finally {
      setSaving(false);
    }
  }

  return {
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
  };
}
