import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function SentimentOverview({ sentiment }) {
  // Safety check for undefined sentiment
  if (!sentiment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sentiment data available</p>
      </div>
    );
  }

  const data = [
    { name: 'Positive', value: sentiment.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: sentiment.neutral || 0, color: '#f59e0b' },
    { name: 'Negative', value: sentiment.negative || 0, color: '#ef4444' }
  ];

  const COLORS = {
    Positive: '#10b981',
    Neutral: '#f59e0b',
    Negative: '#ef4444'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      return (
        <div className="bg-white p-4 border-2 border-gray-300 rounded-xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: COLORS[entry.name] }}
            ></div>
            <div>
              <p className="font-bold text-gray-800 text-lg">{entry.name}</p>
              <p className="text-2xl font-extrabold" style={{ color: COLORS[entry.name] }}>
                {entry.value}%
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={120}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name]}
                stroke={COLORS[entry.name]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value, entry) => (
              <span className="font-semibold text-gray-700">
                {value}: {entry.payload.value}%
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SentimentOverview;

