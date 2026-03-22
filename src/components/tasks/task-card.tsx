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
    <>
      <div className="group animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200 relative overflow-hidden">
          {/* Gradient Accent Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold animate-pulse">
                  {task.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created: {new Date(task.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                
                {task.dueDate && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                {task.user && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(task.user.name || task.user.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700">Created by: {task.user.name || task.user.email}</span>
                  </div>
                )}

                {task.assignedTo ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {(task.assignedTo.name || task.assignedTo.email).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-blue-600 font-medium">Assigned to: {task.assignedTo.name || task.assignedTo.email}</span>
                  </div>
                ) : (currentUserRole === 'ADMIN' || currentUserRole === 'CO_ADMIN') && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Unassigned
                  </div>
                )}
              </div>
            </div>

            {/* Status and Priority Badges */}
            <div className="flex flex-col items-end gap-3 lg:ml-4">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button
              size="sm"
              onClick={() => onEdit(task)}
              className="flex-1 sm:flex-none bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAISummary(true)}
              disabled={loading}
              className="flex-1 sm:flex-none border-2 border-purple-300 hover:border-purple-400 text-purple-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Summary
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(task.id)}
              disabled={loading}
              className="flex-1 sm:flex-none bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
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

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
      
      <AISummary
        title={task.title}
        description={task.description}
        isOpen={showAISummary}
        onClose={() => setShowAISummary(false)}
      />
    </>
  );
};
