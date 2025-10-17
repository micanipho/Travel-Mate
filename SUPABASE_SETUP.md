# Supabase Database Setup Guide

This guide will help you set up and configure Supabase as the database for Travel Mate.

## What Changed?

The project has been migrated from local PostgreSQL to **Supabase** - a cloud-hosted PostgreSQL database with additional features like built-in authentication, real-time subscriptions, and automatic API generation.

### Benefits of Supabase
- ✅ **No Local Installation Required** - No need to install PostgreSQL locally
- ✅ **Cloud-Hosted** - Access your database from anywhere
- ✅ **Automatic Backups** - Built-in backup and recovery
- ✅ **Free Tier Available** - 500MB database, 2GB bandwidth/month
- ✅ **Built-in Dashboard** - Visual interface for managing data
- ✅ **SSL by Default** - Secure connections out of the box

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** and sign up with GitHub, Google, or email
3. Verify your email address

## Step 2: Create a New Project

1. After logging in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `travel-mate` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users (e.g., `us-east-1`, `eu-west-1`, `ap-southeast-1`)
   - **Pricing Plan**: Select "Free" to start
3. Click **"Create new project"**
4. Wait 2-3 minutes for the database to be provisioned

## Step 3: Get Your Connection String

1. In your Supabase project dashboard, click **"Project Settings"** (gear icon)
2. Navigate to **"Database"** in the left sidebar
3. Scroll down to **"Connection string"** section
4. You'll see two types of connection strings:

### Option A: Connection Pooling (Recommended for Serverless)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
- **Port**: 6543
- **Use this for**: Production, serverless functions, connection pooling
- **Advantages**: Better for many concurrent connections

### Option B: Direct Connection
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
- **Port**: 5432
- **Use this for**: Development, direct access, fewer connections
- **Advantages**: Lower latency, simpler setup

**Note**: Replace `[PASSWORD]` with your actual database password and `[YOUR-PASSWORD]` placeholder in the connection string.

## Step 4: Configure Your Application

1. Navigate to the server directory:
```bash
cd server
```

2. Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```

3. Edit `.env` and update the `DATABASE_URL`:
```env
# For Connection Pooling (Recommended)
DATABASE_URL=postgresql://postgres.abcdefghijk:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Or for Direct Connection
DATABASE_URL=postgresql://postgres:your_password@db.abcdefghijk.supabase.co:5432/postgres

# Other required settings
NODE_ENV=development
JWT_SECRET=your_jwt_secret_change_this
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

4. Save the file

## Step 5: Run Database Migrations

Now that your Supabase database is configured, run the migrations to create the required tables:

```bash
# Make sure you're in the server directory
cd server

# Run migrations
npm run db:migrate
```

This will create:
- `users` table
- `monitored_destinations` table
- `alerts` table
- `schema_migrations` table (for tracking migrations)

## Step 6: Seed the Database (Optional)

Add sample data for testing:

```bash
npm run db:seed
```

This adds:
- Sample users
- Sample destinations
- Sample alerts

## Step 7: Verify the Connection

Start your server and test the connection:

```bash
# From the server directory
npm run dev

# Or from the root directory
cd ..
npm run dev:all
```

Check the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-17T...",
  "database": "Connected",
  "version": "1.0.0"
}
```

## Managing Your Database

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click **"Table Editor"** to view and edit data visually
3. Click **"SQL Editor"** to run custom SQL queries

### Using the SQL Editor

You can run queries directly in Supabase:

1. Navigate to **SQL Editor** in the dashboard
2. Click **"New query"**
3. Write your SQL and click **"Run"**

Example queries:
```sql
-- View all users
SELECT * FROM users;

-- Count destinations
SELECT COUNT(*) FROM monitored_destinations;

-- View recent alerts
SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10;
```

### Viewing Logs

1. Go to **"Logs"** in your project dashboard
2. Select **"Postgres Logs"** to see database activity
3. Monitor queries, errors, and performance

## Troubleshooting

### Connection Timeout
**Error**: `connection timeout`

**Solutions**:
- Check your internet connection
- Verify the connection string is correct
- Ensure your IP isn't blocked (Supabase allows all IPs by default)
- Try the direct connection instead of pooler

### Authentication Failed
**Error**: `password authentication failed`

**Solutions**:
- Double-check your database password
- Reset password in Project Settings > Database
- Ensure special characters in password are URL-encoded

### SSL Connection Required
**Error**: `SSL connection required`

**Solution**: The config is already set up for SSL. Make sure `NODE_ENV` is set properly.

### Too Many Connections
**Error**: `too many connections`

**Solutions**:
- Use connection pooling (port 6543)
- Reduce `max` in database config (currently 20)
- Upgrade to a paid Supabase plan for more connections

## Database Scripts Reference

```bash
# Run migrations (create tables)
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Seed database with sample data
npm run db:seed

# Reset database (migrate + seed)
npm run db:reset

# Full setup (same as reset)
npm run db:setup
```

## Production Considerations

### Environment Variables
For production, ensure:
```env
NODE_ENV=production
DATABASE_URL=your_production_connection_string
JWT_SECRET=strong_random_secret
```

### Connection Pooling
Use the pooler connection string (port 6543) for production:
- Better handling of concurrent connections
- Automatic connection management
- Reduced database load

### Security
- Enable Row Level Security (RLS) in Supabase for additional protection
- Use environment variables, never commit credentials
- Rotate database passwords regularly
- Monitor usage in Supabase dashboard

### Backups
Supabase automatically creates daily backups. To restore:
1. Go to **Project Settings** > **Database**
2. Scroll to **"Database backups"**
3. Select a backup and click **"Restore"**

## Migration from Local PostgreSQL

If you have existing data in a local PostgreSQL database:

### Option 1: Export and Import SQL
```bash
# Export from local PostgreSQL
pg_dump -U postgres travel_mate_db > backup.sql

# Import to Supabase (get connection string from dashboard)
psql "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" < backup.sql
```

### Option 2: Use Supabase Migration Tool
1. Use the SQL Editor in Supabase dashboard
2. Paste your SQL dump
3. Click "Run"

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [PostgreSQL in Supabase](https://supabase.com/docs/guides/database/overview)

## Support

If you encounter issues:
1. Check the Supabase [Status Page](https://status.supabase.com/)
2. Visit [Supabase Discord](https://discord.supabase.com/)
3. Search [GitHub Discussions](https://github.com/supabase/supabase/discussions)
4. Contact support in the Supabase dashboard

---

**Next Steps**: Once your database is set up, proceed with [SEEDING_GUIDE.md](./SEEDING_GUIDE.md) for detailed information about sample data.

