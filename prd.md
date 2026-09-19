# Meridian

**The storefront Aftershock breaks.**
## What Meridian is

Meridian is a small e-commerce storefront built for one purpose: to be the thing Aftershock tests on stage. It is the patient, not the product.

It has a catalog, a cart, and a checkout, and it ships with deliberately planted bugs that pass typecheck, pass lint, pass build, and only reveal themselves when someone actually uses the app.

### The one rule

**It has to look like a real shop.** Not a wireframe, not a Bootstrap demo, not five grey boxes labelled "Product 1".

This is not vanity. A judge's confidence in the QA tool is capped by their confidence in the thing it is testing. If Meridian looks like a hackathon toy, every finding Aftershock produces reads as a toy finding, and the whole demo deflates. If Meridian looks like something a real team shipped last week, the bugs feel like real bugs and the fix feels like real work.

Budget the visual polish accordingly. It is not the last thing to do if there is time — it is load-bearing.

### What it is not

No real payments, no real inventory, no accounts, no admin. Every screen exists to give an agent somewhere to go and something to get wrong.

## Stack and deployment

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js App Router, TypeScript | Preview deploys, file-based routes Scout can map by convention |
| Styling | Tailwind | Fast, and no CSS-in-JS class hashing to confuse selectors |
| State | React context for the cart | The bug lives in state wiring, so it needs to be real state |
| Data | Static TypeScript module | No database, no network variance, fully deterministic |
| API | Next route handlers | Real HTTP calls so the network capture has something to show |
| Images | Local files in `public/` | No remote image service, no cold-start flicker |
| Hosting | Vercel | Preview deploy per branch, which is the whole trigger mechanism |

### Repo

A separate repository from Aftershock. It must be a normal-looking project, because Scout reads the diff and the judges may look at the commit.

```
meridian/
  app/
    page.tsx                 catalog
    products/[slug]/page.tsx product detail
    cart/page.tsx
    checkout/page.tsx
    order/[id]/page.tsx      confirmation
    api/coupon/validate/route.ts
    api/cart/route.ts
  components/
  hooks/
  lib/
    catalog.ts
    money.ts
  public/images/
```

### Deployment

Production on `main`, preview on every branch. Both must be live before judging, because differential testing needs a base deployment to compare against.

**The critical setting:** disable Vercel's deployment protection on previews. Password-protected preview URLs are the single most likely thing to silently break the demo, because a remote browser will hit an auth wall and the agent will report a blank page. Check this in hour one, not hour thirty.

Build must stay under about 45 seconds. Aftershock waits on `deployment_status` before it does anything, and a slow build is dead air on stage.

## Routes and screens

Six routes. Every one exists because an agent needs somewhere to go.

| Route | Screen | What it must do |
| --- | --- | --- |
| `/` | Catalog | Grid of 8 products with photo, name, price. Each links to detail |
| `/products/[slug]` | Product detail | Photo, name, price, description, quantity, add to cart |
| `/cart` | Cart | Line items, quantities, subtotal, link to checkout |
| `/checkout` | Checkout | Coupon field, order summary, place order |
| `/order/[id]` | Confirmation | Order number, items, total paid |
| `/api/coupon/validate` | API | POST a code, get validity and percent off |

### The checkout page in detail

This is where the demo happens, so it gets specified properly.

Two columns. Left: a shipping form (name, email, address — present but not validated, it only needs to look real) and below it the discount code section. Right: the order summary showing subtotal, discount, shipping, and total.

The coupon interaction:

1. User types a code and clicks **Apply**
2. `POST /api/coupon/validate` with the code
3. On valid: a green "Coupon applied" message appears beneath the field, the discount line in the summary should populate, and the total should drop
4. On invalid: a red "That code isn't valid" message, summary untouched
5. An applied coupon can be removed, restoring the original total

Step 3 is where the first planted bug lives. Two of those three things will happen and one will not.

### Valid coupons

| Code | Effect |
| --- | --- |
| `SAVE20` | 20 percent off |
| `SAVE10` | 10 percent off |
| `WELCOME` | 15 percent off |

