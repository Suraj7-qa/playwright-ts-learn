import type { Track } from "@/lib/types";

export const playwrightTrack: Track = {
  id: "playwright",
  name: "Playwright",
  blurb:
    "Cross-browser end-to-end testing with TypeScript. From your first `page.goto` to visual comparisons, network mocking, and interview-grade scenarios.",
  icon: "playwright",
  lessons: [
    {
      id: "pw-basics",
      title: "Playwright Foundations",
      description:
        "Install Playwright, write your first test, understand browser contexts, and learn the auto-waiting model that makes Playwright feel different.",
      durationMinutes: 30,
      difficulty: "beginner",
      objectives: [
        "Install Playwright and the browser binaries",
        "Write and run a first end-to-end test",
        "Explain the difference between browser, context, and page",
        "Use auto-waiting locators instead of fixed sleeps",
      ],
      sections: [
        {
          heading: "What is Playwright?",
          body: [
            "Playwright is a cross-browser automation library maintained by Microsoft. It drives Chromium, Firefox, and WebKit with a single API, ships first-class TypeScript bindings, and includes a built-in test runner with fixtures, parallelism, retries, and rich HTML reports.",
            "It competes with Cypress and Selenium. Compared to Cypress, Playwright supports multiple browser engines (Cypress is Chromium-only for the most part), true cross-tab testing, and runs tests in parallel by default. Compared to Selenium, Playwright's API is dramatically more ergonomic and its auto-waiting model removes most of the flakiness that plagues classic Selenium suites.",
          ],
          callout: {
            type: "info",
            title: "Why TypeScript matters here",
            text: "Playwright ships its own first-party TypeScript bindings. Type your selectors, your fixtures, and your page objects — every typo in a locator name becomes a compile error instead of a runtime failure.",
          },
        },
        {
          heading: "Installation",
          body: [
            "Playwright is shipped as a normal npm package plus a CLI that downloads the browser binaries the first time you run it. The recommended init command scaffolds a project with `package.json`, `playwright.config.ts`, and an `example.spec.ts` you can run immediately.",
            "After install, every CI machine and every developer laptop needs the system dependencies (shared libraries like libnss3, libatk, etc.) — the `--with-deps` flag installs them automatically on Debian/Ubuntu.",
          ],
          code: [
            {
              language: "bash",
              caption: "Scaffold a new Playwright TypeScript project",
              code: `# 1. Initialise a new project (interactive prompt)
npm init playwright@latest my-e2e-tests

# 2. Or add Playwright to an existing project
npm i -D @playwright/test

# 3. Install browser binaries + system dependencies (Linux)
npx playwright install --with-deps`,
            },
          ],
        },
        {
          heading: "Your first test",
          body: [
            "A Playwright test file is a Node module that exports tests via `test()` from `@playwright/test`. The `page` argument is a fixture — Playwright creates a fresh browser context and page per test, runs the test, then tears them down. This isolation is what keeps tests deterministic.",
            "Inside a test, you write steps in imperative order: navigate, interact, assert. Playwright automatically waits for elements to be visible, stable, and actionable before interacting with them — you almost never need an explicit `sleep`.",
          ],
          code: [
            {
              language: "typescript",
              caption: "A complete first test: navigate, click, assert",
              code: `import { test, expect } from "@playwright/test";

test("homepage shows the welcome banner", async ({ page }) => {
  // Navigate and wait for 'networkidle' — useful for SPAs
  await page.goto("https://example.com");

  // Click a button whose text matches
  await page.getByRole("button", { name: "Get started" }).click();

  // Assert the heading is visible and has the right text
  await expect(
    page.getByRole("heading", { name: "Welcome to Example" })
  ).toBeVisible();
});`,
            },
          ],
        },
        {
          heading: "Browser, context, and page",
          body: [
            "These three objects form a hierarchy. A `Browser` is a running browser process — Chrome, Firefox, or WebKit. A `BrowserContext` is an isolated session within that browser, with its own cookies, localStorage, and cache. A `Page` is a single tab inside a context.",
            "Most tests use one context and one page, but contexts are cheap — you can spin up several to simulate multiple users in parallel. The fixture system gives every test its own context by default, which is why tests don't leak state between each other.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Using multiple contexts to simulate two users",
              code: `import { test, expect } from "@playwright/test";

test("two users can chat in real time", async ({ browser }) => {
  const alice = await browser.newContext();
  const bob = await browser.newContext();

  const alicePage = await alice.newPage();
  const bobPage = await bob.newPage();

  await alicePage.goto("/chat");
  await bobPage.goto("/chat");

  await alicePage.getByRole("textbox").fill("Hello from Alice");
  await alicePage.getByRole("button", { name: "Send" }).click();

  await expect(bobPage.getByText("Hello from Alice")).toBeVisible();
});`,
            },
          ],
        },
        {
          heading: "Auto-waiting & locators",
          body: [
            "Auto-waiting is the single biggest reason Playwright feels less flaky than Selenium. Every action — `click`, `fill`, `check`, `selectOption`, etc. — automatically waits until the element is attached to the DOM, visible, stable (not animating), enabled, and ready to receive events. Only then does Playwright perform the action.",
            "The price of admission is using locators (the `page.getBy*` methods) instead of raw selectors. Locators are lazy — they re-query the DOM on every action — so they survive dynamic re-renders that would break a cached `ElementHandle`. Never store an `ElementHandle` for later use unless you have a specific reason.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Preferred locator styles — prefer role over CSS",
              code: `// GOOD — semantic, accessible, and resilient
page.getByRole("button", { name: "Submit" });
page.getByLabel("Email address");
page.getByPlaceholder("you@example.com");
page.getByText("Welcome back");

// AVOID — fragile to markup changes
page.locator(".btn.btn-primary.submit-form");
page.locator("#root > div > main > button");

// WORST — caching an ElementHandle defeats auto-waiting
const button = await page.$("#submit");  // don't do this
await button.click();                     // races the render`,
            },
          ],
        },
      ],
    },
    {
      id: "pw-intermediate",
      title: "Selectors, Assertions & Hooks",
      description:
        "Master the testing primitives: all locator strategies, web-first assertions, lifecycle hooks, screenshots, and the configuration file.",
      durationMinutes: 35,
      difficulty: "intermediate",
      objectives: [
        "Choose the right locator strategy for any element",
        "Use web-first assertions to avoid flaky waits",
        "Share setup with beforeAll, beforeEach, afterEach, afterAll",
        "Configure projects, retries, and reporters in playwright.config.ts",
      ],
      sections: [
        {
          heading: "Locator strategies",
          body: [
            "Playwright offers six primary locator strategies, listed roughly in order of preference: `getByRole` (semantically meaningful, survives CSS refactors), `getByLabel` (form inputs), `getByPlaceholder` (when there's no label), `getByText` (headings, paragraphs), `getByAltText` (images), `getByTitle` (elements with a title attribute).",
            "Reserve `page.locator(cssOrXPath)` for the rare case when none of the semantic strategies work. If you find yourself writing `data-testid` attributes everywhere, ask whether the role-based locator would work — it usually does, and your tests will be more accessible-by-construction.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Every locator strategy in one test",
              code: `test("locator strategies", async ({ page }) => {
  await page.goto("/form");

  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByPlaceholder("you@example.com").fill("ada@example.com");
  await page.getByRole("combobox", { name: "Country" }).selectOption("UK");
  await page.getByRole("checkbox", { name: "Subscribe to newsletter" }).check();
  await page.getByRole("button", { name: "Submit" }).click();

  // Filtering — combine locators to narrow down
  await page
    .getByRole("listitem")
    .filter({ hasText: "Receipt" })
    .getByRole("button", { name: "Download" })
    .click();

  // Chaining — find a child within a parent locator
  const card = page.getByRole("article", { name: "Order #1234" });
  await card.getByRole("button", { name: "Cancel" }).click();
});`,
            },
          ],
        },
        {
          heading: "Web-first assertions",
          body: [
            "The `expect` function from `@playwright/test` is async and web-first: it retries the assertion until it either passes or the timeout expires (default 5 seconds). This is the antidote to flaky tests — never write `await page.waitForTimeout(500)` to wait for something to happen; assert that it happened and let Playwright retry.",
            "Every assertion returns a Promise — don't forget to `await` it. The most common ones are `toBeVisible`, `toBeHidden`, `toHaveText`, `toContainText`, `toHaveCount`, `toHaveValue`, `toBeChecked`, `toBeEnabled`, `toBeDisabled`, and `toHaveURL`.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Web-first assertions vs sleep-based waits",
              code: `import { test, expect } from "@playwright/test";

test("BAD — sleep-based, flaky", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForTimeout(2000);              // ❌ flaky
  const text = await page.locator(".total").textContent();
  if (text !== "$1,234") throw new Error("wrong total");
});

test("GOOD — web-first assertion retries until pass or timeout", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator(".total")).toHaveText("$1,234");
  // No sleep — Playwright retries every 100ms up to 5s by default.
});`,
            },
          ],
        },
        {
          heading: "Lifecycle hooks",
          body: [
            "Hooks let you share setup and teardown across tests. `test.beforeAll` runs once per worker before any test in the file; `test.beforeEach` runs before every individual test. The after counterparts are symmetric. Use `beforeAll` for expensive setup (seeding a database), `beforeEach` for cheap per-test isolation (resetting state, navigating to a fresh URL).",
            "Hooks can use fixtures via their second argument. Inside a hook, you typically don't have a `page` because pages are per-test — but you can take a `browser` or `request` fixture for shared setup.",
          ],
          code: [
            {
              language: "typescript",
              caption: "beforeAll + beforeEach + afterEach pattern",
              code: `import { test, expect, request } from "@playwright/test";

let sharedToken: string;

test.beforeAll(async () => {
  // Runs once per worker — seed a test account via API
  const ctx = await request.newContext();
  const res = await ctx.post("/api/test/seed", { data: { email: "qa@example.com" } });
  const body = await res.json();
  sharedToken = body.token;
});

test.beforeEach(async ({ page }) => {
  // Runs before every test — authenticate via injected cookie
  await page.context().addCookies([{
    name: "session", value: sharedToken, domain: "localhost", path: "/"
  }]);
  await page.goto("/dashboard");
});

test.afterEach(async ({ page }, testInfo) => {
  // Capture a screenshot on failure for debugging
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: \`screenshots/\${testInfo.title}.png\` });
  }
});`,
            },
          ],
        },
        {
          heading: "Screenshots, video & traces",
          body: [
            "Playwright can capture screenshots, record video, and record a full trace (DOM snapshots, network, console logs, screenshots) for post-mortem debugging. The trace is by far the most valuable — you can step through a failed test in the Playwright UI as if it were a debugger.",
            "Trace recording is off by default for performance. Turn it on for failures only (`on-first-retry`) so your CI artifacts stay small, and use `trace: 'on'` locally when you need to debug a specific test.",
          ],
          code: [
            {
              language: "typescript",
              caption: "playwright.config.ts section — capture media on retry",
              code: `import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",  // capture a trace only when the test is retried
  },
  retries: 2,                  // retry failing tests twice on CI
  reporter: [["html"], ["list"]],
});`,
            },
            {
              language: "bash",
              caption: "View a captured trace locally",
              code: `npx playwright show-report          # open the HTML report
npx playwright show-trace trace.zip  # open a single trace`,
            },
          ],
        },
        {
          heading: "Configuration deep-dive",
          body: [
            "`playwright.config.ts` controls everything: which tests run, how they're parallelised, which browsers, how many retries, what gets reported, what gets captured. The two most important concepts are projects and workers.",
            "A project is a named configuration: a browser, a viewport, a base URL, a set of fixtures. The test runner runs every project in parallel. A worker is a single Node process — tests in different workers run in parallel; tests in the same worker run serially. Use `test.describe.configure({ mode: 'serial' })` to force a group of tests onto the same worker when they share state.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Multi-browser, multi-viewport config with shared settings",
              code: `import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["github"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox",  use: { ...devices["Desktop Firefox"] } },
    { name: "webkit",   use: { ...devices["Desktop Safari"] } },
    { name: "mobile",   use: { ...devices["iPhone 13"] } },
  ],
});`,
            },
          ],
        },
      ],
    },
    {
      id: "pw-advanced",
      title: "Page Objects, Network & Auth",
      description:
        "Production patterns: Page Object Model, network interception and mocking, authentication state reuse, visual comparisons, and sharding.",
      durationMinutes: 45,
      difficulty: "advanced",
      objectives: [
        "Implement the Page Object Model with TypeScript classes",
        "Intercept and mock network requests for deterministic tests",
        "Reuse authentication state across tests with storageState",
        "Run large suites in parallel with sharding",
      ],
      sections: [
        {
          heading: "Page Object Model with TypeScript",
          body: [
            "The Page Object Model (POM) encapsulates the structure of a page behind a class. Tests interact with the class instead of raw locators, so when the page changes, you update one file instead of a hundred tests. With TypeScript, the class becomes the contract — every method has a typed signature and the IDE autocompletes every action.",
            "A good page object exposes intentions, not mechanics: `login(email, password)` instead of `fillEmail(email); fillPassword(password); clickSubmit()`. Tests should read like a script of user intentions, not a sequence of clicks.",
          ],
          code: [
            {
              language: "typescript",
              caption: "A typed LoginPage with reusable actions",
              code: `import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: "Sign in" });
    this.errorMessage = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorMessage(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }
}`,
            },
            {
              language: "typescript",
              caption: "Consuming the page object inside a test",
              code: `import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test("invalid credentials show an error", async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login("wrong@example.com", "nope");
  await login.expectErrorMessage("Invalid email or password");
});`,
            },
          ],
        },
        {
          heading: "Network interception & mocking",
          body: [
            "Playwright can intercept any network request with `page.route(urlPattern, handler)`. The handler receives the route and can either fulfill it with a mock response, continue it (optionally modifying headers or body), or abort it. This is the foundation of deterministic tests — you control the API instead of waiting for the real one.",
            "A common pattern is to mock all API calls by default in tests and selectively let some through. The `page.unrouteAll()` method cleans up routes between tests; the fixture system does this automatically when the page is torn down.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Mock a GET endpoint with a custom response",
              code: `test("dashboard shows mocked orders", async ({ page }) => {
  // Intercept GET /api/orders and return a stub
  await page.route("**/api/orders", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: 1, total: "$99.00" },
        { id: 2, total: "$45.50" },
      ]),
    });
  });

  await page.goto("/dashboard");

  await expect(page.getByText("$99.00")).toBeVisible();
  await expect(page.getByText("$45.50")).toBeVisible();
});

test("abort third-party trackers", async ({ page }) => {
  await page.route("**/analytics**", (route) => route.abort());
  await page.goto("/");
});`,
            },
          ],
        },
        {
          heading: "Authentication state reuse",
          body: [
            "Logging in before every test is slow and creates a single point of failure. Playwright solves this with `storageState`: you log in once, save the cookies and localStorage to a JSON file, and every subsequent test starts with that state. The setup runs once per project; the tests reuse the saved state with zero cost.",
            "The pattern is two parts: a global setup project that runs the login flow and saves the state to disk, and the main test projects that consume `storageState` in their `use` config. Combine this with conditional running — `test.skip(!fs.existsSync('auth.json'))` — to fail fast if the state file is missing.",
          ],
          code: [
            {
              language: "typescript",
              caption: "playwright.config.ts with authenticated projects",
              code: `import { defineConfig } from "@playwright/test";

export default defineConfig({
  projects: [
    // 1. Setup project — runs the login flow, saves to auth.json
    {
      name: "setup",
      testMatch: /.*\\.setup\\.ts/,
    },
    // 2. Main project — consumes the saved state
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
});`,
            },
            {
              language: "typescript",
              caption: "tests/auth.setup.ts — perform login once and persist",
              code: `import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_USER!);
  await page.getByLabel("Password").fill(process.env.E2E_PASS!);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Welcome back")).toBeVisible();

  await page.context().storageState({ path: "playwright/.auth/user.json" });
});`,
            },
          ],
        },
        {
          heading: "Visual regression testing",
          body: [
            "Visual regression compares a screenshot of the current page against a baseline stored on disk. Playwright's `toHaveScreenshot()` assertion handles the comparison, the diffing, and the baseline update workflow. Set a small `maxDiffPixelRatio` to tolerate sub-pixel rendering differences across browsers and operating systems.",
            "Visual tests are powerful but expensive — every cosmetic change requires regenerating the baseline. Use them sparingly: for critical full-page layouts, branded components, or pages where layout regressions have shipped before. Don't snapshot every component; that's what unit tests are for.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Visual comparison with mask and threshold",
              code: `test("checkout page matches baseline", async ({ page }) => {
  await page.goto("/checkout");

  await expect(page).toHaveScreenshot("checkout.png", {
    maxDiffPixelRatio: 0.01,        // tolerate up to 1% pixel diff
    animations: "disabled",         // wait for CSS animations to settle
    mask: [page.getByTestId("ad-banner")], // ignore dynamic content
  });
});`,
            },
          ],
        },
        {
          heading: "Parallelism & sharding",
          body: [
            "Playwright runs tests in parallel by default — each worker process gets a slice of the test files. For very large suites, you can split execution across multiple CI machines with `--shard=x/y`, where `x` is the current shard index and `y` is the total number of shards. Each shard runs an independent subset of tests.",
            "Merge the JUnit or JSON reports from all shards with `playwright merge-reports` after the CI matrix completes. This gives you a single HTML report covering every shard — invaluable for triage.",
          ],
          code: [
            {
              language: "yaml",
              caption: "GitHub Actions matrix running 4 shards in parallel",
              code: `jobs:
  e2e:
    strategy:
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
      - uses: actions/upload-artifact@v4
        with:
          name: blob-report-\${{ matrix.shardIndex }}
          path: blob-report

  merge-reports:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - run: npx playwright merge-reports --reporter html ./all-blob-reports`,
            },
          ],
        },
        {
          heading: "API testing with Playwright",
          body: [
            "Playwright's `request` fixture is a full-featured HTTP client with the same assertion ergonomics as browser tests. You can mix API and UI in the same test — seed data via the API, then verify the UI renders it. This is dramatically faster than seeding via the UI every time.",
            "Use a separate `request.newContext()` for API work that shouldn't share cookies with the browser context, or use the `request` fixture directly when you want them to share.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Seed via API, verify via UI in the same test",
              code: `import { test, expect, APIRequestContext } from "@playwright/test";

test("newly created product appears in admin list", async ({ page, request }) => {
  // Seed via API — fast, no UI navigation
  const res = await request.post("/api/products", {
    data: { name: "Test Widget", price: 19.99 },
  });
  expect(res.ok()).toBeTruthy();
  const { id } = await res.json();

  // Verify via UI
  await page.goto("/admin/products");
  await expect(page.getByText("Test Widget")).toBeVisible();

  // Cleanup
  await request.delete(\`/api/products/\${id}\`);
});`,
            },
          ],
        },
      ],
    },
    {
      id: "pw-interview",
      title: "Playwright Interview Questions",
      description:
        "Real interview questions with model answers and the kind of follow-ups that separate juniors from seniors.",
      durationMinutes: 30,
      difficulty: "interview",
      objectives: [
        "Answer common Playwright interview questions with depth",
        "Explain auto-waiting and why it eliminates most flakiness",
        "Discuss trade-offs between Cypress, Selenium, and Playwright",
        "Design a CI strategy for a large E2E suite",
      ],
      sections: [
        {
          heading: "Q1 — Why does Playwright feel less flaky than Selenium?",
          body: [
            "Two reasons: auto-waiting and the locator model. Selenium's `findElement` returns immediately, so you have to manually wrap every interaction in a `WebDriverWait` — miss one and you get a flaky test. Playwright's actions (`click`, `fill`, etc.) wait internally until the element is attached, visible, stable, enabled, and ready to receive events.",
            "The second reason is locators vs cached handles. Selenium's `WebElement` is a snapshot — if the DOM re-renders, the handle is stale. Playwright's `Locator` is a lazy query that re-resolves on every action, so it survives re-renders. Together, these two design choices remove the two biggest sources of flakiness.",
          ],
        },
        {
          heading: "Q2 — When would you not use Playwright?",
          body: [
            "Playwright is a heavy tool: it downloads hundreds of megabytes of browser binaries, runs real browsers, and is slower than unit tests by orders of magnitude. Don't use it for component-level testing — use Vitest or Jest with Testing Library instead. Don't use it to test internal logic — use unit tests. Don't use it on a small team with no CI budget — the maintenance cost outweighs the safety net.",
            "Use Playwright for the critical user journeys: signup, checkout, the highest-revenue flows. A suite of 20 carefully-chosen E2E tests is more valuable than 200 brittle ones that no one trusts.",
          ],
        },
        {
          heading: "Q3 — How would you design E2E tests for a CI pipeline?",
          body: [
            "The strongest answer walks through four concerns: speed, isolation, feedback, and cost. Speed: parallelise across workers and shard across machines. Isolation: every test gets a fresh browser context and a clean database state (transaction-rollback or per-test database). Feedback: fail fast on the first error, capture a trace on failure, surface the trace link in the CI summary. Cost: only run the full suite on PRs to main; run a smoke subset on every push to a feature branch.",
            "Mention the auth-state reuse pattern (covered earlier) for tests that need an authenticated user — it shaves seconds off every test. Mention sharding for large suites and `merge-reports` for unified triage. Mention that you should never run E2E tests on every commit on a feature branch unless the team has the CI budget for it.",
          ],
        },
        {
          heading: "Q4 — How do you test something that depends on a third-party API?",
          body: [
            "Mock it. Use `page.route()` to intercept the request and fulfill it with a stubbed response. This makes tests deterministic (no network dependency), fast (no real round-trip), and free (no API quota consumed).",
            "The interview follow-up usually asks what you lose: real integration coverage. The honest answer is that you trade end-to-end confidence for stability, and you should periodically run a small subset of tests against the real API in a nightly job to catch contract drift. Show the interviewer that you understand both sides of the trade.",
          ],
          code: [
            {
              language: "typescript",
              caption: "Mock a third-party API deterministically",
              code: `test("payment failure is shown gracefully", async ({ page }) => {
  await page.route("**/api.stripe.com/v1/charges", (route) =>
    route.fulfill({
      status: 402,
      body: JSON.stringify({ error: { message: "Card declined" } }),
    })
  );

  await page.goto("/checkout");
  await page.getByLabel("Card number").fill("4242 4242 4242 4242");
  await page.getByRole("button", { name: "Pay" }).click();

  await expect(page.getByText("Card declined")).toBeVisible();
});`,
            },
          ],
        },
        {
          heading: "Q5 — What is the difference between test.fail and test.skip?",
          body: [
            "`test.skip` marks a test as not run — useful when a feature is broken and you don't want to block CI. `test.fail` marks a test as expected to fail — useful when you want to track a known bug without breaking CI. If a `test.fail` test passes, Playwright reports an error (the bug was fixed but the marker wasn't removed).",
            "There's also `test.fixme` — semantically similar to skip, but signals intent: this test is broken and should be fixed, not just deprioritised. In an interview, mentioning `test.fixme` shows you've actually used Playwright on a real codebase.",
          ],
          code: [
            {
              language: "typescript",
              caption: "test.fail, test.skip, test.fixme — three intents",
              code: `import { test, expect } from "@playwright/test";

test("known bug in discount calculation", async ({ page }) => {
  test.fail();  // expect this to fail until the bug is fixed
  await page.goto("/cart");
  await expect(page.getByText("Total: $90")).toBeVisible();
});

test.skip("Safari-only feature on Chromium", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "Safari only");
  // ...
});

test.fixme("feature disabled behind a flag", async ({ page }) => {
  // to be re-enabled when the flag ships
});`,
            },
          ],
        },
        {
          heading: "Q6 — How do you debug a flaky test?",
          body: [
            "The Playwright trace is the single most important tool. Run the test with `--repeat-each=10` to surface flakiness locally, then open the trace with `npx playwright show-trace` to step through the failure frame by frame. Look for: missing auto-wait (a sleep-based assertion racing the render), network timing (a request that resolves in a different order), shared state leaking between tests, or nondeterministic data (timestamps, random IDs).",
            "If the trace shows a race, the fix is almost always to convert a `waitForTimeout` or a manual check into a web-first assertion. If the trace shows state leakage, the fix is to add a `beforeEach` that resets state. Mention that you should set `retries: 2` in CI to absorb the residual flakiness — but never use retries to mask a known cause, only to absorb the irreducible tail.",
          ],
        },
      ],
    },
  ],
};
