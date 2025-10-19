# Active Context

- Timestamp: 2025-10-18T00:00:00-04:00
- Current focus: Interactive dashboard shell for the landing route is now implemented in `web/src/app/page.tsx`, mirroring the provided React demo with auth context, protected routes, project/user views, charts, and theme switching.
- Implementation status: UI relies on demo data only; charts and icons are powered by newly added `framer-motion`, `lucide-react`, and `recharts` dependencies. Sidebar/nav logic, mock auth provider, and client-only rendering are in place.
- Immediate next action: Align styling tokens with global design system once it is defined, and plan backend integration so project/user tables hydrate from Prisma once APIs exist.
- Reference artifacts: web/src/app/page.tsx (dashboard shell), web/src/lib/utils.ts (`cn` helper), package installations recorded via `pnpm add framer-motion lucide-react recharts`.
- Previous milestone: Comprehensive Next.js foundation (Docker/Postgres, Prisma, NextAuth, navigation, testing) already established and untouched by this UI pass.
- Notes: Dark-mode handling currently toggles the `dark` class on `document.documentElement`. Need confirmation whether to replace with `next-themes` integration when backend work begins.
- Open questions: Should sign-in flow eventually delegate to NextAuth routes instead of local prompts? What telemetry/back-end endpoints will power the charts once data is available?
