'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CalendarIcon, MapIcon } from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TemperatureDataPoint {
  date: string;
  temperature: number;
  humidity?: number;
  rainfall?: number;
  region: string;
}

interface TemperatureChartProps {
  data: TemperatureDataPoint[];
  title?: string;
  height?: number;
  showControls?: boolean;
}

interface RegionOption {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
}

const KENYA_REGIONS: RegionOption[] = [
  { id: 'nairobi', name: 'Nairobi', coordinates: { lat: -1.2921, lng: 36.8219 } },
  { id: 'mombasa', name: 'Mombasa', coordinates: { lat: -4.0435, lng: 39.6682 } },
  { id: 'kisumu', name: 'Kisumu', coordinates: { lat: -0.0917, lng: 34.7680 } },
  { id: 'nakuru', name: 'Nakuru', coordinates: { lat: -0.3031, lng: 36.0800 } },
  { id: 'eldoret', name: 'Eldoret', coordinates: { lat: 0.5204, lng: 35.2699 } },
  { id: 'meru', name: 'Meru', coordinates: { lat: 0.0500, lng: 37.6500 } },
  { id: 'nyeri', name: 'Nyeri', coordinates: { lat: -0.4167, lng: 36.9500 } },
  { id: 'thika', name: 'Thika', coordinates: { lat: -1.0332, lng: 37.0692 } },
];

type DataType = 'temperature' | 'humidity' | 'rainfall' | 'all';
type TimeRange = '7days' | '30days' | '3months' | '6months';

