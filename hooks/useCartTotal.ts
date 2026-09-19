import { useMemo } from "react";
import { useCartLines } from "@/hooks/useCart";

// Shipping is complimentary on every order for now.
const SHIPPING_CENTS = 0;

export function useCartTotal() {
  const lines = useCartLines();

  return useMemo(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const itemCount = lines.reduce((count, line) => count + line.quantity, 0);
    const shipping = SHIPPING_CENTS;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount,
    };
  }, [lines]);
}

export type CartTotals = ReturnType<typeof useCartTotal>;
