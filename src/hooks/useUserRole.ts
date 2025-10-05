'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase, User, UserRole } from '@/lib/supabase';

export function useUserRole() {
  const { user: clerkUser, isLoaded } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isCreatingUser = useRef(false);

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user exists in database
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', clerkUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (existingUser) {
          setUser(existingUser);
        } else if (!isCreatingUser.current) {
          // Prevent concurrent user creation
          isCreatingUser.current = true;
          
          try {
            // Create new user with default role and points
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                clerk_id: clerkUser.id,
                email: clerkUser.emailAddresses[0].emailAddress,
                first_name: clerkUser.firstName,
                last_name: clerkUser.lastName,
                role: UserRole.MEMBER, // Default role
                points: 0, // Start with 0 points
              })
              .select()
              .single();

            if (insertError) {
              // If it's a duplicate key error, try to fetch the existing user
              if (insertError.code === '23505' && insertError.message.includes('clerk_id')) {
                console.log('Duplicate user detected, fetching existing user...');
                const { data: existingUserAfterInsert, error: fetchErrorAfterInsert } = await supabase
                  .from('users')
                  .select('*')
                  .eq('clerk_id', clerkUser.id)
                  .single();

                if (fetchErrorAfterInsert) {
                  throw fetchErrorAfterInsert;
                }

                setUser(existingUserAfterInsert);
              } else {
                throw insertError;
              }
            } else {
              setUser(newUser);
            }
          } finally {
            isCreatingUser.current = false;
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
        
        let errorMessage = 'An error occurred';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null) {
          // Handle Supabase errors
          const errorObj = err as any;
          if (errorObj.message) {
            errorMessage = errorObj.message;
          } else if (errorObj.error) {
            errorMessage = errorObj.error;
          } else if (errorObj.details) {
            errorMessage = errorObj.details;
          }
        }
        
        setError(`Database connection failed: ${errorMessage}. Please check your database setup.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoaded, clerkUser]);

  const updateUserRole = async (role: UserRole) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const addPoints = async (points: number) => {
    if (!user) return;

    try {
      const newTotalPoints = user.points + points;
      const { data, error } = await supabase
        .from('users')
        .update({ points: newTotalPoints })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setUser(data);
      return data;
    } catch (err) {
      console.error('Error adding points:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  return {
    user,
    loading,
    error,
    updateUserRole,
    addPoints,
    isLoaded,
    clerkUser,
  };
}
