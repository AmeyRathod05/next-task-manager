'use client';

import React from 'react';

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: 'bg-gradient-to-r from-red-100 to-red-200',
          text: 'text-red-800',
          ring: 'ring-2 ring-red-200',
          icon: '👑',
          label: 'Admin'
        };
      case 'CO_ADMIN':
        return {
          bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
          text: 'text-yellow-800',
          ring: 'ring-2 ring-yellow-200',
          icon: '⭐',
          label: 'Co-Admin'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-green-100 to-green-200',
          text: 'text-green-800',
          ring: 'ring-2 ring-green-200',
          icon: '👤',
          label: 'User'
        };
    }
  };

  const roleConfig = getRoleConfig(user.role);

  return (
    <div className="group animate-fade-in bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200 relative overflow-hidden">
      {/* Gradient Accent Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600"></div>
      
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          {/* Status Indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">
              {user.name || 'No Name'}
            </h3>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-600 text-sm">{user.email}</span>
          </div>

          {/* Role Badge */}
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${roleConfig.bg} ${roleConfig.text} ${roleConfig.ring} transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md`}>
            <span className="mr-1.5 text-sm">{roleConfig.icon}</span>
            {roleConfig.label}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all duration-200 transform hover:scale-110 group">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl transition-all duration-200 transform hover:scale-110 group">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};
