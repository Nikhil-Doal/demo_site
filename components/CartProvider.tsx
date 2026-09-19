"use client";

import { createContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  clearStoredState,
  readStoredCart,
  writeStoredCart,
  type StoredCartItem,
} from "@/lib/storage";

export const MAX_QUANTITY = 10;

export type CartItem = StoredCartItem;

type CartState = {
  items: CartItem[];
  /** False until the saved cart has been read from sessionStorage. */
  ready: boolean;
};

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; slug: string; quantity: number }
  | { type: "setQuantity"; slug: string; quantity: number }
  | { type: "remove"; slug: string }
  | { type: "clear" };

export type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  addItem: (slug: string, quantity: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const clampQuantity = (quantity: number) =>
  Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, ready: true };
    case "add": {
      const existing = state.items.find((item) => item.slug === action.slug);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.slug === action.slug
              ? { ...item, quantity: clampQuantity(item.quantity + action.quantity) }
              : item,
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { slug: action.slug, quantity: clampQuantity(action.quantity) }],
      };
    }
    case "setQuantity":
      return {
        ...state,
        items: state.items.map((item) =>
          item.slug === action.slug ? { ...item, quantity: clampQuantity(action.quantity) } : item,
        ),
      };
    case "remove":
      return { ...state, items: state.items.filter((item) => item.slug !== action.slug) };
    case "clear":
      return { ...state, items: [] };
  }
}

/**
 * `?reset=1` on any page wipes the cart (and anything else in session storage)
 * before it is loaded, then drops the parameter so a reload keeps the new cart.
 */
function consumeResetParam() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("reset") !== "1") return;

  clearStoredState();
  url.searchParams.delete("reset");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], ready: false });

  useEffect(() => {
    consumeResetParam();
    dispatch({ type: "hydrate", items: readStoredCart() });
  }, []);

  useEffect(() => {
    if (state.ready) writeStoredCart(state.items);
  }, [state]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      ready: state.ready,
      addItem: (slug, quantity) => dispatch({ type: "add", slug, quantity }),
      setQuantity: (slug, quantity) => dispatch({ type: "setQuantity", slug, quantity }),
      removeItem: (slug) => dispatch({ type: "remove", slug }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
