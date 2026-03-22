'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { StatusBadge } from '../ui/status-badge';
import { PriorityBadge } from '../ui/priority-badge';
import { AISummary } from './ai-summary';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  dueDate: string;
  createdAt: string;
  userId: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name?: string;
    email: string;
  };
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  loading?: boolean;
  currentUserRole?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  loading = false,
  currentUserRole = 'USER'
}) => {
  const [showAISummary, setShowAISummary] = useState(false);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-black">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1">{task.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-2">
        Created: {new Date(task.createdAt).toLocaleDateString()}
        {task.dueDate && ` • Due: ${new Date(task.dueDate).toLocaleDateString()}`}
      </div>

      {task.user && (
        <div className="text-sm text-gray-700 mb-2">
          Created by: {task.user.name || task.user.email}
        </div>
      )}

      {task.assignedTo && (
        <div className="text-sm text-blue-600 mb-2">
          Assigned to: {task.assignedTo.name || task.assignedTo.email}
        </div>
      )}

      {!task.assignedTo && (currentUserRole === 'ADMIN' || currentUserRole === 'CO_ADMIN') && (
        <div className="text-sm text-gray-500 mb-2 italic">
          Unassigned
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={() => onEdit(task)}
          disabled={loading}
        >
          Edit
        </Button>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowAISummary(true)}
          disabled={loading}
        >
          AI Summary
        </Button>
        
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(task.id)}
          disabled={loading}
        >
          Delete
        </Button>
      </div>

      <AISummary
        title={task.title}
        description={task.description}
        isOpen={showAISummary}
        onClose={() => setShowAISummary(false)}
      />
    </div>
  );
};
