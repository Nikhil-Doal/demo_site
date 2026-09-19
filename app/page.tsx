import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";

export default function CatalogPage() {
  const products = getProducts();

  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="max-w-2xl pt-20 pb-16">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          The everyday collection
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight text-ink">
          Well-made things for ordinary days.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Eight pieces we use ourselves, made in small batches from wool, leather, linen, brass
          and wood. Nothing seasonal, nothing disposable.
        </p>
      </section>

      <section aria-labelledby="collection-heading">
        <h2 id="collection-heading" className="sr-only">
          All products
        </h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
