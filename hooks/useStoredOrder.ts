import { useMemo, useSyncExternalStore } from "react";
import { readOrderJson, type StoredOrder } from "@/lib/storage";

// Orders are written once at checkout and never change, so there is nothing
// to subscribe to.
const subscribe = () => () => {};

/**
 * Reads a placed order from sessionStorage.
 * `undefined` while rendering on the server, `null` if the order isn't found.
 */
export function useStoredOrder(id: string): StoredOrder | null | undefined {
  const json = useSyncExternalStore(
    subscribe,
    () => readOrderJson(id),
    () => undefined,
  );

  return useMemo(() => {
    if (json === undefined || json === null) return json;
    try {
      return JSON.parse(json) as StoredOrder;
    } catch {
      return null;
    }
  }, [json]);
}
