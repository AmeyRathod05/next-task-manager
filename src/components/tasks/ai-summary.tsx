'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] w-full mx-auto overflow-y-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white p-6 sm:p-8 -m-6 sm:-m-8 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <DialogTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              🤖 AI Task Analysis
            </DialogTitle>
            <DialogDescription className="text-blue-100 mt-2 text-lg">
              Get intelligent insights and action points for your task
            </DialogDescription>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-b-blue-600 rounded-full animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-200 border-l-cyan-600 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-600 font-medium text-lg animate-pulse">AI is analyzing your task...</p>
              <p className="text-gray-500 text-sm">This may take a few seconds</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-6 sm:mx-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 animate-slide-up">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-red-800 font-semibold text-lg">Analysis Failed</h4>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        )}

        {summary && (
          <div className="space-y-8 px-6 sm:px-8 pb-6 sm:pb-8">
            {/* AI Service Indicator */}
            {summary.usedOllama && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg animate-pulse">
                    <span className="text-green-600 text-lg">🤖</span>
                  </div>
                  <div>
                    <span className="text-green-800 font-semibold text-lg">Using Ollama AI (TinyLlama)</span>
                    <p className="text-green-600 text-sm mt-1">Local AI processing for privacy and speed</p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <h4 className="font-bold text-gray-900 mb-4 text-2xl flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-lg">📝</span>
                </div>
                Summary
              </h4>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all duration-300">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap break-words">{summary.summary}</p>
              </div>
            </div>

            {/* Key Action Points */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h4 className="font-bold text-gray-900 mb-4 text-2xl flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg animate-pulse">
                  <span className="text-purple-600 text-lg">🎯</span>
                </div>
                Key Action Points
              </h4>
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border-2 border-gray-200 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-200 hover:shadow-lg transition-all duration-300">
                <ul className="space-y-4">
                  {summary.keyPoints.map((point, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 animate-slide-up"
                      style={{ animationDelay: `${300 + index * 100}ms` }}
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words flex-1">
                        {typeof point === 'string' ? point : JSON.stringify(point)}
                      </span>
                    </li>
                  ))}
                </ul>
                {summary.keyPoints.length > 3 && (
                  <div className="text-center mt-6 text-sm text-gray-500 italic animate-pulse">
                    ↓ Scroll for more action points ↓
                  </div>
                )}
              </div>
            </div>

            {/* Time and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600">⏱️</span>
                  </div>
                  Estimated Time
                </h4>
                <p className="text-gray-700 font-semibold text-lg whitespace-pre-wrap break-words">{summary.estimatedTime}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-purple-600">🎯</span>
                  </div>
                  Suggested Priority
                </h4>
                <span className={`inline-block px-4 py-2 rounded-xl text-lg font-bold whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${getPriorityColor(summary.priority)}`}>
                  {summary.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Button
                onClick={() => window.navigator.clipboard.writeText(summary.summary)}
                variant="outline"
                className="flex-1 sm:flex-none h-12 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Summary
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 sm:flex-none h-12 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
