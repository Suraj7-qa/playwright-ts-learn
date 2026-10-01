"use client";

import { Github, Rocket, FileText, Terminal } from "lucide-react";
import { CodeBlock } from "./code-block";

const STEP_CARDS = [
  {
    icon: FileText,
    title: "1. Configure Next.js for static export",
    body: [
      "GitHub Pages serves static files, so the Next.js app must be exported as a static site. Open `next.config.ts` and set `output: 'export'`. You also need `images: { unoptimized: true }` because the image optimisation API requires a Node server.",
      "If your repo is published under a sub-path like `https://user.github.io/repo-name`, also set `basePath: '/repo-name'` and `assetPrefix: '/repo-name/'`. For a top-level repo (`user.github.io`), leave these unset.",
    ],
    code: {
      language: "typescript",
      caption: "next.config.ts — static export settings",
      code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",              // produce a static out/ directory
  images: { unoptimized: true }, // disable the image optimisation API
  // For project sites (https://user.github.io/<repo>), uncomment:
  // basePath: "/<repo>",
  // assetPrefix: "/<repo>/",
};

export default nextConfig;`,
    },
  },
  {
    icon: Terminal,
    title: "2. Build the static site",
    body: [
      "Run `npm run build`. Next.js produces an `out/` directory containing every HTML, JS, CSS, and asset file. This directory is what GitHub Pages will serve — commit it (or generate it in CI) and the rest is plumbing.",
      "Verify locally by running `npx serve out` and opening the printed URL — the site should render exactly as it will in production.",
    ],
    code: {
      language: "bash",
      caption: "Build and verify locally",
      code: `# Install deps and build the static export
npm install
npm run build

# Verify locally — npx serve hosts the out/ directory
npx serve out
# Open http://localhost:3000 in your browser`,
    },
  },
  {
    icon: Github,
    title: "3. Add the GitHub Actions workflow",
    body: [
      "Create `.github/workflows/deploy.yml` in your repo. This workflow runs on every push to `main`, builds the Next.js app, and uploads the `out/` directory as a GitHub Pages artifact. The `actions/deploy-pages` action then publishes it.",
      "Make sure to enable Pages in your repo settings: Settings → Pages → Source = GitHub Actions. Without this, the deploy step will fail with a 403.",
    ],
    code: {
      language: "yaml",
      caption: ".github/workflows/deploy.yml",
      code: `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4`,
    },
  },
  {
    icon: Rocket,
    title: "4. Push, watch, ship",
    body: [
      "Commit everything and push to `main`. Open the Actions tab in your GitHub repo and watch the workflow run. When it completes, your site is live at `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` if you named the repo `username.github.io`).",
      "Every subsequent push to `main` automatically redeploys. Pull requests run a build check but don't deploy — perfect for keeping the live site stable while you iterate.",
    ],
    code: {
      language: "bash",
      caption: "Push to deploy",
      code: `git add .
git commit -m "Configure static export + GitHub Pages workflow"
git push origin main

# Watch the workflow run at:
# https://github.com/<username>/<repo>/actions`,
    },
  },
];

const TROUBLESHOOTING = [
  {
    q: "My assets 404 on the live site but work locally.",
    a: "You almost certainly need `basePath` and `assetPrefix` set to your repo name. The Next.js asset URLs are absolute, so when GitHub Pages serves them under `/repo-name/`, they don't resolve. Set both to `/<repo-name>/` (with leading and trailing slashes) and rebuild.",
  },
  {
    q: "The deploy step fails with a 403.",
    a: "GitHub Pages is not enabled in the repo settings. Go to Settings → Pages → Source and select 'GitHub Actions'. The workflow permission `pages: write` and `id-token: write` must also be present — the snippet above includes them.",
  },
  {
    q: "Images don't load.",
    a: "Static export can't run the image optimisation API. The `images: { unoptimized: true }` flag in `next.config.ts` disables it and serves the originals. Alternatively, host images on a CDN and reference them by absolute URL.",
  },
  {
    q: "Dynamic routes (e.g. /lessons/[id]) don't work.",
    a: "Static export needs to know every route at build time. Use `generateStaticParams` in any dynamic route to pre-render all paths. Pages without it will be skipped from the export.",
  },
];

export function DeploymentView() {
  return (
    <div>
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground mb-3">
          <Rocket className="h-3.5 w-3.5" />
          Deployment Guide
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Publish to GitHub Pages
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
          This site is built with Next.js 16. To publish it on GitHub Pages,
          configure static export, build, then ship with a one-file GitHub
          Actions workflow. Four steps, all automated.
        </p>
      </header>

      <div className="space-y-8">
        {STEP_CARDS.map((step, i) => {
          const Icon = step.icon;
          return (
            <section key={i} className="rounded-xl border border-border bg-card p-5 md:p-7 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl md:text-2xl font-semibold mb-3">
                <Icon className="h-5 w-5 text-primary" />
                {step.title}
              </h2>
              <div className="space-y-3 mb-2">
                {step.body.map((para, j) => (
                  <p key={j} className="text-[15px] leading-7 text-foreground/90">
                    {para}
                  </p>
                ))}
              </div>
              <CodeBlock
                code={step.code.code}
                language={step.code.language}
                caption={step.code.caption}
              />
            </section>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <div className="space-y-3">
          {TROUBLESHOOTING.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-muted/30 p-4"
            >
              <p className="font-medium mb-1.5 text-[15px]">{item.q}</p>
              <p className="text-sm text-muted-foreground leading-6">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
