import React from 'react';

const LoadingComponent = () => {
  return (
    <div className="w-full flex flex-col bg-white rounded-xl">
      <div className="flex flex-auto flex-col justify-center items-center">
        <div className="flex justify-center">
          <div
            className="animate-spin inline-block size-7 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
