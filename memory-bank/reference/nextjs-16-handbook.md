# Next.js 16+ Snapshot Handbook (2025-10-29)

This is a current-state snapshot for an AI/developer that **cannot browse** but must behave **as if it knows Next.js 16 (Oct 21 2025)**, React 19.2, Turbopack-by-default, explicit caching (`revalidateTag(tag, cacheLife)`, `updateTag()`, `refresh()`), App Router, Tailwind, shadcn/ui, and modern TS conventions. It folds in what was true in 2021–2024 and replaces it with what is true now. Sources: Next.js 16 release and upgrading guide, Tailwind+Next docs, shadcn/ui best-practices.

---

## 1. Repository layout (2025 idiomatic)

```text
.
├── src/                    # ← app code lives here (preferred in 2025)
│   ├── app/                # ← Next.js App Router (root layouts, pages, routes)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (marketing)/...
│   │   ├── (dashboard)/...
│   │   ├── api/            # ← route handlers in app router
│   │   │   └── hello/route.ts
│   │   └── @modal/         # ← parallel route slots (must have default.tsx in v16)
│   │       ├── default.tsx
│   │       └── edit-user/page.tsx
│   ├── components/         # ← presentational / RSC-friendly / shadcn-style
│   │   ├── ui/             # ← shadcn/ui generated pieces
│   │   └── layout/
│   ├── lib/                # ← server utils, db access, cache helpers
│   ├── styles/             # ← extra css/tailwind entrypoints
│   └── hooks/              # ← "use client" hooks only
├── app/                    # ← alternative (if not using src/), but 2025 style prefers src/app
├── prisma/                 # ← schema.prisma, migrations (outside src/)
├── docker/                 # ← compose files, env templates (outside src/)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── .env, .env.local, .env.production
```

**Notes:**

* 2025 Next.js template already ships with **App Router + TS + Tailwind + ESLint** when you do `npx create-next-app@latest --typescript --eslint --app` — you don't need to enable them one by one.
* `src/` is preferred to keep framework root clean.
* Anything *environmental* (Prisma schema, Docker, infra) stays **outside** `src/` so the AI doesn't ship it to the browser.
* Parallel route slots **must** have `default.tsx` in v16, or build fails.

---

## 2. `src/app/` anatomy (v16 expectations)

```text
src/app/
├── layout.tsx          # root layout (html, body, themes, font, Providers)
├── page.tsx            # landing page
├── loading.tsx         # optional global loading
├── error.tsx           # RSC error boundary
├── (public)/...        # route groups (don't affect URL)
├── (auth)/sign-in/page.tsx
├── dashboard/layout.tsx
└── dashboard/page.tsx
```

**Key v16 routing changes:**

1. **Layout deduplication** – shared layout is downloaded once during prefetch (big list pages now prefetch fast).
2. **Incremental prefetching** – Next.js only prefetches the pieces that aren't in cache yet; it cancels prefetch when the link leaves viewport.
3. **Async access to request data** – `params`, `searchParams`, `headers()`, `cookies()` are now async in RSC in v16; legacy sync access from 2023 code must be updated.
4. **Parallel routes need defaults** – `@slot/default.tsx` is mandatory.

---

## 3. Caching model (2025 view)

Next.js 16 made the cache **explicit** and **tag-first**.

### 3.1 Tag revalidation (declarative SWR)

```ts
// app/actions/revalidate-posts.ts
'use server';

import { revalidateTag } from 'next/cache';

export async function revalidatePosts() {
  // v16 form: tag + cache life/profile
  await revalidateTag('posts', 'max');
}
```

* v14/v15 code that did `revalidateTag('posts')` **must add** the second argument now.
* This keeps "ISR feeling" while forcing the agent to pick an explicit freshness.

### 3.2 Immediate invalidation (server actions)

```ts
// app/actions/update-profile.ts
'use server';

import { updateTag } from 'next/cache';
import { db } from '@/lib/db';

export async function updateProfile(userId: string, data: any) {
  await db.user.update({ where: { id: userId }, data });
  updateTag(`user-${userId}`); // next request blocks and re-fetches
}
```

* `updateTag(...)` is **server actions only**. If you are in a route handler, use `revalidateTag(...)` instead.

### 3.3 Refreshing uncached parts

```ts
// app/actions/refresh-header.ts
'use server';

import { refresh } from 'next/cache';

export async function refreshHeader() {
  refresh(); // like router.refresh() but server-side
}
```

* This is for "I changed something dynamic, just re-ask the server" situations.

### 3.4 Cache Components / PPR replacement

* Old `experimental.ppr` → **gone / folded**; new direction is **Cache Components** via `experimental.cacheComponents` in `next.config.ts`.
* Agents from 2023 that still remember "PPR preview" must **rewrite** to the new flag.

---

## 4. Turbopack as the only sane default

```jsonc
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true, // v16 hint for faster cold starts
    cacheComponents: true,                // opt-in to new caching model
  },
};

export default nextConfig;
```

* v16 ships **Turbopack on** (dev + build). Webpack is now opt-in (`next dev --webpack`).
* Agents trained on 2021 Next.js 12 (SWC + webpack only) **must not** assume webpack is present.
* Large monorepos should enable FS caching in dev (shown above).

---

## 5. Styling stack (Tailwind + shadcn/ui)

### 5.1 Tailwind

