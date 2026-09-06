export type CoffeeSize = 200 | 300;

export const MapCoffeeSize: Record<CoffeeSize, string> = {
  200: '200 мл',
  300: '300 мл',
};

export const coffeeSizes = Object.entries(MapCoffeeSize).map(
  ([value, name]) => ({
    value,
    name,
  }),
);