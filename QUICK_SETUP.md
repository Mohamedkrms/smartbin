# 🚀 Quick Database Setup Guide

## The Issue
You're getting this error because the database tables don't exist yet:
```
Could not find the table 'public.users' in the schema cache
```

## ✅ Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `prlsgxukwtahbbcrpyar`
3. Click **"SQL Editor"** in the left sidebar

### Step 2: Run the Setup Script
1. Copy the entire contents of `simple-database-setup.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** button

### Step 3: Fix RLS Policies (if needed)
If you get RLS policy errors:
1. Copy the contents of `fix-rls-policies.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** button

### Step 4: Verify Setup
1. Go back to your app dashboard
2. Click **"Test Connection"** - should show success
3. Click **"Setup Database"** - should confirm tables exist
4. Click **"Add Sample Data"** - should insert sample bins

## 📋 What the Script Creates

### Tables:
- ✅ `users` - User profiles and roles
- ✅ `smart_bins` - Bin locations and status  
- ✅ `collections` - Waste collection records

### Security:
- ✅ Row Level Security (RLS) enabled
- ✅ Role-based access policies
- ✅ User can only see their own data
- ✅ Agents/Chefs can manage bins and collections

### Features:
- ✅ Automatic timestamps
- ✅ Data validation
- ✅ Sample data for testing

## 🔧 If You Get Errors

### Error: "relation does not exist"
- **Solution**: Make sure you ran the SQL script in Supabase SQL Editor

### Error: "RLS policy" or "row-level security"
- **Solution**: Run the `fix-rls-policies.sql` script in Supabase SQL Editor

### Error: "permission denied"
- **Solution**: Check your Supabase anon key in `src/lib/supabase.ts`

### Error: "connection failed"
- **Solution**: Verify your Supabase URL and key are correct

## 🎯 After Setup

Once the database is set up:
1. **Sign up** new users (default role: member)
2. **Access admin panel** at `/dashboard/admin` (Chef Municipal only)
3. **Change user roles** in the admin panel
4. **Test role-based access** to different dashboards

## 📞 Need Help?

Check the browser console for detailed error messages, or run the setup steps in order:
1. Test Connection
2. Setup Database  
3. Add Sample Data

The app will guide you through any remaining issues! 🚀
