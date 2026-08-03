# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This is a React fundamentals learning project (Vite + React + TypeScript). It is not a production app — expect the codebase to grow incrementally as new concepts (props, state, effects, forms, hooks, etc.) are introduced one at a time.

## Commands

- `npm run dev` — start the Vite dev server (HMR enabled)
- `npm run build` — type-check (`tsc -b`) then production build
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build locally

There is no test runner configured yet.

## Architecture

- Entry point: `src/main.tsx` mounts `<App />` from `src/App.tsx` into `index.html`.
- Components live under `src/components/`, one file per component, default-exported.
- Linting is via **Oxlint** (not ESLint) — config in `.oxlintrc.json`, currently enabling the `react`, `typescript`, and `oxc` plugin rule sets with `react/rules-of-hooks` as an error.
- No React Compiler, router, or state-management library is installed — additions should be deliberate, not assumed.
