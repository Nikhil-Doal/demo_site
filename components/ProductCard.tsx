import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/Price";
import type { Product } from "@/lib/catalog";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      data-testid={`product-card-${product.slug}`}
      className="group block"
    >
      <div className="overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.imageAlt}
          width={1000}
          height={1250}
          loading="eager"
          sizes="(min-width: 1024px) 264px, 50vw"
          className="aspect-[4/5] h-auto w-full object-cover"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-lg leading-snug text-ink group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <Price cents={product.price} className="font-serif text-lg text-ink" />
      </div>
      <p className="mt-1 text-sm text-muted">{product.tagline}</p>
    </Link>
  );
}
