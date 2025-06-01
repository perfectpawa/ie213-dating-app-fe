import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  haveBackground?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = true, haveBackground = true }) => {
  const spinner = (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center {haveBackground ? 'bg-gray-900' : ''}">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner; 