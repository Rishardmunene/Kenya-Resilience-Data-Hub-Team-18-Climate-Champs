import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ClimateOverview } from '@/components/dashboard/ClimateOverview';
import { GeoAIAnalysis } from '@/components/geoai/GeoAIAnalysis';
import { KenyaMap } from '@/components/maps/KenyaMap';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardHeader />
          
          <div className="mt-8 space-y-8">
            {/* Climate Overview */}
            <ClimateOverview />
            
            {/* Kenya Map */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kenya Climate Map</h2>
              <KenyaMap 
                showWeatherStations={true}
                weatherStations={[
                  { name: 'Wilson Airport', latitude: -1.3219, longitude: 36.8147, temperature: 25.5, humidity: 65 },
                  { name: 'JKIA', latitude: -1.3192, longitude: 36.9278, temperature: 24.8, humidity: 68 },
                  { name: 'Moi Airport', latitude: -4.0348, longitude: 39.5945, temperature: 28.2, humidity: 75 }
                ]}
                showClimateData={true}
                climateData={[
                  { region: 'Nairobi', value: 25.5, type: 'temperature' },
                  { region: 'Mombasa', value: 28.2, type: 'temperature' },
                  { region: 'Kisumu', value: 26.1, type: 'temperature' }
                ]}
              />
            </div>
            
            {/* GeoAI Analysis */}
            <GeoAIAnalysis />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
