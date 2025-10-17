# Migration Guide: Local PostgreSQL to Supabase

This guide helps you migrate your existing Travel Mate application from local PostgreSQL to Supabase.

## Why Migrate to Supabase?

- **No Local Setup Required**: Remove the need for PostgreSQL installation
- **Cloud Access**: Access your database from anywhere
- **Automatic Backups**: Built-in backup and recovery
- **Better Collaboration**: Team members can access the same database
- **Production Ready**: Easy path from development to production

## Pre-Migration Checklist

- [ ] Create a Supabase account
- [ ] Create a new Supabase project
- [ ] Back up your local database
- [ ] Note down your existing data

## Step 1: Backup Your Local Database (Optional)

If you have existing data you want to keep:

```bash
# Export your local database
pg_dump -U postgres -d travel_mate_db > backup_$(date +%Y%m%d).sql

# Or export data only (without schema)
pg_dump -U postgres -d travel_mate_db --data-only > data_backup_$(date +%Y%m%d).sql
```

## Step 2: Set Up Supabase

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md):

1. Create a Supabase account at https://supabase.com
2. Create a new project named `travel-mate`
3. Get your connection string from Project Settings → Database

## Step 3: Update Your Configuration

1. **Update server/.env file**:
```bash
cd server

# Backup your old .env
cp .env .env.local_backup

# Update with Supabase credentials
nano .env
```

2. **Replace database configuration**:
```env
# OLD (Local PostgreSQL)
# DATABASE_URL=postgresql://username:password@localhost:5432/travel_mate_db
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=travel_mate_db

# NEW (Supabase)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Keep these the same
NODE_ENV=development
JWT_SECRET=your_jwt_secret
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## Step 4: Run Migrations on Supabase

```bash
# Make sure you're in the server directory
cd server

# Run migrations to create tables in Supabase
npm run db:migrate

# Verify the tables were created
# You can check in Supabase Dashboard → Table Editor
```

## Step 5: Import Your Data (If Needed)

### Option A: Use Seed Data (Recommended for Development)

```bash
# Seed the database with sample data
npm run db:seed
```

### Option B: Import Your Backup

If you backed up your local data:

**Using Supabase SQL Editor**:
1. Go to your Supabase Dashboard
2. Click "SQL Editor"
3. Click "New query"
4. Paste your backup SQL
5. Click "Run"

**Using psql CLI**:
```bash
# Get your Supabase connection string
# From Dashboard → Project Settings → Database

# Import using psql
psql "your_supabase_connection_string" < backup_20250101.sql

# Or import data only
psql "your_supabase_connection_string" < data_backup_20250101.sql
```

### Option C: Manual Data Import

For small datasets, use the Supabase Table Editor:
1. Go to Table Editor in Supabase Dashboard
2. Select a table (users, alerts, destinations)
3. Click "Insert row" to add data manually
4. Or use "Import data from CSV"

## Step 6: Test the Connection

```bash
# Start the server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:3000/api/health
```

Expected output:
```json
{
  "status": "OK",
  "timestamp": "2025-10-17T...",
  "database": "Connected",
  "version": "1.0.0"
}
```

## Step 7: Test Your Application

```bash
# Start the full application
cd ..
npm run dev:all
```

Visit http://localhost:5173 and test:
- [ ] Login with existing credentials
- [ ] View your destinations
- [ ] Check alerts
- [ ] Update your profile

## Step 8: Clean Up (Optional)

Once everything works with Supabase:

```bash
# Stop your local PostgreSQL service (if you want)
# Ubuntu/Debian:
sudo systemctl stop postgresql

# macOS with Homebrew:
brew services stop postgresql@16

# You can uninstall PostgreSQL if no longer needed
# But keep it if other projects use it
```

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Supabase
**Solution**:
```bash
# Verify your connection string
echo $DATABASE_URL

# Test connection with psql
psql "your_connection_string" -c "SELECT version();"

# Check server logs
npm run dev
# Look for "Supabase PostgreSQL connected successfully"
```

### SSL Errors

**Problem**: SSL connection errors
**Solution**: The config already handles SSL for production. Ensure `NODE_ENV` is set correctly.

### Migration Errors

**Problem**: "Table already exists" errors
**Solution**:
```bash
# Check existing tables in Supabase SQL Editor
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

# If needed, drop tables and re-run migrations
# WARNING: This deletes all data
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS monitored_destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS schema_migrations CASCADE;

# Then run migrations again
npm run db:migrate
```

### Data Import Issues

**Problem**: Foreign key constraint violations
**Solution**: Import tables in the correct order:
1. First: `users` (no dependencies)
2. Then: `monitored_destinations` (depends on users)
3. Then: `alerts` (depends on users)

## Comparison: Before vs After

### Before (Local PostgreSQL)
```bash
# Setup required
sudo apt install postgresql
createdb travel_mate_db
# Configure pg_hba.conf
# Set up users and permissions

# Each developer needs to:
- Install PostgreSQL locally
- Create their own database
- Manage their own backups
```

### After (Supabase)
```bash
# Setup required
# 1. Create Supabase account (once)
# 2. Get connection string
# 3. Add to .env

# Each developer needs to:
- Get the connection string
- That's it!
```

## Rolling Back (If Needed)

If you need to go back to local PostgreSQL:

```bash
# Restore your .env backup
cd server
cp .env.local_backup .env

# Restore your database backup
createdb travel_mate_db
psql -U postgres -d travel_mate_db < backup_20250101.sql

# Start the server
npm run dev
```

## Production Deployment

When deploying to production:

1. **Use Connection Pooling**:
   ```
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   Note the port `6543` for pooled connections.

2. **Set Environment**:
   ```env
   NODE_ENV=production
   ```

3. **Secure Your Secrets**:
   - Never commit .env files
   - Use environment variables in your hosting platform
   - Rotate passwords regularly

4. **Enable Row Level Security** (Optional but recommended):
   In Supabase SQL Editor:
   ```sql
   -- Enable RLS on tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE monitored_destinations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
   ```

## Next Steps

- ✅ Set up automated backups in Supabase (already enabled by default)
- ✅ Configure team access in Supabase Dashboard → Settings → Team
- ✅ Monitor database usage in Supabase Dashboard → Reports
- ✅ Set up alerts for database limits (free tier: 500MB)

## Additional Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Detailed setup instructions
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Migration Guide](https://supabase.com/docs/guides/database/migrating-to-supabase)

## Support

If you encounter issues during migration:
1. Check the [Troubleshooting](#troubleshooting) section above
2. Review [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Check Supabase [Status Page](https://status.supabase.com/)
4. Open an issue on GitHub

---

**Happy migrating!** 🚀

