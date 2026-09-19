"use client";

import { useState } from "react";

type Applied = { code: string; percentOff: number };

/**
 * Coupon entry for checkout. Validates the code against the catalogue of
 * active promotions and reports the result.
 */
export function CouponInput() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Applied | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function apply() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = (await response.json()) as { valid: boolean; percentOff?: number };
      if (result.valid && typeof result.percentOff === "number") {
        setApplied({ code: code.toUpperCase(), percentOff: result.percentOff });
      } else {
        setApplied(null);
        setError("That code is not valid.");
      }
    } catch {
      setError("We couldn't check that code. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 border-t border-line pt-6">
      <label htmlFor="coupon" className="block text-sm text-muted">
        Coupon code
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="coupon"
          name="coupon"
          data-testid="coupon-input"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          className="h-11 flex-1 rounded-sm border border-line bg-paper px-3 text-sm text-ink"
          placeholder="SAVE20"
        />
        <button
          type="button"
          data-testid="coupon-apply"
          onClick={apply}
          disabled={pending}
          className="h-11 rounded-sm bg-ink px-5 text-sm font-medium tracking-wide text-paper hover:bg-ink/85 disabled:bg-ink/60"
        >
          {pending ? "Checking…" : "Apply"}
        </button>
      </div>
      {applied ? (
        <p data-testid="coupon-applied" className="mt-3 text-sm text-ink">
          Coupon applied — {applied.code}, {applied.percentOff}% off
        </p>
      ) : null}
      {error ? (
        <p role="alert" data-testid="coupon-error" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
