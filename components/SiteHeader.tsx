import Link from "next/link";
import { CartLink } from "@/components/CartLink";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-serif text-[1.65rem] leading-none tracking-tight text-ink">
          Meridian
        </Link>
        <nav aria-label="Main" className="flex items-center gap-8">
          <Link href="/" className="text-sm text-ink hover:text-accent">
            Shop
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}
