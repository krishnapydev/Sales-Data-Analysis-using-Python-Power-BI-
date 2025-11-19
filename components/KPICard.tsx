import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { KPI } from '../types';

interface KPICardProps {
  data: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ data }) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{data.label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-bold text-gray-900">{data.value}</p>
        {data.change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{data.change}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
