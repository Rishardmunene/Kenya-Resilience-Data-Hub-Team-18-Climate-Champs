import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'user',
          organization VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create regions table for GIS data
    await sql`
      CREATE TABLE IF NOT EXISTS regions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          county_code VARCHAR(10) UNIQUE,
          county_name VARCHAR(255),
          sub_county VARCHAR(255),
          ward VARCHAR(255),
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          area_km2 DECIMAL(10, 2),
          population INTEGER,
          elevation_m INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create weather stations table
    await sql`
      CREATE TABLE IF NOT EXISTS weather_stations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          station_code VARCHAR(50) UNIQUE NOT NULL,
          station_name VARCHAR(255) NOT NULL,
          region_id UUID REFERENCES regions(id),
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          elevation_m INTEGER,
          station_type VARCHAR(50) DEFAULT 'automatic',
          is_active BOOLEAN DEFAULT true,
          installation_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create weather data table
    await sql`
      CREATE TABLE IF NOT EXISTS weather_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          station_id UUID REFERENCES weather_stations(id),
          timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
          temperature_celsius DECIMAL(4, 1),
          humidity_percent DECIMAL(5, 2),
          rainfall_mm DECIMAL(6, 2),
          wind_speed_kmh DECIMAL(5, 2),
          wind_direction_degrees INTEGER,
          atmospheric_pressure_hpa DECIMAL(7, 2),
          solar_radiation_wm2 DECIMAL(6, 2),
          visibility_km DECIMAL(4, 2),
          cloud_cover_percent INTEGER,
          data_quality VARCHAR(20) DEFAULT 'good',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(station_id, timestamp)
      );
    `;

    // Create climate indicators table
    await sql`
      CREATE TABLE IF NOT EXISTS climate_indicators (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          region_id UUID REFERENCES regions(id),
          indicator_name VARCHAR(255) NOT NULL,
          indicator_type VARCHAR(100) NOT NULL,
          value DECIMAL(10, 4) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          measurement_date DATE NOT NULL,
          data_source VARCHAR(255),
          confidence_level DECIMAL(3, 2),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create environmental data table
    await sql`
      CREATE TABLE IF NOT EXISTS environmental_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          region_id UUID REFERENCES regions(id),
          data_type VARCHAR(100) NOT NULL,
          parameter_name VARCHAR(255) NOT NULL,
          value DECIMAL(10, 4) NOT NULL,
          unit VARCHAR(50) NOT NULL,
          measurement_date DATE NOT NULL,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          depth_m DECIMAL(5, 2),
          data_source VARCHAR(255),
          quality_flag VARCHAR(20) DEFAULT 'good',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create disaster events table
    await sql`
      CREATE TABLE IF NOT EXISTS disaster_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type VARCHAR(100) NOT NULL,
          event_name VARCHAR(255),
          region_id UUID REFERENCES regions(id),
          start_date DATE NOT NULL,
          end_date DATE,
          severity_level VARCHAR(20),
          affected_population INTEGER,
          economic_loss_usd DECIMAL(15, 2),
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          description TEXT,
          data_source VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create data sources table
    await sql`
      CREATE TABLE IF NOT EXISTS data_sources (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source_name VARCHAR(255) NOT NULL,
          source_type VARCHAR(100) NOT NULL,
          organization VARCHAR(255),
          api_endpoint VARCHAR(500),
          update_frequency VARCHAR(50),
          last_updated TIMESTAMP WITH TIME ZONE,
          is_active BOOLEAN DEFAULT true,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_weather_data_station_timestamp ON weather_data(station_id, timestamp);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_weather_data_timestamp ON weather_data(timestamp);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_climate_indicators_region_date ON climate_indicators(region_id, measurement_date);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_environmental_data_region_type ON environmental_data(region_id, data_type);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_regions_location ON regions(latitude, longitude);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_weather_stations_location ON weather_stations(latitude, longitude);`;

    // Insert sample regions (Kenya counties)
    const sampleRegions = [
      { name: 'Nairobi', county_code: '047', county_name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, area_km2: 694.9, population: 4397073 },
      { name: 'Mombasa', county_code: '001', county_name: 'Mombasa', latitude: -4.0435, longitude: 39.6682, area_km2: 212.5, population: 1208333 },
      { name: 'Kisumu', county_code: '042', county_name: 'Kisumu', latitude: -0.0917, longitude: 34.7680, area_km2: 2085.8, population: 1155574 },
      { name: 'Nakuru', county_code: '032', county_name: 'Nakuru', latitude: -0.3031, longitude: 36.0800, area_km2: 7495.5, population: 2162203 },
      { name: 'Eldoret', county_code: '027', county_name: 'Uasin Gishu', latitude: 0.5204, longitude: 35.2699, area_km2: 2955.3, population: 1163186 }
    ];

    for (const region of sampleRegions) {
      await sql`
        INSERT INTO regions (name, county_code, county_name, latitude, longitude, area_km2, population)
        VALUES (${region.name}, ${region.county_code}, ${region.county_name}, ${region.latitude}, ${region.longitude}, ${region.area_km2}, ${region.population})
        ON CONFLICT (county_code) DO NOTHING
      `;
    }

    // Insert sample weather stations
    const sampleStations = [
      { station_code: 'WILSON', station_name: 'Wilson Airport', latitude: -1.3219, longitude: 36.8147, elevation_m: 1676 },
      { station_code: 'JKIA', station_name: 'Jomo Kenyatta International Airport', latitude: -1.3192, longitude: 36.9278, elevation_m: 1624 },
      { station_code: 'MOMBASA', station_name: 'Moi International Airport', latitude: -4.0348, longitude: 39.5945, elevation_m: 55 },
      { station_code: 'KISUMU', station_name: 'Kisumu Airport', latitude: -0.0861, longitude: 34.7289, elevation_m: 1157 },
      { station_code: 'ELDORET', station_name: 'Eldoret International Airport', latitude: 0.4044, longitude: 35.2389, elevation_m: 2134 }
    ];

    for (const station of sampleStations) {
      await sql`
        INSERT INTO weather_stations (station_code, station_name, latitude, longitude, elevation_m)
        VALUES (${station.station_code}, ${station.station_name}, ${station.latitude}, ${station.longitude}, ${station.elevation_m})
        ON CONFLICT (station_code) DO NOTHING
      `;
    }

    // Insert sample data sources
    const sampleDataSources = [
      { source_name: 'Kenya Meteorological Department', source_type: 'weather', organization: 'KMD', update_frequency: 'hourly' },
      { source_name: 'NASA POWER Project', source_type: 'climate', organization: 'NASA', update_frequency: 'daily' },
      { source_name: 'Copernicus Climate Data Store', source_type: 'climate', organization: 'ECMWF', update_frequency: 'daily' },
      { source_name: 'Kenya National Bureau of Statistics', source_type: 'demographic', organization: 'KNBS', update_frequency: 'annual' },
      { source_name: 'National Disaster Management Unit', source_type: 'disaster', organization: 'NDMU', update_frequency: 'as_occurred' }
    ];

    for (const source of sampleDataSources) {
      await sql`
        INSERT INTO data_sources (source_name, source_type, organization, update_frequency)
        VALUES (${source.source_name}, ${source.source_type}, ${source.organization}, ${source.update_frequency})
        ON CONFLICT DO NOTHING
      `;
    }

    // Create admin user
    const adminEmail = 'admin@kcrd.ke';
    const existingAdmin = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;

    if (existingAdmin.length === 0) {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('admin123456', saltRounds);

      await sql`
        INSERT INTO users (email, password_hash, first_name, last_name, role, organization) 
        VALUES (${adminEmail}, ${passwordHash}, 'Admin', 'User', 'admin', 'KCRD')
      `;
    }

    return NextResponse.json({
      message: 'Database initialized successfully with GIS and weather data schema',
      adminUser: {
        email: 'admin@kcrd.ke',
        password: 'admin123456'
      },
      tablesCreated: [
        'users', 'regions', 'weather_stations', 'weather_data', 
        'climate_indicators', 'environmental_data', 'disaster_events', 'data_sources'
      ],
      sampleData: {
        regions: sampleRegions.length,
        weatherStations: sampleStations.length,
        dataSources: sampleDataSources.length
      }
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Database initialization failed', details: error },
      { status: 500 }
    );
  }
}
