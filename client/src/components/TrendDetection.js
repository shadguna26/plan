import React from 'react';

function TrendDetection({ trends }) {
  const getPriorityBadge = (priority) => {
    const styles = {
      High: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400 shadow-md',
      Medium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-400 shadow-md',
      Low: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-400 shadow-md'
    };

    const icons = {
      High: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      Medium: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      Low: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-4 py-2 text-xs font-bold rounded-lg border-2 ${styles[priority]}`}>
        {icons[priority]}
        <span>{priority} Priority</span>
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <div className="glass-effect rounded-xl overflow-hidden shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-red-500 to-pink-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Consecutive Negative Cycles
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Current Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trends.map((trend, index) => (
              <tr 
                key={index} 
                className="hover:bg-red-50 transition-colors duration-150 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-bold text-gray-900">{trend.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">
                        {trend.consecutive_negative_cycles}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">cycles</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(trend.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${trend.current_sentiment_score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 min-w-[60px]">
                      {trend.current_sentiment_score}/100
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trends.length === 0 && (
        <div className="text-center py-12 glass-effect rounded-xl">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700">No continuous negative trends detected</p>
          <p className="text-gray-500 mt-2">All categories are performing well! 🎉</p>
        </div>
      )}
    </div>
  );
}

export default TrendDetection;

