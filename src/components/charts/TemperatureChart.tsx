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
}

interface TemperatureChartProps {
  data: TemperatureDataPoint[];
  title?: string;
  height?: number;
  showHumidity?: boolean;
  showRainfall?: boolean;
}

export function TemperatureChart({ 
  data, 
  title = 'Temperature Trends', 
  height = 300,
  showHumidity = false,
  showRainfall = false 
}: TemperatureChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const labels = data.map(point => {
        const date = new Date(point.date);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      });

      const datasets = [
        {
          label: 'Temperature (°C)',
          data: data.map(point => point.temperature),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        }
      ];

      if (showHumidity && data.some(point => point.humidity !== undefined)) {
        datasets.push({
          label: 'Humidity (%)',
          data: data.map(point => point.humidity || 0),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        });
      }

      if (showRainfall && data.some(point => point.rainfall !== undefined)) {
        datasets.push({
          label: 'Rainfall (mm)',
          data: data.map(point => point.rainfall || 0),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y2',
        });
      }

      setChartData({
        labels,
        datasets,
      });
    }
  }, [data, showHumidity, showRainfall]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
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
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        min: Math.min(...data.map(point => point.temperature)) - 5,
        max: Math.max(...data.map(point => point.temperature)) + 5,
      },
      ...(showHumidity && {
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Humidity (%)',
          },
          min: 0,
          max: 100,
          grid: {
            drawOnChartArea: false,
          },
        },
      }),
      ...(showRainfall && {
        y2: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          title: {
            display: true,
            text: 'Rainfall (mm)',
          },
          min: 0,
          max: Math.max(...data.map(point => point.rainfall || 0)) + 10,
          grid: {
            drawOnChartArea: false,
          },
        },
      }),
    },
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No temperature data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

// Sample data generator for testing
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
    });
  }

  return data;
}
