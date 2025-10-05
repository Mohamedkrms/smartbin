'use client';

import { UserRole } from '@/lib/supabase';

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function UserRoleBadge({ role, className = '' }: UserRoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case UserRole.MEMBER:
        return {
          label: 'Member',
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          textColor: 'text-blue-800 dark:text-blue-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        };
      case UserRole.AGENT_MUNICIPAL:
        return {
          label: 'Agent Municipal',
          bgColor: 'bg-green-100 dark:bg-green-900',
          textColor: 'text-green-800 dark:text-green-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case UserRole.CHEF_MUNICIPAL:
        return {
          label: 'Chef Municipal',
          bgColor: 'bg-purple-100 dark:bg-purple-900',
          textColor: 'text-purple-800 dark:text-purple-200',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default:
        return {
          label: 'Unknown',
          bgColor: 'bg-gray-100 dark:bg-gray-900',
          textColor: 'text-gray-800 dark:text-gray-200',
          icon: null
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${config.bgColor} ${config.textColor} ${className}`}>
      {config.icon && <span className="mr-1 hidden sm:inline">{config.icon}</span>}
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">
        {role === UserRole.MEMBER && '👤'}
        {role === UserRole.AGENT_MUNICIPAL && '🚛'}
        {role === UserRole.CHEF_MUNICIPAL && '👑'}
      </span>
    </span>
  );
}
