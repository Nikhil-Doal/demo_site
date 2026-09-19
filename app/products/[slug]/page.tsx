import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Price } from "@/components/Price";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, getProductSlugs, getRelatedProducts } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.slug);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <nav aria-label="Breadcrumb" className="pt-8 text-sm text-muted">
        <Link href="/" className="hover:text-ink">
          Shop
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20">
        <div className="bg-surface">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={1000}
            height={1250}
            loading="eager"
            sizes="(min-width: 1024px) 600px, 100vw"
            className="aspect-[4/5] h-auto w-full object-cover"
          />
        </div>

        <div className="lg:pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            {product.tagline}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-ink">
            {product.name}
          </h1>
          <Price
            cents={product.price}
            className="mt-3 block font-serif text-2xl text-ink"
          />
          <p className="mt-8 text-base leading-relaxed text-muted">{product.description}</p>

          <div className="mt-10">
            <AddToCart slug={product.slug} name={product.name} />
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-ink">Details</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-heading" className="pt-28">
        <h2 id="related-heading" className="font-serif text-2xl text-ink">
          More from the workshop
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {related.map((item) => (
            <li key={item.slug}>
              <ProductCard product={item} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
