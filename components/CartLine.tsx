"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantitySelect } from "@/components/QuantitySelect";
import { useCart, type CartLine as CartLineData } from "@/hooks/useCart";
import { formatPrice } from "@/lib/money";

type CartLineProps = {
  line: CartLineData;
};

export function CartLine({ line }: CartLineProps) {
  const { setQuantity, removeItem } = useCart();
  const { product } = line;

  return (
    <li data-testid={`cart-line-${line.slug}`} className="flex gap-6 py-8">
      <Link href={`/products/${product.slug}`} className="w-28 shrink-0 bg-surface">
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={1000}
          height={1250}
          loading="eager"
          sizes="112px"
          className="aspect-[4/5] h-auto w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h2 className="font-serif text-xl leading-snug text-ink">
            <Link href={`/products/${product.slug}`} className="hover:underline hover:underline-offset-4">
              {product.name}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted">{product.tagline}</p>
          <p className="mt-1 text-sm text-muted">{formatPrice(product.price)} each</p>
        </div>
        <div className="flex items-start gap-8 sm:flex-col sm:items-end sm:gap-4">
          <p className="font-serif text-lg text-ink">{formatPrice(line.lineTotal)}</p>
          <div className="flex items-center gap-4">
            <QuantitySelect
              id={`quantity-${line.slug}`}
              label={`Quantity for ${product.name}`}
              hideLabel
              value={line.quantity}
              onChange={(quantity) => setQuantity(line.slug, quantity)}
            />
            <button
              type="button"
              onClick={() => removeItem(line.slug)}
              aria-label={`Remove ${product.name}`}
              className="text-sm text-muted underline underline-offset-4 hover:text-ink"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
