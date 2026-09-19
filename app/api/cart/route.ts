import { getProduct } from "@/lib/catalog";
import { lineTotal } from "@/lib/money";
import { orderIdFor } from "@/lib/order";

type SubmittedItem = {
  slug?: unknown;
  quantity?: unknown;
};

/**
 * Submits the cart. Prices are looked up again from the catalog rather than
 * trusted from the client, and the order reference is derived from the lines.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { items?: unknown } | null;
  const submitted: SubmittedItem[] = Array.isArray(body?.items) ? body.items : [];

  if (submitted.length === 0) {
    return Response.json({ error: "Cart is empty" }, { status: 400 });
  }

  const lines = [];
  for (const item of submitted) {
    const product = typeof item.slug === "string" ? getProduct(item.slug) : undefined;
    const quantity = item.quantity;
    if (!product || typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      return Response.json({ error: "Invalid cart item" }, { status: 400 });
    }
    lines.push({ slug: product.slug, quantity, lineTotal: lineTotal(product.price, quantity) });
  }

  return Response.json({
    orderId: orderIdFor(lines),
    itemCount: lines.reduce((count, line) => count + line.quantity, 0),
    subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
  });
}
