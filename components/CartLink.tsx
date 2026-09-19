"use client";

import Link from "next/link";
import { useCartTotal } from "@/hooks/useCartTotal";
import { useCart } from "@/hooks/useCart";

export function CartLink() {
  const { ready } = useCart();
  const { itemCount } = useCartTotal();

  return (
    <Link href="/cart" className="flex items-center gap-2 text-sm text-ink hover:text-accent">
      <span>Cart</span>
      <span
        data-testid="cart-count"
        className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-medium text-paper tabular-nums"
      >
        {ready ? itemCount : 0}
      </span>
    </Link>
  );
}
