'use client';

import { useState } from 'react';
import { BellIcon, CogIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export function DashboardHeader() {
  const [selectedRegion, setSelectedRegion] = useState('All Kenya');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Kenya Climate Resilience Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's your environmental insights overview.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Region Selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="region" className="text-sm font-medium text-gray-700">
              Region:
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="input-field text-sm"
            >
              <option value="All Kenya">All Kenya</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Nakuru">Nakuru</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <BellIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <CogIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <UserCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
