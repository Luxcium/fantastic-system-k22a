# 🚀 Genesis Utilities - Complete Setup Guide

This guide will walk you through setting up the complete Genesis Utilities foundation system from scratch.

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 22+** - [Download here](https://nodejs.org/)
- **pnpm 9+** - Install with: `npm install -g pnpm`
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

Verify installations:
```bash
node --version    # Should show v22.x.x or higher
pnpm --version    # Should show 9.x.x or higher
docker --version  # Should show Docker version info
git --version     # Should show Git version info
```

## 📥 Step 1: Clone and Navigate

```bash
cd /projects/incubator/fantastic-system-k22a/web
```

## 📦 Step 2: Install Dependencies

```bash
pnpm install
```

This will install all necessary packages including:
- Next.js 15 and React 19
- Prisma ORM and PostgreSQL client
- NextAuth v5 for authentication
- Zustand for state management
- Testing libraries (Vitest, Playwright)
- And many more...

**Expected time**: 2-5 minutes depending on your internet speed

## 🗄️ Step 3: Setup Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update the following **required** fields:

```env
# Database - Keep default for local development
DATABASE_URL="postgresql://genesis:dev_password_change_in_production@localhost:5432/genesis_dev"

# NextAuth - IMPORTANT: Generate a secure secret!
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters-long-change-this"
AUTH_TRUST_HOST=true
```

### Generate a secure NEXTAUTH_SECRET:
```bash
# Option 1: Using openssl (recommended)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the generated string and replace the `NEXTAUTH_SECRET` value.

### Optional: OAuth Configuration

If you want to enable Google or GitHub authentication, add your OAuth credentials:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

[How to get Google OAuth credentials](https://support.google.com/cloud/answer/6158849)  
[How to get GitHub OAuth credentials](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)

## 🐳 Step 4: Start the Database

```bash
pnpm db:init
```

This command:
- Starts PostgreSQL 16 in a Docker container
- Creates the `genesis_dev` database
- Configures health checks
- Sets up volume persistence

**Verify the database is running:**
```bash
docker ps
```

You should see a container named `genesis-postgres` with status "healthy".

**Optional: Start pgAdmin** (database management UI):
```bash
docker compose --profile tools up -d pgadmin
```

Access pgAdmin at [http://localhost:5050](http://localhost:5050)
- Email: `admin@genesis.local`
- Password: `admin_password`

## 📊 Step 5: Run Database Migrations

```bash
pnpm db:migrate
```

This creates all the database tables:
- users, accounts, sessions, passwords
- verification_tokens
- utilities, user_utilities, utility_usage_logs
- audit_logs
- app_config

**Expected output**: You should see migration files being applied successfully.

## 🌱 Step 6: Seed the Database

```bash
pnpm db:seed
```

This populates the database with:
- **Admin user**: admin@genesis.local / admin123
- **Test user**: user@genesis.local / user123
- **5 sample utilities**: JSON Formatter, Text Diff, URL Encoder, Base64 Converter, Hash Generator
- **App configuration**: Feature flags and settings

**Expected output**: You should see "🎉 Database seeding completed successfully!"

## 🎨 Step 7: Generate Prisma Client

```bash
pnpm db:generate
```

This generates the type-safe Prisma client based on your schema.

## 🚀 Step 8: Start the Development Server

```bash
pnpm dev
```

The application should start on [http://localhost:3000](http://localhost:3000)

**Expected output**:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

## ✅ Step 9: Verify the Installation

### Check the Homepage
Visit [http://localhost:3000](http://localhost:3000)
- You should see the Genesis Utilities homepage
- Header with navigation
- Theme toggle button
- Sign in/Sign up buttons

### Test Authentication
1. Click "Sign In"
2. Use test credentials:
   - Email: `user@genesis.local`
   - Password: `user123`
3. You should be redirected to the dashboard

### Check the Health Endpoint
Visit [http://localhost:3000/api/health](http://localhost:3000/api/health)

You should see:
```json
{
  "status": "healthy",
  "timestamp": "...",
  "uptime": 123,
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "up",
      "responseTime": 5,
      "info": { ... }
    },
    "memory": { ... },
    "environment": { ... }
  }
}
```

## 🧪 Step 10: Run Tests

### Unit Tests
```bash
pnpm test
```

### E2E Tests (requires the dev server to be running)
```bash
# In a new terminal
pnpm test:e2e
```

### Coverage Report
```bash
pnpm test:coverage
```

## 🎉 You're All Set!

The Genesis Utilities foundation is now fully set up and running.

## 📚 Next Steps

1. **Explore the codebase**: Check out `/src/lib`, `/src/app`, `/src/components`
2. **Read the documentation**: See `README.md` and `memory-bank/` folder
3. **Create your first utility**: Follow the patterns in the navigation registry
4. **Customize the theme**: Edit `src/app/globals.css`
5. **Add new features**: Follow the layered architecture pattern

## 🛠️ Common Commands Reference

### Development
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production build
pnpm lint         # Run linter
pnpm format       # Format code
pnpm type-check   # Type check without building
```

### Database
```bash
pnpm db:init      # Start database
pnpm db:stop      # Stop database
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database
pnpm db:studio    # Open Prisma Studio GUI
pnpm db:reset     # Reset database (⚠️ deletes all data)
```

### Testing
```bash
pnpm test              # Run unit tests
pnpm test:ui           # Run tests with UI
pnpm test:coverage     # Generate coverage report
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Run E2E tests with Playwright UI
```

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 pnpm dev
```

### Port 5432 already in use (PostgreSQL)
```bash
# Stop any existing PostgreSQL services
sudo systemctl stop postgresql

# Or change the port in docker-compose.yml
```

### Docker permission denied
```bash
# Add your user to the docker group
sudo usermod -aG docker $USER

# Log out and log back in
```

### Database connection errors
```bash
# Check if database is running
docker ps

# Restart database
pnpm db:stop && pnpm db:init

# Check logs
docker logs genesis-postgres
```

### Prisma Client not generated
```bash
# Generate Prisma Client manually
pnpm db:generate

# Or reinstall dependencies
rm -rf node_modules
pnpm install
```

### Build errors
```bash
# Clean build cache
rm -rf .next

# Clean and reinstall
rm -rf node_modules .next
pnpm install
```

### Test failures
```bash
# Clear test cache
pnpm test --clearCache

# Run specific test file
pnpm test src/lib/utils.test.ts
```

## 📞 Getting Help

- **Documentation**: Check `/memory-bank` folder
- **Decisions**: See `/memory-bank/decisions`
- **Issues**: Check GitHub issues
- **Health Check**: Visit `/api/health`

## 🔐 Security Reminders

Before deploying to production:

1. ✅ Change all default passwords
2. ✅ Generate strong NEXTAUTH_SECRET
3. ✅ Use environment-specific .env files
4. ✅ Enable HTTPS
5. ✅ Configure OAuth redirect URIs
6. ✅ Review security headers in middleware
7. ✅ Enable rate limiting
8. ✅ Review Prisma migrations
9. ✅ Setup database backups
10. ✅ Configure monitoring/alerting

---

**Congratulations! You've successfully set up the Genesis Utilities foundation system! 🎊**
