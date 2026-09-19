"use client";

import Link from "next/link";
import { CartLine } from "@/components/CartLine";
import { useCart, useCartLines } from "@/hooks/useCart";
import { useCartTotal } from "@/hooks/useCartTotal";
import { formatPrice } from "@/lib/money";

export default function CartPage() {
  const { ready } = useCart();
  const lines = useCartLines();
  const { subtotal, itemCount } = useCartTotal();

  return (
    <div className="mx-auto max-w-6xl px-6 pt-16">
      <h1 className="font-serif text-4xl tracking-tight text-ink">Your cart</h1>

      {!ready ? null : lines.length === 0 ? (
        <div className="py-16">
          <p className="text-lg text-muted">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-8 inline-flex h-11 items-center rounded-sm bg-ink px-8 text-sm font-medium tracking-wide text-paper hover:bg-ink/85"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <CartLine key={line.slug} line={line} />
            ))}
          </ul>

          <aside aria-labelledby="cart-summary-heading" className="lg:pt-8">
            <h2 id="cart-summary-heading" className="sr-only">
              Cart summary
            </h2>
            <dl className="flex items-baseline justify-between">
              <dt className="text-base text-ink">
                Subtotal{" "}
                <span className="ml-1 text-sm text-muted">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              </dt>
              <dd data-testid="cart-subtotal" className="font-serif text-2xl text-ink tabular-nums">
                {formatPrice(subtotal)}
              </dd>
            </dl>
            <p className="mt-3 text-sm text-muted">Shipping is calculated at checkout.</p>
            <Link
              href="/checkout"
              className="mt-8 flex h-12 items-center justify-center rounded-sm bg-ink text-sm font-medium tracking-wide text-paper hover:bg-ink/85"
            >
              Checkout
            </Link>
            <Link
              href="/"
              className="mt-4 block text-center text-sm text-muted underline underline-offset-4 hover:text-ink"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
