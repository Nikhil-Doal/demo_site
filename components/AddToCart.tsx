"use client";

import Link from "next/link";
import { useState } from "react";
import { QuantitySelect } from "@/components/QuantitySelect";
import { useCart } from "@/hooks/useCart";

type AddToCartProps = {
  slug: string;
  name: string;
};

export function AddToCart({ slug, name }: AddToCartProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(slug, quantity);
    setAdded(true);
  }

  return (
    <div>
      <div className="flex items-end gap-4">
        <QuantitySelect id="quantity" value={quantity} onChange={setQuantity} />
        <button
          type="button"
          data-testid="add-to-cart"
          onClick={handleAdd}
          className="h-11 flex-1 rounded-sm bg-ink px-8 text-sm font-medium tracking-wide text-paper hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Add to cart
        </button>
      </div>
      <p role="status" className="mt-4 min-h-6 text-sm text-ink">
        {added ? (
          <>
            {name} was added to your cart.{" "}
            <Link href="/cart" className="underline underline-offset-4 hover:text-accent">
              View cart
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
