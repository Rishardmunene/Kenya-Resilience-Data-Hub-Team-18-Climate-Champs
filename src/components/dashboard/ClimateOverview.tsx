'use client';

import { CloudIcon, SunIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const climateData = [
  {
    title: 'Air Quality Index',
    value: '156',
    unit: 'AQI',
    status: 'warning',
    change: '+12',
    icon: CloudIcon,
    description: 'Moderate air pollution levels'
  },
  {
    title: 'Temperature',
    value: '24.5',
    unit: '°C',
    status: 'safe',
    change: '-2.1',
    icon: SunIcon,
    description: 'Within normal range'
  },
  {
    title: 'Rainfall',
    value: '45.2',
    unit: 'mm',
    status: 'info',
    change: '+8.3',
    icon: CloudIcon,
    description: 'Above average rainfall'
  },
  {
    title: 'Drought Risk',
    value: 'Low',
    unit: '',
    status: 'safe',
    change: 'Stable',
    icon: CheckCircleIcon,
    description: 'Minimal drought conditions'
  }
];

export function ClimateOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {climateData.map((item, index) => (
        <div key={index} className="card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.unit}</p>
              </div>
            </div>
            <div className={`p-2 rounded-lg ${
              item.status === 'safe' ? 'bg-green-100 text-green-600' :
              item.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              item.status === 'danger' ? 'bg-red-100 text-red-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              <item.icon className="h-6 w-6" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-gray-500">{item.description}</p>
            <span className={`text-xs font-medium ${
              item.change.startsWith('+') ? 'text-green-600' :
              item.change.startsWith('-') ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
