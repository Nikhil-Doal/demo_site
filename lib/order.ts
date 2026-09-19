type OrderItem = {
  slug: string;
  quantity: number;
};

/**
 * Order references are derived from the cart contents (FNV-1a over the sorted
 * lines) rather than generated randomly, so the same cart always produces the
 * same reference.
 */
export function orderIdFor(items: OrderItem[]): string {
  const key = [...items]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((item) => `${item.slug}:${item.quantity}`)
    .join("|");

  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  const digits = ((hash >>> 0) % 100_000_000).toString().padStart(8, "0");
  return `MER-${digits}`;
}
