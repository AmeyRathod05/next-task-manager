import React from 'react';

interface PriorityBadgeProps {
  priority: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-600';
    if (priority >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <span className={`text-sm font-medium ${getPriorityColor(priority)}`}>
      P: {priority}
    </span>
  );
};
