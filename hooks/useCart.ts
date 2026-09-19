import { useContext, useMemo } from "react";
import { CartContext } from "@/components/CartProvider";
import { getProduct, type Product } from "@/lib/catalog";
import { lineTotal } from "@/lib/money";

export type CartLine = {
  slug: string;
  quantity: number;
  product: Product;
  lineTotal: number;
};

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return cart;
}

/** Cart items joined with their catalog entries. Unknown slugs are dropped. */
export function useCartLines(): CartLine[] {
  const { items } = useCart();

  return useMemo(
    () =>
      items.flatMap((item) => {
        const product = getProduct(item.slug);
        if (!product) return [];
        return [
          {
            slug: item.slug,
            quantity: item.quantity,
            product,
            lineTotal: lineTotal(product.price, item.quantity),
          },
        ];
      }),
    [items],
  );
}
