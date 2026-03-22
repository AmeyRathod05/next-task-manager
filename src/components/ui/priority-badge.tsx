import React from 'react';

interface PriorityBadgeProps {
  priority: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = (priority: number) => {
    if (priority >= 4) {
      return {
        bg: 'bg-gradient-to-r from-red-100 to-red-200',
        text: 'text-red-800',
        ring: 'ring-2 ring-red-200',
        icon: '🔥',
        label: 'High'
      };
    }
    if (priority >= 3) {
      return {
        bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
        text: 'text-yellow-800',
        ring: 'ring-2 ring-yellow-200',
        icon: '⚡',
        label: 'Medium'
      };
    }
    return {
      bg: 'bg-gradient-to-r from-green-100 to-green-200',
      text: 'text-green-800',
      ring: 'ring-2 ring-green-200',
      icon: '🌱',
      label: 'Low'
    };
  };

  const config = getPriorityConfig(priority);

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text} ${config.ring} transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md`}>
      <span className="mr-1.5 text-sm">{config.icon}</span>
      <span className="font-mono">{priority}</span>
      <span className="ml-1">{config.label}</span>
    </div>
  );
};