Anything else is invalid. Three codes rather than one, so Aftershock's adversary agent has something to vary and the demo isn't obviously hardcoded to a single string.

## Catalog and seed data

Eight products. A single small-batch goods shop, which is the easiest kind of store to make look credible with limited assets.

| Slug | Name | Price |
| --- | --- | --- |
| `wool-scarf` | Lambswool scarf | $84.00 |
| `leather-notebook` | Bound leather notebook | $42.00 |
| `ceramic-mug` | Stoneware mug | $28.00 |
| `canvas-tote` | Waxed canvas tote | $65.00 |
| `brass-pen` | Solid brass pen | $38.00 |
| `linen-apron` | Linen work apron | $58.00 |
| `walnut-board` | Walnut serving board | $96.00 |
| `wool-socks` | Merino socks, two pack | $24.00 |

### The demo arithmetic

The lambswool scarf is the demo product and its price is chosen deliberately.

```
subtotal        $84.00
SAVE20 (20%)   −$16.80
total           $67.20
```

Both numbers are clean, both are instantly checkable by a judge doing mental arithmetic, and $84 to $67.20 is a visibly large drop on screen. A price like $79.99 gives you $63.99 and nobody can tell at a glance whether that's right.

### Storage

Prices live in `lib/catalog.ts` as integer cents. No floats anywhere — floating point rounding is exactly the kind of noise that would make a differential comparator report a spurious delta.

The cart persists to `sessionStorage` so a reload doesn't empty it, which matters because one of the assertions tests reload behaviour.

## Determinism requirements

This is the section most likely to be skipped and most likely to wreck the demo.

Aftershock's differential agents run the same journey against two deployments and diff everything observable. Any part of Meridian that renders differently on two identical runs produces a false delta. Ten of those and the comparator is useless.

**Two loads of the same page, one second apart, must produce byte-identical output.** Everything below follows from that.

| Banned | Why | Do instead |
| --- | --- | --- |
| Relative timestamps | "2 minutes ago" differs between runs | Omit, or use a fixed date string |
| Random or shuffled ordering | Product grid order must be stable | Fixed order from the catalog array |
| Fake social proof | "12 people viewing this" is pure noise | Leave it out entirely |
| Random IDs in the DOM | React keys or generated ids that leak into attributes | Stable slugs |
| Entrance animations | Fade-ins are mid-flight when screenshots fire | Static render, or a hard 150ms cap |
| Carousels and auto-rotation | Different frame on each capture | Static grid |
| Remote images | Load timing varies, occasionally fails | Local files in `public/` |
| Analytics or chat widgets | Inject markup nondeterministically | None installed |
| `Math.random`, `Date.now` in render | Obvious | Nowhere in a component |

### Order IDs

The confirmation page needs an order number and a random one breaks determinism. Derive it from cart contents with a stable hash, so the same cart always produces the same order id. It looks real and it never varies.

### A note on scope

These rules apply to Meridian because Meridian is the controlled test subject. Aftershock's comparator still needs its own noise normalisation for the general case, since real apps will not be this well behaved. But do not rely on the normaliser to cover for a sloppy demo app: on stage, the app should be clean and the normaliser should have nothing to do.

## Testability contract

Aftershock uses Stagehand, which finds elements by natural language against the accessibility tree and self-heals when selectors move. So Meridian does not strictly need test hooks. It gets them anyway, because a deterministic replay is faster, cheaper, and far less likely to wobble on stage than an inferred one.

### Stable test ids

Every element an assertion touches carries a `data-testid` that must not change between branches.

| Element | `data-testid` |
| --- | --- |
| Add to cart button | `add-to-cart` |
| Cart line item | `cart-line-{slug}` |
| Cart subtotal | `cart-subtotal` |
| Coupon input | `coupon-input` |
| Coupon apply button | `coupon-apply` |
| Coupon status message | `coupon-status` |
| Summary subtotal | `summary-subtotal` |
| Summary discount | `summary-discount` |
| Summary total | `order-total` |
| Place order button | `place-order` |

