'use client';

import { useState } from 'react';
import { 
  ChartBarIcon
} from '@heroicons/react/24/outline';

const dataTypes = [
  { id: 'temperature', name: 'Temperature', icon: ChartBarIcon },
  { id: 'rainfall', name: 'Rainfall', icon: ChartBarIcon },
  { id: 'air-quality', name: 'Air Quality', icon: ChartBarIcon },
  { id: 'wind-speed', name: 'Wind Speed', icon: ChartBarIcon },
  { id: 'humidity', name: 'Humidity', icon: ChartBarIcon },
  { id: 'pressure', name: 'Atmospheric Pressure', icon: ChartBarIcon }
];

const timeRanges = [
  { id: '1d', name: 'Last 24 Hours' },
  { id: '7d', name: 'Last 7 Days' },
  { id: '30d', name: 'Last 30 Days' },
  { id: '90d', name: 'Last 3 Months' },
  { id: '1y', name: 'Last Year' }
];

export function DataExplorer() {
  const [selectedDataType, setSelectedDataType] = useState('temperature');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['Nairobi']);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Data Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={selectedDataType}
            onChange={(e) => setSelectedDataType(e.target.value)}
            className="input-field"
          >
            {dataTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="input-field"
          >
            {timeRanges.map((range) => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regions
          </label>
          <select
            multiple
            value={selectedRegions}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedRegions(values);
            }}
            className="input-field"
          >
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
            <option value="Eldoret">Eldoret</option>
          </select>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {dataTypes.find(t => t.id === selectedDataType)?.name} Data
        </h3>
        <p className="text-gray-500 mb-4">
          Showing data for {selectedRegions.join(', ')} over the {timeRanges.find(t => t.id === selectedTimeRange)?.name.toLowerCase()}
        </p>
        <div className="w-full h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
          <p className="text-gray-400">Interactive Chart Component</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Data Points</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2024-01-{String(item).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Nairobi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {24 + item}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Normal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
