import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FeedbackInput from './FeedbackInput';
import DataSourceStatus from './DataSourceStatus';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch sync status on component mount
  useEffect(() => {
    fetchSyncStatus();
    // Refresh sync status every 30 seconds
    const interval = setInterval(fetchSyncStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sync-status`);
      setSyncStatus(response.data);
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const handleAnalyze = async (feedbackText) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-feedback`, {
        feedbackText: feedbackText
      });
      
      // Refresh sync status after analysis
      fetchSyncStatus();
      
      // Navigate to fresh analysis results page with data
      // Using replace: false to allow back navigation, but this creates a fresh page
      navigate('/analysis', { 
        state: { analysisData: response.data },
        replace: false
      });
      
      // Keep loading state until navigation completes
      // The loading will be cleared when component unmounts
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to analyze feedback. Please try again.';
      setError(errorMessage);
      console.error('Analysis error:', err);
      console.error('Error response:', err.response?.data);
      setLoading(false);
    }
  };

  const handleCSVUpload = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await axios.post(`${API_BASE_URL}/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh sync status after upload
      fetchSyncStatus();
      
      // Navigate to fresh analysis results page with data
      // Using replace: false to allow back navigation, but this creates a fresh page
      navigate('/analysis', { 
        state: { analysisData: response.data },
        replace: false
      });
      
      // Keep loading state until navigation completes
      // The loading will be cleared when component unmounts
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process CSV file. Please try again.');
      console.error('CSV upload error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect shadow-xl border-b-2 border-purple-200/30 sticky top-0 z-50 no-print-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold gradient-text tracking-tight">Feedback Intelligence</h1>
                <p className="text-sm text-gray-600 font-medium flex items-center space-x-1 mt-1">
                  <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Welcome back, {user?.name || user?.email}</span>
                </p>
              </div>
            </div>
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
      </header>

      {/* Main Content - Page 2: Data Upload Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-2">
        {/* Data Source Status */}
        <DataSourceStatus syncStatus={syncStatus} />

        {/* Feedback Input Section - Page 2 Content */}
        <div className="mb-8 page-2-content" style={{ pageBreakAfter: 'always', breakAfter: 'page' }}>
          <FeedbackInput 
            onAnalyze={handleAnalyze} 
            onCSVUpload={handleCSVUpload}
            loading={loading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg animate-slide-up flex items-center space-x-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <strong className="font-semibold">Error: </strong>{error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-8 glass-effect rounded-2xl shadow-2xl p-16 text-center animate-fade-in border-2 border-purple-100">
            <div className="relative mb-6">
              <div className="spinner mx-auto mb-4 w-16 h-16 border-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold gradient-text mb-2">Analyzing feedback with AI...</p>
            <p className="text-gray-600 mt-2 font-medium">This may take a few moments</p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (
          <div className="text-center py-20 animate-fade-in">
            <div className="glass-effect rounded-3xl shadow-2xl p-16 max-w-3xl mx-auto border-2 border-purple-100">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse-slow transform hover:scale-110 transition-transform duration-500">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="absolute top-0 right-1/4 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white animate-bounce"></div>
                <div className="absolute bottom-0 left-1/4 w-4 h-4 bg-green-400 rounded-full border-4 border-white animate-ping"></div>
              </div>
              <h3 className="text-4xl font-extrabold gradient-text mb-4 tracking-tight">Ready to Analyze Feedback</h3>
              <p className="text-gray-700 text-xl mb-6 font-medium">Enter feedback text above to begin AI-powered analysis</p>
              <div className="flex items-center justify-center space-x-3 text-base text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-semibold">Powered by <span className="gradient-text">Google Gemini AI</span></span>
              </div>
            </div>
          </div>
        )}
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

export default Dashboard;


