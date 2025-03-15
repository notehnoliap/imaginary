import React from 'react';

const StatsCard = ({ title, value, icon, loading }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {loading ? (
        <div className="animate-pulse">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mt-2"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-primary-light text-primary mr-2">
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </>
      )}
    </div>
  );
};

export default StatsCard; 