'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FormInput } from '../ui/form-input';
import { FormTextarea } from '../ui/form-textarea';
import { FormSelect } from '../ui/form-select';

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: number;
  dueDate: string;
  assignedToId?: string | null;
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
    assignedToId: initialData?.assignedToId || null
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date(new Date().toDateString())) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    console.log('Form validation passed, submitting...');
    await onSubmit(formData);
  };

  const handleChange = (field: keyof TaskFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <FormInput
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        error={errors.title}
        required
        disabled={loading}
      />

      <div>
        <FormTextarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          rows={3}
          disabled={loading}
          maxLength={1000}
        />
        <div className="text-xs text-gray-500 mt-1">
          {formData.description.length}/1000 characters
        </div>
      </div>

      <FormSelect
        label="Status"
        value={formData.status}
        onChange={(e) => handleChange('status', e.target.value)}
        options={statusOptions}
        disabled={loading}
      />

      <FormSelect
        label="Priority"
        value={formData.priority.toString()}
        onChange={(e) => handleChange('priority', parseInt(e.target.value))}
        options={priorityOptions}
        disabled={loading}
      />

      <FormInput
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange('dueDate', e.target.value)}
        error={errors.dueDate}
        required
        disabled={loading}
      />

      {(currentUserRole === 'ADMIN' || currentUserRole === 'CO_ADMIN') && users.length > 0 && (
        <FormSelect
          label="Assign To"
          value={formData.assignedToId || ''}
          onChange={(e) => handleChange('assignedToId', e.target.value || null)}
          options={[
            { value: '', label: 'Unassigned' },
            ...users.map(user => ({
              value: user.id,
              label: `${user.name || user.email} (${user.email})`
            }))
          ]}
          disabled={loading}
        />
      )}

      <div className="flex space-x-4">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
