# Genesis 22 Web Application

A modern, full-stack Next.js application with TypeScript, Prisma, NextAuth, and comprehensive testing.

## 🎯 Project Overview

This is a production-ready Next.js 15 application built with the App Router, featuring:

- **Framework**: Next.js 15 with React 19 Server & Client Components
- **Language**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS v4 with utility-first approach
- **Database**: PostgreSQL 16 with Prisma ORM
- **Authentication**: NextAuth.js v5 with multiple providers
- **State Management**: Zustand + TanStack Query
- **UI Components**: Radix UI primitives with custom components
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Linting**: Biome (modern, fast alternative to ESLint + Prettier)
- **Git Hooks**: Husky + lint-staged for pre-commit checks

## 📁 Project Structure

```
web/
├── .key/                   # Key management (gitignored, for sensitive keys)
├── docker/                 # Docker configuration files
├── e2e/                   # End-to-end tests (Playwright)
├── prisma/                # Prisma schema, migrations, and seeds
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding script
│   └── migrations/       # Database migrations
├── public/                # Static assets
├── scripts/               # Build and utility scripts
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Homepage
│   ├── components/       # Reusable React components
│   │   ├── ui/           # Base UI components (Button, Card, etc.)
│   │   └── theme-*.tsx   # Theme-related components
│   ├── features/         # Feature-specific code (modular by domain)
│   ├── lib/              # Utility functions and configurations
│   │   ├── db/           # Database utilities
│   │   └── utils.ts      # Common utilities
│   └── test/             # Test utilities and setup
├── .env.example          # Environment variables template
├── biome.json           # Biome configuration (linting + formatting)
├── docker-compose.yml   # Docker services (PostgreSQL, pgAdmin)
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies and scripts
├── playwright.config.ts # Playwright configuration
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── vitest.config.ts     # Vitest configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 22+ ([Download](https://nodejs.org/))
- **pnpm**: 10+ (Install: `npm install -g pnpm`)
- **Docker**: Latest ([Download](https://docker.com))

### Installation

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```
Edit `.env.local` and update the `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

3. **Start the database**:
```bash
pnpm db:init
```

4. **Run migrations**:
```bash
pnpm db:migrate
```

5. **Seed the database** (optional):
```bash
pnpm db:seed
```

6. **Start development server**:
```bash
pnpm dev
# Opens browser automatically at http://localhost:3022

# Or without browser:
pnpm dev:no-browser
```

Visit [http://localhost:3022](http://localhost:3022)

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📜 Available Scripts

### Development
- `pnpm dev` - Start development server on port 3022
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm type-check` - Type check without building

### Code Quality
- `pnpm lint` - Lint and auto-fix with Biome
- `pnpm format` - Format code with Biome

### Testing
- `pnpm test` - Run unit tests (Vitest)
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Generate coverage report
- `pnpm test:e2e` - Run E2E tests (Playwright)
- `pnpm test:e2e:ui` - Run E2E tests with UI

### Database
- `pnpm db:init` - Start PostgreSQL container
- `pnpm db:stop` - Stop all containers
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes (development)
- `pnpm db:seed` - Seed database with test data
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:reset` - Reset database (⚠️ deletes all data)

## 🏗️ Architecture

### App Router Structure
We use Next.js 15 App Router with the following conventions:
- `page.tsx` - Route pages
- `layout.tsx` - Shared layouts
- `loading.tsx` - Loading states
- `error.tsx` - Error boundaries
- `route.ts` - API routes

### Component Organization
- **Base UI Components** (`src/components/ui/`): Reusable, styled components (Button, Card, Badge, etc.)
- **Feature Components** (`src/features/`): Domain-specific components organized by feature
- **Page Components** (`src/app/`): Page-level components and layouts

### State Management
- **Server State**: TanStack Query for data fetching and caching
- **Client State**: Zustand for global client state
- **Form State**: React Hook Form with Zod validation

### Database Schema
See `prisma/schema.prisma` for the complete schema. Key models:
- **User, Account, Session**: Authentication and user management
- **Utility, UserUtility**: Utility management and user preferences
- **AuditLog**: Audit trail for all actions
- **AppConfig**: Application configuration

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Test utilities, hooks, and pure functions
- Mock external dependencies
- Fast execution with hot reload
- Located alongside source files or in `src/test/`

### E2E Tests (Playwright)
- Test critical user flows
- Test across browsers (Chromium, Firefox, WebKit)
- Located in `e2e/` directory

### Coverage Goals
- Utilities: 90%+
- Components: 80%+
- API Routes: 80%+

## 🔒 Security

### Authentication
- NextAuth.js v5 with JWT sessions
- Multiple providers: Credentials, Google, GitHub
- Secure password hashing with bcryptjs
- Session management with Prisma adapter

### Environment Variables
- Never commit `.env.local` or `.key/` directory
- Use strong secrets (32+ characters)
- Rotate keys regularly
- Use different secrets per environment

### Git Hooks
- Pre-commit: Lint staged files with Biome
- Prevents committing code with linting errors

## 🎨 Styling

### Tailwind CSS v4
- Utility-first CSS framework
- Custom design tokens in `globals.css`
- Dark mode support via `next-themes`
- Responsive design with mobile-first approach

### Component Variants
We use `class-variance-authority` for type-safe component variants:
```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: { primary: "...", secondary: "..." },
      size: { sm: "...", md: "..." }
    }
  }
)
```

## 📦 Dependencies

For detailed dependency information and update policies, see:
- [memory-bank/dependencies.md](../memory-bank/dependencies.md)

### Key Dependencies
- **Next.js 15.5.4**: React framework
- **React 19.1.0**: UI library
- **Prisma 6.17.1**: Database ORM
- **NextAuth 5.0.0-beta.29**: Authentication
- **Zustand 5.0.8**: State management
- **Zod 3.25.76**: Schema validation
- **Biome 2.2.0**: Linting & formatting

## 🐳 Docker Services

### PostgreSQL
- Port: 5433 (mapped to container's 5432)
- User: genesis
- Database: genesis_dev
- Volume: Persistent data storage

### pgAdmin (optional)
- Port: 5050
- Access: http://localhost:5050
- Start with: `docker compose --profile tools up -d pgadmin`

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Target: ES2017

### Biome (`biome.json`)
- Replaces ESLint + Prettier
- 10-100x faster linting
- Auto-fix on save
- Organizes imports

### Next.js (`next.config.ts`)
- TypeScript configuration
- Build optimizations
- Environment variables

## 📖 Documentation

### Project Documentation
- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [memory-bank/](../memory-bank/) - Project context and decisions
- [memory-bank/dependencies.md](../memory-bank/dependencies.md) - Dependency tracking
- [memory-bank/progress.md](../memory-bank/progress.md) - Development progress

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3022
lsof -ti:3022 | xargs kill -9
```

