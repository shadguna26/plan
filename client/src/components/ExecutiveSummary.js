import React from 'react';

function ExecutiveSummary({ summary }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-2 border-indigo-200 shadow-lg animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="flex-1 prose max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-base font-medium">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveSummary;

