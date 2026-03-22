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
  return (
    <div className="flex items-center justify-between p-3 border rounded">
      <div>
        <div className="font-medium text-black">{user.name || user.email}</div>
        <div className="text-sm text-gray-600">{user.email}</div>
        <div className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded mt-1">
          {user.role}
        </div>
      </div>
    </div>
  );
};
