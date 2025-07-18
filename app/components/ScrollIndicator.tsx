import React from 'react';

const ScrollIndicator: React.FC = () => (
  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce transition-all duration-700 ease-in-out">
    <div className="text-gray-400 text-center">
      <div className="text-sm mb-2">Scroll down</div>
      <svg
        className="w-6 h-6 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </div>
);

export default ScrollIndicator; 