import { ProductItem } from "@prisma/client";
import { PizzaType,  pizzasize } from "../constants/Pizza";
import { Variant } from "../components/GroupVariants";

export const GetaAvalibePizzaSizes = (items: ProductItem[], type: PizzaType): Variant[] => {
    const availablePizzaTypes = items.filter((item) => item.pizzaType === type);
    return pizzasize.map((item) => ({
        name: item.name,
        value: item.value,
        disabled: !availablePizzaTypes.some((pizza) => pizza.size === Number(item.value)),
    }));
}