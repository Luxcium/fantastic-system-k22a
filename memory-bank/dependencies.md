# Dependencies

This document tracks the project dependencies, their versions, and rationale for inclusion.

## Core Framework

### Next.js 16.0.1
- **Purpose**: React framework with App Router, server components, and built-in optimizations
- **Rationale**: Latest stable version with Turbopack as default bundler, improved performance and explicit caching model
- **Node Version**: Requires Node.js ≥ 20.9
- **Key Features**: Turbopack by default, explicit caching with `revalidateTag(tag, cacheLife)`, layout deduplication, incremental prefetching
- **Breaking Changes**: Async request data access (`params`, `searchParams`, `headers()`, `cookies()`), parallel routes require `default.tsx`

### React 19.2.0 & React DOM 19.2.0
- **Purpose**: UI library with server and client components
- **Rationale**: Latest React version with View Transitions, improved concurrent features and hooks
- **Key Features**: View Transitions API support, `useEffectEvent()` hook, improved server components

### TypeScript 5.x
- **Purpose**: Type-safe JavaScript development
- **Configuration**: Strict mode enabled in tsconfig.json
- **Rationale**: Catches errors at compile time, improves code quality and maintainability

## Database & ORM

### Prisma 6.17.1
- **Purpose**: Next-generation ORM for Node.js and TypeScript
- **Client**: @prisma/client (auto-generated from schema)
- **Rationale**: Type-safe database client with excellent TypeScript support
- **Features**: Migrations, seeding, Prisma Studio GUI

### PostgreSQL 16 (Docker)
- **Purpose**: Production-grade relational database
- **Configuration**: docker-compose.yml with health checks
- **Rationale**: Robust, standards-compliant, excellent JSON support

## Authentication & Authorization

### NextAuth.js 5.0.0-beta.29
- **Purpose**: Authentication for Next.js applications
- **Adapter**: @auth/prisma-adapter (2.11.0)
- **Features**: JWT sessions, OAuth (Google, GitHub), credentials auth
- **Rationale**: Official Next.js authentication solution with Prisma integration

### bcryptjs 2.4.3
- **Purpose**: Password hashing
- **Rationale**: Secure password hashing with salt rounds

## State Management

### Zustand 5.0.8
- **Purpose**: Lightweight state management
- **Rationale**: Simple API, TypeScript support, minimal boilerplate

### TanStack Query 5.90.2
- **Purpose**: Data fetching, caching, and synchronization
- **Rationale**: Powerful async state management with built-in caching

## Validation & Schema

### Zod 3.25.76
- **Purpose**: TypeScript-first schema validation
- **Rationale**: Runtime type checking, schema inference, excellent TypeScript integration

## Styling & UI

### Tailwind CSS 4.1.13
- **Purpose**: Utility-first CSS framework
- **PostCSS Plugin**: @tailwindcss/postcss (4.1.14)
- **Utilities**: autoprefixer (10.4.21), postcss (8.5.6)
- **Rationale**: Rapid UI development, consistent design system

### Tailwind Utilities
- **tailwind-merge (2.6.0)**: Merge Tailwind classes without conflicts
- **clsx (2.1.1)**: Conditional class names utility
- **class-variance-authority (0.7.1)**: Type-safe variant classes

### UI Components

#### Radix UI (@radix-ui/react-slot 1.2.3)
- **Purpose**: Unstyled, accessible UI primitives
- **Rationale**: Accessibility-first, composable components

#### Lucide React 0.546.0
- **Purpose**: Beautiful & consistent icon library
- **Rationale**: Tree-shakeable, TypeScript support, 1000+ icons

#### Framer Motion 12.23.24
- **Purpose**: Animation library for React
- **Rationale**: Smooth animations, gesture support, layout animations

#### Recharts 3.3.0
- **Purpose**: Composable charting library
- **Rationale**: Built on React components, responsive, customizable

#### Next Themes 0.4.6
- **Purpose**: Dark mode support for Next.js
- **Rationale**: System preference detection, no flash on load

## Utilities

### Immer 10.1.3
- **Purpose**: Immutable state updates
- **Rationale**: Used with Zustand for clean state mutations

## Development Tools

### Linting & Formatting

#### Biome 2.2.0

- **Purpose**: Fast linter and formatter (replaces ESLint + Prettier)
- **Features**: 10-100x faster, single tool for linting and formatting
- **Configuration**: web/biome.json
- **Rationale**: Modern tooling, faster feedback loops

#### markdownlint-cli2 0.18.1 (Added 2025-11-06)

- **Purpose**: Strict markdown linting and validation for AI agents
- **Features**: 50+ rules enforcing CommonMark/GFM standards, auto-fix capability
- **Configuration**: .markdownlint-cli2.jsonc (root and web/)
- **Rationale**: Ensures consistent, high-quality markdown across all documentation
- **Integration**: Pre-commit hooks via lint-staged, validation scripts for AI agents
- **Key Rules**: ATX headings, consistent lists, no trailing spaces, code block languages, image alt text
- **Scripts**: `markdown:lint`, `markdown:fix`, `markdown:validate`

### Git Hooks

#### Husky 9.1.7

- **Purpose**: Git hooks made easy
- **Rationale**: Enforce code quality before commits

#### Lint-Staged 16.2.5
- **Purpose**: Run linters on staged files
- **Configuration**: In web/package.json
- **Rationale**: Fast pre-commit checks, only lints changed files