export function TemperatureChart({ 
  data, 
  title = 'Climate Data Trends', 
  height = 400,
  showControls = true 
}: TemperatureChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [selectedDataType, setSelectedDataType] = useState<DataType>('temperature');
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('7days');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['nairobi']);
  const [filteredData, setFilteredData] = useState<TemperatureDataPoint[]>([]);

  // Generate sample data for all regions
  useEffect(() => {
    if (!data || data.length === 0) {
      const sampleData = generateMultiRegionData();
      setFilteredData(sampleData);
    } else {
      setFilteredData(data);
    }
  }, [data]);

  // Filter data based on selected criteria
  useEffect(() => {
    let filtered = filteredData;

    // Filter by time range
    const now = new Date();
    const startDate = new Date();
    
    switch (selectedTimeRange) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
    }

    filtered = filtered.filter(point => {
      const pointDate = new Date(point.date);
      return pointDate >= startDate && pointDate <= now;
    });

    // Filter by selected regions
    filtered = filtered.filter(point => 
      selectedRegions.includes(point.region.toLowerCase())
    );

    updateChartData(filtered);
  }, [filteredData, selectedDataType, selectedTimeRange, selectedRegions]);

  const generateMultiRegionData = (): TemperatureDataPoint[] => {
    const data: TemperatureDataPoint[] = [];
    const days = 180; // 6 months of data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    KENYA_REGIONS.forEach(region => {
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Generate realistic climate data based on region
        const baseTemp = getBaseTemperature(region.id);
        const temp = baseTemp + Math.sin(i * 0.1) * 3 + (Math.random() - 0.5) * 4;
        const humidity = getBaseHumidity(region.id) + Math.sin(i * 0.15) * 15 + (Math.random() - 0.5) * 10;
        const rainfall = Math.random() > 0.8 ? Math.random() * 25 : 0; // 20% chance of rain

        data.push({
          date: date.toISOString(),
          temperature: Math.round(temp * 10) / 10,
          humidity: Math.round(humidity),
          rainfall: Math.round(rainfall * 10) / 10,
          region: region.id,
        });
      }
    });

    return data;
  };

  const getBaseTemperature = (regionId: string): number => {
    const temps: Record<string, number> = {
      nairobi: 22,
      mombasa: 28,
      kisumu: 24,
      nakuru: 20,
      eldoret: 18,
      meru: 21,
      nyeri: 19,
      thika: 23,
    };
    return temps[regionId] || 22;
  };

  const getBaseHumidity = (regionId: string): number => {
    const humidity: Record<string, number> = {
      nairobi: 65,
      mombasa: 80,
      kisumu: 70,
      nakuru: 60,
      eldoret: 55,
      meru: 68,
      nyeri: 62,
      thika: 67,
    };
    return humidity[regionId] || 65;
  };

  const updateChartData = (data: TemperatureDataPoint[]) => {
    if (!data || data.length === 0) {
      setChartData(null);
      return;
    }

    // Group data by region
    const regionData: Record<string, TemperatureDataPoint[]> = {};
    data.forEach(point => {
      if (!regionData[point.region]) {
        regionData[point.region] = [];
      }
      regionData[point.region].push(point);
    });

    // Sort data by date for each region
    Object.keys(regionData).forEach(region => {
      regionData[region].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    // Create labels from the first region's dates
    const firstRegion = Object.keys(regionData)[0];
    const labels = regionData[firstRegion]?.map(point => {
      const date = new Date(point.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }) || [];

    const datasets: any[] = [];

    // Color palette for different regions
    const colors = [
      'rgb(239, 68, 68)',   // red
      'rgb(59, 130, 246)',  // blue
      'rgb(34, 197, 94)',   // green
      'rgb(251, 146, 60)',  // orange
      'rgb(168, 85, 247)',  // purple
      'rgb(236, 72, 153)',  // pink
      'rgb(14, 165, 233)',  // sky
      'rgb(132, 204, 22)',  // lime
    ];

    let colorIndex = 0;

    // Create datasets based on selected data type
    Object.keys(regionData).forEach(regionId => {
      const regionName = KENYA_REGIONS.find(r => r.id === regionId)?.name || regionId;
      const color = colors[colorIndex % colors.length];
      
      if (selectedDataType === 'temperature' || selectedDataType === 'all') {
        datasets.push({
          label: `${regionName} Temperature (°C)`,
          data: regionData[regionId].map(point => point.temperature),
          borderColor: color,
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          fill: selectedDataType === 'temperature',
          tension: 0.4,
          yAxisID: 'y',
        });
      }

      if (selectedDataType === 'humidity' || selectedDataType === 'all') {
        datasets.push({
          label: `${regionName} Humidity (%)`,
          data: regionData[regionId].map(point => point.humidity || 0),
          borderColor: color.replace('rgb', 'rgba').replace(')', ', 0.7)'),
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          fill: false,
          tension: 0.4,
          yAxisID: selectedDataType === 'all' ? 'y1' : 'y',
          borderDash: selectedDataType === 'all' ? [5, 5] : undefined,
        });
      }

      if (selectedDataType === 'rainfall' || selectedDataType === 'all') {
        datasets.push({
          label: `${regionName} Rainfall (mm)`,
          data: regionData[regionId].map(point => point.rainfall || 0),
          borderColor: color.replace('rgb', 'rgba').replace(')', ', 0.5)'),
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          fill: false,
          tension: 0.4,
          yAxisID: selectedDataType === 'all' ? 'y2' : 'y',
          borderDash: selectedDataType === 'all' ? [2, 2] : undefined,
        });
      }

      colorIndex++;
    });

    setChartData({
      labels,
      datasets,
    });
  };

  const getSelectedRegionsText = () => {
    if (selectedRegions.length === 1) {
      return KENYA_REGIONS.find(r => r.id === selectedRegions[0])?.name || selectedRegions[0];
    }
    return `${selectedRegions.length} Regions`;
  };

  const getTimeRangeText = () => {
    switch (selectedTimeRange) {
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '3months':
        return 'Last 3 Months';
      case '6months':
        return 'Last 6 Months';
      default:
        return 'Last 7 Days';
    }
  };

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  const getScaleOptions = () => {
    const baseScales: any = {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: getYAxisLabel(),
        },
      },
    };

    if (selectedDataType === 'all') {
      baseScales.y1 = {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)',
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      };

      baseScales.y2 = {
        type: 'linear',
        display: false,
        position: 'right',
        title: {
          display: true,
          text: 'Rainfall (mm)',
        },
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
      };
    }

    return baseScales;
  };

  const getYAxisLabel = () => {
    switch (selectedDataType) {
      case 'temperature':
        return 'Temperature (°C)';
      case 'humidity':
        return 'Humidity (%)';
      case 'rainfall':
        return 'Rainfall (mm)';
      case 'all':
        return 'Temperature (°C)';
      default:
        return 'Value';
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${title} - ${getSelectedRegionsText()} (${getTimeRangeText()})`,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: getScaleOptions(),
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading climate data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Controls */}
      {showControls && (
        <div className="mb-6 space-y-4">
          {/* Data Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'temperature', label: 'Temperature' },
                { value: 'humidity', label: 'Humidity' },
                { value: 'rainfall', label: 'Rainfall' },
                { value: 'all', label: 'All Data' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDataType(option.value as DataType)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDataType === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="inline h-4 w-4 mr-1" />
              Time Range
            </label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>

          {/* Region Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapIcon className="inline h-4 w-4 mr-1" />
              Regions
            </label>
            <div className="flex flex-wrap gap-2">
              {KENYA_REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedRegions.includes(region.id)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Data Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Data Summary</h4>
        <p className="text-sm text-gray-600">
          Showing {selectedDataType === 'all' ? 'temperature, humidity, and rainfall' : selectedDataType} data 
          for {getSelectedRegionsText()} over the {getTimeRangeText().toLowerCase()}.
          {selectedRegions.length > 1 && ` Comparing ${selectedRegions.length} regions.`}
        </p>
      </div>
    </div>
  );
}

// Sample data generator for testing (legacy support)
export function generateSampleTemperatureData(days: number = 30): TemperatureDataPoint[] {
  const data: TemperatureDataPoint[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic temperature data for Kenya
    const baseTemp = 25 + Math.sin(i * 0.2) * 5; // Daily temperature variation
    const temp = baseTemp + (Math.random() - 0.5) * 3; // Add some randomness
    const humidity = 60 + Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 10;
    const rainfall = Math.random() > 0.7 ? Math.random() * 20 : 0; // 30% chance of rain

    data.push({
      date: date.toISOString(),
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(humidity),
      rainfall: Math.round(rainfall * 10) / 10,
      region: 'nairobi', // Default region for legacy compatibility
    });
  }

  return data;
}
