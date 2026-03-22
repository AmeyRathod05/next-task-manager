'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskCard } from '@/components/tasks/task-card';
import Link from 'next/link';

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

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [session, status]);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        fetch('/api/tasks', { credentials: 'include' }),
        // Only fetch users if admin or co-admin
        (session?.user?.role === 'ADMIN' || session?.user?.role === 'CO_ADMIN') 
          ? fetch('/api/users', { credentials: 'include' })
          : Promise.resolve({ ok: false, json: async () => ({ users: [] }) } as Response)
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    setSubmitting(true);
    setError(null);
    console.log('Creating task with data:', taskData);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
        credentials: 'include',
      });

      console.log('Task creation response status:', response.status);
      
      if (response.ok) {
        const newTask = await response.json();
        console.log('Task created successfully:', newTask);
        setTasks(prev => [...prev, newTask]);
        setShowCreateForm(false);
      } else {
        const errorData = await response.json();
        console.error('Task creation error:', errorData);
        setError(errorData.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return;
    
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        ));
        setEditingTask(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setDeletingTaskId(taskId);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeletingTaskId(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex-1">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-black">
              Tasks ({tasks.length})
            </h2>
            <Button
              onClick={() => setShowCreateForm(true)}
            >
              Create Task
            </Button>
          </div>
          
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b">
              <div className="flex items-center">
                <span className="text-red-600">{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner size="md" />
                <div className="text-black mt-4">Loading tasks...</div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-black">No tasks found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                    loading={deletingTaskId === task.id}
                    currentUserRole={session?.user?.role}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
          loading={submitting}
          title="Create New Task"
          users={users}
          currentUserRole={session?.user?.role}
        />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            loading={submitting}
            title="Edit Task"
            users={users}
            currentUserRole={session?.user?.role}
          />
        )}
      </Modal>
    </div>
  );
}
