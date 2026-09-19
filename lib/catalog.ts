export type Product = {
  slug: string;
  name: string;
  /** Price in integer cents. */
  price: number;
  /** Short line shown under the name in the product grid. */
  tagline: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
};

// Shop order. The grid renders products in exactly this order.
const products: Product[] = [
  {
    slug: "wool-scarf",
    name: "Lambswool scarf",
    price: 8400,
    tagline: "Oatmeal check",
    description:
      "Spun from Scottish lambswool, finished by hand. Soft enough to wear against bare skin and warm enough for a January platform.",
    details: [
      "100% lambswool",
      "180 × 30 cm with a hand-knotted fringe",
      "Woven in the Scottish Borders",
    ],
    image: "/images/wool-scarf.jpg",
    imageAlt: "Folded oatmeal lambswool scarf with a camel check and knotted fringe",
  },
  {
    slug: "leather-notebook",
    name: "Bound leather notebook",
    price: 4200,
    tagline: "Tan, A5",
    description:
      "Vegetable-tanned leather wrapped around 192 pages of heavyweight cream paper. The cover darkens and softens the longer you carry it.",
    details: [
      "A5, 192 pages of 120 gsm paper",
      "Refillable, with a wrap-around tie",
      "Stitched by hand in our workshop",
    ],
    image: "/images/leather-notebook.jpg",
    imageAlt: "Tan leather notebook with saddle stitching and a wrap-around leather tie",
  },
  {
    slug: "ceramic-mug",
    name: "Stoneware mug",
    price: 2800,
    tagline: "Speckled oat glaze",
    description:
      "Wheel-thrown in speckled stoneware and dipped in a soft oat glaze. Holds a proper cup of tea and keeps it warm while you forget about it.",
    details: [
      "350 ml",
      "Dishwasher and microwave safe",
      "Every glaze line is slightly different",
    ],
    image: "/images/ceramic-mug.jpg",
    imageAlt: "Speckled cream stoneware mug with an unglazed clay foot",
  },
  {
    slug: "canvas-tote",
    name: "Waxed canvas tote",
    price: 6500,
    tagline: "Field olive",
    description:
      "Heavy cotton canvas, waxed by hand to shrug off rain, with bridle leather handles riveted at the stress points. Big enough for a laptop and the weekly shop.",
    details: [
      "18 oz waxed cotton canvas",
      "42 × 38 × 12 cm",
      "Re-wax once a year to keep it proofed",
    ],
    image: "/images/canvas-tote.jpg",
    imageAlt: "Olive waxed canvas tote bag with brown leather handles and a front pocket",
  },
  {
    slug: "brass-pen",
    name: "Solid brass pen",
    price: 3800,
    tagline: "Unlacquered brass",
    description:
      "Turned from a single bar of solid brass and weighted to sit balanced in the hand. It takes standard gel refills and will outlast every one of them.",
    details: [
      "Solid brass, left uncoated",
      "Takes standard G2-style refills",
      "Develops a warm patina with use",
    ],
    image: "/images/brass-pen.jpg",
    imageAlt: "Solid brass pen with a knurled grip lying at an angle",
  },
  {
    slug: "linen-apron",
    name: "Linen work apron",
    price: 5800,
    tagline: "Slate blue",
    description:
      "Stonewashed linen in slate blue, cut long with a split front pocket for pens, tools and a phone. The neck strap adjusts and the ties are long enough to wrap to the front.",
    details: [
      "Stonewashed European linen",
      "One size, 90 cm long",
      "Machine wash warm, line dry",
    ],
    image: "/images/linen-apron.jpg",
    imageAlt: "Slate blue linen apron with a split front pocket holding a pencil",
  },
  {
    slug: "walnut-board",
    name: "Walnut serving board",
    price: 9600,
    tagline: "American black walnut",
    description:
      "Cut from a single piece of American black walnut and finished with food-safe oil. Serve on one side, slice on the other.",
    details: [
      "48 × 22 × 2 cm",
      "Hand wash, oil once a month",
      "Grain and colour vary from board to board",
    ],
    image: "/images/walnut-board.jpg",
    imageAlt: "Dark walnut serving board with a handle and a hanging hole",
  },
  {
    slug: "wool-socks",
    name: "Merino socks, two pack",
    price: 2400,
    tagline: "Flint and rust",
    description:
      "Fine merino with a reinforced heel and toe, knitted to stay up without pinching. One pair in flint grey, one in rust.",
    details: [
      "80% merino wool, 20% nylon",
      "Fits shoe sizes 8 to 12",
      "Knitted in Leicester, England",
    ],
    image: "/images/wool-socks.jpg",
    imageAlt: "Two merino socks, one flint grey and one rust with oatmeal heel and toe",
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

/** The next few products in shop order, wrapping around the end of the list. */
export function getRelatedProducts(slug: string, count = 4): Product[] {
  const index = products.findIndex((product) => product.slug === slug);
  const related: Product[] = [];
  for (let offset = 1; offset < products.length && related.length < count; offset++) {
    related.push(products[(index + offset) % products.length]);
  }
  return related;
}
