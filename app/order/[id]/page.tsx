"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Price } from "@/components/Price";
import { useStoredOrder } from "@/hooks/useStoredOrder";

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const order = useStoredOrder(id);

  if (order === undefined) {
    return <div className="mx-auto max-w-3xl px-6 pt-20" />;
  }

  if (order === null) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-20">
        <h1 className="font-serif text-4xl tracking-tight text-ink">Order not found</h1>
        <p className="mt-6 text-lg text-muted">
          We couldn&apos;t find order {id} in this browser session.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm underline underline-offset-4 hover:text-accent">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-20">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">Order confirmed</p>
      <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight text-ink">
        Thank you for your order.
      </h1>
      <p className="mt-6 text-lg text-muted">
        Your order number is{" "}
        <span data-testid="order-id" className="font-medium text-ink">
          {order.id}
        </span>
        . We&apos;ll email you when it leaves the studio, usually within two working days.
      </p>

      <section aria-labelledby="order-items-heading" className="mt-14">
        <h2 id="order-items-heading" className="text-xs font-medium uppercase tracking-[0.12em] text-ink">
          Items
        </h2>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {order.lines.map((line) => (
            <li key={line.slug} data-testid={`order-line-${line.slug}`} className="flex items-center gap-5 py-5">
              <div className="w-16 shrink-0 bg-surface">
                <Image
                  src={line.image}
                  alt=""
                  width={1000}
                  height={1250}
                  loading="eager"
                  sizes="64px"
                  className="aspect-[4/5] h-auto w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-serif text-lg text-ink">{line.name}</p>
                <p className="text-sm text-muted">Qty {line.quantity}</p>
              </div>
              <Price cents={line.lineTotal} className="text-ink tabular-nums" />
            </li>
          ))}
        </ul>
        <div
          data-testid="order-paid"
          data-total-cents={order.total}
          className="flex items-baseline justify-between pt-6"
        >
          <p className="text-base text-ink">Total paid</p>
          <Price cents={order.total} className="font-serif text-2xl text-ink tabular-nums" />
        </div>
      </section>

      <Link
        href="/"
        className="mt-14 inline-flex h-11 items-center rounded-sm bg-ink px-8 text-sm font-medium tracking-wide text-paper hover:bg-ink/85"
      >
        Continue shopping
      </Link>
    </div>
  );
}
