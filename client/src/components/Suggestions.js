import React from 'react';

function Suggestions({ suggestions }) {
  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="flex items-start p-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-r-xl hover:shadow-lg transition-all duration-200 card-hover animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex-shrink-0 mr-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-orange-700 font-bold text-sm">Action #{index + 1}</span>
            </div>
            <p className="text-gray-800 font-semibold text-lg leading-relaxed">{suggestion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;

