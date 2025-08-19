import { neon } from '@neondatabase/serverless';

// Types for data import
interface WeatherDataPoint {
  station_code: string;
  timestamp: string;
  temperature_celsius?: number;
  humidity_percent?: number;
  rainfall_mm?: number;
  wind_speed_kmh?: number;
  wind_direction_degrees?: number;
  atmospheric_pressure_hpa?: number;
  solar_radiation_wm2?: number;
  visibility_km?: number;
  cloud_cover_percent?: number;
}

interface RegionData {
  name: string;
  county_code: string;
  county_name: string;
  latitude: number;
  longitude: number;
  area_km2?: number;
  population?: number;
  elevation_m?: number;
}

interface ClimateIndicator {
  region_name: string;
  indicator_name: string;
  indicator_type: string;
  value: number;
  unit: string;
  measurement_date: string;
  data_source?: string;
}

export class DataImportService {
  private sql: ReturnType<typeof neon>;

  constructor() {
    this.sql = neon(process.env.DATABASE_URL!);
  }

  async importWeatherData(data: WeatherDataPoint[]) {
    const results = [];
    
    for (const point of data) {
      try {
        // Validate data
        const validation = this.validateWeatherData(point);
        if (!validation.isValid) {
          console.warn(`Skipping invalid weather data: ${validation.issues.join(', ')}`);
          continue;
        }

        // Get station ID
        const stations = await this.sql`
          SELECT id FROM weather_stations WHERE station_code = ${point.station_code}
        ` as Array<{ id: string }>;
        
        if (stations.length === 0) {
          console.warn(`Weather station not found: ${point.station_code}`);
          continue;
        }

        const stationId = stations[0].id;

        // Insert weather data
        const result = await this.sql`
          INSERT INTO weather_data (
            station_id, timestamp, temperature_celsius, humidity_percent,
            rainfall_mm, wind_speed_kmh, wind_direction_degrees,
            atmospheric_pressure_hpa, solar_radiation_wm2,
            visibility_km, cloud_cover_percent
          ) VALUES (
            ${stationId}, ${point.timestamp}, ${point.temperature_celsius}, ${point.humidity_percent},
            ${point.rainfall_mm}, ${point.wind_speed_kmh}, ${point.wind_direction_degrees},
            ${point.atmospheric_pressure_hpa}, ${point.solar_radiation_wm2},
            ${point.visibility_km}, ${point.cloud_cover_percent}
          ) ON CONFLICT (station_id, timestamp) DO NOTHING
          RETURNING id
        ` as Array<{ id: string }>;

        if (result.length > 0) {
          results.push({ success: true, id: result[0].id });
        } else {
          results.push({ success: false, reason: 'Duplicate data' });
        }

      } catch (error) {
        console.error(`Error importing weather data for ${point.station_code}:`, error);
        results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return {
      total: data.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async importRegionData(data: RegionData[]) {
    const results = [];
    
    for (const region of data) {
      try {
        const result = await this.sql`
          INSERT INTO regions (
            name, county_code, county_name, latitude, longitude,
            area_km2, population, elevation_m
          ) VALUES (
            ${region.name}, ${region.county_code}, ${region.county_name},
            ${region.latitude}, ${region.longitude}, ${region.area_km2},
            ${region.population}, ${region.elevation_m}
          ) ON CONFLICT (county_code) DO UPDATE SET
            name = EXCLUDED.name,
            county_name = EXCLUDED.county_name,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            area_km2 = EXCLUDED.area_km2,
            population = EXCLUDED.population,
            elevation_m = EXCLUDED.elevation_m,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id
        ` as Array<{ id: string }>;

        results.push({ success: true, id: result[0].id });

      } catch (error) {
        console.error(`Error importing region data for ${region.name}:`, error);
        results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return {
      total: data.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async importClimateIndicators(data: ClimateIndicator[]) {
    const results = [];
    
    for (const indicator of data) {
      try {
        // Get region ID
        const regions = await this.sql`
          SELECT id FROM regions WHERE name = ${indicator.region_name}
        ` as Array<{ id: string }>;
        
        if (regions.length === 0) {
          console.warn(`Region not found: ${indicator.region_name}`);
          continue;
        }

        const regionId = regions[0].id;

        const result = await this.sql`
          INSERT INTO climate_indicators (
            region_id, indicator_name, indicator_type, value, unit,
            measurement_date, data_source
          ) VALUES (
            ${regionId}, ${indicator.indicator_name}, ${indicator.indicator_type},
            ${indicator.value}, ${indicator.unit}, ${indicator.measurement_date},
            ${indicator.data_source}
          ) RETURNING id
        ` as Array<{ id: string }>;

        results.push({ success: true, id: result[0].id });

      } catch (error) {
        console.error(`Error importing climate indicator for ${indicator.indicator_name}:`, error);
        results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return {
      total: data.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  async fetchNASAWeatherData(latitude: number, longitude: number, startDate: string, endDate: string) {
    try {
      // NASA POWER API endpoint
      const baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/regional';
      const params = new URLSearchParams({
        parameters: 'T2M,RH2M,PRECTOT',
        community: 'RE',
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        start: startDate,
        end: endDate,
        format: 'JSON'
      });

      const response = await fetch(`${baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Error fetching NASA weather data:', error);
      throw error;
    }
  }

  validateWeatherData(data: WeatherDataPoint): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!data.station_code) {
      issues.push('Missing station code');
    }

    if (!data.timestamp) {
      issues.push('Missing timestamp');
    }

    if (data.temperature_celsius !== undefined && (data.temperature_celsius < -50 || data.temperature_celsius > 60)) {
      issues.push('Temperature out of valid range (-50 to 60°C)');
    }

    if (data.humidity_percent !== undefined && (data.humidity_percent < 0 || data.humidity_percent > 100)) {
      issues.push('Humidity out of valid range (0 to 100%)');
    }

    if (data.rainfall_mm !== undefined && data.rainfall_mm < 0) {
      issues.push('Rainfall cannot be negative');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  generateSampleWeatherData(stationCode: string, days: number = 30): WeatherDataPoint[] {
    const data: WeatherDataPoint[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate realistic weather data
      const baseTemp = 25 + Math.sin(i * 0.2) * 5; // Daily temperature variation
      const temp = baseTemp + (Math.random() - 0.5) * 3; // Add some randomness
      const humidity = 60 + Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 10;
      const rainfall = Math.random() > 0.7 ? Math.random() * 20 : 0; // 30% chance of rain

      data.push({
        station_code: stationCode,
        timestamp: date.toISOString(),
        temperature_celsius: Math.round(temp * 10) / 10,
        humidity_percent: Math.round(humidity),
        rainfall_mm: Math.round(rainfall * 10) / 10,
        wind_speed_kmh: Math.round(Math.random() * 20 + 5),
        wind_direction_degrees: Math.round(Math.random() * 360),
        atmospheric_pressure_hpa: Math.round(1013 + (Math.random() - 0.5) * 20),
        solar_radiation_wm2: Math.round(Math.random() * 800 + 200),
        visibility_km: Math.round((Math.random() * 15 + 5) * 10) / 10,
        cloud_cover_percent: Math.round(Math.random() * 100)
      });
    }

    return data;
  }
}

export const dataImportService = new DataImportService();
