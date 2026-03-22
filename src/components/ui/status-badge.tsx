import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'TODO': 
        return {
          bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
          text: 'text-gray-800',
          ring: 'ring-2 ring-gray-200',
          icon: '⏸️',
          label: 'To Do'
        };
      case 'IN_PROGRESS': 
        return {
          bg: 'bg-gradient-to-r from-blue-100 to-blue-200',
          text: 'text-blue-800',
          ring: 'ring-2 ring-blue-200',
          icon: '🔄',
          label: 'In Progress'
        };
      case 'DONE': 
        return {
          bg: 'bg-gradient-to-r from-green-100 to-green-200',
          text: 'text-green-800',
          ring: 'ring-2 ring-green-200',
          icon: '✅',
          label: 'Completed'
        };
      default: 
        return {
          bg: 'bg-gradient-to-r from-gray-100 to-gray-200',
          text: 'text-gray-800',
          ring: 'ring-2 ring-gray-200',
          icon: '📋',
          label: status.replace('_', ' ')
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text} ${config.ring} transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md`}>
      <span className="mr-1.5 text-sm">{config.icon}</span>
      {config.label}
    </div>
  );
};
