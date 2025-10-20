# 🎯 Setup Execution Checklist

Copy this checklist and check off items as you complete them.

## ✅ Prerequisites (Should already be done)
- [ ] Node.js 22+ installed
- [ ] pnpm 9+ installed
- [ ] Docker Desktop running
- [ ] Repository cloned

## 📋 Step-by-Step Setup

### 1. Navigate to Web Directory
```bash
cd /projects/incubator/fantastic-system-k22a/web
```
- [ ] Confirmed current directory is `/projects/incubator/fantastic-system-k22a/web`

### 2. Install Dependencies
```bash
pnpm install
```
- [ ] Command completed successfully
- [ ] `node_modules/` directory created
- [ ] No fatal errors in output

**Expected time**: 2-5 minutes  
**Common issues**: Network timeout, disk space

### 3. Configure Environment
```bash
# Copy the example file
cp .env.local.example .env.local

# Generate a secure secret
openssl rand -base64 32

# Edit .env.local and paste the secret
nano .env.local  # or use your preferred editor
```
- [ ] `.env.local` file created
- [ ] `NEXTAUTH_SECRET` updated with generated value (32+ characters)
- [ ] `DATABASE_URL` kept as default for local dev
- [ ] File saved

**Required changes**:
- Replace `your-secret-key-minimum-32-characters-long-change-this` with generated secret

### 4. Start Database
```bash
pnpm db:init
```
- [ ] Docker container `genesis-postgres` started
- [ ] Container shows status "healthy"
- [ ] No connection errors

**Verify**:
```bash
docker ps | grep genesis-postgres
```

### 5. Run Database Migrations
```bash
pnpm db:migrate
```
- [ ] Migration files applied successfully
- [ ] No schema errors
- [ ] Tables created in database

**Expected output**: "Your database is now in sync with your schema"

### 6. Seed Database
```bash
pnpm db:seed
```
- [ ] Seed script completed
- [ ] Admin user created
- [ ] Test user created
- [ ] 5 utilities created
- [ ] Configuration created

**Expected output**: "🎉 Database seeding completed successfully!"

### 7. Generate Prisma Client
```bash
pnpm db:generate
```
- [ ] Prisma client generated successfully
- [ ] Type definitions created

### 8. Validate Setup
```bash
./scripts/validate-setup.sh
```
- [ ] All prerequisite checks passed
- [ ] File structure validated
- [ ] Dependencies confirmed
- [ ] Environment verified
- [ ] Database confirmed healthy
- [ ] Prisma validated

**Expected output**: "🎉 All checks passed! Your system is ready."

### 9. Start Development Server
```bash
pnpm dev
```
- [ ] Server started on http://localhost:3000
- [ ] No compilation errors
- [ ] Ready message displayed

**Expected output**:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

### 10. Verify Application

#### Homepage
- [ ] Open http://localhost:3000 in browser
- [ ] Page loads successfully
- [ ] Header visible with navigation
- [ ] Theme toggle works
- [ ] Sign in button visible

#### Authentication
- [ ] Click "Sign In"
- [ ] Sign in page loads
- [ ] Use credentials: `user@genesis.local` / `user123`
- [ ] Successfully redirected after login
- [ ] User menu appears in header

#### Health Endpoint
- [ ] Visit http://localhost:3000/api/health
- [ ] JSON response received
- [ ] `status: "healthy"`
- [ ] Database check shows "up"

### 11. Run Tests

#### Unit Tests
```bash
pnpm test
```
- [ ] Tests run successfully
- [ ] No failing tests (or expected failures documented)

#### E2E Tests (in new terminal, keep dev server running)
```bash
pnpm test:e2e
```
- [ ] Playwright tests execute
- [ ] Homepage tests pass
- [ ] No critical failures

#### Coverage (optional)
```bash
pnpm test:coverage
```
- [ ] Coverage report generated
- [ ] Coverage meets thresholds (70%)

## 🎉 Completion Checklist

- [ ] All setup steps completed
- [ ] No errors in any step
- [ ] Application running successfully
- [ ] Tests passing
- [ ] Health check green

## 📝 Post-Setup

### Optional: Open Prisma Studio
```bash
pnpm db:studio
```
- [ ] Prisma Studio opens at http://localhost:5555
- [ ] Can browse database tables
- [ ] Can see seeded data

### Optional: Open pgAdmin
```bash
docker compose --profile tools up -d pgadmin
```
- [ ] pgAdmin accessible at http://localhost:5050
- [ ] Can log in (admin@genesis.local / admin_password)
- [ ] Can see genesis_dev database

## 🆘 Troubleshooting

If you encounter issues:

1. **Check validation script output**:
   ```bash
   ./scripts/validate-setup.sh
   ```

2. **View database logs**:
   ```bash
   docker logs genesis-postgres
   ```

3. **Restart database**:
   ```bash
   pnpm db:stop && pnpm db:init
   ```

4. **Clean and reinstall**:
   ```bash
   rm -rf node_modules .next
   pnpm install
   ```

5. **Check documentation**:
   - See `SETUP.md` for detailed troubleshooting
   - Review `memory-bank/reference/quick-reference.md` for commands
   - Check `memory-bank/index.md` for all docs

## 📚 Next Steps

After successful setup:

1. **Explore the codebase**:
   - [ ] Browse `src/lib/` for core utilities
   - [ ] Check `src/app/` for pages and API routes
   - [ ] Review `src/components/` for UI components

2. **Read documentation**:
   - [ ] `README.md` - Complete guide
   - [ ] `memory-bank/systemPatterns.md` - Architecture
   - [ ] `memory-bank/decisions/` - Design decisions

3. **Start developing**:
   - [ ] Create a new utility
   - [ ] Add a new API endpoint
   - [ ] Customize the theme

## 🎓 Training Tasks

### Beginner
- [ ] Modify the homepage text
- [ ] Add a new navigation link
- [ ] Change the theme colors

### Intermediate
- [ ] Create a new API endpoint
- [ ] Add a new database model
- [ ] Implement a new utility

### Advanced
- [ ] Add a new OAuth provider
- [ ] Implement real-time features
- [ ] Create a complex form with validation

---

**Status**: Setup Complete ✅  
**Date**: _____________  
**Time Taken**: _____________  
**Issues Encountered**: _____________

**Notes**:


