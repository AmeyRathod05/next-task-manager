import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer spinning circle */}
      <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      
      {/* Middle spinning circle with delay */}
      <div className={`absolute inset-1 ${sizeClasses[size]} border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin animation-delay-150`}></div>
      
      {/* Inner spinning circle with delay */}
      <div className={`absolute inset-2 ${sizeClasses[size]} border-4 border-cyan-200 border-l-cyan-600 rounded-full animate-spin animation-delay-300`}></div>
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};
