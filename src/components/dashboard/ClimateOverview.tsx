'use client';

import { useState, useEffect } from 'react';
import { 
  SunIcon, 
  CloudIcon, 
  BeakerIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { TemperatureChart, generateSampleTemperatureData } from '@/components/charts/TemperatureChart';

interface ClimateMetric {
  name: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'stable';
  icon: React.ReactNode;
  color: string;
}

export function ClimateOverview() {
  const [temperatureData, setTemperatureData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load sample temperature data
    const sampleData = generateSampleTemperatureData(30);
    setTemperatureData(sampleData);
    setIsLoading(false);
  }, []);

  const climateMetrics: ClimateMetric[] = [
    {
      name: 'Average Temperature',
      value: '25.3°C',
      change: '+2.1°C',
      changeType: 'increase',
      icon: <SunIcon className="h-6 w-6" />,
      color: 'text-orange-600'
    },
    {
      name: 'Humidity Level',
      value: '68%',
      change: '-5%',
      changeType: 'decrease',
      icon: <CloudIcon className="h-6 w-6" />,
      color: 'text-blue-600'
    },
    {
      name: 'Rainfall',
      value: '45mm',
      change: '+12mm',
      changeType: 'increase',
      icon: <BeakerIcon className="h-6 w-6" />,
      color: 'text-green-600'
    },
    {
      name: 'Air Quality',
      value: 'Good',
      change: 'Stable',
      changeType: 'stable',
      icon: <CheckCircleIcon className="h-6 w-6" />,
      color: 'text-green-600'
    }
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'decrease':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-red-600';
      case 'decrease':
        return 'text-green-600';
      case 'stable':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Climate Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Climate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {climateMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-white ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="flex items-center space-x-1">
                {getChangeIcon(metric.changeType)}
                <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-900">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Temperature Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trends (Last 30 Days)</h3>
        <TemperatureChart 
          data={temperatureData}
          title="Kenya Temperature Trends"
          height={300}
          showHumidity={true}
          showRainfall={true}
        />
      </div>

      {/* Climate Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Climate Alert</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Above-average temperatures detected in Nairobi region. Consider implementing heat mitigation strategies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
