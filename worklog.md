# Worklog

---
Task ID: main
Agent: main (super-z)
Task: Build a learning website for Playwright + TypeScript (basics to interview level) with practice problems and GitHub Pages deployment guidance.

Work Log:
- Loaded `fullstack-dev` skill and initialised Next.js 16 project (TypeScript, Tailwind, shadcn/ui).
- Designed site architecture: single-page app with state-driven navigation between Home / TypeScript track / Playwright track / Practice problems / Deploy guide.
- Authored curriculum data files under `src/data/`:
  - `typescript-curriculum.ts` — 4 lessons (Foundations, Generics & Utility Types, Advanced Patterns, Interview Q&A) with code examples, callouts, objectives.
  - `playwright-curriculum.ts` — 4 lessons (Foundations, Selectors & Hooks, POM & Network, Interview Q&A) with full code samples including GitHub Actions sharding config.
  - `problems.ts` — 16 practice problems (8 TS + 8 Playwright) with prompts, progressive hints, runnable solutions, and written explanations.
- Built site components under `src/components/site/`:
  - `code-block.tsx` — syntax-highlighted code with copy button (uses `react-syntax-highlighter` + oneDark theme + clipboard API with execCommand fallback).
  - `lesson-view.tsx` — renders a Lesson with header, objectives, sections, callouts (info/warning/tip/success), and embedded code blocks.
  - `problems-view.tsx` — problems list with category filter tabs, collapsible cards, Show-hints and Reveal-solution interactions.
  - `home-view.tsx` — hero, learning-path track cards, stats grid, "why this curriculum" feature cards.
  - `deployment-view.tsx` — 4-step GitHub Pages deployment guide with code blocks for `next.config.ts`, build commands, `.github/workflows/deploy.yml`, and a troubleshooting section.
  - `sidebar.tsx` — navigation tree with expandable tracks, lesson difficulty badges, active state highlighting.
  - `site-header.tsx` — sticky header with logo, mobile Sheet menu, GitHub link, theme toggle.
  - `theme-provider.tsx` — wraps next-themes for light/dark mode.
- Updated `src/app/page.tsx` to compose all views with state-based navigation and breadcrumb.
- Updated `src/app/layout.tsx` to add ThemeProvider and SEO metadata.
- Added `src/hooks/use-mounted.ts` (uses `useSyncExternalStore` to avoid the `setState-in-effect` lint rule) for theme-aware rendering.
- Added custom CSS in `globals.css` for code-block scrollbars, smooth scroll, and inline code styling.
- Added `.github/workflows/deploy.yml` and updated `next.config.ts` with commented-out static-export settings and instructions for the user.
- Ran `bun run lint` — passes cleanly.
- Verified dev server: `GET / 200`, no runtime errors, no console warnings after the Sheet description fix.
- Verified rendering with Agent Browser:
  - Home page hero, tracks, features all render.
  - TypeScript track loads all 4 lessons with code blocks and callouts.
  - Playwright track loads with full code samples.
  - Practice problems: 16 problems visible, filter tabs work, Show hints and Reveal solution interactivity confirmed.
  - Deploy page renders all 4 steps with copy buttons.
  - Dark mode toggle works (HTML element class flips to `dark`).
  - Mobile responsive: hamburger menu opens Sheet with full navigation tree.
  - No console errors after the Sheet description fix.

Stage Summary:
- Built a comprehensive 5-section learning portal: Home, TypeScript track (4 lessons), Playwright track (4 lessons), Practice problems (16), Deploy guide.
- Total content: 8 lessons + 16 practice problems + 1 deployment guide, all with runnable, copyable code samples.
- Tech stack: Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + react-syntax-highlighter + next-themes.
- GitHub Pages deployment is documented end-to-end; the workflow file is committed at `.github/workflows/deploy.yml` and the `next.config.ts` has clearly-commented static export settings to flip on when ready to publish.
- Lint passes; dev server responds 200; Agent Browser self-verification confirms visual and interactive correctness on both desktop and mobile viewports.
