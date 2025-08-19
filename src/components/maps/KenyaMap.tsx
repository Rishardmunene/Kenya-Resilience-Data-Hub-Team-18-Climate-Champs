'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  loadKenyaBoundaries, 
  extractRegions, 
  getRegionCenter,
  KenyaRegion,
  GeoJSONCollection 
} from '@/utils/geoData';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface KenyaMapProps {
  selectedRegion?: string;
  onRegionClick?: (region: KenyaRegion) => void;
  showWeatherStations?: boolean;
  weatherStations?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    temperature?: number;
    humidity?: number;
  }>;
  showClimateData?: boolean;
  climateData?: Array<{
    region: string;
    value: number;
    type: 'temperature' | 'rainfall' | 'humidity';
  }>;
}

export function KenyaMap({ 
  selectedRegion, 
  onRegionClick, 
  showWeatherStations = false,
  weatherStations = [],
  showClimateData = false,
  climateData = []
}: KenyaMapProps) {
  const [kenyaData, setKenyaData] = useState<GeoJSONCollection | null>(null);
  const [regions, setRegions] = useState<KenyaRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Load Kenya boundaries on component mount
  useEffect(() => {
    loadKenyaData();
  }, []);

  const loadKenyaData = async () => {
    try {
      setLoading(true);
      const geoJSON = await loadKenyaBoundaries();
      setKenyaData(geoJSON);
      
      const extractedRegions = extractRegions(geoJSON);
      setRegions(extractedRegions);
      
      setError(null);
    } catch (err) {
      setError('Failed to load Kenya map data');
      console.error('Error loading Kenya data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Style function for GeoJSON regions
  const getRegionStyle = (feature: any) => {
    const regionName = feature.properties.name || feature.properties.NAME || '';
    const isSelected = selectedRegion && regionName.toLowerCase() === selectedRegion.toLowerCase();
    
    return {
      fillColor: isSelected ? '#3B82F6' : '#10B981',
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#1D4ED8' : '#059669',
      fillOpacity: isSelected ? 0.7 : 0.3
    };
  };

  // Handle region click
  const handleRegionClick = (feature: any, layer: L.Layer) => {
    const regionName = feature.properties.name || feature.properties.NAME || '';
    const region = regions.find(r => r.name === regionName);
    
    if (region && onRegionClick) {
      onRegionClick(region);
    }
  };

  // Get climate data for a region
  const getClimateDataForRegion = (regionName: string) => {
    return climateData.filter(data => 
      data.region.toLowerCase() === regionName.toLowerCase()
    );
  };

  // Create popup content for regions
  const createRegionPopup = (feature: any) => {
    const regionName = feature.properties.name || feature.properties.NAME || 'Unknown Region';
    const regionData = getClimateDataForRegion(regionName);
    
    let popupContent = `<h3 class="font-bold text-lg mb-2">${regionName}</h3>`;
    
    if (regionData.length > 0) {
      popupContent += '<div class="text-sm">';
      regionData.forEach(data => {
        const unit = data.type === 'temperature' ? '°C' : 
                    data.type === 'rainfall' ? 'mm' : '%';
        popupContent += `<p><strong>${data.type}:</strong> ${data.value}${unit}</p>`;
      });
      popupContent += '</div>';
    }
    
    return popupContent;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Kenya map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadKenyaData}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!kenyaData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No map data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={[-1.2921, 36.8219]} // Nairobi coordinates
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {/* Base tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Kenya boundaries */}
        <GeoJSON
          data={kenyaData}
          style={getRegionStyle}
          onEachFeature={(feature, layer) => {
            layer.on({
              click: () => handleRegionClick(feature, layer)
            });
            
            // Add popup
            const popupContent = createRegionPopup(feature);
            layer.bindPopup(popupContent);
          }}
        />

        {/* Weather stations */}
        {showWeatherStations && weatherStations.map((station, index) => (
          <Marker
            key={index}
            position={[station.latitude, station.longitude]}
            icon={L.divIcon({
              className: 'weather-station-marker',
              html: `
                <div class="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  W
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold">{station.name}</h3>
                {station.temperature && (
                  <p>Temperature: {station.temperature}°C</p>
                )}
                {station.humidity && (
                  <p>Humidity: {station.humidity}%</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Climate data markers */}
        {showClimateData && climateData.map((data, index) => {
          const region = regions.find(r => 
            r.name.toLowerCase() === data.region.toLowerCase()
          );
          
          if (!region) return null;
          
          const center = getRegionCenter(region.geometry);
          
          return (
            <Marker
              key={index}
              position={center}
              icon={L.divIcon({
                className: 'climate-data-marker',
                html: `
                  <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                    ${data.type.charAt(0).toUpperCase()}
                  </div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              })}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{data.region}</h3>
                  <p>{data.type}: {data.value}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
