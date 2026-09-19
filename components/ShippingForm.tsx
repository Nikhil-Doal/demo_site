"use client";

type Field = {
  id: string;
  label: string;
  autoComplete: string;
  type?: string;
  span?: "full" | "half";
};

const FIELDS: Field[] = [
  { id: "name", label: "Full name", autoComplete: "name" },
  { id: "email", label: "Email", autoComplete: "email", type: "email" },
  { id: "address", label: "Street address", autoComplete: "street-address" },
  { id: "city", label: "City", autoComplete: "address-level2", span: "half" },
  { id: "state", label: "State", autoComplete: "address-level1", span: "half" },
  { id: "postal-code", label: "ZIP code", autoComplete: "postal-code", span: "half" },
  { id: "country", label: "Country", autoComplete: "country-name", span: "half" },
];

export function ShippingForm() {
  return (
    <section aria-labelledby="shipping-heading">
      <h2 id="shipping-heading" className="font-serif text-2xl text-ink">
        Shipping details
      </h2>
      <form
        id="shipping-form"
        className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5"
        noValidate
        onSubmit={(event) => event.preventDefault()}
      >
        {FIELDS.map((field) => (
          <div key={field.id} className={field.span === "half" ? "col-span-1" : "col-span-2"}>
            <label htmlFor={field.id} className="block text-sm text-ink">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              className="mt-2 h-11 w-full rounded-sm border border-line bg-paper px-3 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>
        ))}
      </form>
    </section>
  );
}
