import { Ingredient } from "@prisma/client";
import { IngredientItem } from "./IngredientItem";

interface IngredientGridProps {
    ingredients: Ingredient[];
    selectedIngredients: ReadonlySet<number>;
    onToggle: (ingredientId: number) => void;
    className?: string;
    itemClassName?: string;
}

export function IngredientGrid({
    ingredients,
    selectedIngredients,
    onToggle,
    className,
    itemClassName,
}: IngredientGridProps) {
    return (
        <div className={className}>
            {ingredients.map((ingredient) => (
                <IngredientItem
                    key={ingredient.id}
                    name={ingredient.name}
                    price={ingredient.price}
                    imageUrl={ingredient.imageUrl}
                    onClick={() => onToggle(ingredient.id)}
                    active={selectedIngredients.has(ingredient.id)}
                    className={itemClassName}
                />
            ))}
        </div>
    );
}
