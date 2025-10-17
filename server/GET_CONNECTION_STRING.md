# How to Get Your Correct Supabase Connection String

Follow these steps to get the correct connection string:

## Step 1: Go to Supabase Dashboard

1. Open https://supabase.com and log in
2. Select your `travel-mate` project (or whatever you named it)

## Step 2: Navigate to Database Settings

1. Click the **Settings** icon (gear) in the left sidebar
2. Click **Database** in the settings menu

## Step 3: Get Connection String

Scroll down to the **Connection string** section. You'll see two tabs:

### Option A: Connection Pooling (Recommended)
Click on "Connection pooling" tab and you'll see:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Copy this entire string** and:
1. Replace `[YOUR-PASSWORD]` with your actual database password
2. Encode special characters in the password:
   - If your password is: `Micasa@078Micasa@078`
   - It becomes: `Micasa%40078Micasa%40078`
   - The `@` symbol becomes `%40`

### Option B: Direct Connection (Alternative)
If pooling doesn't work, try the "Direct connection" tab:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Step 4: Verify Your Password

**IMPORTANT**: Your actual database password (not the one shown with `[YOUR-PASSWORD]` placeholder)

To reset your password if you forgot it:
1. In Database settings, scroll to **Database password**
2. Click **Reset database password**
3. Copy the new password
4. Use this password in your connection string

## Step 5: Update Your .env File

Replace the DATABASE_URL in your `server/.env` file with the complete connection string.

Example (with connection pooling):
```env
DATABASE_URL=postgresql://postgres.zencwhusyyjsqjnvwpxu:YourActualPassword%40Here@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Step 6: Test the Connection

Run:
```bash
cd server
node test-connection.js
```

If you see ✅ Connection successful, you're good to go!

## Common Issues

### Issue 1: Wrong Password
- Make sure you're using the **database password**, not your account password
- They are different!

### Issue 2: Special Characters Not Encoded
- `@` must be `%40`
- `:` must be `%3A`
- `/` must be `%2F`
- Space must be `%20`

### Issue 3: Wrong Username Format
- For **pooled** connection: username is `postgres.PROJECT_REF`
- For **direct** connection: username is just `postgres`

### Issue 4: Copy-Paste Errors
- Make sure you didn't copy the square brackets `[` and `]`
- They are just placeholders showing what to replace

## Need Help?

If you're still having issues, please:
1. Double-check you're using the database password (not account password)
2. Try resetting your database password in Supabase dashboard
3. Make sure you copied the entire connection string
4. Verify there are no extra spaces or line breaks

Once you have the correct connection string, update your `.env` file and run:
```bash
npm run db:migrate
```

