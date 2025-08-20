'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, CogIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization?: string;
}

interface KenyaRegion {
  name: string;
  latitude: number;
  longitude: number;
  county_code: string;
}

export function DashboardHeader() {
  const [selectedRegion, setSelectedRegion] = useState('All Kenya');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [regions, setRegions] = useState<KenyaRegion[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Load Kenya regions
    const loadRegions = async () => {
      try {
        const response = await fetch('/api/geoai/regions');
        const data = await response.json();
        setRegions(data.regions || []);
      } catch (error) {
        console.error('Failed to load regions:', error);
        // Fallback regions if API fails
        setRegions([
          { name: "Nairobi", latitude: -1.2921, longitude: 36.8219, county_code: "047" },
          { name: "Mombasa", latitude: -4.0435, longitude: 39.6682, county_code: "001" },
          { name: "Kisumu", latitude: -0.0917, longitude: 34.7680, county_code: "042" },
          { name: "Nakuru", latitude: -0.3031, longitude: 36.0800, county_code: "032" },
          { name: "Eldoret", latitude: 0.5204, longitude: 35.2699, county_code: "027" },
          { name: "Meru", latitude: 0.0500, longitude: 37.6500, county_code: "012" },
          { name: "Nyeri", latitude: -0.4167, longitude: 36.9500, county_code: "019" },
          { name: "Thika", latitude: -1.0332, longitude: 37.0692, county_code: "022" },
          { name: "Machakos", latitude: -1.5167, longitude: 37.2667, county_code: "016" },
          { name: "Kakamega", latitude: 0.2833, longitude: 34.7500, county_code: "037" }
        ]);
      }
    };
    
    loadRegions();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfileMenuOpen(false);
    router.push('/');
  };

  const handleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setSettingsOpen(false);
    setProfileMenuOpen(false);
  };

  const handleSettings = () => {
    setSettingsOpen(!settingsOpen);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    // TODO: Implement region-based data filtering
    console.log('Region changed to:', region);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Kenya Climate Resilience Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here&apos;s your environmental insights overview.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Region Selector */}
          <div className="flex items-center space-x-3">
            <label htmlFor="region" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Region:
            </label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="min-w-[180px] text-sm border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="All Kenya">All Kenya</option>
              {regions.map((region) => (
                <option key={region.county_code} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={handleNotifications}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
              </button>
              
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">Analysis Completed</p>
                          <p className="text-gray-600">Land cover analysis for Nairobi is ready</p>
                          <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">New Data Available</p>
                          <p className="text-gray-600">Updated weather data for Mombasa region</p>
                          <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative">
              <button 
                onClick={handleSettings}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Settings"
              >
                <CogIcon className="h-5 w-5" />
              </button>
              
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
                  </div>
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="font-medium">Dashboard Preferences</div>
                      <div className="text-xs text-gray-500">Customize your dashboard layout</div>
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="font-medium">Data Sources</div>
                      <div className="text-xs text-gray-500">Manage data connections</div>
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="font-medium">Export Settings</div>
                      <div className="text-xs text-gray-500">Configure data export options</div>
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="font-medium">API Keys</div>
                      <div className="text-xs text-gray-500">Manage external service keys</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-1 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <UserCircleIcon className="h-5 w-5" />
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for closing dropdowns */}
      {(profileMenuOpen || notificationsOpen || settingsOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setProfileMenuOpen(false);
            setNotificationsOpen(false);
            setSettingsOpen(false);
          }}
        />
      )}
    </div>
  );
}
