# Playwright TypeScript — Dynamic Redeem (redimi) with Images

This repository contains Playwright + TypeScript tests. This README explains how to add a dynamic "redeem" flow (redimi) test that includes uploading and validating static and moving images (PNG/JPG, GIF/APNG, WebM, Lottie). Use this file as a copy-paste template for documenting the feature and for adding tests.

---

## Overview

Feature: "Dynamic Redeem" — a UI flow where users redeem vouchers/items that are generated dynamically, and the flow includes image uploads or image verification (thumbnails, previews, comparisons, and animated previews).

This README shows:
- How to structure tests
- How to provide dynamic input data
- How to include and reference images (fixtures)
- Example Playwright test (TypeScript)
- Commands to run locally / CI

---

## Prerequisites

- Node.js 18+ (or the project's supported Node version)
- npm or yarn
- Playwright installed for browsers:
  - `npx playwright install`

Recommended dev dependencies:
- `@playwright/test`
- `typescript`
- `ts-node` (optional)

Install (example):
- `npm install`
- `npx playwright install`

---

## Project layout (recommended)

```
tests/
  fixtures/
    images/
      voucher-sample-1.png
      voucher-sample-2.jpg
      voucher-anim-1.gif
      voucher-anim-2.webm
      voucher-lottie.json
  redeem/
    redeem-dynamic.spec.ts

playwright.config.ts
package.json
README.md
```

Store all test image fixtures under `tests/fixtures/images/`.

---

## Example test: dynamic redeem with images

Copy this file to `tests/redeem/redeem-dynamic.spec.ts`. It demonstrates:
- dynamic data-driven tests
- uploading an image file with `setInputFiles`
- checking image preview and taking a screenshot (or comparing a screenshot)
- handling static and animated image types

```typescript
import path from 'path';
import { test, expect } from '@playwright/test';

const redeemCases = [
  {
    name: 'Promo voucher - PNG',
    code: 'DYN-RED-001',
    imageFile: 'voucher-sample-1.png',
    expectedMessage: 'Redeem successful',
  },
  {
    name: 'Gift voucher - JPG',
    code: 'DYN-RED-002',
    imageFile: 'voucher-sample-2.jpg',
    expectedMessage: 'Redeem successful',
  },
  {
    name: 'Animated GIF',
    code: 'DYN-RED-003',
    imageFile: 'voucher-anim-1.gif',
    expectedMessage: 'Redeem successful',
  },
  {
    name: 'Video WebM',
    code: 'DYN-RED-004',
    imageFile: 'voucher-anim-2.webm',
    expectedMessage: 'Redeem successful',
  },
  {
    name: 'Lottie animation',
    code: 'DYN-RED-005',
    imageFile: 'voucher-lottie.json',
    expectedMessage: 'Redeem successful',
  },
];

test.describe('Dynamic Redeem (redimi) with images', () => {
  for (const c of redeemCases) {
    test(c.name, async ({ page, tmpDir }) => {
      // Navigate to the page under test — change to your app URL
      await page.goto('https://example.com/redeem');

      // Fill dynamic code field
      await page.locator('input[name="redeemCode"]').fill(c.code);

      // Upload image fixture
      const imagePath = path.resolve(__dirname, '../fixtures/images', c.imageFile);
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(imagePath);

      // Wait for preview/thumbnail to appear (adjust selector)
      const preview = page.locator('[data-testid="redeem-image-preview"], .redeem-preview, video, canvas');
      await expect(preview).toBeVisible({ timeout: 5_000 });

      // Special handling for video to ensure it started playing
      if (c.imageFile.endsWith('.webm')) {
        await page.waitForFunction(() => {
          const v = document.querySelector('video');
          return v && (v as HTMLVideoElement).currentTime > 0;
        }, null, { timeout: 5_000 });
      }

      // For Lottie JSON, wait for a player container
      if (c.imageFile.endsWith('.json')) {
        await expect(page.locator('[data-testid="lottie-player"], .lottie')).toBeVisible({ timeout: 5_000 });
      }

      // Optionally take a screenshot for visual verification / snapshot
      await expect(preview).toHaveScreenshot(`${c.code}-preview.png`, { animations: 'disabled' });

      // Submit redeem form
      await page.locator('button:has-text("Redeem")').click();

      // Wait and assert success message or redirect
      const success = page.locator('text=' + c.expectedMessage);
      await expect(success).toBeVisible({ timeout: 10_000 });

      // Optional: capture full-page screenshot on success for debugging
      await page.screenshot({ path: path.join(tmpDir.path, `${c.code}-success.png`) });
    });
  }
});
```

Notes:
- Replace `https://example.com/redeem` and selectors with your actual app URL and selectors.
- Use stable selectors (data-testid or data-qa) whenever possible.
- `toHaveScreenshot` will save an image in Playwright's snapshot folder on first run; commit it if you want snapshot testing, or keep it for local debugging.

---

## Image fixtures and paths

- Put your image fixtures in `tests/fixtures/images/`.
- Reference them using `path.resolve(__dirname, '../fixtures/images', 'your-image.png')`.
- If tests run in CI, ensure the fixtures are present in the repository or downloaded during CI.

---

## Running tests

From the project root:

- Run all tests:
  - `npx playwright test`

- Run just the redeem tests:
  - `npx playwright test tests/redeem`

- Run a single test in headed mode for debugging:
  - `npx playwright test tests/redeem/redeem-dynamic.spec.ts -g "Promo voucher - PNG" --headed --debug`

- Install Playwright browsers (first time / CI):
  - `npx playwright install`

- To record a trace for failing test:
  - `npx playwright test --trace on`

---

## CI tips

- Ensure Playwright browsers are installed on CI:
  - `npx playwright install --with-deps` (or just `npx playwright install`)
- Cache node_modules and Playwright dependencies if your CI supports it.
- Use `--workers=1` if there are shared global resources or flaky external services.

---

## Troubleshooting & tips

- If file uploads fail, check that the `<input type="file">` is visible or use `setInputFiles` directly on the input locator.
- If image previews are rendered by JS after upload, add a wait for the preview element or an XHR/network idle.
- Use `test.info().snapshotPath` or `tmpDir` to store ephemeral debug files.
- Use environment variables (or Playwright fixtures) to pass dynamic test endpoints or credentials.

---

## Example package.json scripts

Add helpful scripts to package.json:

```json
{
  "scripts": {
    "test": "npx playwright test",
    "test:headed": "npx playwright test --headed",
    "test:redeem": "npx playwright test tests/redeem"
  }
}
```

---

## Contributing

- Open an issue describing the behavior if the redeem flow changes or selectors break.
- When adding new image fixtures, name them clearly (e.g., `redeem-<scenario>-v1.png`) and update tests.

---

## License

Add your preferred license information here (MIT, Apache-2.0, etc).

---

If you want, I can also:
- generate the example test file in the repo (create `tests/redeem/redeem-dynamic.spec.ts` with the code above), or
- adapt the README and test to your exact app selectors, URL, and upload method — give me the form fields and preview selectors and I will tailor the test.