The rule that matters: **the planted bug must never change a test id.** If the buggy branch renames `order-total`, the differential agent reports a DOM-structure delta instead of a value delta, and the demo tells the wrong story. The bug is in the number, not the markup.

### Accessible naming

Real `<button>`, real `<label>` tied to each input, real `<a href>`. Beyond being correct, this is what lets Stagehand's `observe` resolve "click the apply coupon button" on the first try. A div with an onClick handler is invisible to the accessibility tree and will cost you an agent retry.

### State reset

A `?reset=1` query parameter clears the cart and any applied coupon on load. Every agent begins its journey with this, so no agent inherits state from another and runs are independent. Without it, eight parallel sessions sharing a browser context will interfere and you will spend an hour diagnosing phantom failures.

### Machine-readable totals

The total element also carries the raw value: `data-total-cents="8400"`. Agents can then assert on an integer instead of parsing `"$84.00"` out of text, which removes a whole class of formatting-related false positives.

### Network shape

The coupon endpoint returns a flat, obvious payload, because the network capture appears in the GitHub issue and Sleuth reasons from it:

```json
{ "valid": true, "code": "SAVE20", "percentOff": 20 }
```

Add a deliberate 200 to 300ms delay. It makes the recording legible — you can see the request fire and the response land — and it stops the interaction being over before a frame is captured.

## The git plan

The commit is a prop. It has to be staged as carefully as the app.

### On `main`

The whole store, working correctly, with **no coupon feature at all**. This is the base deployment every differential agent compares against, so it must be clean. Any bug already on `main` is a bug Aftershock correctly refuses to report, which is the right behaviour but a wasted demo beat.

Give `main` a handful of ordinary-looking commits with real messages. A repo whose entire history is one commit called "initial" undercuts the story.

### On `feat/coupon-codes`

Exactly one commit. It is the only thing Scout reads, so it does the work of a specification.

```
feat: coupon codes at checkout

Adds a discount code field to the checkout page. Valid codes apply
a percentage discount to the order total. Invalid codes surface an
inline error and leave the order untouched.

Also moves price formatting into lib/money.ts so the discount can
be applied in one place.
```

Three things this message is doing:

**It states the intent honestly.** Scout derives every conformance assertion from these words. The commit describes the feature correctly; the code simply fails to deliver it. That gap is the entire product.

**It mentions the refactor in passing.** "Also moves price formatting into lib/money.ts" is how real commits bury their most dangerous change. It gives the second bug a plausible origin, and it lets Sleuth find the connection.

**It says nothing about `/cart`.** Which is precisely why the cart regression is unclaimed, and why only a differential agent can catch it.

### Files touched

| File | Change |
| --- | --- |
| `components/CouponInput.tsx` | New |
| `app/api/coupon/validate/route.ts` | New |
| `lib/money.ts` | Modified — the dangerous one |
| `hooks/useCartTotal.ts` | Modified |
| `app/checkout/page.tsx` | Modified |
| `components/OrderSummary.tsx` | Modified |

Six files, about 140 lines. Big enough to be a real feature, small enough that Scout's route mapping is legible when you show it on screen.

### Staging for the demo

The branch exists and is pushed **before** judging, but the demo push is a trivial follow-up commit on the same branch — a whitespace fix or a comment — which re-triggers the webhook and gives you a live `git push` to open on. You get a real trigger without gambling on a cold build in front of judges.

Keep a second identical branch in reserve for a rehearsal or a second run.

## The planted bugs

Three bugs, each one aimed at a different part of Aftershock. Every one of them must pass `tsc`, pass `eslint`, and build cleanly, or the premise collapses.

| # | Bug | Caught by | Severity |
| --- | --- | --- | --- |
| 1 | Coupon never reaches the order total | Conformance agent, via intent | High |
| 2 | Cart subtotal renders as `$NaN` | Differential agent, via base comparison | Critical |
| 3 | Empty coupon accepted as valid | Adversary agent | Medium |

### Bug 1 — the feature doesn't do what the commit says