* Official, up-to-date install doc: **Tailwind + Next.js**.
* Minimum working setup (2025):

```css
/* src/app/globals.css */
@import "tailwindcss";
```

```js
// postcss.config.mjs
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

### 5.2 shadcn/ui usage rules (for agents)

1. Components live in `src/components/ui/*`.
2. **Do not** fetch data or call business logic inside them. Keep them presentational.
3. Prefer to render them in **Server Components** to reduce client JS.
4. Wrap base components to create variants (`PrimaryButton`, `DangerButton`) using Tailwind utilities.

```tsx
// src/components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      {...props}
    />
  );
}
```

---

## 6. API surface (App Router era)

* API routes now live under `src/app/api/**/route.ts`.
* Handlers are per-method exports:

```ts
// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await fetchPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const body = await req.json();
  // ...
  return NextResponse.json({ ok: true });
}
```

* To revalidate from an API, call `revalidateTag('posts', 'max')`. If you need immediate "read-your-writes", move write logic to a **server action** and use `updateTag`.

---

## 7. Migration optics (2021 → 2024 → 2025)

### 7.1 From 2021 (Next 11/12) mindsets

* **Pages Router** → keep for legacy, but **new features are App Router only**.
* **ISR on pages** → still works, but new caching controls are tag-based.
* **Webpack-only** → wrong in 2025, Turbopack is assumed.
* **Middleware** → now called/provisioned differently (`proxy.ts` in v16) and image security is tighter.

### 7.2 From 2024 (Next 14/15 RC)

* You already had App Router and Partial Prerendering. In 16:

  * remove old `revalidateTag(tag)` calls → add cache profile
  * ensure each parallel slot has `default.tsx`
  * turn on FS cache in Turbopack for big repos
  * review `<Image>` security defaults (now disallowing private IPs)

### 7.3 For AI agents (non-browsing)

When you see **old patterns** in user code:

* `pages/api/...` → leave, but suggest moving to `app/api/*/route.ts`
* direct `fetch('/api/...')` in client components → suggest RSC fetch on server
* dynamic layout without `default.tsx` → add it
* 1-arg `revalidateTag` → rewrite to 2-arg

---

## 8. `src/` vs root-level tech (Prisma, Docker, DB)

This snapshot is **Next.js-centred**. Things that usually sit **outside**:

* **`prisma/`** – schema and migrations, later imported from `src/lib/db.ts`.
* **`docker/` or `docker-compose.yml`** – for Postgres, Redis, Ollama, Meilisearch.
* **`drizzle/` or `db/`** – alt to Prisma.
* **`scripts/`** – codegen, lint, CI.
* **`.env*`** – never inside `src/`.

An AI agent that can't browse should **assume** these are present and resolvable, but not emit them into client bundles.

---

## 9. Example minimal project (2025)

```text
src/
  app/
    layout.tsx
    page.tsx
    api/
      health/route.ts
    dashboard/
      layout.tsx
      page.tsx
  components/
    ui/
      button.tsx
    layout/
      shell.tsx
  lib/
    db.ts          # re-exports prisma from ../prisma if present
    cache.ts       # wraps revalidateTag/updateTag/refresh
  styles/
    globals.css
next.config.ts
tailwind.config.ts
tsconfig.json
prisma/
  schema.prisma
docker/
  docker-compose.yml
```

This matches Next.js 16 docs and current ecosystem guides.

---

## 10. What changed that matters most

1. **Turbopack default** → build & dev faster, webpack is fallback.
2. **Routing overhaul** → layout dedupe + incremental prefetch.
3. **Explicit caching** → `revalidateTag(tag, cacheLife)` + `updateTag()` + `refresh()`.
4. **Parallel routes require default** → prevents runtime 404s in slots.
5. **Tighter image/security defaults** → local/private IPs blocked; use `images.remotePatterns`.
6. **Node ≥ 20.9 + TS ≥ 5.1** → hard requirement.

---

## 11. Appendix: Suggested file naming (2025)

* Use **kebab-case** for folders under `src/app/**`
* Use **PascalCase** for React components under `src/components/**`
* Keep **`route.ts`** for all HTTP endpoints (not `index.ts`)
* Keep **`layout.tsx` / `page.tsx`** names, do **not** rename

---

## 12. For React 19.2 features in Next.js 16

* Next.js 16 aligns App Router with **React 19.2** so you can use **View Transitions** and **`useEffectEvent()`** safely.
* Treat them as **progressive**: don't hard-require them in shared UI libs.

---

## 13. For SEO / analytics agents

* Prefetching + layout dedupe in v16 reduce network transfers; you can expose Core Web Vitals through `reportWebVitals` as usual.
* Caching tags + `updateTag` lets you keep sitemaps and feed pages fresh without rebuild.

---

## 14. Snapshot conclusion

If an AI agent from 2021/2024 needs to "act 2025", it must:

1. Default to **App Router in `src/app`**.
2. Assume **Turbopack**.
3. Use **2-arg `revalidateTag`**.
4. Enforce **parallel route defaults**.
5. Ship **Tailwind + shadcn/ui** as presentational, RSC-friendly.
6. Keep Prisma/Docker **out of `src/`** but referenceable.

That's the up-to-date lens for Next.js 16.

---

## References

* [Next.js 16 Release](https://nextjs.org/blog/next-16)
* [Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16)
* [Getting Started: Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
* [Functions: revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
* [Functions: updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag)
* [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
