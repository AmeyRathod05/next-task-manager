'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { LoadingSpinner } from '../ui/loading-spinner';

interface TaskSummary {
  summary: string;
  keyPoints: string[];
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
  usedOllama?: boolean;
  message?: string;
}

interface AISummaryProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AISummary: React.FC<AISummaryProps> = ({
  title,
  description,
  isOpen,
  onClose
}) => {
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          action: 'summarize'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError('Failed to generate AI summary');
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !summary && !loading) {
      fetchSummary();
    }
  }, [isOpen]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Task Analysis"
    >
      <div className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
            <span className="ml-2">Analyzing task...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="ml-4 text-red-400 hover:text-red-600 text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {summary && (
          <div className="space-y-6">
            {summary.usedOllama && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🤖</span>
                  <p className="text-green-800 text-sm">{summary.message}</p>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-semibold text-black mb-3 text-lg">📝 Task Summary</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{summary.summary}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-black mb-3 text-lg">🎯 Key Action Points</h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <ul className="list-disc list-inside space-y-3">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {typeof point === 'string' ? point : JSON.stringify(point)}
                    </li>
                  ))}
                </ul>
                {summary.keyPoints.length > 3 && (
                  <div className="text-xs text-gray-500 mt-4 text-center italic">
                    ↓ Scroll for more action points ↓
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-black mb-2 flex items-center">
                  <span className="text-blue-600 mr-2">⏱️</span>
                  Estimated Time
                </h4>
                <p className="text-gray-700 font-medium whitespace-pre-wrap break-words">{summary.estimatedTime}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-black mb-2 flex items-center">
                  <span className="text-purple-600 mr-2">🎯</span>
                  Suggested Priority
                </h4>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getPriorityColor(summary.priority)}`}>
                  {summary.priority.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={onClose}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <span>Close</span>
                <span className="text-lg">×</span>
              </Button>
            </div>
          </div>
        )}

        {!summary && !loading && !error && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-gray-500 mb-4">Get AI-powered insights about this task</p>
            </div>
            <Button 
              onClick={fetchSummary} 
              className="px-6 py-2"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Task'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
