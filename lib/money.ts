// All amounts are integer cents. Only convert to a display string at the edge.

export function lineTotal(unitPrice: number, quantity: number): number {
  return unitPrice * quantity;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