### Testing

#### Vitest 2.1.9
- **Purpose**: Unit testing framework
- **Plugins**: @vitejs/plugin-react (4.7.0)
- **Coverage**: @vitest/coverage-v8 (2.1.9)
- **UI**: @vitest/ui (2.1.9)
- **Rationale**: Fast, Vite-powered, Jest-compatible API

#### Testing Library
- **@testing-library/react (16.3.0)**: React component testing
- **@testing-library/user-event (14.6.1)**: User interaction simulation
- **@testing-library/jest-dom (6.9.1)**: Custom matchers
- **jsdom (25.0.1)**: DOM implementation for Node.js
- **Rationale**: Best practices for testing React components

#### Playwright 1.56.0
- **Purpose**: End-to-end testing
- **Configuration**: playwright.config.ts
- **Rationale**: Cross-browser testing, auto-wait, excellent developer experience

### Type Definitions

- **@types/node (22.18.10)**: Node.js type definitions
- **@types/react (19.1.15)**: React type definitions
- **@types/react-dom (19.1.9)**: React DOM type definitions
- **@types/bcryptjs (2.4.6)**: bcryptjs type definitions

### Build Tools

#### TSX 4.20.6
- **Purpose**: TypeScript execution for scripts
- **Usage**: Database seeding, build scripts
- **Rationale**: No compilation step needed for TS scripts

## Package Manager

### pnpm 10.18.3
- **Purpose**: Fast, disk space efficient package manager
- **Configuration**: .npmrc, pnpm.onlyBuiltDependencies in package.json
- **Rationale**: Faster installs, better disk usage, strict dependency resolution

## Docker & Infrastructure

### Docker Compose
- **Services**: PostgreSQL 16, pgAdmin 4
- **Configuration**: docker-compose.yml
- **Networks**: genesis_network
- **Volumes**: Persistent data storage

## Dependency Management Policies

### Version Strategy
- **Major versions**: Pinned for stability (e.g., "next": "15.5.4")
- **Minor/patch**: Flexible with ^ (e.g., "@types/node": "^22")
- **Dev dependencies**: More flexible, can update frequently

### Update Schedule
- **Security updates**: Immediate
- **Minor updates**: Monthly review
- **Major updates**: Quarterly evaluation

### Adding New Dependencies
1. **Check alternatives**: Evaluate multiple options
2. **Check bundle size**: Use bundlephobia.com
3. **Check maintenance**: Active development, recent updates
4. **Check compatibility**: Works with Node 22+, Next.js 15
5. **Check security**: No known vulnerabilities
6. **Document rationale**: Update this file

### Removing Dependencies
1. **Check usage**: Search codebase for imports
2. **Test thoroughly**: Run all tests after removal
3. **Update docs**: Remove from this file
4. **Clean lock file**: Run pnpm install

## Excluded Dependencies

### ESLint & Prettier
- **Status**: Replaced by Biome
- **Rationale**: Biome is 10-100x faster and provides both linting and formatting

### Jest
- **Status**: Replaced by Vitest
- **Rationale**: Vitest is faster and has better Vite integration

## Security Considerations

### Regular Audits
```bash
pnpm audit
```

### Outdated Check
```bash
pnpm outdated
```

### Update All
```bash
pnpm update --latest
```

### Security Policies
- No dependencies with known critical vulnerabilities
- Prefer well-maintained packages with active communities
- Use lock files to ensure reproducible builds
- Review dependency changes in pull requests

## Performance Considerations

### Bundle Size Monitoring
- Use Next.js bundle analyzer
- Tree-shaking enabled
- Code splitting via dynamic imports

### Development Experience
- Fast refresh with Next.js
- Fast linting with Biome
- Fast tests with Vitest
- Fast package installs with pnpm

## Last Updated
- **Date**: 2025-10-21
- **By**: GitHub Copilot Agent
- **Next Review**: 2025-11-21
## Core Framework Versions

### Updated: 2025-10-30
- **Next.js**: 16.0.1 (upgraded from 15.5.4)
- **React**: 19.2.0 (upgraded from 19.1.0)
- **React-DOM**: 19.2.0 (upgraded from 19.1.0)

### TypeScript Configuration Changes
- `jsx`: Changed from "preserve" to "react-jsx" (Next.js 16 uses React automatic runtime)
- `include`: Added ".next/dev/types/**/*.ts" for improved type support

## Key Features in Next.js 16
- **Turbopack as Default**: Next.js 16 uses Turbopack as the default bundler for faster builds
- **Explicit Caching**: New caching model with `revalidateTag` and `updateTag` functions
- **App Router**: Continued improvements to the App Router architecture
- **React 19 Support**: Full compatibility with React 19.x

## Dependency Status
All dependencies installed and verified:
- ✅ Build passes successfully
- ✅ TypeScript compilation passes
- ✅ All 62 tests pass
- ✅ Development server starts correctly
- ✅ Turbopack bundler working as expected

## Known Warnings
- **next-auth**: Peer dependency warning (expects Next.js ^14.0.0-0 || ^15.0.0-0, but we have 16.0.1)
  - This is expected and does not affect functionality
  - next-auth will likely be updated to support Next.js 16 in future versions
  - Current version (5.0.0-beta.25) still works with Next.js 16

## Package Manager
- **pnpm**: v10.20.0 (required and enforced by project guidelines)
