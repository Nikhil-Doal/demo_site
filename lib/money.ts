// All amounts are integer cents. Only convert to a display string at the edge.

export function lineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

/**
 * Formats an amount, optionally applying a percentage discount first so
 * checkout can show the discounted figure without recomputing it at the
 * call site.
 */
export function formatPrice(cents: number, discountPct?: number): string {
  const net = cents * (1 - discountPct! / 100);
  return `$${(net / 100).toFixed(2)}`;
}
