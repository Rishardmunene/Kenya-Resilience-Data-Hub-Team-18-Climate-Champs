# Database Schema & Data Integration Guide

## 🗄️ **Database Overview**

The Kenya Climate Resilience Dashboard uses **Neon PostgreSQL** (serverless) on Vercel with the following key features:

- **Spatial Data Support**: Latitude/longitude coordinates for GIS mapping
- **Time Series Data**: Weather and climate measurements over time
- **Multi-source Integration**: Support for various data providers
- **Scalable Architecture**: Serverless database that scales automatically

## 📊 **Database Tables & Data Types**

### **1. Users Table**
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50),
  organization VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### **2. Regions Table (GIS Data)**
```sql
regions (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  county_code VARCHAR(10) UNIQUE,
  county_name VARCHAR(255),
  sub_county VARCHAR(255),
  ward VARCHAR(255),
  latitude DECIMAL(10, 8),      -- GPS coordinates
  longitude DECIMAL(11, 8),     -- GPS coordinates
  area_km2 DECIMAL(10, 2),      -- Area in square kilometers
  population INTEGER,           -- Population count
  elevation_m INTEGER,          -- Elevation in meters
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### **3. Weather Stations Table**
```sql
weather_stations (
  id UUID PRIMARY KEY,
  station_code VARCHAR(50) UNIQUE,
  station_name VARCHAR(255),
  region_id UUID REFERENCES regions(id),
  latitude DECIMAL(10, 8),      -- GPS coordinates
  longitude DECIMAL(11, 8),     -- GPS coordinates
  elevation_m INTEGER,          -- Station elevation
  station_type VARCHAR(50),     -- 'automatic', 'manual', 'satellite'
  is_active BOOLEAN,
  installation_date DATE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### **4. Weather Data Table (Time Series)**
```sql
weather_data (
  id UUID PRIMARY KEY,
  station_id UUID REFERENCES weather_stations(id),
  timestamp TIMESTAMP WITH TIME ZONE,
  temperature_celsius DECIMAL(4, 1),      -- Temperature in °C
  humidity_percent DECIMAL(5, 2),         -- Relative humidity %
  rainfall_mm DECIMAL(6, 2),              -- Rainfall in mm
  wind_speed_kmh DECIMAL(5, 2),           -- Wind speed km/h
  wind_direction_degrees INTEGER,         -- Wind direction 0-360°
  atmospheric_pressure_hpa DECIMAL(7, 2), -- Pressure in hPa
  solar_radiation_wm2 DECIMAL(6, 2),      -- Solar radiation W/m²
  visibility_km DECIMAL(4, 2),            -- Visibility in km
  cloud_cover_percent INTEGER,            -- Cloud cover 0-100%
  data_quality VARCHAR(20),               -- 'good', 'fair', 'poor'
  created_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(station_id, timestamp)
)
```

### **5. Climate Indicators Table**
```sql
climate_indicators (
  id UUID PRIMARY KEY,
  region_id UUID REFERENCES regions(id),
  indicator_name VARCHAR(255),            -- e.g., 'Average Temperature'
  indicator_type VARCHAR(100),            -- 'temperature', 'rainfall', 'drought'
  value DECIMAL(10, 4),                   -- Numeric value
  unit VARCHAR(50),                       -- '°C', 'mm', 'index'
  measurement_date DATE,
  data_source VARCHAR(255),               -- Source organization
  confidence_level DECIMAL(3, 2),         -- 0.00-1.00 confidence
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### **6. Environmental Data Table**
```sql
environmental_data (
  id UUID PRIMARY KEY,
  region_id UUID REFERENCES regions(id),
  data_type VARCHAR(100),                 -- 'soil', 'water', 'air', 'vegetation'
  parameter_name VARCHAR(255),            -- e.g., 'pH', 'Dissolved Oxygen'
  value DECIMAL(10, 4),                   -- Numeric value
  unit VARCHAR(50),                       -- Unit of measurement
  measurement_date DATE,
  latitude DECIMAL(10, 8),                -- Specific location
  longitude DECIMAL(11, 8),               -- Specific location
  depth_m DECIMAL(5, 2),                  -- Depth for soil/water samples
  data_source VARCHAR(255),
  quality_flag VARCHAR(20),               -- 'good', 'fair', 'poor'
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### **7. Disaster Events Table**
```sql
disaster_events (
  id UUID PRIMARY KEY,
  event_type VARCHAR(100),                -- 'flood', 'drought', 'landslide'
  event_name VARCHAR(255),
  region_id UUID REFERENCES regions(id),
  start_date DATE,
  end_date DATE,
  severity_level VARCHAR(20),             -- 'low', 'medium', 'high', 'critical'
  affected_population INTEGER,
  economic_loss_usd DECIMAL(15, 2),       -- Economic impact in USD
  latitude DECIMAL(10, 8),                -- Event location
  longitude DECIMAL(11, 8),               -- Event location
  description TEXT,
  data_source VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### **8. Data Sources Table**
```sql
data_sources (
  id UUID PRIMARY KEY,
  source_name VARCHAR(255),               -- Organization name
  source_type VARCHAR(100),               -- 'weather', 'climate', 'demographic'
  organization VARCHAR(255),              -- Full organization name
  api_endpoint VARCHAR(500),              -- API URL if available
  update_frequency VARCHAR(50),           -- 'hourly', 'daily', 'monthly'
  last_updated TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

## 🌍 **GIS Data Integration**

### **Coordinate Systems**
- **Format**: Decimal degrees (WGS84)
- **Latitude**: -4.0435 to 4.0000 (Kenya's latitude range)
- **Longitude**: 33.0000 to 42.0000 (Kenya's longitude range)
- **Precision**: 8 decimal places for high accuracy

### **Sample GIS Data**
```json
{
  "name": "Nairobi",
  "county_code": "047",
  "county_name": "Nairobi",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "area_km2": 694.9,
  "population": 4397073
}
```

## 🌤️ **Weather Data Integration**

### **Data Sources**
1. **Kenya Meteorological Department (KMD)**
   - Real-time weather station data
   - Historical climate records
   - API: Available for registered users

2. **NASA POWER Project**
   - Global weather and climate data
   - Free API access
   - Resolution: 0.5° x 0.5° grid

3. **Copernicus Climate Data Store**
   - European climate data
   - High-resolution datasets
   - Free access with registration

### **Weather Data Format**
```json
{
  "station_id": "uuid",
  "timestamp": "2024-01-15T10:30:00Z",
  "temperature_celsius": 25.5,
  "humidity_percent": 65.2,
  "rainfall_mm": 0.0,
  "wind_speed_kmh": 12.3,
  "wind_direction_degrees": 180,
  "atmospheric_pressure_hpa": 1013.25,
  "solar_radiation_wm2": 850.0,
  "visibility_km": 10.0,
  "cloud_cover_percent": 20
}
```

## 🔗 **API Integration Methods**

### **1. Real-time Weather Data**
```javascript
// Fetch current weather for a station
const response = await fetch('/api/data/weather?station_code=WILSON&limit=1');
const weatherData = await response.json();
```

### **2. Historical Climate Data**
```javascript
// Fetch historical data for analysis
const response = await fetch('/api/data/weather?station_code=WILSON&start_date=2024-01-01&end_date=2024-01-31');
const historicalData = await response.json();
```

### **3. Regional GIS Data**
```javascript
// Fetch all regions for mapping
const response = await fetch('/api/data/regions');
const regions = await response.json();
```

### **4. Climate Indicators**
```javascript
// Fetch climate indicators for a region
const response = await fetch('/api/data/climate-indicators?region_id=uuid');
const indicators = await response.json();
```

## 📡 **External Data Integration**

### **1. KMD API Integration**
```javascript
// Example KMD API call
const kmdResponse = await fetch('https://api.kmd.go.ke/weather/current', {
  headers: {
    'Authorization': `Bearer ${KMD_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

### **2. NASA POWER API**
```javascript
// NASA POWER API for climate data
const nasaResponse = await fetch(
  `https://power.larc.nasa.gov/api/temporal/daily/regional?parameters=T2M,PRECTOT&community=RE&longitude=${longitude}&latitude=${latitude}&start=20240101&end=20240131&format=JSON`
);
```

### **3. Copernicus Climate Data**
```javascript
// Copernicus Climate Data Store
const copernicusResponse = await fetch(
  `https://cds.climate.copernicus.eu/api/v2/resources/reanalysis-era5-single-levels?variable=2m_temperature&date=2024-01-15&area=[-4,33,4,42]`
);
```

## 🗺️ **Mapping Integration**

### **1. Leaflet.js Integration**
```javascript
import L from 'leaflet';

// Create map with Kenya bounds
const map = L.map('map').setView([-1.2921, 36.8219], 7);

// Add weather stations
weatherStations.forEach(station => {
  L.marker([station.latitude, station.longitude])
    .bindPopup(`<b>${station.station_name}</b><br>Temperature: ${station.temperature}°C`)
    .addTo(map);
});
```

### **2. GeoJSON Support**
```javascript
// Convert regions to GeoJSON
const geoJsonData = {
  type: "FeatureCollection",
  features: regions.map(region => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [region.longitude, region.latitude]
    },
    properties: {
      name: region.name,
      county: region.county_name,
      population: region.population
    }
  }))
};
```

## 📊 **Data Visualization**

### **1. Time Series Charts**
```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Weather data visualization
<LineChart data={weatherData}>
  <XAxis dataKey="timestamp" />
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Line type="monotone" dataKey="temperature_celsius" stroke="#8884d8" />
</LineChart>
```

### **2. Heat Maps**
```javascript
// Temperature heat map
const heatmapData = weatherStations.map(station => ({
  lat: station.latitude,
  lng: station.longitude,
  value: station.temperature_celsius
}));
```

## 🔧 **Data Quality & Validation**

### **1. Data Validation Rules**
- Temperature: -50°C to +60°C
- Humidity: 0% to 100%
- Rainfall: 0mm to 1000mm per hour
- Wind speed: 0 to 200 km/h
- Coordinates: Valid latitude/longitude ranges

### **2. Quality Flags**
- `good`: Data within expected ranges
- `fair`: Data slightly outside ranges but plausible
- `poor`: Data likely erroneous

### **3. Data Completeness**
- Track missing data points
- Implement data interpolation for gaps
- Flag stations with poor data quality

## 🚀 **Performance Optimization**

### **1. Database Indexes**
```sql
-- Weather data indexes
CREATE INDEX idx_weather_data_station_timestamp ON weather_data(station_id, timestamp);
CREATE INDEX idx_weather_data_timestamp ON weather_data(timestamp);

-- Spatial indexes
CREATE INDEX idx_regions_location ON regions(latitude, longitude);
CREATE INDEX idx_weather_stations_location ON weather_stations(latitude, longitude);
```

### **2. Caching Strategy**
- Cache frequently accessed data
- Use Redis for session data
- Implement CDN for static assets

### **3. Data Partitioning**
- Partition weather data by year
- Archive old data to separate tables
- Use materialized views for complex queries

## 📋 **Data Import/Export**

### **1. CSV Import**
```javascript
// Import weather data from CSV
const csvData = await parseCSV(file);
const weatherRecords = csvData.map(row => ({
  station_id: row.station_id,
  timestamp: new Date(row.timestamp),
  temperature_celsius: parseFloat(row.temperature),
  // ... other fields
}));
```

### **2. API Export**
```javascript
// Export data as JSON
const exportData = await fetch('/api/data/weather/export?format=json&start_date=2024-01-01');
const data = await exportData.json();
```

This comprehensive schema supports all the requirements for the Kenya Climate Resilience Dashboard, including GIS mapping, weather data integration, and climate analysis capabilities.
