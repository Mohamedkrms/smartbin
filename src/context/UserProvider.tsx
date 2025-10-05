'use client'

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { User } from '@/lib/supabase';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (!clerkUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const syncAndFetchUser = async () => {
      try {
        setLoading(true);
        const syncResponse = await fetch('/api/user/sync', { method: 'POST' });
        if (!syncResponse.ok) throw new Error('Failed to sync user');

        const profileResponse = await fetch('/api/user/profile');
        if (!profileResponse.ok) throw new Error('Failed to fetch user profile');

        const userData = await profileResponse.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    syncAndFetchUser();
  }, [clerkUser, clerkLoaded]);

  const value = { user, loading, error };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