**Mechanism.** `CouponInput` calls the API, gets back `{ valid: true, percentOff: 20 }`, and stores it in its own local `useState`. It renders "Coupon applied" from that local state, which is why the UI looks like it worked. But the value is never lifted into the cart context, so `useCartTotal` never sees a coupon and the total never changes.

**Why CI misses it.** The types are all correct. The memo's dependency array is complete and honest, so `react-hooks/exhaustive-deps` has nothing to say. The component compiles, renders, and passes any test that checks the success message appears.

This matters: **resist the temptation to plant a missing dependency array.** That is the textbook React bug, and the textbook lint rule catches it. State that is simply never lifted is more realistic, completely invisible to tooling, and just as easy to fix.

**What an agent sees.** Enter `SAVE20`, click Apply, green message appears, discount line stays empty, total stays `$84.00`. The expected value is `$67.20` and the assertion came from the author's own PR body.

**The fix.** Lift the coupon into the cart context and derive the discounted total in `useCartTotal`. Four lines, one file. Small enough that Codex will get it right and a judge can read the diff in three seconds.

### Bug 2 — the unclaimed regression

This is the most important bug in the demo. It is the one that proves the differential oracle, and it is the one no competitor's tool would find.

**Mechanism.** The commit moves price formatting into `lib/money.ts` and gives it a new optional parameter:

```ts
export function formatPrice(cents: number, discountPct?: number) {
  const net = cents * (1 - discountPct / 100);
  return `$${(net / 100).toFixed(2)}`;
}
```

The checkout page always passes the second argument, so checkout looks fine. The cart page, untouched by this commit, still calls `formatPrice(subtotal)` with one argument. `discountPct` is `undefined`, the arithmetic produces `NaN`, and `/cart` renders `$NaN`.

**Why CI misses it.** The parameter is optional, so TypeScript is satisfied at every call site. `undefined` in arithmetic is legal JavaScript. Nothing throws. There is no console error, no failed request, no 500 — the page renders perfectly and displays a wrong string. This is exactly the class of bug that reaches production.

**Why only a differential agent catches it.** A conformance agent has no assertion about `/cart`, because the commit never mentioned `/cart`. An explorer agent might wander there, but `$NaN` on a page it has no baseline for is a judgement call, and the confidence model would reject a lone explorer report. The differential agent runs `/cart` against both deployments simultaneously, sees `$84.00` on main and `$NaN` on the preview, finds nothing in the diff claiming `/cart` would change, and classifies it as a regression by construction.

Say that out loud during the demo. It is the single strongest technical moment you have.

**Making sure it lands.** Add the cart page to Scout's critical-path surfaces regardless of the diff, so a differential agent is always assigned to it. This is defensible on its own terms — the purchase path always gets tested — and it guarantees the bug is found rather than hoping the route mapper wanders there.

### Bug 3 — the adversary's bug

**Mechanism.** The validation route checks `if (VALID_CODES[code.toUpperCase()])` without first checking for an empty string, and a falsy-but-present empty code takes a branch that returns `valid: true` with `percentOff: 0`. Submitting an empty field shows "Coupon applied" and applies nothing.

**Why it's here.** It gives the adversary agent a genuine catch, which proves that archetype isn't decorative. It is deliberately Medium severity, so the Critic ranks it below the other two and it doesn't compete for the demo's attention. If time is short this is the one to drop.

### What all three have in common

Every one of them is a bug where **the app keeps working and displays something wrong.** No crashes, no error pages, no red console. That's deliberate: crashes are what a smoke test catches, and if Aftershock's demo bugs were crashes, a judge would rightly ask why you need a fleet of browsers to find them.

## Spare bugs

Keep three or four extra branches ready. You will want them for two reasons: rehearsing against the same bug eight times stops telling you anything, and a judge may ask whether the system only works on the one case you built for.

Being able to say *"pick one"* and run it live is worth more than any slide.

