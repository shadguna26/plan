import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SentimentOverview from './SentimentOverview';
import SentimentCards from './SentimentCards';
import CategoryAnalysis from './CategoryAnalysis';
import TrendDetection from './TrendDetection';
import Suggestions from './Suggestions';
import ExecutiveSummary from './ExecutiveSummary';

function AnalysisResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const analysisData = location.state?.analysisData;

  // Scroll to top on mount for fresh page experience
  React.useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Also use scrollTo for older browsers
    window.scrollTo(0, 0);
    
    // Clear any potential focus states
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, []);

  // If no analysis data, redirect back to dashboard
  React.useEffect(() => {
    if (!analysisData) {
      navigate('/dashboard', { replace: true });
    }
  }, [analysisData, navigate]);

  if (!analysisData) {
    return null; // Will redirect
  }

  // Transform new API response format to match component expectations
  const transformAnalysisData = (data) => {
    // If data already has the old format, return as is
    if (data.overall_sentiment && data.category_analysis) {
      return data;
    }

    // Transform new format to old format
    const sentimentValue = data.sentiment || 'Neutral';
    
    // Create overall_sentiment object based on the sentiment value
    const overallSentiment = {
      positive: sentimentValue === 'Positive' ? 100 : 0,
      neutral: sentimentValue === 'Neutral' ? 100 : 0,
      negative: sentimentValue === 'Negative' ? 100 : 0
    };

    // Create category_analysis array from the single category
    const categoryAnalysis = [{
      category: data.category || 'Other',
      sentiment: sentimentValue.toLowerCase(),
      score: sentimentValue === 'Positive' ? 80 : sentimentValue === 'Negative' ? 20 : 50,
      mentions: 1
    }];

    return {
      overall_sentiment: overallSentiment,
      category_analysis: categoryAnalysis,
      suggestions: data.suggestions || [],
      summary: data.summary || '',
      continuous_negative_areas: sentimentValue === 'Negative' ? [{
        category: data.category || 'Other',
        consecutive_negative_cycles: 1,
        priority: 'Low',
        current_sentiment_score: 20
      }] : []
    };
  };

  const transformedData = transformAnalysisData(analysisData);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect shadow-xl border-b-2 border-purple-200/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold gradient-text tracking-tight">Analysis Results</h1>
                <p className="text-sm text-gray-600 font-medium flex items-center space-x-1 mt-1">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Feedback Intelligence Dashboard</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analysis Results */}
        <div className="space-y-8 animate-fade-in analysis-section">
          {/* Overall Sentiment Overview */}
          <div className="glass-effect rounded-xl shadow-xl p-8 card-hover animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Overall Sentiment Overview</h2>
            </div>
            <SentimentOverview sentiment={transformedData.overall_sentiment} />
          </div>

          {/* Sentiment Summary Cards */}
          <SentimentCards sentiment={transformedData.overall_sentiment} />

          {/* Category-wise Analysis */}
          <div className="glass-effect rounded-xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Category-wise Analysis</h2>
            </div>
            <CategoryAnalysis categories={transformedData.category_analysis} />
          </div>

          {/* Continuous Negative Trend Detection */}
          {transformedData.continuous_negative_areas && transformedData.continuous_negative_areas.length > 0 && (
            <div className="glass-effect rounded-xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Continuous Negative Trend Detection</h2>
              </div>
              <TrendDetection trends={transformedData.continuous_negative_areas} />
            </div>
          )}

          {/* Suggestions & Action Points */}
          <div className="glass-effect rounded-xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Suggestions & Action Points</h2>
            </div>
            <Suggestions suggestions={transformedData.suggestions} />
          </div>

          {/* Executive Summary */}
          <div className="glass-effect rounded-xl shadow-xl p-8 card-hover animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Executive Summary</h2>
            </div>
            <ExecutiveSummary summary={transformedData.summary} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 glass-effect border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-700 text-sm font-medium">
            <span className="inline-flex items-center space-x-2">
              <span>Powered by</span>
              <span className="font-bold gradient-text">Google Gemini AI</span>
              <span>•</span>
              <span>Feedback Intelligence Dashboard</span>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AnalysisResults;

