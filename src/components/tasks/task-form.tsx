'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: number;
  dueDate: string;
  assignedToId?: string | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  assignedToId?: string;
}

interface User {
  id: string;
  name?: string;
  email: string;
  role: string;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  title: string;
  users?: User[];
  currentUserRole?: string;
}

const statusOptions = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' }
];

const priorityOptions = [
  { value: '1', label: 'Low (1)' },
  { value: '2', label: 'Medium-Low (2)' },
  { value: '3', label: 'Medium (3)' },
  { value: '4', label: 'Medium-High (4)' },
  { value: '5', label: 'High (5)' }
];

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  title,
  users = [],
  currentUserRole = 'USER'
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 3,
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    assignedToId: initialData?.assignedToId || 'unassigned'
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        assignedToId: (formData.assignedToId === 'unassigned' || formData.assignedToId === 'unknown') ? undefined : formData.assignedToId
      });
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 3,
        dueDate: '',
        assignedToId: 'unassigned'
      });
      setErrors({});
      onCancel();
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const statusOptions = [
    { value: 'TODO', label: 'To Do' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 1, label: 'Low (1)' },
    { value: 2, label: 'Low-Medium (2)' },
    { value: 3, label: 'Medium (3)' },
    { value: 4, label: 'High (4)' },
    { value: 5, label: 'Critical (5)' }
  ];

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] w-full mx-auto overflow-y-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sm:p-8 -m-6 sm:-m-8 mb-6 sm:mb-8">
          <DialogTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              {initialData ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>
            {initialData ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription className="text-blue-100 mt-2">
            {initialData ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Title Field */}
            <div className="space-y-3 group">
              <Input
                label="Task Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a descriptive task title..."
                required
                error={errors.title}
                maxLength={200}
                className="text-lg py-4 px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300"
              />
              {formData.title && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="animate-fade-in">Title looks good! {formData.title.length}/200 characters</span>
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-3 group">
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide detailed information about this task..."
                rows={5}
                error={errors.description}
                maxLength={1000}
                className="py-4 px-5 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300 resize-none"
              />
              {formData.description && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="animate-fade-in">Great description! {formData.description.length}/1000 characters</span>
                </div>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3 group">
                <SelectLabel required htmlFor="status-select" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Status
                </SelectLabel>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger id="status-select" className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-3 px-4 hover:bg-blue-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          {option.value === 'TODO' && <span className="w-3 h-3 bg-gray-400 rounded-full"></span>}
                          {option.value === 'IN_PROGRESS' && <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>}
                          {option.value === 'DONE' && <span className="w-3 h-3 bg-green-500 rounded-full"></span>}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 group">
                <SelectLabel required htmlFor="priority-select" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Priority
                </SelectLabel>
                <Select value={formData.priority.toString()} onValueChange={(value) => handleInputChange('priority', parseInt(value))}>
                  <SelectTrigger id="priority-select" className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()} className="py-3 px-4 hover:bg-blue-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          {option.value <= 2 && <span className="w-3 h-3 bg-green-500 rounded-full"></span>}
                          {option.value === 3 && <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>}
                          {option.value >= 4 && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Date and Assigned User */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3 group">
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  error={errors.dueDate}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300"
                />
              </div>

              <div className="space-y-3 group">
                <SelectLabel htmlFor="assigned-select" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Assigned To
                </SelectLabel>
                <Select value={formData.assignedToId} onValueChange={(value) => handleInputChange('assignedToId', value)}>
                  <SelectTrigger id="assigned-select" className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:border-gray-300">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                    <SelectItem value="unassigned" className="py-3 px-4 hover:bg-blue-50 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                        Unassigned
                      </div>
                    </SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id || 'unknown'} className="py-3 px-4 hover:bg-blue-50 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          {user.name || user.email}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 sm:flex-none h-12 px-8 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex-1 sm:flex-none h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {initialData ? 'Update Task' : 'Create Task'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
