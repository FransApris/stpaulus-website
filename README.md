# St. Paulus CMS - Parish Management System

A comprehensive Content Management System built with Nuxt 3 for parish administration and community engagement.

## �️ Platform Support

✅ **Windows 10/11** | ✅ **macOS** | ✅ **Linux**

- **Windows Users:** See **[WINDOWS_QUICK_START.md](./WINDOWS_QUICK_START.md)** for setup guide
- **Detailed Windows Setup:** See **[WINDOWS_SETUP_GUIDE.md](./WINDOWS_SETUP_GUIDE.md)**

## �📚 Documentation

### Database Documentation
For complete database setup, upgrade, and maintenance guides:
- 📖 **[DATABASE_README.md](./DATABASE_README.md)** - Documentation index
- 🚀 **[QUICK_START_DATABASE.md](./QUICK_START_DATABASE.md)** - Quick reference
- 🔄 **[MYSQL_UPGRADE_MIGRATION_GUIDE.md](./MYSQL_UPGRADE_MIGRATION_GUIDE.md)** - Upgrade guide
- 📊 **[DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)** - Complete schema
- 💾 **[DATABASE_BACKUP_DOCUMENTATION.md](./DATABASE_BACKUP_DOCUMENTATION.md)** - Backup system

### Quick Database Commands
```bash
# Cross-platform (works on all OS)
npm run db:test      # Test database connection
npm run db:migrate   # Run database migrations
npm run db:backup    # Create database backup
npm run db:info      # Show database information

# macOS/Linux only
npm run mysql:start  # Start MySQL server
npm run mysql:stop   # Stop MySQL server
npm run mysql:status # Check MySQL status

# Windows only
npm run mysql:start:win   # Start MySQL server
npm run mysql:stop:win    # Stop MySQL server
npm run mysql:status:win  # Check MySQL status
npm run mysql:restart:win # Restart MySQL server
```

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

⚠️ **IMPORTANT**: MySQL server must be running before starting dev server!

### Quick Start (Recommended):

**macOS/Linux:**
```bash
npm run dev:auto
```

**Windows:**
```powershell
npm run dev:auto:win
```

### Manual Start:

**macOS/Linux:**
```bash
# 1. Start MySQL first
npm run mysql:start

# 2. Then start dev server
npm run dev
```

**Windows:**
```powershell
# 1. Start MySQL first
npm run mysql:start:win
# Or: net start MySQL80

# 2. Then start dev server
npm run dev
```

### MySQL Management:

**macOS/Linux:**
```bash
npm run mysql:status  # Check status
npm run mysql:stop    # Stop MySQL
```

**Windows:**
```powershell
npm run mysql:status:win   # Check status
npm run mysql:stop:win     # Stop MySQL
npm run mysql:restart:win  # Restart MySQL
```

> 📖 **Platform-specific guides:**
> - Windows: [WINDOWS_QUICK_START.md](./WINDOWS_QUICK_START.md)
> - macOS/Linux: [MYSQL_AUTO_START_GUIDE.md](./MYSQL_AUTO_START_GUIDE.md)

Server will be available at `http://localhost:3000` (or 3001 if 3000 is busy)

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
