import React, { useState } from 'react';

function FeedbackInput({ onAnalyze, onCSVUpload, loading }) {
  const [feedbackText, setFeedbackText] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      onAnalyze(feedbackText);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
      }
      onCSVUpload(file);
      // Reset file input
      setFileInputKey(prev => prev + 1);
    }
  };

  return (
    <div className="glass-effect rounded-2xl shadow-2xl p-10 card-hover animate-slide-up border-2 border-purple-100">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold gradient-text tracking-tight">Feedback Input</h2>
          <p className="text-sm text-gray-600 font-medium mt-1">Enter your feedback for AI-powered analysis</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Paste your feedback text here</span>
          </label>
          <textarea
            id="feedback"
            rows="8"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all duration-200 shadow-inner bg-white/50"
            placeholder="Enter bulk feedback text here... (e.g., customer reviews, survey responses, support tickets)"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading || !feedbackText.trim()}
            className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-8 py-5 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="spinner w-6 h-6 border-3"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Analyze Feedback</span>
              </>
            )}
          </button>

          <div className="flex-1">
            <label className="block w-full bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 text-gray-800 px-8 py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300 cursor-pointer text-center transition-all duration-300 transform hover:scale-105 border-2 border-teal-200 hover:border-teal-300 flex items-center justify-center space-x-3">
              <input
                key={fileInputKey}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              {loading ? (
                <>
                  <div className="spinner w-6 h-6 border-3"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-teal-700">Upload CSV from Google Forms</span>
                </>
              )}
            </label>
          </div>
        </div>
      </form>

      <div className="mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-l-4 border-purple-500 rounded-r-xl p-5 flex items-start space-x-4 shadow-md">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-base text-gray-800 font-semibold mb-1">
            <span className="text-purple-600 font-extrabold">💡 Pro Tip:</span>
          </p>
          <p className="text-sm text-gray-700 font-medium">
            You can paste text directly or upload a CSV file exported from Google Sheets for bulk analysis
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeedbackInput;

