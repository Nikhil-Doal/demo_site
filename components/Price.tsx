const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type PriceProps = {
  cents: number;
  className?: string;
};

export function Price({ cents, className }: PriceProps) {
  return <span className={className}>{usd.format(cents / 100)}</span>;
}
