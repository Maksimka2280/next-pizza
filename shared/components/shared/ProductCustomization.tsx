import { Ingredient } from "@prisma/client";
import { PizzaSize, PizzaType } from "../../constants/Pizza";
import { GroupVariants, Variant } from "../GroupVariants";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";
import { IngredientGrid } from "./IngredientGrid";

interface ProductCustomizationProps {
    availablePizzaSizes: readonly Variant[];
    availableTypeOptions: readonly Variant[];
    hasTypeSelector: boolean;
    size: PizzaSize;
    type: PizzaType;
    ingredients: Ingredient[];
    selectedIngredients: ReadonlySet<number>;
    loading: boolean;
    adding: boolean;
    finalPrice: number;
    onSizeChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onIngredientToggle: (ingredientId: number) => void;
    onAdd: () => void;
}

export function ProductCustomization({
    availablePizzaSizes,
    availableTypeOptions,
    hasTypeSelector,
    size,
    type,
    ingredients,
    selectedIngredients,
    loading,
    adding,
    finalPrice,
    onSizeChange,
    onTypeChange,
    onIngredientToggle,
    onAdd,
}: ProductCustomizationProps) {
    return (
        <>
            <div className="mt-5 flex flex-col gap-4">
                {availablePizzaSizes.length > 0 && (
                    <GroupVariants
                        items={availablePizzaSizes}
                        value={String(size)}
                        onClick={onSizeChange}
                    />
                )}
                {hasTypeSelector && (
                    <GroupVariants
                        items={availableTypeOptions}
                        value={String(type)}
                        onClick={onTypeChange}
                    />
                )}
            </div>

            <h2 className="text-[18px] font-bold">Ингредиенты</h2>
            <IngredientGrid
                ingredients={ingredients}
                selectedIngredients={selectedIngredients}
                onToggle={onIngredientToggle}
                className="flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-10"
            />
            <Button
                disabled={loading || adding}
                onClick={onAdd}
                className="mt-8 h-13.75 w-full rounded-[18px] px-10 text-base disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
                {loading || adding ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                    `Добавить в корзину за ${finalPrice} ₴`
                )}
            </Button>
        </>
    );
}
