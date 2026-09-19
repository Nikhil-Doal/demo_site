import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-24">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">404</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-6 text-lg text-muted">
        It may have moved, or the link may be mistyped.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm underline underline-offset-4 hover:text-accent">
        Back to the shop
      </Link>
    </div>
  );
}
