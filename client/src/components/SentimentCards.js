import React from 'react';

function SentimentCards({ sentiment }) {
  // Safety check for undefined sentiment
  if (!sentiment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sentiment data available</p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Positive',
      value: sentiment.positive || 0,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Neutral',
      value: sentiment.neutral || 0,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Negative',
      value: sentiment.negative || 0,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  const getIcon = (label) => {
    switch(label) {
      case 'Positive':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        );
      case 'Neutral':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'Negative':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`glass-effect ${card.borderColor} border-2 rounded-xl p-8 shadow-xl card-hover animate-slide-up`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                {getIcon(card.label)}
                <p className={`text-lg font-bold ${card.textColor}`}>{card.label}</p>
              </div>
              <p className={`text-5xl font-extrabold ${card.textColor} mt-2`}>
                {card.value}%
              </p>
            </div>
            <div className={`${card.color} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200`}>
              <span className="text-white text-3xl font-bold">{card.value}%</span>
            </div>
          </div>
          <div className="mt-4">
            <div className={`${card.color} h-2 rounded-full`} style={{ width: `${card.value}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SentimentCards;

