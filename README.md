# Meridian

Storefront for Meridian Goods: a catalog of eight products, a cart, checkout and order confirmation.

Next.js (App Router) + TypeScript + Tailwind. No database: the catalog is a static module in
`lib/catalog.ts` and the cart lives in React context, persisted to `sessionStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script              | What it does                 |
| ------------------- | ---------------------------- |
| `npm run dev`       | Local dev server             |
| `npm run build`     | Production build             |
| `npm run start`     | Serve the production build   |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | `tsc --noEmit`               |

## Routes

| Route               | Screen                                   |
| ------------------- | ---------------------------------------- |
| `/`                 | Catalog                                  |
| `/products/[slug]`  | Product detail                           |
| `/cart`             | Cart                                     |
| `/checkout`         | Shipping details and order summary       |
| `/order/[id]`       | Order confirmation                       |
| `POST /api/cart`    | Submits the cart, returns an order id    |

## Conventions

- **Money is integer cents** everywhere. Format only when rendering.
- **Rendering is deterministic.** No random ids, no `Date.now()` in render, no entrance
  animations, no remote images. The product grid always renders in catalog order, and order
  ids are a hash of the cart contents, so the same cart always gets the same order number.
- **`?reset=1`** on any URL clears the cart and anything else Meridian keeps in session storage.
- **Test ids** (`data-testid`) on the elements below are a contract. Don't rename them.

| Element             | `data-testid`       |
| ------------------- | ------------------- |
| Add to cart button  | `add-to-cart`       |
| Cart line item      | `cart-line-{slug}`  |
| Cart subtotal       | `cart-subtotal`     |
| Summary subtotal    | `summary-subtotal`  |
| Summary total       | `order-total`       |
| Place order button  | `place-order`       |

The summary total also carries the raw amount as `data-total-cents`.

## Product photography

Images live in `public/images/{slug}.jpg`, 1000 × 1250 (4:5), on the same warm grey backdrop.
Replacements should keep the filename, size and backdrop.