| Branch | Bug | Caught by | Difficulty |
| --- | --- | --- | --- |
| `feat/free-shipping` | Free shipping threshold uses `>` instead of `>=`, so an order at exactly $100 pays shipping | Conformance, edge case | Easy |
| `feat/quantity-stepper` | Quantity updates the line item but not the subtotal until reload | Conformance | Easy |
| `fix/price-rounding` | Rounding moved from cents to floats, so `/cart` totals drift by a penny on some carts | Differential, subtle | Medium |
| `feat/product-badges` | A new badge component shifts the add-to-cart button off-screen at 1280px wide | Explorer or differential | Medium |
| `chore/extract-utils` | Pure refactor commit that silently changes sort order on the catalog | Differential only, nothing claimed | Hard |

That last one is the best insurance policy you have. A commit whose message says *nothing is supposed to change* and where something did is the purest possible demonstration of the differential oracle. If the main demo goes sideways, this is the one to fall back on.

**Rule for every spare:** it must be a one-file, small-diff change, and it must pass CI. A spare that breaks the build teaches nothing, because the build already caught it.

## Visual direction

Two hours, and it has to look like a real shop. That is achievable, but only by copying what real small shops actually do rather than inventing.

**Warm, quiet, editorial.** Off-white ground around `#FAF8F3`, near-black ink, one muted accent. A serif for product names and prices, a clean sans for everything else. Small-batch goods stores all look roughly like this, so it reads as real immediately and costs nothing extra.

**Photography is the whole battle.** Eight product photos on plain backgrounds, consistent in tone and crop. Nothing destroys credibility faster than mismatched stock images. Generate them or source them, but do it in the first hour and make them consistent — inconsistent photos look worse than no photos.

**Generous whitespace, few borders.** Real stores have air. Boxes around everything is the single clearest tell of a hackathon build.

**Real copy.** "Spun from Scottish lambswool, finished by hand." Not "Product description goes here." Two sentences per product, written once.

### What to avoid

No gradient hero. No emoji. No Inter. No cookie banner, no newsletter modal, no chat bubble, no "Sale!" starbursts, no fake urgency counters. Beyond looking generic, every one of them is a source of nondeterminism or an obstacle an agent has to click through before it can start working.

### One deliberate constraint

**No dark mode.** A theme toggle doubles your visual surface area, and worse, an agent landing in a different theme than its counterpart produces a page-wide differential delta that swamps everything real. One theme, always.

## Build plan

Meridian is not the project. It is a prop for the project, and it should be built like one — fast, by one person, in parallel with the real work.

| Hours | Work | Done when |
| --- | --- | --- |
| 0–0.5 | Next.js scaffold, Tailwind, Vercel connected, **preview protection off** | A preview URL loads for a branch |
| 0.5–1 | Catalog data, product photos, real copy written | 8 products exist with images |
| 1–2.5 | Catalog, detail, cart, checkout, confirmation. Test ids as you go | Full purchase path completes |
| 2.5–3 | Determinism pass and `?reset=1` | Two loads produce identical DOM |
| 3–3.5 | Merge to `main`, deploy production | Base deployment live |
| 3.5–4.5 | Build the coupon feature with bugs 1 and 2 planted. Verify `tsc`, `eslint` and `build` all pass | Branch pushed, preview live, bugs reproducible by hand |
| 4.5–5 | Spare branches | At least two ready |

Five hours, one owner, finished around the same time Aftershock's parallel agents come online — which is when you need something to point them at.

### The verification step nobody remembers

Before handing Meridian to the team, **reproduce every planted bug by hand, in a real browser, on the deployed preview.** Not locally. Not from reading the code.

If you cannot make the total stay at $84.00 with your own hands, no agent will either, and you will spend four hours debugging Aftershock for a bug that was never actually shipped. This has killed more hackathon demos than any framework choice.

### Out of scope

Authentication, real payments, inventory, search, filters, reviews, wishlists, an admin panel, mobile layouts, dark mode, i18n, SEO, and tests. Meridian has no test suite on purpose — the absence of tests is the premise of the product testing it.

### Open questions

- Does the demo need a logged-in state? Only if Aftershock's Browserbase Contexts work is going ahead. Default assumption: no.
- Where do the product photos come from? Decide in hour one; inconsistent photos are worse than plain ones.
- Does anything need to survive a page reload beyond the cart? Assumption: no.