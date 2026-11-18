import { PizzaSize, PizzaType, pizzaTypes } from "../../constants/Pizza";
import { GroupVariants, Variant } from "../GroupVariants";

interface PizzaVariantSelectorsProps {
    availableSizes: readonly Variant[];
    availablePizzaSizes: readonly Variant[];
    size: PizzaSize;
    type: PizzaType;
    onSizeChange: (size: PizzaSize) => void;
    onTypeChange: (type: PizzaType) => void;
}

export function PizzaVariantSelectors({
    availableSizes,
    availablePizzaSizes,
    size,
    type,
    onSizeChange,
    onTypeChange,
}: PizzaVariantSelectorsProps) {
    return (
        <div className="mt-5 flex flex-col gap-4">
            {availableSizes.length > 0 && (
                <GroupVariants
                    items={availablePizzaSizes}
                    value={String(size)}
                    onClick={(value) => onSizeChange(Number(value) as PizzaSize)}
                />
            )}
            <GroupVariants
                items={pizzaTypes}
                value={String(type)}
                onClick={(value) => onTypeChange(Number(value) as PizzaType)}
            />
        </div>
    );
}
