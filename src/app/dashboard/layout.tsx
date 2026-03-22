'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname === '/dashboard/tasks') return 'tasks';
    if (pathname === '/dashboard/users') return 'users';
    return 'dashboard';
  };

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'CO_ADMIN';

  const navigation = [
    {
      id: 'tasks',
      label: 'Tasks',
      href: '/dashboard/tasks',
      icon: 'tasks'
    },
    {
      id: 'users',
      label: 'Users',
      href: '/dashboard/users',
      icon: 'users'
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'tasks':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v2a2 2 0 002 2h6a2 2 0 002 2V7a2 2 0 00-2-2z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 00-4-4v8a4 4 0 004-4H6a4 4 0 00-4-4v8a4 4 0 004-4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-black">Dashboard</h1>
              <span className="text-sm text-black">
                Welcome, {session.user?.name || session.user?.email}
                {session.user?.role === 'ADMIN' && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ADMIN</span>}
                {session.user?.role === 'CO_ADMIN' && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">CO-ADMIN</span>}
              </span>
              <Button
                onClick={() => signOut()}
                variant="danger"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-0 sm:px-6 lg:px-8 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h2>
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = getActiveTab() === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                      transition-colors duration-150
                    `}
                  >
                    {getIcon(item.icon)}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
