import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function CategoryAnalysis({ categories }) {
  // Safety check for undefined categories
  if (!categories || !Array.isArray(categories)) {
    return (
      <div className="text-center py-12 glass-effect rounded-xl">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-700">No category data available</p>
      </div>
    );
  }

  // Filter only negative sentiment categories for the bar chart
  const negativeCategories = categories
    .filter(cat => cat && cat.sentiment === 'negative')
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map(cat => ({
      category: cat.category || 'Unknown',
      negativeScore: cat.score || 0,
      mentions: cat.mentions || 0
    }));

  // If no negative categories, show a message
  if (negativeCategories.length === 0) {
    return (
      <div className="text-center py-12 glass-effect rounded-xl">
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-700">No negative sentiment categories found</p>
        <p className="text-gray-500 mt-2">Great news! 🎉</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-gray-300 rounded-xl shadow-2xl">
          <p className="font-bold text-gray-800 text-lg mb-2">{data.category}</p>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-600">
              Negative Score: <span className="text-lg">{payload[0].value}</span>
            </p>
            <p className="text-sm text-gray-600">
              Mentions: <span className="font-semibold">{data.mentions}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={negativeCategories} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <defs>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.9}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey="category" 
            angle={-45} 
            textAnchor="end" 
            height={120}
            tick={{ fontSize: 12, fontWeight: 600 }}
            stroke="#6b7280"
          />
          <YAxis 
            label={{ value: 'Negative Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontWeight: 600 } }}
            domain={[0, 100]}
            stroke="#6b7280"
            tick={{ fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="font-semibold text-gray-700">{value}</span>}
          />
          <Bar 
            dataKey="negativeScore" 
            fill="url(#colorNegative)" 
            name="Negative Sentiment Score"
            radius={[12, 12, 0, 0]}
            animationBegin={0}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Category Details Table */}
      <div className="mt-8 overflow-x-auto glass-effect rounded-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-500 to-teal-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Sentiment
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Mentions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors duration-150 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {category.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                    category.sentiment === 'positive' 
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : category.sentiment === 'negative'
                      ? 'bg-red-100 text-red-800 border-2 border-red-300'
                      : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                  }`}>
                    {category.sentiment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          category.sentiment === 'positive' ? 'bg-green-500' :
                          category.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 min-w-[60px]">
                      {category.score}/100
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-800 text-sm font-semibold">
                    {category.mentions}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryAnalysis;

