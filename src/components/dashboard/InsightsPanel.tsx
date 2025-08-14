'use client';

import { useState } from 'react';
import { LightBulbIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const insights = [
  {
    id: 1,
    type: 'recommendation',
    title: 'Implement Green Infrastructure',
    description: 'Consider planting urban forests in Nairobi to improve air quality and reduce heat island effects.',
    priority: 'high',
    icon: LightBulbIcon,
    action: 'View Details'
  },
  {
    id: 2,
    type: 'alert',
    title: 'High Pollution Alert',
    description: 'Air quality in Eldoret has exceeded safe levels. Consider implementing traffic restrictions.',
    priority: 'critical',
    icon: ExclamationTriangleIcon,
    action: 'Take Action'
  },
  {
    id: 3,
    type: 'success',
    title: 'Rainwater Harvesting Success',
    description: 'Recent rainfall patterns show good potential for rainwater harvesting systems in coastal regions.',
    priority: 'medium',
    icon: CheckCircleIcon,
    action: 'Learn More'
  },
  {
    id: 4,
    type: 'info',
    title: 'Climate Trend Analysis',
    description: 'Temperature trends show a gradual increase of 0.8°C over the past decade in major cities.',
    priority: 'low',
    icon: InformationCircleIcon,
    action: 'View Report'
  }
];

export function InsightsPanel() {
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'text-yellow-600';
      case 'alert': return 'text-red-600';
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Insights & Recommendations</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedInsight === insight.id ? 'ring-2 ring-primary-500' : ''
            } ${getPriorityColor(insight.priority)}`}
            onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getIconColor(insight.type)}`}>
                <insight.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {insight.title}
                  </h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    insight.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {insight.description}
                </p>
                {selectedInsight === insight.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                      {insight.action}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">4</p>
            <p className="text-xs text-gray-500">Active Insights</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">1</p>
            <p className="text-xs text-gray-500">Critical Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
