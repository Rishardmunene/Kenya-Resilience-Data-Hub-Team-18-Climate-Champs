'use client';

import { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

// Mock map data - in real implementation, this would use Leaflet or similar
const regions = [
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, status: 'warning', aqi: 156 },
  { name: 'Mombasa', lat: -4.0435, lng: 39.6682, status: 'safe', aqi: 45 },
  { name: 'Kisumu', lat: -0.1022, lng: 34.7617, status: 'info', aqi: 78 },
  { name: 'Nakuru', lat: -0.3031, lng: 36.0800, status: 'safe', aqi: 52 },
  { name: 'Eldoret', lat: 0.5204, lng: 35.2699, status: 'danger', aqi: 189 }
];

export function RegionalMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Mock Map Container */}
      <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Interactive Map</p>
          <p className="text-sm text-gray-400">Kenya Climate Data Visualization</p>
        </div>
        
        {/* Mock Region Markers */}
        {regions.map((region, index) => (
          <div
            key={index}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedRegion === region.name ? 'z-10' : 'z-0'
            }`}
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${30 + (index * 10)}%`
            }}
            onClick={() => setSelectedRegion(region.name)}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
              region.status === 'safe' ? 'bg-green-500' :
              region.status === 'warning' ? 'bg-yellow-500' :
              region.status === 'danger' ? 'bg-red-500' :
              'bg-blue-500'
            }`}></div>
            
            {/* Tooltip */}
            {selectedRegion === region.name && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 whitespace-nowrap">
                <p className="font-medium text-sm">{region.name}</p>
                <p className="text-xs text-gray-600">AQI: {region.aqi}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Map Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Good (0-50)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Moderate (51-100)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Unhealthy (101-150)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Info</span>
        </div>
      </div>
    </div>
  );
}
