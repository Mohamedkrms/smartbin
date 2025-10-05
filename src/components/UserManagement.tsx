'use client';

import { useState, useEffect } from 'react';
import { supabase, UserRole } from '@/lib/supabase';
import { UserRoleBadge } from './UserRoleBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ChevronDown, Users, Search, Plus, UserPlus } from 'lucide-react';

interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: UserRole;
  points: number;
  created_at: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newUser, setNewUser] = useState({
    email: '',
    role: UserRole.AGENT_MUNICIPAL
  });
  const [roleChangeAlert, setRoleChangeAlert] = useState<{
    open: boolean;
    userId: string;
    userName: string;
    currentRole: UserRole;
    newRole: UserRole;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChangeRequest = (userId: string, newRole: UserRole) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setRoleChangeAlert({
        open: true,
        userId,
        userName: user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}` 
          : user.email,
        currentRole: user.role,
        newRole
      });
    }
  };

  const confirmRoleChange = async () => {
    if (!roleChangeAlert) return;

    try {
      setUpdatingUser(roleChangeAlert.userId);
      const { error } = await supabase
        .from('users')
        .update({ role: roleChangeAlert.newRole })
        .eq('id', roleChangeAlert.userId);

      if (error) {
        throw error;
      }

      // Update local state
      const updatedUsers = users.map(user => 
        user.id === roleChangeAlert.userId ? { ...user, role: roleChangeAlert.newRole } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      
      // Close alert
      setRoleChangeAlert(null);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setUpdatingUser(null);
    }
  };

  const addNewUser = async () => {
    try {
      if (!newUser.email.trim()) {
        setError('Email is required');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{
          clerk_id: `temp_${Date.now()}`, // Temporary ID for manual users
          email: newUser.email,
          first_name: null,
          last_name: null,
          role: newUser.role,
          points: 0
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const updatedUsers = [...users, data];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      // Reset form
      setNewUser({
        email: '',
        role: UserRole.AGENT_MUNICIPAL
      });
      setError(null);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  const getAvailableRoles = (currentRole: UserRole) => {
    // Allow changing to any role except the current one
    const allRoles = [UserRole.MEMBER, UserRole.AGENT_MUNICIPAL, UserRole.CHEF_MUNICIPAL];
    return allRoles.filter(role => role !== currentRole);
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.MEMBER:
        return 'Member';
      case UserRole.AGENT_MUNICIPAL:
        return 'Agent Municipal';
      case UserRole.CHEF_MUNICIPAL:
        return 'Chef Municipal';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={fetchUsers}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          User Management
        </h3>
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                <UserPlus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system. Fill in the required information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right text-sm font-medium">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right text-sm font-medium">
                    Role
                  </label>
                   <select
                     id="role"
                     value={newUser.role}
                     onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                     className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                   >
                     <option value={UserRole.AGENT_MUNICIPAL}>Agent Municipal</option>
                     <option value={UserRole.CHEF_MUNICIPAL}>Chef Municipal</option>
                   </select>
                </div>
              </div>
              <DialogFooter>
                <button
                  onClick={addNewUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Add User
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <button 
            onClick={fetchUsers}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>


      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Current Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Points</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user.email
                      }
                    </p>
                    {user.first_name && user.last_name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {user.email}
                </td>
                <td className="py-3 px-4">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                  {user.points || 0}
                </td>
                <td className="py-3 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        disabled={updatingUser === user.id}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Users className="w-4 h-4" />
                        <span>{updatingUser === user.id ? 'Updating...' : 'Change Role'}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleRoleChangeRequest(user.id, UserRole.MEMBER)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <UserRoleBadge role={UserRole.MEMBER} />
                          <span className="text-sm">Make Member</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChangeRequest(user.id, UserRole.AGENT_MUNICIPAL)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <UserRoleBadge role={UserRole.AGENT_MUNICIPAL} />
                          <span className="text-sm">Make Agent</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleChangeRequest(user.id, UserRole.CHEF_MUNICIPAL)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <UserRoleBadge role={UserRole.CHEF_MUNICIPAL} />
                          <span className="text-sm">Make Chef</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No users found matching your search' : 'No users found'}
          </p>
        </div>
      )}

      {/* Role Change Confirmation Alert */}
      {roleChangeAlert && (
        <AlertDialog open={roleChangeAlert.open} onOpenChange={() => setRoleChangeAlert(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change the role of <strong>{roleChangeAlert.userName}</strong> from{' '}
                <strong>{getRoleDisplayName(roleChangeAlert.currentRole)}</strong> to{' '}
                <strong>{getRoleDisplayName(roleChangeAlert.newRole)}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRoleChange}>
                {updatingUser === roleChangeAlert.userId ? 'Updating...' : 'Confirm Change'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
