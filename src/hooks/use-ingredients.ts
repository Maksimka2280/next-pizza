import { useEffect, useState } from "react";
import { Api } from "../../service/api-clients";
import { Ingredient } from "@prisma/client";

interface UseIngredientsResult {
    ingredients: Ingredient[];
    loading: boolean;
}

export const useIngredients = (): UseIngredientsResult => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchIngredients() {
            try {
                setLoading(true);
                const ingredients = await Api.ingredients.getAll();
                setIngredients(ingredients);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        fetchIngredients();
    }, []);

    return {
        ingredients,
        loading,
    };
}