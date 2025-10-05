# Smart Bin - Role-Based Authentication Setup

## Quick Setup Guide

### 1. Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Update `src/lib/supabase.ts` with your actual credentials:

```typescript
const supabaseUrl = 'https://your-actual-project-id.supabase.co'
const supabaseKey = 'your-actual-anon-key-here'
```

4. Run the SQL schema from `database-schema.sql` in your Supabase SQL editor

### 2. Authentication Setup (Clerk)

1. Keep your existing Clerk setup in `.env.local`
2. The app will automatically create users in the database when they sign up
3. Default role is "member" - change it in the admin panel

### 3. User Roles

The system has 3 user roles:

- **Member**: Basic user, can view nearby bins and report issues
- **Agent Municipal**: Can manage collections and monitor bin status
- **Chef Municipal**: Full admin access, can manage users and system settings

### 4. How to Change User Roles

1. Sign up as a user (default role: member)
2. A Chef Municipal can access `/dashboard/admin` to change user roles
3. Or manually update the role in the Supabase database

### 5. Dashboard Access

- **Main Dashboard**: `/dashboard` - Shows user role and quick actions
- **Member Dashboard**: `/dashboard/member` - Only accessible to members
- **Agent Dashboard**: `/dashboard/agent-municipal` - Only accessible to agents
- **Chef Dashboard**: `/dashboard/chef-municipal` - Only accessible to chefs
- **Admin Panel**: `/dashboard/admin` - Only accessible to chefs, for role management

### 6. Features

✅ **Role-based access control** - Users can only access their appropriate dashboards
✅ **Automatic user creation** - New Clerk users are automatically added to database
✅ **Role badges** - Visual indicators of user roles throughout the app
✅ **Admin panel** - Easy role management interface
✅ **Database integration** - Full CRUD operations with Supabase
✅ **Security** - Row Level Security (RLS) policies in place

### 7. Database Schema

- **users**: Stores user information and roles
- **smart_bins**: Stores bin locations and status
- **collections**: Tracks waste collection activities

### 8. Next Steps

1. Update the Supabase connection details in `src/lib/supabase.ts`
2. Run the database schema
3. Test the role system by creating users and changing their roles
4. Customize the dashboards for your specific needs

The system is now ready to use with role-based authentication! 🎉
