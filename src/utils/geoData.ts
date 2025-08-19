// Types for GeoJSON data
export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: Record<string, unknown>;
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface KenyaRegion {
  name: string;
  county_code: string;
  geometry: GeoJSONFeature['geometry'];
  properties: Record<string, unknown>;
}

// Load Kenya boundaries from GeoJSON file
export async function loadKenyaBoundaries(): Promise<GeoJSONCollection> {
  try {
    const response = await fetch('/data/geojson/kenya-boundaries.json');
    if (!response.ok) {
      throw new Error(`Failed to load Kenya boundaries: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading Kenya boundaries:', error);
    throw error;
  }
}

// Extract regions from GeoJSON data
export function extractRegions(geoJSON: GeoJSONCollection): KenyaRegion[] {
  return geoJSON.features.map((feature, index) => {
    // Try to extract region name from properties
    const properties = feature.properties || {};
    const name = (properties.name || 
                 properties.NAME || 
                 properties.county_name || 
                 properties.COUNTY_NAME || 
                 `Region ${index + 1}`) as string;
    
    const countyCode = (properties.county_code || 
                      properties.COUNTY_CODE || 
                      properties.code || 
                      String(index + 1).padStart(3, '0')) as string;

    return {
      name,
      county_code: countyCode,
      geometry: feature.geometry,
      properties
    };
  });
}

// Get region by name
export function getRegionByName(regions: KenyaRegion[], name: string): KenyaRegion | undefined {
  return regions.find(region => 
    region.name.toLowerCase() === name.toLowerCase() ||
    (region.properties.name as string)?.toLowerCase() === name.toLowerCase()
  );
}

// Get region by county code
export function getRegionByCode(regions: KenyaRegion[], code: string): KenyaRegion | undefined {
  return regions.find(region => region.county_code === code);
}

// Calculate region area (approximate)
export function calculateRegionArea(geometry: GeoJSONFeature['geometry']): number {
  // This is a simplified area calculation
  // For more accurate results, use a proper geospatial library
  if (geometry.type === 'Polygon') {
    const coordinates = geometry.coordinates[0] as number[][];
    let area = 0;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const [lon1, lat1] = coordinates[i] as [number, number];
      const [lon2, lat2] = coordinates[i + 1] as [number, number];
      area += (lon2 - lon1) * (lat2 + lat1) / 2;
    }
    
    return Math.abs(area) * 111.32 * 111.32; // Rough conversion to km²
  }
  
  return 0;
}

// Get bounding box for a region
export function getRegionBounds(geometry: GeoJSONFeature['geometry']): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  if (geometry.type === 'Polygon') {
    const coordinates = geometry.coordinates[0] as number[][];
    coordinates.forEach((coord) => {
      const [lon, lat] = coord as [number, number];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
    });
  }

  return {
    north: maxLat,
    south: minLat,
    east: maxLon,
    west: minLon
  };
}

// Convert to Leaflet-compatible format
export function convertToLeafletFormat(geoJSON: GeoJSONCollection) {
  return {
    type: 'FeatureCollection',
    features: geoJSON.features.map(feature => ({
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        ...feature.properties,
        popupContent: (feature.properties.name || feature.properties.NAME || 'Unknown Region') as string
      }
    }))
  };
}

// Get Kenya's overall bounding box
export function getKenyaBounds(): {
  north: number;
  south: number;
  east: number;
  west: number;
} {
  // Kenya's approximate bounds
  return {
    north: 4.0,    // Northern border
    south: -4.5,   // Southern border
    east: 42.0,    // Eastern border
    west: 33.0     // Western border
  };
}

// Validate coordinates are within Kenya
export function isWithinKenya(lat: number, lon: number): boolean {
  const bounds = getKenyaBounds();
  return lat >= bounds.south && lat <= bounds.north && 
         lon >= bounds.west && lon <= bounds.east;
}

// Get region center point
export function getRegionCenter(geometry: GeoJSONFeature['geometry']): [number, number] {
  if (geometry.type === 'Polygon') {
    const coordinates = geometry.coordinates[0] as number[][];
    let sumLat = 0, sumLon = 0;
    
    coordinates.forEach((coord) => {
      const [lon, lat] = coord as [number, number];
      sumLat += lat;
      sumLon += lon;
    });
    
    return [sumLat / coordinates.length, sumLon / coordinates.length];
  }
  
  return [0, 0];
}