### Database Connection Issues
```bash
# Check if database is running
docker ps

# Restart database
pnpm db:stop && pnpm db:init

# Check logs
docker logs genesis-postgres
```

### Prisma Client Errors
```bash
# Regenerate Prisma Client
pnpm db:generate

# Reset and regenerate
rm -rf node_modules/.prisma
pnpm db:generate
```

### Type Errors
```bash
# Clean build
rm -rf .next
pnpm type-check
```

## 🤝 Contributing

### Code Style
- Use TypeScript strict mode
- Follow SOLID principles
- Write TSDoc comments for public APIs
- Keep components small and focused
- Use functional components with hooks

### Git Workflow
1. Create feature branch
2. Make changes
3. Run tests: `pnpm test && pnpm test:e2e`
4. Lint: `pnpm lint`
5. Type check: `pnpm type-check`
6. Commit (pre-commit hooks run automatically)
7. Push and create PR

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details
## Screenshot Automation

This project includes a comprehensive screenshot automation system for agentic workflows, documentation, and testing.

### Quick Start

```bash
# Capture desktop screenshot (both themes)
pnpm screenshot

# Capture all viewports and themes
pnpm screenshot:suite

# Capture specific viewport
pnpm screenshot:mobile
pnpm screenshot:tablet
pnpm screenshot:desktop
```

### Programmatic Usage

```typescript
import { captureScreenshot, VIEWPORTS } from '@/utils/screenshot';

// Capture screenshot programmatically
const results = await captureScreenshot({
  url: 'http://localhost:3022',
  viewport: VIEWPORTS.mobile,
  theme: 'both'
});
```

See [docs/SCREENSHOT-AUTOMATION.md](docs/SCREENSHOT-AUTOMATION.md) for full documentation.

## Available Scripts

### Development
- `pnpm dev` - Start dev server with browser (auto-opens Chrome at http://localhost:3022)
- `pnpm dev:no-browser` - Start dev server only (no browser auto-launch)
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Testing
- `pnpm test` - Run unit tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:ui` - Run E2E tests with UI

### Screenshots
- `pnpm screenshot` - Capture desktop (1920×1080) screenshot in both themes
- `pnpm screenshot:suite` - Capture all viewports and themes (6 screenshots)
- `pnpm screenshot:mobile` - Mobile viewport (375×667)
- `pnpm screenshot:tablet` - Tablet viewport (768×1024)
- `pnpm screenshot:desktop` - Desktop viewport (1920×1080)

### Code Quality
- `pnpm lint` - Lint and fix code with Biome
- `pnpm format` - Format code with Biome
- `pnpm type-check` - Check TypeScript types

### Database
- `pnpm db:init` - Start PostgreSQL container
- `pnpm db:stop` - Stop database
- `pnpm db:migrate` - Run migrations
- `pnpm db:push` - Push schema to database
- `pnpm db:seed` - Seed database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:reset` - Reset database

## Learn More

## 🙏 Acknowledgments

Built with the Genesis 22 template and best practices from:
- Next.js team
- Vercel
- Prisma team
- NextAuth team
- React community

## 📞 Support

- **Documentation**: See [memory-bank/](../memory-bank/)
- **Issues**: Open a GitHub issue
- **Health Check**: Visit `/api/health`

---

**Made with ❤️ using Next.js, TypeScript, and modern web technologies.**
