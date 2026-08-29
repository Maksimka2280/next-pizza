export type PizzaSize = 20 | 30 | 40;
export type PizzaType = 1 | 2;

export const Mapsize: Record<PizzaSize, string> = {
    20: 'Маленькая',
    30: 'Средняя',
    40: 'Большая',
};

export const Maptype: Record<PizzaType, string> = {
    1: 'Традиционное',
    2: 'Тонкое',
};

export const pizzasize = Object.entries(Mapsize).map(([value, name]) => ({
    value,
    name,
}));

export const pizzaTypes = Object.entries(Maptype).map(([value, name]) => ({
    value,
    name,
}));