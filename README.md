# Axyl1410 – Portfolio

![Open Graph preview](https://nguyentruonggiang.id.vn/og)

Modern, animation‑driven personal portfolio built with Next.js, Motion, and View Transitions, showcasing my work as a full‑stack developer.

Featured project: **[Sora UI](https://ui.soralabs.io.vn)** — motion-first React component registry ([Product Hunt](https://www.producthunt.com/products/sora-ui)).

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: CSS utilities & Tailwind css
- **Animations**: Motion (scroll reveals, loaders, nav, buttons)
- **UI primitives**: [Sora UI](https://ui.soralabs.io.vn) (`@soralabs` shadcn registry — install-ready for Phase 2)
- **Page Transitions**: View Transitions API
- **Deployment Target**: Cloudflare (via OpenNext)

## Sora UI registry

This project registers the `@soralabs` namespace for the shadcn CLI (`components.json`). Install primitives when needed:

```bash
npx shadcn@latest add @soralabs/text-effect
```

Registry URL: `https://ui.soralabs.io.vn/r/{name}.json`

## Features

- **Animated page transitions** using the View Transitions API
- **Intro loader** that reveals the hero content, nav, and menu in a coordinated sequence
- **Scroll‑based text reveals** (word/character splitting with Motion)
- **Responsive navigation** with animated underline and menu overlay
- **Lightweight, performance‑minded motion** that respects `prefers-reduced-motion`

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
# or
pnpm install
# or
bun install
```

Run the development server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Scripts

- `**npm run dev**` – Start the Next.js development server
- `**npm run preview**` – Preview the application locally on the Cloudflare runtime
- `**npm run deploy**` – Deploy the application to Cloudflare

## Project Structure (high level)

- `**src/app**` – App Router pages, layouts, OG routes, metadata
- `**src/components**` – Reusable UI, navigation, loaders, and animation components
- `**src/styles**` – Global styles and utility classes (typography, layout, components)
- `**src/utils**` – Helpers for page transitions, motion preferences, etc.

## License

Licensed under the **Apache License, Version 2.0** (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
