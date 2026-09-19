// Thin wrappers around sessionStorage. Everything Meridian stores lives under
// the "meridian:" prefix so a reset can clear it in one pass.

const PREFIX = "meridian:";
const CART_KEY = `${PREFIX}cart`;
const orderKey = (id: string) => `${PREFIX}order:${id}`;

export type StoredCartItem = {
  slug: string;
  quantity: number;
};

export type StoredOrder = {
  id: string;
  lines: {
    slug: string;
    name: string;
    image: string;
    quantity: number;
    lineTotal: number;
  }[];
  total: number;
};

function read(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, quota). The cart still works
    // for the current page view, it just won't survive a reload.
  }
}

export function readStoredCart(): StoredCartItem[] {
  const raw = read(CART_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredCartItem =>
        typeof item?.slug === "string" &&
        Number.isInteger(item?.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function writeStoredCart(items: StoredCartItem[]) {
  write(CART_KEY, JSON.stringify(items));
}

export function saveOrder(order: StoredOrder) {
  write(orderKey(order.id), JSON.stringify(order));
}

/** Raw JSON for an order, so callers can use it as a stable snapshot. */
export function readOrderJson(id: string): string | null {
  return read(orderKey(id));
}

/** Removes everything Meridian has put in sessionStorage. */
export function clearStoredState() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key?.startsWith(PREFIX)) keys.push(key);
    }
    keys.forEach((key) => window.sessionStorage.removeItem(key));
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
