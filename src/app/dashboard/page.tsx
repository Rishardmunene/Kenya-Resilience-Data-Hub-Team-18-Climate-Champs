import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ClimateOverview } from '@/components/dashboard/ClimateOverview';
import { DataExplorer } from '@/components/dashboard/DataExplorer';
import { GeoAIAnalysis } from '@/components/geoai/GeoAIAnalysis';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader />
          
          <div className="mt-8 space-y-8">
            {/* Climate Overview */}
            <ClimateOverview />
            
            {/* GeoAI Analysis */}
            <GeoAIAnalysis />
            
            {/* Data Explorer */}
            <DataExplorer />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
