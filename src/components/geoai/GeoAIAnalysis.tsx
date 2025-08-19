'use client';

import { useState, useEffect } from 'react';
import { 
  MapIcon, 
  SatelliteIcon, 
  ChartBarIcon, 
  CloudIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

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
  results: any;
  metadata: any;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
}

interface Region {
  name: string;
  latitude: number;
  longitude: number;
  county_code: string;
}

interface AnalysisType {
  id: string;
  name: string;
  description: string;
  satellite_sources: string[];
}

export function GeoAIAnalysis() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [analysisTypes, setAnalysisTypes] = useState<AnalysisType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('');
  const [selectedSatelliteSource, setSelectedSatelliteSource] = useState<string>('sentinel-2');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  // Load regions and analysis types on component mount
  useEffect(() => {
    loadRegions();
    loadAnalysisTypes();
    loadAnalysisHistory();
  }, []);

  const loadRegions = async () => {
    try {
      const response = await fetch('/api/geoai/regions');
      const data = await response.json();
      setRegions(data.regions || []);
    } catch (error) {
      console.error('Error loading regions:', error);
    }
  };

  const loadAnalysisTypes = async () => {
    try {
      const response = await fetch('/api/geoai/analysis-types');
      const data = await response.json();
      setAnalysisTypes(data.analysis_types || []);
    } catch (error) {
      console.error('Error loading analysis types:', error);
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
        latitude: region.latitude,
        longitude: region.longitude,
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

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'land_cover':
        return <MapIcon className="h-6 w-6" />;
      case 'change_detection':
        return <ChartBarIcon className="h-6 w-6" />;
      case 'vegetation':
        return <CloudIcon className="h-6 w-6" />;
      case 'water':
        return <SatelliteIcon className="h-6 w-6" />;
      default:
        return <MapIcon className="h-6 w-6" />;
    }
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
          <SatelliteIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">GeoAI Analysis</h2>
            <p className="text-sm text-gray-600">
              AI-powered geospatial analysis using satellite imagery
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
              Region *
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a region</option>
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
              <option value="sentinel-2">Sentinel-2</option>
              <option value="landsat-8">Landsat-8</option>
              <option value="sentinel-1">Sentinel-1</option>
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
                {currentAnalysis.analysis_type.replace('_', ' ').toUpperCase()} - {currentAnalysis.region_name}
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
                      {analysis.analysis_type.replace('_', ' ').toUpperCase()} - {analysis.region_name}
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
