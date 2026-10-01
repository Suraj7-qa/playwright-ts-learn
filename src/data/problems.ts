import type { PracticeProblem } from "@/lib/types";

export const practiceProblems: PracticeProblem[] = [
  // ---------------- TypeScript ----------------
  {
    id: "ts-1-deep-readonly",
    title: "Implement DeepReadonly<T>",
    difficulty: "advanced",
    category: "typescript",
    tags: ["mapped types", "recursion", "conditional types"],
    prompt: [
      "Write a type `DeepReadonly<T>` that makes every property of `T` readonly — recursively, including nested objects and arrays.",
      "It should behave like `Readonly<T>` for the top level, but also drill into nested object types and array element types.",
      "Function types and primitives should be left unchanged.",
    ],
    hints: [
      "Use a mapped type that wraps each property in `Readonly<...>`.",
      "Detect nested object types with a conditional: `T extends object ? DeepReadonly<T> : T`.",
      "Make sure you exclude functions — they're objects too, but you don't want to recurse into them.",
      "Use `keyof T` to iterate and `[K in keyof T]` to map.",
    ],
    solutionCode: {
      language: "typescript",
      code: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends (...args: any[]) => any
    ? T[K]
    : T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface Nested {
  user: { name: string; address: { city: string } };
  scores: number[];
  log: (msg: string) => void;
}

type R = DeepReadonly<Nested>;
/*
{
  readonly user: {
    readonly name: string;
    readonly address: { readonly city: string };
  };
  readonly scores: readonly number[];
  readonly log: (msg: string) => void;
}
*/`,
    },
    explanation: [
      "The mapped type iterates over every key. For each value type T[K], we check three things in order: is it a function? If so, leave it alone. Otherwise, is it an object? If so, recurse. Otherwise (primitive), use it as-is.",
      "The order matters: function check first, because functions are technically objects and would otherwise be recursed into, producing a broken type. The array case is handled implicitly — arrays satisfy `extends object`, and TypeScript maps them to `readonly number[]` via the standard Readonly behaviour on arrays.",
    ],
  },
  {
    id: "ts-2-pick-by-value-type",
    title: "Pick properties whose value matches a type",
    difficulty: "intermediate",
    category: "typescript",
    tags: ["mapped types", "conditional types", "keyof"],
    prompt: [
      "Write a type `PickByValue<T, V>` that returns a new type containing only the properties of `T` whose value is assignable to `V`.",
      "Example: given `{ name: string; age: number; email: string }`, `PickByValue<T, string>` should return `{ name: string; email: string }`.",
    ],
    hints: [
      "Use a mapped type with `K in keyof T`.",
      "Add an `as` clause to remap the key — `K extends ... ? K : never` filters keys.",
      "The condition is `T[K] extends V`.",
    ],
    solutionCode: {
      language: "typescript",
      code: `type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface Profile {
  name: string;
  age: number;
  email: string;
  active: boolean;
}

type StringProps = PickByValue<Profile, string>;
// { name: string; email: string }

type BooleanProps = PickByValue<Profile, boolean>;
// { active: boolean }`,
    },
    explanation: [
      "The `as` clause in a mapped type lets you remap (or filter) keys. When the remapped key is `never`, the property is dropped from the resulting type. This is the cleanest way to filter properties by their value type.",
      "The conditional `T[K] extends V` checks assignability — string is assignable to string, number is not. The result preserves the original value type at the filtered keys.",
    ],
  },
  {
    id: "ts-3-typed-event-emitter",
    title: "Build a strongly-typed event emitter",
    difficulty: "advanced",
    category: "typescript",
    tags: ["generics", "mapped types", "template literals"],
    prompt: [
      "Design a `TypedEmitter<TEvents>` class where `TEvents` is a record of event name to payload type.",
      "The `on(name, handler)` method must accept a handler whose parameter matches the payload type for that event.",
      "The `emit(name, payload)` method must accept a payload of the correct type. Calls with the wrong event name or wrong payload should fail at compile time.",
    ],
    hints: [
      "Make the class generic over `TEvents extends Record<string, any>`.",
      "Index into TEvents with the event name to get the payload type.",
      "Use `keyof TEvents` for the event-name parameter.",
    ],
    solutionCode: {
      language: "typescript",
      code: `type EventHandler<T> = (payload: T) => void;

class TypedEmitter<TEvents extends Record<string, any>> {
  private handlers = new Map<keyof TEvents, Set<EventHandler<any>>>();

  on<K extends keyof TEvents>(name: K, handler: EventHandler<TEvents[K]>) {
    if (!this.handlers.has(name)) this.handlers.set(name, new Set());
    this.handlers.get(name)!.add(handler);
    return () => this.off(name, handler);
  }

  off<K extends keyof TEvents>(name: K, handler: EventHandler<TEvents[K]>) {
    this.handlers.get(name)?.delete(handler);
  }

  emit<K extends keyof TEvents>(name: K, payload: TEvents[K]) {
    this.handlers.get(name)?.forEach((h) => h(payload));
  }
}

// Usage — the contract is enforced at the call site
interface CartEvents {
  itemAdded: { sku: string; qty: number };
  itemRemoved: { sku: string };
  checkout: { total: number };
}

const cart = new TypedEmitter<CartEvents>();

cart.on("itemAdded", (p) => console.log(p.sku, p.qty));
cart.emit("itemAdded", { sku: "ABC", qty: 2 }); // OK
// cart.emit("itemAdded", { sku: "ABC" });        // ERROR: missing qty
// cart.on("checkout", (p) => p.sku);             // ERROR: checkout has no sku`,
    },
    explanation: [
      "The generic parameter `TEvents` is the contract. Every method that takes an event name also takes a generic K bound by `keyof TEvents`, which lets us index `TEvents[K]` to get the per-event payload type.",
      "The handler's parameter type is `TEvents[K]`, so the compiler enforces that the handler accepts the right shape. The same constraint flows through `emit` — passing the wrong payload type is a compile error.",
      "`on` returns an unsubscribe function — a common ergonomic pattern that lets callers do `const off = emitter.on(...); ... off();` instead of tracking the handler for later `off()` calls.",
    ],
  },
  {
    id: "ts-4-result-type",
    title: "Implement a Result<T, E> type for error handling",
    difficulty: "intermediate",
    category: "typescript",
    tags: ["discriminated unions", "generics"],
    prompt: [
      "Model an operation that either succeeds with a value of type T or fails with an error of type E.",
      "Provide `ok(value)` and `err(error)` constructors, and an `isOk` / `isErr` pair of type guards.",
      "The success and failure variants must be distinguishable by a discriminator field.",
    ],
    hints: [
      "Use a discriminated union with a `status: 'ok' | 'err'` field.",
      "Generic parameters T and E let the caller control both payload types.",
      "Type guards are functions whose return type is `x is Result<...>`.",
    ],
    solutionCode: {
      language: "typescript",
      code: `type Result<T, E = Error> =
  | { status: "ok"; value: T }
  | { status: "err"; error: E };

function ok<T>(value: T): Result<T, never> {
  return { status: "ok", value };
}

function err<E>(error: E): Result<never, E> {
  return { status: "err", error };
}

function isOk<T, E>(r: Result<T, E>): r is { status: "ok"; value: T } {
  return r.status === "ok";
}

function isErr<T, E>(r: Result<T, E>): r is { status: "err"; error: E } {
  return r.status === "err";
}

// Usage — no try/catch needed
function parseInt(s: string): Result<number, string> {
  const n = parseInt(s, 10);
  return isNaN(n) ? err("not a number") : ok(n);
}

const r = parseInt("42");
if (isOk(r)) {
  console.log(r.value.toFixed(2));  // r.value is number
} else {
  console.log(r.error);            // r.error is string
}`,
    },
    explanation: [
      "Discriminated unions are the idiomatic TypeScript pattern for representing operations that can fail in type-safe ways. The `status` field is the discriminator — TypeScript narrows to the correct variant inside each branch of a conditional.",
      "Using `never` for the unused type parameter in `ok` and `err` lets callers write `Result<number, string>` without having to specify both — `ok(42)` returns `Result<number, never>`, which is assignable to any `Result<number, E>`.",
      "Compared to try/catch, this pattern forces callers to handle the error case explicitly, and the error type is part of the function's signature instead of being opaque.",
    ],
  },
  {
    id: "ts-5-async-pool",
    title: "Implement an async pool with concurrency limit",
    difficulty: "intermediate",
    category: "typescript",
    tags: ["generics", "async", "Promises"],
    prompt: [
      "Write a function `mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]>` that maps over `items` with at most `limit` concurrent invocations of `fn`.",
      "The result must preserve the order of the input array.",
      "If any invocation rejects, the whole promise rejects with that error.",
    ],
    hints: [
      "Track a pointer to the next item to start; spawn up to `limit` workers that pull the next item.",
      "Each worker writes to the result array at the original index — that's how you preserve order.",
      "Use Promise.all on the worker promises to wait for everything.",
    ],
    solutionCode: {
      language: "typescript",
      code: `async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// Usage — fetch 50 URLs with at most 5 in flight
const urls = Array.from({ length: 50 }, (_, i) => \`https://api.example.com/\${i}\`);
const bodies = await mapLimit(urls, 5, (url) =>
  fetch(url).then((r) => r.text())
);`,
    },
    explanation: [
      "The trick is to share a single cursor across all workers. Each worker grabs the next index, runs the function, stores the result, then loops. Because the result is written at the original index, order is preserved regardless of completion order.",
      "Spawning `min(limit, items.length)` workers handles the edge case where there are fewer items than the limit. Using `Promise.all` propagates the first rejection — matching the spec.",
    ],
  },
  {
    id: "ts-6-optional-chain-types",
    title: "Type the result of a deeply-nested optional accessor",
    difficulty: "intermediate",
    category: "typescript",
    tags: ["indexed access", "conditional types", "infer"],
    prompt: [
      "Given a path string like `'user.address.city'`, write a function `get(obj, path)` that returns the value at that path (or undefined) with the correct type.",
      "The return type must be the exact type of the nested property, not `any`.",
      "Bonus: type the path parameter so invalid paths fail at compile time.",
    ],
    hints: [
      "Use a recursive conditional type to walk the path string.",
      "Template literal types with `infer` let you split on '.'.",
      "Index access `T[K]` walks one level.",
    ],
    solutionCode: {
      language: "typescript",
      code: `type Path<T, P extends string> =
  P extends \`\${infer K}.\${infer Rest}\`
    ? K extends keyof T
      ? Path<T[K], Rest>
      : never
    : P extends keyof T
    ? T[P]
    : never;

function get<T, P extends string>(obj: T, path: P): Path<T, P> {
  return path.split(".").reduce<any>((acc, key) => acc?.[key], obj);
}

interface Data {
  user: { address: { city: string; zip: number } };
}

const d: Data = { user: { address: { city: "London", zip: 12345 } } };

const city = get(d, "user.address.city");  // string
const zip = get(d, "user.address.zip");     // number
// const bad = get(d, "user.address.country"); // ERROR: path doesn't exist`,
    },
    explanation: [
      "The `Path` type is recursive. It splits the string on the first '.', checks whether the left side is a key of T, then recurses into T[K] with the rest of the string. When there's no more '.', it does a final index access.",
      "If any segment isn't a valid key, the conditional resolves to `never`, and the call site gets a compile error. The runtime uses a simple reduce with optional chaining — it doesn't need to match the type-level logic, only to behave the same way.",
    ],
  },
  {
    id: "ts-7-merge-config",
    title: "Deep-merge two config objects with full type safety",
    difficulty: "advanced",
    category: "typescript",
    tags: ["conditional types", "mapped types", "generics"],
    prompt: [
      "Write a function `merge<A, B>(a: A, b: B)` that deep-merges two objects: for each key in B, if both a and b have an object value at that key, recurse; otherwise b's value wins.",
      "The return type must reflect the merge — keys from both A and B, with B's types overriding A's where they conflict.",
      "Arrays should be replaced (not concatenated).",
    ],
    hints: [
      "Use a mapped type over `keyof A | keyof B`.",
      "For each key, check whether both A and B have an object value at that key.",
      "If so, recurse the type-level merge.",
    ],
    solutionCode: {
      language: "typescript",
      code: `type DeepMerge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? B[K] extends object
        ? A[K] extends object
          ? DeepMerge<A[K], B[K]>
          : B[K]
        : B[K]
      : B[K]
    : K extends keyof A
    ? A[K]
    : never;
};

function merge<A extends object, B extends object>(a: A, b: B): DeepMerge<A, B> {
  const out: any = { ...a };
  for (const key of Object.keys(b)) {
    const av = (a as any)[key];
    const bv = (b as any)[key];
    if (av && bv && typeof av === "object" && typeof bv === "object"
        && !Array.isArray(av) && !Array.isArray(bv)) {
      out[key] = merge(av, bv);
    } else {
      out[key] = bv;
    }
  }
  return out;
}

const a = { host: "localhost", port: 3000, db: { url: "x", timeout: 5 } };
const b = { port: 8080, db: { timeout: 10 } };
const merged = merge(a, b);
// { host: string; port: number; db: { url: string; timeout: number } }
// merged.db.url === "x", merged.db.timeout === 10, merged.port === 8080`,
    },
    explanation: [
      "The type-level merge uses a mapped type over the union of keys. For each key, the conditional picks the right value type: if B has the key, B wins; if A has it, A provides it; otherwise never. The nested case recurses when both A and B have an object at that key.",
      "The runtime mirrors the type-level logic exactly. The array check skips recursion — arrays are replaced, not concatenated. The result preserves types because the function is generic over A and B and the return type is computed from them.",
    ],
  },
  {
    id: "ts-8-enum-alternative",
    title: "Replace an enum with a const object + union, preserving exhaustiveness",
    difficulty: "beginner",
    category: "typescript",
    tags: ["unions", "as const", "keyof"],
    prompt: [
      "Refactor the following enum-based code to use a plain const object plus a derived union type, without losing the exhaustiveness check in the switch.",
      "Original:",
      "enum Status { Pending, Active, Closed }",
      "function label(s: Status) { switch(s) { case Pending: return 'P'; case Active: return 'A'; case Closed: return 'C'; default: const _: never = s; throw new Error(); } }",
    ],
    hints: [
      "Use `as const` on a plain object to lock in literal types.",
      "Derive the union with `typeof Status[keyof typeof Status]`.",
      "The exhaustiveness check works the same way.",
    ],
    solutionCode: {
      language: "typescript",
      code: `const Status = {
  Pending: "Pending",
  Active: "Active",
  Closed: "Closed",
} as const;

type Status = typeof Status[keyof typeof Status];
// "Pending" | "Active" | "Closed"

function label(s: Status): string {
  switch (s) {
    case Status.Pending: return "P";
    case Status.Active:  return "A";
    case Status.Closed:   return "C";
    default: {
      const _exhaustive: never = s;
      throw new Error(\`Unhandled status: \${_exhaustive}\`);
    }
  }
}

label(Status.Pending);  // "P"`,
    },
    explanation: [
      "The `as const` assertion locks each property to its literal value — without it, TypeScript widens them all to string. The derived union `typeof Status[keyof typeof Status]` is then `\"Pending\" | \"Active\" | \"Closed\"`.",
      "This pattern has three advantages over a string enum: no runtime object overhead if you only need the literal values, full tree-shaking (the object is dead-code eliminated if unused), and the values survive minification since they're plain string literals in the source.",
      "The exhaustiveness check works identically: the default branch's `never` assignment fails to compile if any variant is unhandled.",
    ],
  },

  // ---------------- Playwright ----------------
  {
    id: "pw-1-stable-counter",
    title: "Stabilise a flaky cart-count test",
    difficulty: "intermediate",
    category: "playwright",
    tags: ["auto-waiting", "assertions", "flakiness"],
    prompt: [
      "A test that adds an item to the cart and asserts the cart badge shows '1' is flaky. The badge appears 200-500ms after the click. The current test uses `await page.waitForTimeout(1000)` and reads the text with `textContent()`.",
      "Refactor the test to use web-first assertions and remove the sleep. The test should pass reliably without any artificial delay.",
    ],
    hints: [
      "Replace `waitForTimeout` with `await expect(locator).toHaveText('1')`.",
      "Use `getByRole` or `getByTestId` to target the badge.",
      "Web-first assertions retry automatically — no manual polling needed.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";

test("cart badge updates after adding an item", async ({ page }) => {
  await page.goto("/products");

  // Click 'Add to cart' on the first product
  await page.getByRole("button", { name: "Add to cart" }).first().click();

  // Web-first assertion — Playwright retries until it passes or times out
  await expect(page.getByTestId("cart-badge")).toHaveText("1");
});`,
    },
    explanation: [
      "The original test relied on a fixed sleep that was sometimes too short. Playwright's web-first assertions retry every 100ms for up to 5s by default — far more resilient than a guessed timeout.",
      "Notice we use `getByTestId(\"cart-badge\")` — test IDs are an acceptable escape hatch when no semantic role exists. They're explicit about intent and survive CSS refactors.",
      "If the assertion still fails occasionally, increase the per-assertion timeout: `await expect(locator).toHaveText(\"1\", { timeout: 10_000 })`. Never reach for `waitForTimeout`.",
    ],
  },
  {
    id: "pw-2-multi-tab",
    title: "Test a flow that opens a new tab",
    difficulty: "intermediate",
    category: "playwright",
    tags: ["popup", "context", "waitForEvent"],
    prompt: [
      "Clicking 'Open report' on the dashboard opens the report in a new browser tab. Write a test that waits for the new tab, switches to it, and asserts the report heading is visible.",
      "The new tab may take up to 2 seconds to open after the click.",
    ],
    hints: [
      "Use `context.waitForEvent('page')` to capture the new page promise before clicking.",
      "Await the promise to get a `Page` object representing the new tab.",
      "Use `page.waitForLoadState()` to wait for the new tab's content to settle.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";

test("report opens in a new tab", async ({ page, context }) => {
  await page.goto("/dashboard");

  // Set up the listener BEFORE the click — otherwise we might miss it
  const newTabPromise = context.waitForEvent("page");

  await page.getByRole("link", { name: "Open report" }).click();

  const newTab = await newTabPromise;
  await newTab.waitForLoadState("domcontentloaded");

  await expect(
    newTab.getByRole("heading", { name: "Monthly Report" })
  ).toBeVisible();
});`,
    },
    explanation: [
      "Race condition gotcha: you must register the `waitForEvent('page')` listener BEFORE the click that opens the tab. If you click first, the event may fire before the listener is attached, and the promise never resolves.",
      "`waitForLoadState` on the new page is critical — the page object exists as soon as the tab opens, but the DOM may not have loaded yet. Assertions on the new page will retry until it's ready, but explicit `waitForLoadState` makes the intent clear.",
    ],
  },
  {
    id: "pw-3-dialog",
    title: "Handle a native confirm() dialog",
    difficulty: "beginner",
    category: "playwright",
    tags: ["dialogs", "events"],
    prompt: [
      "A 'Delete account' button triggers `window.confirm('Are you sure?')`. Write a test that accepts the dialog and asserts the account is deleted.",
      "Also write a variant that dismisses the dialog and asserts nothing is deleted.",
    ],
    hints: [
      "Use `page.on('dialog', ...)` to register a handler before the click.",
      "Call `dialog.accept()` or `dialog.dismiss()` from the handler.",
      "Register the handler before the action that triggers the dialog.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";

test("accepting the confirm dialog deletes the account", async ({ page }) => {
  await page.goto("/settings");

  page.once("dialog", async (d) => {
    expect(d.message()).toBe("Are you sure?");
    await d.accept();
  });

  await page.getByRole("button", { name: "Delete account" }).click();

  await expect(page.getByText("Account deleted")).toBeVisible();
});

test("dismissing the confirm dialog keeps the account", async ({ page }) => {
  await page.goto("/settings");

  page.once("dialog", async (d) => await d.dismiss());

  await page.getByRole("button", { name: "Delete account" }).click();

  // Verify the page is unchanged — no deletion banner
  await expect(page.getByText("Account deleted")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Delete account" })).toBeVisible();
});`,
    },
    explanation: [
      "Native browser dialogs (alert, confirm, prompt) block the page until handled. Playwright auto-dismisses them after a timeout, which would make the click appear to do nothing. You must register a handler before triggering the dialog.",
      "Using `once` instead of `on` ensures the handler is removed after the first dialog — useful when you only expect one. The `expect(d.message())` inside the handler verifies the dialog text, which is otherwise invisible to the test.",
    ],
  },
  {
    id: "pw-4-download",
    title: "Verify a downloaded file's contents",
    difficulty: "intermediate",
    category: "playwright",
    tags: ["downloads", "fixtures"],
    prompt: [
      "Clicking 'Export CSV' triggers a file download. Write a test that captures the download, reads the file content, and asserts the CSV header row is correct.",
      "The download should be cleaned up after the test.",
    ],
    hints: [
      "Use `page.waitForEvent('download')` (or expectDownload via the download fixture).",
      "Call `download.path()` to get the file path on disk, then `fs.readFile` to read it.",
      "Set up the listener before the click, just like with dialogs.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";
import { readFile, rm } from "node:fs/promises";

test("export CSV downloads a file with the correct header", async ({ page }) => {
  await page.goto("/reports");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\\.csv$/);

  const filePath = await download.path();
  const contents = await readFile(filePath!, "utf-8");

  const firstLine = contents.split("\\n")[0];
  expect(firstLine).toBe("id,name,email,created_at");

  // Cleanup
  await rm(filePath!);
});`,
    },
    explanation: [
      "Just like dialogs and new tabs, the download event must be captured before the click that triggers it. `waitForEvent('download')` returns a promise that resolves when the download starts.",
      "`download.path()` returns the file's location on disk after Playwright finishes saving it. The suggested filename check is a quick sanity check on the server's `Content-Disposition` header.",
      "Cleanup is important in long-running test suites — Playwright saves downloads to a temp directory that grows unboundedly if you don't delete them.",
    ],
  },
  {
    id: "pw-5-mock-api",
    title: "Mock an API to test error states",
    difficulty: "intermediate",
    category: "playwright",
    tags: ["network", "mocking", "page.route"],
    prompt: [
      "A 'Load profile' button fetches `/api/profile`. Write three tests:",
      "1. The endpoint returns 200 with a profile — the UI shows the user's name.",
      "2. The endpoint returns 500 — the UI shows a retry button.",
      "3. The endpoint takes 30s — the UI shows a timeout message after 5s.",
    ],
    hints: [
      "Use `page.route(url, handler)` with `route.fulfill` for 200 and 500.",
      "For the slow case, use `route.fulfill` after a long delay, but shorten the UI timeout in the test setup.",
      "Intercept the same URL pattern in all three tests — only the response differs.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";

const PROFILE_URL = "**/api/profile";

test("shows the user's name on success", async ({ page }) => {
  await page.route(PROFILE_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name: "Ada Lovelace", email: "ada@example.com" }),
    })
  );

  await page.goto("/");
  await page.getByRole("button", { name: "Load profile" }).click();

  await expect(page.getByText("Ada Lovelace")).toBeVisible();
});

test("shows a retry button on 500", async ({ page }) => {
  await page.route(PROFILE_URL, (route) =>
    route.fulfill({ status: 500, body: "Internal Server Error" })
  );

  await page.goto("/");
  await page.getByRole("button", { name: "Load profile" }).click();

  await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
});

test("shows a timeout message after 5s", async ({ page }) => {
  // Mock a 30s delay — but simulate the UI's 5s client-side timeout
  await page.route(PROFILE_URL, async (route) => {
    await new Promise((r) => setTimeout(r, 30_000));
    await route.fulfill({ status: 200, body: "{}" });
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Load profile" }).click();

  // Assert the timeout message appears — use a 6s assertion timeout
  await expect(page.getByText("Request timed out")).toBeVisible({
    timeout: 6_000,
  });
});`,
    },
    explanation: [
      "Mocking the API gives you deterministic control over every code path — including ones that are nearly impossible to trigger against a real backend (timeouts, 500s, malformed responses).",
      "For the timeout test, you can either mock the slow response (as shown) or use `page.context().setOffline(true)` to simulate a network failure. The simulated delay keeps the test self-contained — no real 30s wait needed if the UI's own timeout fires first.",
      "The third test uses an explicit assertion timeout to give the UI's 5s timeout some headroom. Without it, the default 5s assertion timeout might race the UI's 5s timeout and produce false failures.",
    ],
  },
  {
    id: "pw-6-table-assert",
    title: "Assert the contents of a dynamic table",
    difficulty: "advanced",
    category: "playwright",
    tags: ["locators", "filter", "tables"],
    prompt: [
      "A paginated table at `/users` shows 10 users per page. Write a test that asserts the third row's email column contains 'alice@example.com' and that the row's 'Delete' button is visible.",
      "The table re-renders when navigating between pages, so a stale ElementHandle would break. Use only locators and web-first assertions.",
    ],
    hints: [
      "Target a row with `getByRole('row', { name: ... })` filtered by the email text.",
      "Or use `nth(2)` on the row locator to get the third row.",
      "Chain a `getByRole('button', { name: 'Delete' })` inside the row locator.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";

test("third row contains Alice's email with a Delete button", async ({ page }) => {
  await page.goto("/users");

  // Option A: locate the row by the email text inside it
  const aliceRow = page.getByRole("row").filter({ hasText: "alice@example.com" });
  await expect(aliceRow).toBeVisible();
  await expect(aliceRow.getByRole("button", { name: "Delete" })).toBeVisible();

  // Option B: locate by position (third row, after the header)
  const thirdRow = page.getByRole("row").nth(2);
  await expect(thirdRow).toContainText("alice@example.com");
  await expect(thirdRow.getByRole("button", { name: "Delete" })).toBeVisible();
});`,
    },
    explanation: [
      "Both options are valid. Option A (filter by text) is more resilient to row reordering — if the third row is suddenly a different user, the test still finds Alice. Option B (by position) is appropriate when order matters as part of the contract.",
      "Notice we never call `elementHandle()` or `textContent()`. Locators re-query the DOM on every assertion, so they survive re-renders. The `filter({ hasText })` modifier is one of Playwright's most useful tools for table assertions.",
    ],
  },
  {
    id: "pw-7-pom-login",
    title: "Refactor a procedural test into a Page Object",
    difficulty: "intermediate",
    category: "playwright",
    tags: ["page object model", "refactoring"],
    prompt: [
      "Given this procedural test, extract a `LoginPage` class with three methods: `goto()`, `login(email, password)`, and `expectError(text)`. The locators should be defined as class fields so they're typed and reusable.",
      "Original test:",
      "test('login fails with wrong password', async ({page}) => { await page.goto('/login'); await page.locator('#email').fill('a@b.com'); await page.locator('#password').fill('wrong'); await page.locator('button[type=submit]').click(); await expect(page.locator('.error')).toHaveText('Invalid'); });",
    ],
    hints: [
      "Define readonly Locator fields in the constructor.",
      "Prefer semantic locators (getByLabel, getByRole) over the original CSS selectors — this is a chance to improve the test as you refactor.",
      "Methods should express intentions, not mechanics.",
    ],
    solutionCode: {
      language: "typescript",
      code: `// pages/LoginPage.ts
import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Sign in" });
    this.errorAlert = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(text: string) {
    await expect(this.errorAlert).toContainText(text);
  }
}

// tests/login.spec.ts
import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("login fails with wrong password", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login("a@b.com", "wrong");
  await login.expectError("Invalid");
});`,
    },
    explanation: [
      "The refactored test reads like a sentence: 'go to login, log in with these credentials, expect this error'. The implementation details — which selectors, which click order — live in one place. Change the markup and you update a single file.",
      "The constructor takes the page fixture and creates all locators eagerly. This is fine — locators are lazy and re-query on every use, so creating them upfront has no cost and improves readability.",
      "Notice we upgraded the fragile CSS selectors (`#email`, `button[type=submit]`) to semantic ones (`getByLabel`, `getByRole`). This is a chance to improve the test's resilience as part of the refactor.",
    ],
  },
  {
    id: "pw-8-visual-regression",
    title: "Set up visual regression with a stable baseline",
    difficulty: "advanced",
    category: "playwright",
    tags: ["visual", "screenshots", "ci"],
    prompt: [
      "Design a visual regression test for the homepage that:",
      "1. Disables animations before capture.",
      "2. Masks the dynamic 'last updated' timestamp so it doesn't cause false failures.",
      "3. Tolerates up to 0.1% pixel difference (for sub-pixel rendering across OSes).",
      "4. Generates the baseline on first run and compares on subsequent runs.",
    ],
    hints: [
      "Pass options to `toHaveScreenshot`.",
      "Use `mask: [locator]` to ignore a region.",
      "Use `maxDiffPixelRatio` to set the threshold.",
      "First run with `--update-snapshots` to seed the baseline.",
    ],
    solutionCode: {
      language: "typescript",
      code: `import { test, expect } from "@playwright/test";

test("homepage matches baseline", async ({ page }) => {
  await page.goto("/");

  // Mask the dynamic timestamp element so it doesn't break the diff
  const timestamp = page.getByTestId("last-updated");

  await expect(page).toHaveScreenshot("home.png", {
    maxDiffPixelRatio: 0.001,   // tolerate 0.1% pixel diff
    animations: "disabled",     // wait for transitions to settle
    mask: [timestamp],          // ignore the timestamp region
    threshold: 0.2,             // per-pixel perceptual diff threshold
  });
});`,
    },
    explanation: [
      "Visual regression tests fail for two reasons: real visual regressions (intended) and false positives from dynamic content (unintended). The `mask` option is your primary weapon against false positives — explicitly ignore elements that change between runs.",
      "`animations: 'disabled'` is essential for any page with transitions — Playwright waits for CSS animations and transitions to finish before capturing. Without it, you get flicker between runs.",
      "The `maxDiffPixelRatio` of 0.001 (0.1%) absorbs sub-pixel rendering differences between macOS, Linux, and Windows. The `threshold` (per-pixel perceptual diff) absorbs anti-aliasing differences. Tune both to your CI's noise floor.",
      "First run: `npx playwright test --update-snapshots` writes the baseline. CI runs compare against the committed baseline. Update baselines deliberately in a PR — never as part of a feature commit.",
    ],
  },
];
