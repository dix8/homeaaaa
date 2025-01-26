import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}>
      {message}
    </div>
  );
};

export default ErrorMessage; 