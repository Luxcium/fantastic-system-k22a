# Dependencies

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
