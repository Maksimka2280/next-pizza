export const DELIVERY_FEE = 120;
export const TAX_RATE_PERCENT = 5;

export function calculateCheckoutTotal(subtotal: number) {
  return Math.round(
    subtotal + DELIVERY_FEE + (subtotal * TAX_RATE_PERCENT) / 100,
  );
}
