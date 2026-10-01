import type { Track } from "@/lib/types";

export const typescriptTrack: Track = {
  id: "typescript",
  name: "TypeScript",
  blurb:
    "From primitive types to advanced generics and interview-grade patterns. Every concept ships with runnable code you can copy.",
  icon: "typescript",
  lessons: [
    {
      id: "ts-basics",
      title: "TypeScript Foundations",
      description:
        "Why TypeScript exists, how the compiler thinks, and the primitive + object types you will use every day.",
      durationMinutes: 25,
      difficulty: "beginner",
      objectives: [
        "Explain what TypeScript adds on top of JavaScript",
        "Annotate variables, parameters, and return types",
        "Distinguish between structural and nominal typing",
        "Read common compiler errors with confidence",
      ],
      sections: [
        {
          heading: "What is TypeScript, really?",
          body: [
            "TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. The compiler (tsc) erases every type annotation before the code reaches a runtime, which means your types exist at design time only — they have zero runtime cost. This is why people say TypeScript is 'just' JavaScript with a layer of safety glasses on top.",
            "The value proposition is straightforward: catch mistakes earlier, get first-class autocomplete in any modern editor, and create self-documenting APIs. A function signature like `getUser(id: number): Promise<User>` already tells you what to send in and what comes back without reading a single line of implementation.",
            "TypeScript uses structural typing. Two types are considered compatible if their shapes match, regardless of whether they share a name. This is the opposite of languages like Java or C# that use nominal typing. Structural typing is why you can pass any object that happens to have a `name: string` field to a function that expects `{ name: string }`, even if the object was declared as something completely different.",
          ],
          callout: {
            type: "tip",
            title: "Mental model",
            text: "Think of TypeScript as a contract you write with your future self. The compiler is the notary that enforces it during development, and the contract vanishes the moment you build for production.",
          },
        },
        {
          heading: "Primitive types & annotations",
          body: [
            "The JavaScript primitives `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, and `bigint` all exist as TypeScript types verbatim. You can annotate variables explicitly or let the compiler infer the type from the initialiser. Inference is preferred for local variables; explicit annotations are preferred for function signatures and exported APIs where the inferred type might surprise callers.",
            "Be careful with `any`. It disables type checking entirely and is the single biggest source of bugs in TypeScript codebases. Prefer `unknown` when you genuinely don't know the shape of a value — it forces a narrowing check before you can use it.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Primitives, inference, and the difference between any and unknown",
              code: `let username: string = "ada";      // explicit annotation
let attempts = 3;                    // inferred as number
let isActive = true;                 // inferred as boolean

// any disables checking — avoid in production code
let anything: any = "hello";
anything.toFixed();                  // no error, runtime crash

// unknown forces narrowing before use
function parse(raw: unknown): string {
  if (typeof raw === "string") return raw.toUpperCase();
  if (typeof raw === "number") return raw.toString();
  throw new Error("Unsupported input");
}`,
            },
          ],
        },
        {
          heading: "Arrays, tuples, and enums",
          body: [
            "Arrays have two equivalent syntaxes: `number[]` and `Array<number>`. The first is more common in application code; the second reads better when the element type is complex (e.g. `Array<{ id: number; name: string }>`).",
            "Tuples are fixed-length arrays where each index has a known type. They are useful for things like React's `useState` return value `[T, (next: T) => void]` or CSV row representations. Note that tuples are still JavaScript arrays at runtime — TypeScript cannot actually prevent you from pushing extra elements, so prefer plain objects when readability matters.",
            "Enums give you a set of named constants. Numeric enums auto-increment from zero; string enums are required to be initialised. Prefer string enums for code that ships to production: they survive minification, are easy to grep for in logs, and serialise predictably over the wire.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Arrays, tuples, and string enums",
              code: `const scores: number[] = [98, 76, 100];
const matrix: Array<Array<number>> = [[1, 2], [3, 4]];

// Tuple: exactly two elements, fixed types
const httpStatus: [number, string] = [404, "Not Found"];

// String enum — recommended for production code
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

function log(level: LogLevel, message: string) {
  console.log(\`[\${level}] \${message}\`);
}`,
            },
          ],
        },
        {
          heading: "Functions",
          body: [
            "Type every parameter and every return type on exported functions. Locally-scoped helpers can rely on inference for their return type, but explicit return types make refactors safer: if you accidentally change what a function returns, callers will get a compile error instead of silently receiving the wrong shape.",
            "Optional parameters must come after required ones, and default parameters behave like optional parameters from a caller's perspective. Use rest parameters with tuple types when you need variadic functions.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Parameter types, defaults, optional params, and rest",
              code: `function greet(name: string, greeting = "Hello"): string {
  return \`\${greeting}, \${name}\`;
}

// Optional parameter — must come last
function formatPrice(amount: number, currency?: string): string {
  return currency
    ? \`\${amount.toFixed(2)} \${currency}\`
    : amount.toFixed(2);
}

// Rest parameters with a tuple type
function sum(...values: number[]): number {
  return values.reduce((acc, n) => acc + n, 0);
}

// Function type alias — useful for callbacks
type Comparator<T> = (a: T, b: T) => number;
const sortStrings: Comparator<string> = (a, b) => a.localeCompare(b);`,
            },
          ],
        },
        {
          heading: "Interfaces vs Type aliases",
          body: [
            "Both can describe the shape of an object, and in 90% of cases they are interchangeable. Use `interface` when you want declaration merging (multiple declarations with the same name automatically combine), and `type` when you need features interfaces lack: unions, intersections, tuples, conditional types, mapped types.",
            "A common convention is to use `interface` for object shapes that other developers might want to extend, and `type` for everything else (unions, utility aliases, complex generics). Both produce identical runtime output.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Interface declaration merging vs type union",
              code: `// Declaration merging — interfaces with the same name combine
interface Window {
  title: string;
}
interface Window {
  theme: "light" | "dark";
}
// Window now has both 'title' and 'theme'

// Type alias — supports unions, interfaces do not
type Status = "idle" | "loading" | "success" | "error";

// Extending: interface extends, type intersects
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

type Vehicle = { wheels: number };
type Car = Vehicle & { make: string };`,
            },
          ],
        },
        {
          heading: "Union & intersection types",
          body: [
            "A union type `A | B` means a value is one of A or B. An intersection type `A & B` means a value has the shape of both A and B at the same time. Unions are common for modelling state machines (loading | success | error); intersections are common for mixins and combining capabilities.",
            "When you narrow a union with a discriminator (a literal field shared by all variants), TypeScript knows which variant is in scope without any explicit cast. This is called a discriminated union and is the single most useful pattern in TypeScript for modelling application state.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Discriminated union with type narrowing",
              code: `type RequestState =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "success"; data: unknown }
  | { status: "error"; message: string };

function describe(state: RequestState): string {
  switch (state.status) {
    case "idle":     return "Waiting to start";
    case "loading":  return \`Started \${state.startedAt}ms ago\`;
    case "success":  return "Done";
    case "error":    return \`Failed: \${state.message}\`;
  }
}`,
            },
          ],
        },
      ],
    },
    {
      id: "ts-intermediate",
      title: "Generics, Utility Types & Type Guards",
      description:
        "Write reusable, type-safe code that scales. Master generics, mapped types, utility types, and runtime narrowing.",
      durationMinutes: 35,
      difficulty: "intermediate",
      objectives: [
        "Declare and consume generic functions and classes",
        "Use the built-in utility types confidently",
        "Write type guards that narrow unions correctly",
        "Apply mapped types to transform existing shapes",
      ],
      sections: [
        {
          heading: "Why generics?",
          body: [
            "Generics let you write one function or class that works with any type while preserving full type safety. Without generics, you'd be forced to choose between `any` (loses safety) or copying the function once per type (loses DRY).",
            "The mental model is a type-level function: when the caller provides a concrete type, the generic parameter is replaced everywhere it appears. The compiler then checks the body against that concrete type.",
          ],
          code: [
            {
              language: "typescript",
              caption: "From a hardcoded function to a generic one",
              code: `// Hardcoded — only works for numbers
function firstNumber(arr: number[]): number | undefined {
  return arr[0];
}

// any — loses type information
function firstAny(arr: any[]): any {
  return arr[0];
}

// Generic — preserves the element type
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]);        // number | undefined
const s = first(["a", "b"]);       // string | undefined`,
            },
          ],
        },
        {
          heading: "Generic constraints",
          body: [
            "Sometimes you need to require that the generic parameter satisfies a shape. Use the `extends` keyword to constrain a generic. This unlocks access to the constrained fields inside the function body.",
            "You can also default a generic parameter so callers can omit it. Defaults are useful when the type can almost always be inferred but you want a sensible fallback for edge cases.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Constraining T to types that have a length property",
              code: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("alice", "bob");                  // "alice"
longest([1, 2, 3], [4, 5]);               // [1, 2, 3]
// longest(5, 10);                          // Error: number has no .length

// Default type parameter
interface Box<T = string> { value: T; }
const stringBox: Box = { value: "hi" };    // T defaults to string
const numberBox: Box<number> = { value: 7 };`,
            },
          ],
        },
        {
          heading: "Built-in utility types",
          body: [
            "TypeScript ships a small but powerful set of utility types. Learn these first — they cover the majority of everyday type transformations.",
            "The five most-used utilities are: `Partial<T>` makes every property optional, `Required<T>` makes every property required, `Pick<T, Keys>` keeps only the listed keys, `Omit<T, Keys>` drops the listed keys, and `Record<K, V>` builds a dictionary type. Combine them with intersection (&) to express almost any shape change.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Partial, Required, Pick, Omit, Record in one example",
              code: `interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
}

type UserPatch = Partial<User>;             // all keys optional
type StrictUser = Required<User>;            // nothing optional
type PublicUser = Pick<User, "id" | "name">; // only id + name
type CreateUser = Omit<User, "id">;          // no id, everything else

// Record<K, V> — a dictionary
const roleCounts: Record<User["role"], number> = {
  admin: 0,
  member: 0,
};`,
            },
          ],
        },
        {
          heading: "Type guards & narrowing",
          body: [
            "TypeScript narrows a type based on runtime checks. The built-in narrowing mechanisms are: `typeof` for primitives, `instanceof` for class instances, the `in` operator for object property presence, and discriminated unions (covered earlier).",
            "When none of those work — typically for complex shapes or API responses — write a user-defined type guard. A type guard is any function whose return type is `x is Type`. Once it returns true, TypeScript treats the argument as that type for the rest of the branch.",
          ],
          code: [
            {
              language: "typescript",
              caption: "typeof, in, and user-defined type guards",
              code: `function format(value: string | number | string[]) {
  if (typeof value === "string") return value.toUpperCase();
  if (typeof value === "number") return value.toFixed(2);
  return value.join(", ");
}

// 'in' narrows by property presence
type Cat = { meow: () => void };
type Dog = { bark: () => void };
function speak(animal: Cat | Dog) {
  if ("meow" in animal) animal.meow();
  else animal.bark();
}

// User-defined type guard — checks shape at runtime
interface ErrorResponse { error: string; code: number; }
function isErrorResponse(x: unknown): x is ErrorResponse {
  return (
    typeof x === "object" && x !== null &&
    "error" in x && typeof (x as ErrorResponse).error === "string"
  );
}`,
            },
          ],
        },
        {
          heading: "Mapped & conditional types",
          body: [
            "A mapped type iterates over the keys of an existing type and produces a new shape. The built-in `Partial`, `Readonly`, and `Pick` are themselves mapped types. Once you understand the syntax, you can write your own — for example, a `Nullable<T>` that wraps every property in `T | null`.",
            "A conditional type is a type-level if/else: `T extends U ? X : Y`. Combined with the `infer` keyword, it can extract types from complex structures — for example, pulling the resolved value type out of a Promise.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Custom mapped type and a conditional infer",
              code: `// Make every property of T nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface Product { id: number; name: string; inStock: boolean; }
type NullableProduct = Nullable<Product>;
// { id: number | null; name: string | null; inStock: boolean | null }

// Pull the resolved value out of a Promise
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type R = Unwrap<Promise<number>>;  // number
type F = Unwrap<string>;            // string`,
            },
          ],
        },
      ],
    },
    {
      id: "ts-advanced",
      title: "Advanced TypeScript: Template Literals, Infer & Modules",
      description:
        "Push the type system to its limits: template literal types, the infer keyword, declaration files, and module augmentation.",
      durationMinutes: 40,
      difficulty: "advanced",
      objectives: [
        "Build types from string literals with template literal types",
        "Use the infer keyword in conditional types",
        "Author .d.ts files to type untyped libraries",
        "Augment existing module declarations safely",
      ],
      sections: [
        {
          heading: "Template literal types",
          body: [
            "Template literal types let you build new string types by interpolating union types into a template literal. They are incredibly powerful for things like accessor names, event handler names, and route paths.",
            "Combined with mapped types, you can generate a getter for every property of an object — or a setter, or a change handler. This pattern is what powers strongly-typed event emitters and reactive stores.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Generate on<PropertyName> handler signatures from a type",
              code: `type OnEvent<T> = {
  [K in keyof T & string as \`on\${Capitalize<K>}Change\`]: (value: T[K]) => void;
};

interface Settings {
  theme: string;
  volume: number;
  muted: boolean;
}

type SettingsListeners = OnEvent<Settings>;
/*
{
  onThemeChange: (value: string) => void;
  onVolumeChange: (value: number) => void;
  onMutedChange:  (value: boolean) => void;
}
*/`,
            },
          ],
        },
        {
          heading: "The infer keyword",
          body: [
            "`infer` appears only inside the extends clause of a conditional type. It tells TypeScript to declare a new type variable that captures whatever shape the conditional matched. It is the cornerstone of every utility type that 'pulls something out' of another type.",
            "Common use cases: extracting the return type of a function, the resolved type of a Promise, the element type of an array, or the parameters of a function. Many of these are built in (`ReturnType`, `Parameters`, `Awaited`), but knowing how to write your own is essential for advanced work.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Three custom infer-based utilities",
              code: `// Element type of an array — built-in is 'Awaited<Array<...>>'
type ElementOf<T> = T extends (infer E)[] ? E : never;
type R1 = ElementOf<number[]>;        // number

// First parameter type of a function
type FirstParam<T> = T extends (first: infer P, ...rest: any[]) => any ? P : never;
type R2 = FirstParam<(name: string, age: number) => void>; // string

// The constructor's instance type
type Instance<C> = C extends new (...args: any[]) => infer I ? I : never;
type R3 = Instance<typeof Map>;       // Map<any, any>`,
            },
          ],
        },
        {
          heading: "Declaration files (.d.ts)",
          body: [
            "A declaration file describes the types of a JavaScript module without containing any implementation. You'll encounter them in three situations: when you publish a library written in JavaScript, when you consume a third-party library that ships no types, and when you patch the types of a dependency that ships slightly wrong ones.",
            "When you write a `.d.ts` file, use `declare` to assert that a value exists at runtime. Combine that with normal interface and type declarations to describe the shape.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Hand-written ambient declaration for a legacy JS module",
              code: `// legacy-logger.d.ts — describes the runtime API without JS code
declare module "legacy-logger" {
  export interface LogOptions {
    level?: "info" | "warn" | "error";
    timestamp?: boolean;
  }
  export function log(message: string, options?: LogOptions): void;
  export const version: string;
}

// Usage in app code — now fully typed
import { log, version } from "legacy-logger";
log("boot complete", { level: "info" });`,
            },
          ],
        },
        {
          heading: "Module augmentation",
          body: [
            "Module augmentation lets you extend an existing module's types without forking it. The classic example is adding a custom property to the Express `Request` object so your handlers can access authenticated user data with full type safety.",
            "The pattern is: import the module normally, declare a module of the same name with the same interface name, and add your fields. TypeScript merges the declarations at compile time. The runtime code is unchanged.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Augmenting Express Request with an authenticated user",
              code: `import { Request } from "express";

// Augment — must use the exact same module + interface name
declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      roles: string[];
    };
  }
}

// Now every handler sees req.user as fully typed
function handler(req: Request) {
  if (req.user) {
    return req.user.email; // string | undefined -> string after the if
  }
  throw new Error("Not authenticated");
}`,
            },
          ],
        },
        {
          heading: "Strict mode & tsconfig essentials",
          body: [
            "Strict mode turns on a set of compiler flags that catch real bugs: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, and `alwaysStrict`. Enable it on every new project — the small friction is worth the safety.",
            "Beyond strict mode, the two flags that pay back the most are `noUncheckedIndexedAccess` (forces array and record lookups to be `T | undefined`) and `exactOptionalPropertyTypes` (distinguishes 'property absent' from 'property present and undefined').",
          ],
          code: [
            {
              language: "json",
              caption: "Recommended tsconfig.json snippet for a new project",
              code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}`,
            },
          ],
        },
      ],
    },
    {
      id: "ts-interview",
      title: "TypeScript Interview Questions",
      description:
        "The questions that come up most often in real interviews, with model answers and code samples you can use as talking points.",
      durationMinutes: 30,
      difficulty: "interview",
      objectives: [
        "Answer the most common TypeScript interview questions confidently",
        "Avoid the classic 'looks right but isn't' type traps",
        "Explain structural typing and why it surprises Java/C# developers",
        "Demonstrate idiomatic use of generics, unions, and narrowing",
      ],
      sections: [
        {
          heading: "Q1 — What's the difference between interface and type?",
          body: [
            "Short answer: they are interchangeable for object shapes, but only `type` can express unions, intersections, tuples, primitives, and mapped types; only `interface` supports declaration merging and is the conventional choice for publicly extensible object APIs.",
            "In an interview, the strongest answer adds the nuance that declaration merging — multiple `interface` declarations with the same name automatically combine — is what makes interfaces the right pick for library APIs that consumers might want to extend. `type` cannot be merged after declaration. The other key point is that interfaces report errors more cleanly when two declarations conflict, while conflicting type aliases produce confusing intersection types.",
          ],
        },
        {
          heading: "Q2 — What is structural typing and why does it matter?",
          body: [
            "TypeScript compares types by their shape, not by their name. If type A has all the properties that type B requires (with compatible types), an A value is assignable to B even if A was never declared to extend B.",
            "The classic gotcha: passing `{ name: 'Alice', age: 30 }` to a function expecting `{ name: string }` works fine — but assigning an object literal with extra properties directly to that parameter is an error. The first is allowed because the variable already exists and was typed as something broader; the second is checked strictly because the literal is the source of truth.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Excess property checks only fire on fresh object literals",
              code: `interface Name { name: string; }

const person = { name: "Alice", age: 30 };  // typed as { name: string; age: number }
acceptName(person);  // OK — structural match

acceptName({ name: "Bob", age: 30 });  // ERROR — excess property on fresh literal

function acceptName(n: Name) { console.log(n.name); }`,
            },
          ],
        },
        {
          heading: "Q3 — Explain the difference between any, unknown, and never",
          body: [
            "`any` opts out of type checking entirely. You can do anything with an `any` value, including calling methods that don't exist. It is a deliberate escape hatch — useful for migration but dangerous in production code.",
            "`unknown` is the type-safe alternative. A value typed as `unknown` can hold anything, but TypeScript forces you to narrow it (with typeof, instanceof, or a type guard) before you can do anything meaningful with it. Use `unknown` for the boundary between trusted and untrusted data — JSON.parse results, API responses, etc.",
            "`never` is the type of values that never occur. A function that always throws or has an infinite loop returns `never`. It is also the bottom type: it is assignable to every other type, but no type is assignable to `never`. The most common real use is exhaustiveness checking in switch statements — if you assign the switch's subject to a `never`-typed variable in the default case, TypeScript will error if any union variant is unhandled.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Exhaustiveness check using never",
              code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "square":   return shape.size ** 2;
    case "triangle": return 0.5 * shape.base * shape.height;
    default: {
      // If a new variant is added without handling it,
      // this assignment will fail at compile time.
      const _exhaustive: never = shape;
      throw new Error(\`Unhandled shape: \${_exhaustive}\`);
    }
  }
}`,
            },
          ],
        },
        {
          heading: "Q4 — What is declaration merging?",
          body: [
            "Declaration merging is the mechanism by which two or more `interface` declarations with the same name are automatically combined into a single interface by the compiler. Functions can also merge with interfaces (the function's call signatures join the interface), and namespaces can merge with classes, functions, and enums.",
            "In an interview, the strongest answer explains why this matters: library authors can ship an extensible surface, and consumers can extend it without forking. The Express `Request` augmentation pattern covered earlier is the textbook example. Mention also that the order matters — later declarations appear earlier in the resulting type, which affects overload resolution.",
          ],
        },
        {
          heading: "Q5 — How does TypeScript handle enums at runtime?",
          body: [
            "Numeric enums are compiled to a reverse-mapping JavaScript object: you can go from name to value and from value to name. String enums compile to a forward-only mapping — name to value — because string-to-name would require a runtime lookup table.",
            "The interview follow-up usually asks about `const enum`: a const enum is fully erased at compile time — every usage is replaced by its literal value, with no runtime object emitted at all. The trade-off: const enums break across package boundaries if the consuming package uses isolatedModules, so the TypeScript team now recommends avoiding them in libraries. Use plain string enums or union types of string literals for new code.",
          ],
          code: [
            {
              language: "typescript",
              caption: "What a numeric enum compiles down to",
              code: `// Input
enum Direction { Up, Down, Left, Right }

// Compiled JavaScript
var Direction;
(function (Direction) {
  Direction[Direction["Up"] = 0] = "Up";
  Direction[Direction["Down"] = 1] = "Down";
  Direction[Direction["Left"] = 2] = "Left";
  Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));

// So both directions work:
Direction.Up;     // 0
Direction[0];     // "Up"`,
            },
          ],
        },
        {
          heading: "Q6 — What are keyof, typeof, and indexed access types?",
          body: [
            "These three operators form the backbone of type-level metaprogramming. `typeof X` extracts the type of a runtime value. `keyof T` produces a union of the keys of T. Indexed access `T[K]` looks up the type of property K on T.",
            "Together they let you derive types from runtime values so they always stay in sync. The canonical interview example is a typed `getProperty` function — it accepts any object and any of that object's keys, and returns the value with the correct type.",
          ],
          code: [
            {
              language: "typescript",
              caption: "typeof + keyof + indexed access in concert",
              code: `const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

type Config = typeof config;
type ConfigKey = keyof Config;        // "apiUrl" | "timeout" | "retries"

function getProperty<K extends keyof Config>(key: K): Config[K] {
  return config[key];
}

const url: string = getProperty("apiUrl");    // string
const retries: number = getProperty("retries"); // number
// getProperty("missing");                    // compile error`,
            },
          ],
        },
        {
          heading: "Q7 — What is the difference between a type and an interface for declaration merging?",
          body: [
            "Revisiting Q1 with a sharper focus: only `interface` supports declaration merging. If you need a type to grow as the file grows (a common pattern for Vue plugins, Express middlewares, JWT payloads), use `interface`. If you need a closed type — one that cannot be merged accidentally by another file — use `type`. The choice is about intent as much as capability.",
            "In an interview, the strongest candidates also point out that `interface` declarations in different files merge globally if they're declared in the global scope, which can cause surprising cross-file interactions. Modern TypeScript encourages module-scoped declarations to avoid this.",
          ],
        },
      ],
    },
  ],
};
