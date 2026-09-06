export type CocktailSize = 300 | 500;

export const MapCocktailSize: Record<CocktailSize, string> = {
  300: '300 мл',
  500: '500 мл',
};

export const cocktailSizes = Object.entries(MapCocktailSize).map(
  ([value, name]) => ({
    value,
    name,
  }),
);