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
  sub_county?: string;
  ward?: string;
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
  data_source: string;
  confidence_level?: number;
}

export class DataImportService {
  private sql: any;

  constructor() {
    this.sql = neon(process.env.DATABASE_URL!);
  }

  /**
   * Import weather data from CSV or API
   */
  async importWeatherData(data: WeatherDataPoint[]) {
    try {
      const results = [];
      
      for (const point of data) {
        // Get station ID from station code
        const stations = await this.sql`
          SELECT id FROM weather_stations WHERE station_code = ${point.station_code}
        `;
        
        if (stations.length === 0) {
          console.warn(`Station ${point.station_code} not found`);
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
          ) ON CONFLICT (station_id, timestamp) DO UPDATE SET
            temperature_celsius = EXCLUDED.temperature_celsius,
            humidity_percent = EXCLUDED.humidity_percent,
            rainfall_mm = EXCLUDED.rainfall_mm,
            wind_speed_kmh = EXCLUDED.wind_speed_kmh,
            wind_direction_degrees = EXCLUDED.wind_direction_degrees,
            atmospheric_pressure_hpa = EXCLUDED.atmospheric_pressure_hpa,
            solar_radiation_wm2 = EXCLUDED.solar_radiation_wm2,
            visibility_km = EXCLUDED.visibility_km,
            cloud_cover_percent = EXCLUDED.cloud_cover_percent
          RETURNING id
        `;

        results.push(result[0]);
      }

      return {
        success: true,
        imported: results.length,
        total: data.length
      };

    } catch (error) {
      console.error('Error importing weather data:', error);
      throw error;
    }
  }

  /**
   * Import region data for GIS mapping
   */
  async importRegionData(data: RegionData[]) {
    try {
      const results = [];
      
      for (const region of data) {
        const result = await this.sql`
          INSERT INTO regions (
            name, county_code, county_name, sub_county, ward,
            latitude, longitude, area_km2, population, elevation_m
          ) VALUES (
            ${region.name}, ${region.county_code}, ${region.county_name}, ${region.sub_county}, ${region.ward},
            ${region.latitude}, ${region.longitude}, ${region.area_km2}, ${region.population}, ${region.elevation_m}
          ) ON CONFLICT (county_code) DO UPDATE SET
            name = EXCLUDED.name,
            county_name = EXCLUDED.county_name,
            sub_county = EXCLUDED.sub_county,
            ward = EXCLUDED.ward,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            area_km2 = EXCLUDED.area_km2,
            population = EXCLUDED.population,
            elevation_m = EXCLUDED.elevation_m,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id
        `;

        results.push(result[0]);
      }

      return {
        success: true,
        imported: results.length,
        total: data.length
      };

    } catch (error) {
      console.error('Error importing region data:', error);
      throw error;
    }
  }

  /**
   * Import climate indicators
   */
  async importClimateIndicators(data: ClimateIndicator[]) {
    try {
      const results = [];
      
      for (const indicator of data) {
        // Get region ID from region name
        const regions = await this.sql`
          SELECT id FROM regions WHERE county_name = ${indicator.region_name}
        `;
        
        if (regions.length === 0) {
          console.warn(`Region ${indicator.region_name} not found`);
          continue;
        }

        const regionId = regions[0].id;

        const result = await this.sql`
          INSERT INTO climate_indicators (
            region_id, indicator_name, indicator_type, value, unit,
            measurement_date, data_source, confidence_level
          ) VALUES (
            ${regionId}, ${indicator.indicator_name}, ${indicator.indicator_type}, ${indicator.value}, ${indicator.unit},
            ${indicator.measurement_date}, ${indicator.data_source}, ${indicator.confidence_level}
          ) RETURNING id
        `;

        results.push(result[0]);
      }

      return {
        success: true,
        imported: results.length,
        total: data.length
      };

    } catch (error) {
      console.error('Error importing climate indicators:', error);
      throw error;
    }
  }

  /**
   * Fetch weather data from NASA POWER API
   */
  async fetchNASAWeatherData(latitude: number, longitude: number, startDate: string, endDate: string) {
    try {
      const url = `https://power.larc.nasa.gov/api/temporal/daily/regional?parameters=T2M,PRECTOT,RH2M,WS2M&community=RE&longitude=${longitude}&latitude=${latitude}&start=${startDate}&end=${endDate}&format=JSON`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (!data.properties || !data.properties.parameter) {
        throw new Error('Invalid NASA POWER API response');
      }

      const parameters = data.properties.parameter;
      const dates = Object.keys(parameters.T2M);

      const weatherData: WeatherDataPoint[] = dates.map(date => ({
        station_code: 'NASA_POWER',
        timestamp: date,
        temperature_celsius: parameters.T2M[date] - 273.15, // Convert Kelvin to Celsius
        rainfall_mm: parameters.PRECTOT[date],
        humidity_percent: parameters.RH2M[date],
        wind_speed_kmh: parameters.WS2M[date] * 3.6 // Convert m/s to km/h
      }));

      return weatherData;

    } catch (error) {
      console.error('Error fetching NASA weather data:', error);
      throw error;
    }
  }

  /**
   * Validate weather data quality
   */
  validateWeatherData(data: WeatherDataPoint): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    // Temperature validation
    if (data.temperature_celsius !== undefined) {
      if (data.temperature_celsius < -50 || data.temperature_celsius > 60) {
        issues.push(`Temperature ${data.temperature_celsius}°C is outside valid range (-50 to 60°C)`);
      }
    }

    // Humidity validation
    if (data.humidity_percent !== undefined) {
      if (data.humidity_percent < 0 || data.humidity_percent > 100) {
        issues.push(`Humidity ${data.humidity_percent}% is outside valid range (0 to 100%)`);
      }
    }

    // Rainfall validation
    if (data.rainfall_mm !== undefined) {
      if (data.rainfall_mm < 0 || data.rainfall_mm > 1000) {
        issues.push(`Rainfall ${data.rainfall_mm}mm is outside valid range (0 to 1000mm)`);
      }
    }

    // Wind speed validation
    if (data.wind_speed_kmh !== undefined) {
      if (data.wind_speed_kmh < 0 || data.wind_speed_kmh > 200) {
        issues.push(`Wind speed ${data.wind_speed_kmh} km/h is outside valid range (0 to 200 km/h)`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Generate sample weather data for testing
   */
  generateSampleWeatherData(stationCode: string, days: number = 30): WeatherDataPoint[] {
    const data: WeatherDataPoint[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Generate realistic weather data for Kenya
      const baseTemp = 25 + Math.sin(i * 0.2) * 5; // Daily temperature variation
      const temp = baseTemp + (Math.random() - 0.5) * 3; // Add some randomness
      
      data.push({
        station_code: stationCode,
        timestamp: date.toISOString(),
        temperature_celsius: Math.round(temp * 10) / 10,
        humidity_percent: Math.round(60 + Math.random() * 30),
        rainfall_mm: Math.random() > 0.7 ? Math.round(Math.random() * 20 * 10) / 10 : 0,
        wind_speed_kmh: Math.round(Math.random() * 15 * 10) / 10,
        wind_direction_degrees: Math.floor(Math.random() * 360),
        atmospheric_pressure_hpa: Math.round((1013 + (Math.random() - 0.5) * 20) * 100) / 100,
        solar_radiation_wm2: Math.round((800 + Math.random() * 400) * 10) / 10,
        visibility_km: Math.round((8 + Math.random() * 4) * 10) / 10,
        cloud_cover_percent: Math.floor(Math.random() * 100)
      });
    }

    return data;
  }
}

// Export singleton instance
export const dataImportService = new DataImportService();
