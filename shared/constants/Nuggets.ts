export type NuggetsCount = 6 | 9 | 12;

export const MapNuggetsCount: Record<NuggetsCount, string> = {
  6: '6 шт',
  9: '9 шт',
  12: '12 шт',
};

export const nuggetsCounts = Object.entries(MapNuggetsCount).map(
  ([value, name]) => ({
    value,
    name,
  }),
);