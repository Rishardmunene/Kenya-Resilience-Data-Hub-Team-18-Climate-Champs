-- Kenya Climate Resilience Dashboard Database Schema (Simplified)
-- This script initializes the database with tables for climate data

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    organization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create regions table (simplified without PostGIS)
CREATE TABLE IF NOT EXISTS regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- county, sub-county, ward
    parent_id UUID REFERENCES regions(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create climate_data table
CREATE TABLE IF NOT EXISTS climate_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID NOT NULL REFERENCES regions(id),
    data_type VARCHAR(50) NOT NULL, -- temperature, rainfall, air_quality, etc.
    value DECIMAL(10, 4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(100) NOT NULL,
    confidence_level DECIMAL(3, 2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID NOT NULL REFERENCES regions(id),
    alert_type VARCHAR(50) NOT NULL, -- pollution, drought, flood, etc.
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    title VARCHAR(255) NOT NULL,
    description TEXT,
    threshold_value DECIMAL(10, 4),
    current_value DECIMAL(10, 4),
    status VARCHAR(20) DEFAULT 'active', -- active, resolved, dismissed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID REFERENCES regions(id),
    insight_type VARCHAR(50) NOT NULL, -- recommendation, trend, anomaly
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL, -- low, medium, high, critical
    category VARCHAR(50) NOT NULL, -- climate, pollution, infrastructure
    actionable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL, -- climate_summary, pollution_analysis, etc.
    parameters JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create data_sources table
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    api_key VARCHAR(255),
    data_types TEXT[], -- array of supported data types
    update_frequency VARCHAR(50), -- hourly, daily, weekly
    last_updated TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, error
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_climate_data_region_timestamp ON climate_data(region_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_climate_data_type_timestamp ON climate_data(data_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_region_status ON alerts(region_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity_status ON alerts(severity, status);
CREATE INDEX IF NOT EXISTS idx_insights_region_priority ON insights(region_id, priority);
CREATE INDEX IF NOT EXISTS idx_reports_user_status ON reports(user_id, status);

-- Insert sample regions
INSERT INTO regions (name, code, type, latitude, longitude) VALUES
('Nairobi', 'NBI', 'county', -1.2921, 36.8219),
('Mombasa', 'MBS', 'county', -4.0435, 39.6682),
('Kisumu', 'KSM', 'county', -0.0917, 34.7680),
('Nakuru', 'NKR', 'county', -0.3031, 36.0800),
('Eldoret', 'ELD', 'county', 0.5204, 35.2697)
ON CONFLICT (code) DO NOTHING;

-- Insert sample data source
INSERT INTO data_sources (name, description, data_types, update_frequency) VALUES
('Kenya Meteorological Department', 'Official weather data from KMD', ARRAY['temperature', 'rainfall', 'humidity'], 'hourly'),
('Air Quality Monitoring Network', 'Real-time air quality data', ARRAY['air_quality', 'pollution'], 'hourly'),
('Satellite Data', 'Remote sensing data from various satellites', ARRAY['temperature', 'vegetation', 'land_use'], 'daily')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
