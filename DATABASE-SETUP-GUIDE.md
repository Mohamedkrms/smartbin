# Database Setup Guide for Smart Bin

This guide will help you set up the Supabase database with proper policies and verify the connection.

## 🔧 Step 1: Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
# Get these from your Clerk dashboard: https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase Database
# Get these from your Supabase project settings: https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database URL for Prisma
# Use the connection string from your Supabase project settings
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Tables
Run the `supabase-setup.sql` script in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Click "Run"

### 2.2 Apply Security Policies
Run the `supabase-policies.sql` script:

1. Copy and paste the contents of `supabase-policies.sql`
2. Click "Run"

This will create:
- Row Level Security (RLS) policies
- Security functions
- Audit logging
- Performance indexes

## 🧪 Step 3: Test Database Connection

### 3.1 Install Dependencies
```bash
npm install dotenv
```

### 3.2 Run Connection Test
```bash
node test-database-connection.js
```

This will test:
- Environment variables
- Supabase connection
- Table accessibility
- Prisma connection

### 3.3 Verify Setup
Run the `verify-database-setup.sql` script in Supabase SQL Editor to check:
- Tables exist
- RLS is enabled
- Policies are created
- Functions are working

## 👥 Step 4: Create Test Users (Optional)

### 4.1 Create Users in Clerk
1. Go to your Clerk dashboard
2. Create test users with these emails:
   - `chef.municipal@test.com`
   - `agent.municipal@test.com`
   - `member@test.com`

### 4.2 Get Clerk User IDs
1. Copy the user IDs from Clerk dashboard
2. Update the `create-test-users.sql` script with actual IDs
3. Run the script in Supabase SQL Editor

## 🔐 Step 5: Database Policies Overview

### Row Level Security (RLS) Policies

#### Municipalities Table
- **Public Read**: Everyone can view municipalities
- **Authenticated Write**: Only authenticated users can modify

#### Users Table
- **Self Access**: Users can view/update their own data
- **Agent Municipal**: Can view/update users in their municipality
- **Chef Municipal**: Can view/update all users
- **Role Protection**: Agents cannot change user roles

#### User Role Transfers Table
- **Chef Only**: Only Chef Municipal can view/create transfers
- **Audit Trail**: All transfers are logged

### Security Functions
- `is_chef_municipal()`: Check if user is Chef Municipal
- `is_agent_municipal()`: Check if user is Agent Municipal
- `get_user_municipality_id()`: Get user's municipality ID
- `audit_trigger_function()`: Log all changes

## 🚀 Step 6: Test the System

### 6.1 Start the Application
```bash
npm run dev
```

### 6.2 Test User Flows
1. **Sign Up**: Create a new user (gets Member role)
2. **Sign In**: Login with existing users
3. **Role Access**: Verify role-specific dashboards
4. **Role Transfer**: Test Chef Municipal transferring roles
5. **Municipality Assignment**: Test assigning municipalities

### 6.3 Verify Security
- Try accessing other users' data
- Test role-based API access
- Check audit logs

## 🔍 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Found
```
❌ Missing environment variable: NEXT_PUBLIC_SUPABASE_URL
```
**Solution**: Create `.env.local` file with proper values

#### 2. Database Connection Failed
```
❌ Basic connection failed: Invalid API key
```
**Solution**: Check your Supabase URL and API key

#### 3. Tables Don't Exist
```
❌ Table 'users' does not exist
```
**Solution**: Run the `supabase-setup.sql` script

#### 4. RLS Policies Not Working
```
❌ Cannot access users table
```
**Solution**: Run the `supabase-policies.sql` script

#### 5. Prisma Connection Issues
```
❌ Prisma connection failed
```
**Solution**: Check DATABASE_URL format and credentials

### Debug Steps

1. **Check Environment Variables**:
   ```bash
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

2. **Test Supabase Connection**:
   ```bash
   node test-database-connection.js
   ```

3. **Verify Database Setup**:
   Run `verify-database-setup.sql` in Supabase

4. **Check Prisma Schema**:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```

## 📊 Database Schema

### Tables
- `municipalities`: Municipal data
- `users`: User profiles and roles
- `user_role_transfers`: Role change audit trail
- `audit_log`: System change logs

### Key Features
- **UUID Primary Keys**: Secure, non-sequential IDs
- **Timestamps**: Created/updated tracking
- **Foreign Keys**: Data integrity
- **Indexes**: Query performance
- **RLS**: Row-level security
- **Audit Trail**: Change tracking

## 🎯 Next Steps

After successful setup:
1. Customize municipalities for your region
2. Set up Clerk webhooks for user sync
3. Configure email templates
4. Set up monitoring and alerts
5. Plan user onboarding flow

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all environment variables
3. Test database connection
4. Check Supabase logs
5. Review Clerk dashboard settings

The system is designed to be secure, scalable, and maintainable. Follow this guide step by step for the best results.
