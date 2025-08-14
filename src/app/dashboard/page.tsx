import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ClimateOverview } from '@/components/dashboard/ClimateOverview';
import { RegionalMap } from '@/components/dashboard/RegionalMap';
import { DataExplorer } from '@/components/dashboard/DataExplorer';
import { InsightsPanel } from '@/components/dashboard/InsightsPanel';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Main Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Climate Overview & Map */}
          <div className="lg:col-span-2 space-y-8">
            {/* Climate Overview Cards */}
            <Suspense fallback={<LoadingSpinner />}>
              <ClimateOverview />
            </Suspense>

            {/* Interactive Regional Map */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Regional Climate Data
              </h2>
              <Suspense fallback={<LoadingSpinner />}>
                <RegionalMap />
              </Suspense>
            </div>

            {/* Data Explorer */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Data Explorer
              </h2>
              <Suspense fallback={<LoadingSpinner />}>
                <DataExplorer />
              </Suspense>
            </div>
          </div>

          {/* Right Column - Insights & Actions */}
          <div className="space-y-8">
            {/* Insights Panel */}
            <Suspense fallback={<LoadingSpinner />}>
              <InsightsPanel />
            </Suspense>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Generate Report
                </button>
                <button className="w-full btn-secondary">
                  Export Data
                </button>
                <button className="w-full btn-secondary">
                  Set Alerts
                </button>
                <button className="w-full btn-secondary">
                  Share Dashboard
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-climate-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      High pollution alert in Nairobi
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-climate-safe rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Rainfall data updated
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-climate-info rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      New climate model available
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
