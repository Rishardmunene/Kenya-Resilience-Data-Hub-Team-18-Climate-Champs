'use client';

import { useState, useEffect } from 'react';
import { 
  MapIcon, 
  GlobeAltIcon, 
  ChartBarIcon, 
  CloudIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { loadKenyaBoundaries, extractRegions, KenyaRegion } from '@/utils/geoData';

interface AnalysisRequest {
  region_name: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  start_date: string;
  end_date: string;
  analysis_type: string;
  satellite_source: string;
}

interface AnalysisResult {
  analysis_id: string;
  region_name: string;
  analysis_type: string;
  results: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
}

interface AnalysisType {
  id: string;
  name: string;
  description: string;
  satellite_sources: string[];
  icon: React.ReactNode;
}

// Kenya's 47 counties with their coordinates
const KENYA_COUNTIES = [
  { name: 'Mombasa', latitude: -4.0435, longitude: 39.6682, county_code: '001' },
  { name: 'Kwale', latitude: -4.1816, longitude: 39.4606, county_code: '002' },
  { name: 'Kilifi', latitude: -3.5107, longitude: 39.9093, county_code: '003' },
  { name: 'Tana River', latitude: -1.5000, longitude: 40.0000, county_code: '004' },
  { name: 'Lamu', latitude: -2.2719, longitude: 40.9020, county_code: '005' },
  { name: 'Taita Taveta', latitude: -3.4000, longitude: 38.3700, county_code: '006' },
  { name: 'Garissa', latitude: -0.4567, longitude: 39.6583, county_code: '007' },
  { name: 'Wajir', latitude: 1.7471, longitude: 40.0573, county_code: '008' },
  { name: 'Mandera', latitude: 3.9373, longitude: 41.8569, county_code: '009' },
  { name: 'Marsabit', latitude: 2.3344, longitude: 37.9902, county_code: '010' },
  { name: 'Isiolo', latitude: 0.3556, longitude: 37.5833, county_code: '011' },
  { name: 'Meru', latitude: 0.0500, longitude: 37.6500, county_code: '012' },
  { name: 'Tharaka Nithi', latitude: -0.3000, longitude: 37.9500, county_code: '013' },
  { name: 'Embu', latitude: -0.5333, longitude: 37.4500, county_code: '014' },
  { name: 'Kitui', latitude: -1.3667, longitude: 38.0167, county_code: '015' },
  { name: 'Machakos', latitude: -1.5167, longitude: 37.2667, county_code: '016' },
  { name: 'Makueni', latitude: -2.2833, longitude: 37.8333, county_code: '017' },
  { name: 'Nyandarua', latitude: -0.5333, longitude: 36.5333, county_code: '018' },
  { name: 'Nyeri', latitude: -0.4167, longitude: 36.9500, county_code: '019' },
  { name: 'Kirinyaga', latitude: -0.5000, longitude: 37.3333, county_code: '020' },
  { name: 'Murang&apos;a', latitude: -0.7833, longitude: 37.1333, county_code: '021' },
  { name: 'Kiambu', latitude: -1.1833, longitude: 36.8333, county_code: '022' },
  { name: 'Turkana', latitude: 3.1167, longitude: 35.6000, county_code: '023' },
  { name: 'West Pokot', latitude: 1.4000, longitude: 35.1167, county_code: '024' },
  { name: 'Samburu', latitude: 1.1167, longitude: 36.6833, county_code: '025' },
  { name: 'Trans Nzoia', latitude: 1.0167, longitude: 35.0000, county_code: '026' },
  { name: 'Uasin Gishu', latitude: 0.5204, longitude: 35.2699, county_code: '027' },
  { name: 'Elgeyo Marakwet', latitude: 0.5167, longitude: 35.8500, county_code: '028' },
  { name: 'Nandi', latitude: 0.1833, longitude: 35.1333, county_code: '029' },
  { name: 'Baringo', latitude: 0.4667, longitude: 35.9667, county_code: '030' },
  { name: 'Laikipia', latitude: 0.2000, longitude: 36.9500, county_code: '031' },
  { name: 'Nakuru', latitude: -0.3031, longitude: 36.0800, county_code: '032' },
  { name: 'Narok', latitude: -1.0833, longitude: 35.8667, county_code: '033' },
  { name: 'Kajiado', latitude: -1.8500, longitude: 36.7833, county_code: '034' },
  { name: 'Kericho', latitude: -0.3667, longitude: 35.2833, county_code: '035' },
  { name: 'Bomet', latitude: -0.7833, longitude: 35.3333, county_code: '036' },
  { name: 'Kakamega', latitude: 0.2833, longitude: 34.7500, county_code: '037' },
  { name: 'Vihiga', latitude: 0.0500, longitude: 34.7167, county_code: '038' },
  { name: 'Bungoma', latitude: 0.5667, longitude: 34.5667, county_code: '039' },
  { name: 'Busia', latitude: 0.4667, longitude: 34.1167, county_code: '040' },
  { name: 'Siaya', latitude: 0.0667, longitude: 34.2833, county_code: '041' },
  { name: 'Kisumu', latitude: -0.0917, longitude: 34.7680, county_code: '042' },
  { name: 'Homa Bay', latitude: -0.5333, longitude: 34.4500, county_code: '043' },
  { name: 'Migori', latitude: -1.0667, longitude: 34.4667, county_code: '044' },
  { name: 'Kisii', latitude: -0.6833, longitude: 34.7667, county_code: '045' },
  { name: 'Nyamira', latitude: -0.5667, longitude: 34.9500, county_code: '046' },
  { name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, county_code: '047' }
];

// Climate resilience analysis types
const ANALYSIS_TYPES: AnalysisType[] = [
  {
    id: 'land_cover_classification',
    name: 'Land Cover Classification',
    description: 'Classify land types (forest, agriculture, urban, water) using satellite imagery',
    satellite_sources: ['sentinel-2', 'landsat-8'],
    icon: <MapIcon className="h-6 w-6" />
  },
  {
    id: 'vegetation_health',
    name: 'Vegetation Health Analysis',
    description: 'Monitor vegetation health and biomass using NDVI and other vegetation indices',
    satellite_sources: ['sentinel-2', 'landsat-8'],
    icon: <EyeIcon className="h-6 w-6" />
  },
  {
    id: 'water_body_detection',
    name: 'Water Body Detection',
    description: 'Detect and analyze water bodies, rivers, and lakes for flood monitoring',
    satellite_sources: ['sentinel-2', 'sentinel-1'],
    icon: <SparklesIcon className="h-6 w-6" />
  },
  {
    id: 'change_detection',
    name: 'Land Use Change Detection',
    description: 'Detect changes in land use over time for environmental monitoring',
    satellite_sources: ['sentinel-2', 'landsat-8'],
    icon: <ChartBarIcon className="h-6 w-6" />
  },
  {
    id: 'drought_monitoring',
    name: 'Drought Monitoring',
    description: 'Monitor drought conditions using temperature and vegetation data',
    satellite_sources: ['sentinel-2', 'landsat-8'],
    icon: <CloudIcon className="h-6 w-6" />
  },
  {
    id: 'soil_moisture',
    name: 'Soil Moisture Analysis',
    description: 'Analyze soil moisture content for agricultural planning',
    satellite_sources: ['sentinel-1', 'sentinel-2'],
    icon: <BeakerIcon className="h-6 w-6" />
  },
  {
    id: 'urban_expansion',
    name: 'Urban Expansion Analysis',
    description: 'Monitor urban growth and development patterns',
    satellite_sources: ['sentinel-2', 'landsat-8'],
    icon: <GlobeAltIcon className="h-6 w-6" />
  }
];

export function GeoAIAnalysis() {
  const [regions, setRegions] = useState<KenyaRegion[]>([]);
  const [analysisTypes, setAnalysisTypes] = useState<AnalysisType[]>(ANALYSIS_TYPES);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('');
  const [selectedSatelliteSource, setSelectedSatelliteSource] = useState<string>('sentinel-2');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  // Load Kenya regions from GeoJSON data
  useEffect(() => {
    loadKenyaRegions();
    loadAnalysisHistory();
  }, []);

  const loadKenyaRegions = async () => {
    try {
      const geoJSON = await loadKenyaBoundaries();
      const extractedRegions = extractRegions(geoJSON);
      setRegions(extractedRegions);
    } catch (error) {
      console.error('Error loading Kenya regions:', error);
      // Fallback to hardcoded counties if GeoJSON fails
      setRegions(KENYA_COUNTIES.map(county => ({
        name: county.name,
        county_code: county.county_code,
        geometry: { type: 'Polygon', coordinates: [] },
        properties: { latitude: county.latitude, longitude: county.longitude }
      })));
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const response = await fetch('/api/geoai/analysis-history');
      const data = await response.json();
      setAnalysisResults(data.analyses || []);
    } catch (error) {
      console.error('Error loading analysis history:', error);
    }
  };

  const startAnalysis = async () => {
    if (!selectedRegion || !selectedAnalysisType || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }

    const region = regions.find(r => r.name === selectedRegion);
    if (!region) return;

    setIsLoading(true);

    try {
      const request: AnalysisRequest = {
        region_name: selectedRegion,
        latitude: (region.properties.latitude as number) || 0,
        longitude: (region.properties.longitude as number) || 0,
        radius_km: radiusKm,
        start_date: startDate,
        end_date: endDate,
        analysis_type: selectedAnalysisType,
        satellite_source: selectedSatelliteSource
      };

      const response = await fetch('/api/geoai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: AnalysisResult = await response.json();
      
      setCurrentAnalysis(result);
      setAnalysisResults(prev => [result, ...prev]);

      // Poll for results
      pollAnalysisResults(result.analysis_id);

    } catch (error) {
      console.error('Error starting analysis:', error);
      alert('Failed to start analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const pollAnalysisResults = async (analysisId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/geoai/analysis/${analysisId}`);
        const result = await response.json();

        if (result.status === 'completed') {
          setCurrentAnalysis(result);
          setAnalysisResults(prev => 
            prev.map(analysis => 
              analysis.analysis_id === analysisId ? result : analysis
            )
          );
          clearInterval(pollInterval);
        } else if (result.status === 'failed') {
          setCurrentAnalysis(result);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling analysis results:', error);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => clearInterval(pollInterval), 600000);
  };

  const getAnalysisTypeIcon = (typeId: string) => {
    const analysisType = analysisTypes.find(type => type.id === typeId);
    return analysisType?.icon || <MapIcon className="h-6 w-6" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <GlobeAltIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">GeoAI Climate Analysis</h2>
            <p className="text-sm text-gray-600">
              AI-powered geospatial analysis for Kenya&apos;s climate resilience
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Start New Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Region Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kenya County *
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a county</option>
              {regions.map((region) => (
                <option key={region.county_code} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Analysis Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Type *
            </label>
            <select
              value={selectedAnalysisType}
              onChange={(e) => setSelectedAnalysisType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select analysis type</option>
              {analysisTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Satellite Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Satellite Source
            </label>
            <select
              value={selectedSatelliteSource}
              onChange={(e) => setSelectedSatelliteSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="sentinel-2">Sentinel-2 (Optical)</option>
              <option value="sentinel-1">Sentinel-1 (Radar)</option>
              <option value="landsat-8">Landsat-8 (Multispectral)</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Radius (km)
            </label>
            <input
              type="number"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Analysis Type Description */}
        {selectedAnalysisType && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              {getAnalysisTypeIcon(selectedAnalysisType)}
              <div>
                <h4 className="font-medium text-blue-900">
                  {analysisTypes.find(t => t.id === selectedAnalysisType)?.name}
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {analysisTypes.find(t => t.id === selectedAnalysisType)?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Start Analysis Button */}
        <div className="mt-6">
          <button
            onClick={startAnalysis}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <ClockIcon className="h-5 w-5 mr-2 animate-spin" />
                Starting Analysis...
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Analysis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Analysis Status */}
      {currentAnalysis && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Analysis</h3>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(currentAnalysis.status)}
            <div>
              <p className="font-medium text-gray-900">
                {analysisTypes.find(t => t.id === currentAnalysis.analysis_type)?.name || currentAnalysis.analysis_type} - {currentAnalysis.region_name}
              </p>
              <p className="text-sm text-gray-600">
                Started: {formatDate(currentAnalysis.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis History</h3>
        
        {analysisResults.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No analyses completed yet</p>
        ) : (
          <div className="space-y-3">
            {analysisResults.map((analysis) => (
              <div
                key={analysis.analysis_id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {getAnalysisTypeIcon(analysis.analysis_type)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {analysisTypes.find(t => t.id === analysis.analysis_type)?.name || analysis.analysis_type} - {analysis.region_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(analysis.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(analysis.status)}
                  <span className="text-sm text-gray-600">
                    {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
