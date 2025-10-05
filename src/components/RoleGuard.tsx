'use client';

import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallbackRoute?: string;
}

export function RoleGuard({ allowedRoles, children, fallbackRoute = '/dashboard' }: RoleGuardProps) {
  const { user, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role)) {
      router.push(fallbackRoute);
    }
  }, [user, loading, allowedRoles, fallbackRoute, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
