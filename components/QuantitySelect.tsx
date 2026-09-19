"use client";

import { MAX_QUANTITY } from "@/components/CartProvider";

type QuantitySelectProps = {
  id: string;
  value: number;
  onChange: (quantity: number) => void;
  label?: string;
  hideLabel?: boolean;
};

const OPTIONS = Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1);

export function QuantitySelect({
  id,
  value,
  onChange,
  label = "Quantity",
  hideLabel = false,
}: QuantitySelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "text-xs font-medium uppercase tracking-[0.12em] text-muted"}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-11 w-20 appearance-none rounded-sm border border-line bg-paper pl-4 pr-8 text-sm text-ink focus:border-ink focus:outline-none"
        >
          {OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
    </div>
  );
}
