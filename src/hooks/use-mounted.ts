"use client";

import { useSyncExternalStore } from "react";

// Returns `false` during SSR / first render, `true` after hydration.
// Uses `useSyncExternalStore` to avoid the "setState in effect" lint rule.
const emptySubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot: mounted
    () => false, // server snapshot: not mounted
  );
}
