# GeoAI Integration Guide

## 🚀 **Overview**

This guide explains how to integrate **GeoAI** (Artificial Intelligence for geospatial data analysis) with your Kenya Climate Resilience Dashboard. GeoAI provides powerful AI capabilities for analyzing satellite imagery, detecting changes in land use, and monitoring environmental conditions.

## 📋 **Features**

### **1. AI-Powered Analysis Types**
- **Land Cover Classification**: Automatically classify land types (forest, agriculture, urban, water)
- **Change Detection**: Detect changes in land use over time
- **Vegetation Analysis**: Monitor vegetation health and biomass
- **Water Body Analysis**: Analyze water bodies and quality

### **2. Satellite Data Sources**
- **Sentinel-2**: High-resolution optical imagery (10m resolution)
- **Landsat-8**: Multispectral imagery (30m resolution)
- **Sentinel-1**: Radar imagery for all-weather monitoring

### **3. Real-time Processing**
- Background task processing for long-running analyses
- Real-time status updates and progress tracking
- Automatic result storage and retrieval

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   GeoAI Python  │
│   (React)       │◄──►│   (Proxy)       │◄──►│   Service       │
│                 │    │                 │    │                 │
│ - GeoAI UI      │    │ - /api/geoai/*  │    │ - FastAPI       │
│ - Analysis      │    │ - Request       │    │ - GeoAI Library │
│   Dashboard     │    │   Forwarding    │    │ - Satellite     │
│                 │    │                 │    │   Data          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ **Installation & Setup**

### **1. Install GeoAI**
```bash
# Install GeoAI Python package
pip install geoai-py

# Or using conda
conda install -c conda-forge geoai
```

### **2. Environment Variables**
Add these to your `.env.local`:
```bash
# GeoAI Service URL
GEOAI_API_URL=http://localhost:8001

# Satellite Data API Keys (optional)
SENTINEL_API_KEY=your_sentinel_api_key
NASA_API_KEY=your_nasa_api_key
```

### **3. Start Services**
```bash
# Start all services with Docker
docker-compose up -d

# Or start GeoAI service separately
cd services/geoai-api
python main.py
```

## 📊 **Usage Examples**

### **1. Land Cover Classification**
```javascript
// Start land cover analysis
const response = await fetch('/api/geoai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    region_name: 'Nairobi',
    latitude: -1.2921,
    longitude: 36.8219,
    radius_km: 10,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    analysis_type: 'land_cover',
    satellite_source: 'sentinel-2'
  })
});

const result = await response.json();
console.log('Analysis ID:', result.analysis_id);
```

### **2. Change Detection**
```javascript
// Detect changes over time
const response = await fetch('/api/geoai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    region_name: 'Mombasa',
    latitude: -4.0435,
    longitude: 39.6682,
    radius_km: 15,
    start_date: '2023-01-01',
    end_date: '2024-01-01',
    analysis_type: 'change_detection',
    satellite_source: 'sentinel-2'
  })
});
```

### **3. Vegetation Analysis**
```javascript
// Analyze vegetation health
const response = await fetch('/api/geoai/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    region_name: 'Kisumu',
    latitude: -0.0917,
    longitude: 34.7680,
    radius_km: 20,
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    analysis_type: 'vegetation',
    satellite_source: 'sentinel-2'
  })
});
```

## 🔍 **API Endpoints**

### **Analysis Endpoints**
- `POST /api/geoai/analyze` - Start new analysis
- `GET /api/geoai/analysis/{id}` - Get analysis results
- `GET /api/geoai/analysis-history` - Get analysis history

### **Configuration Endpoints**
- `GET /api/geoai/regions` - Get available regions
- `GET /api/geoai/analysis-types` - Get analysis types
- `GET /api/geoai/health` - Service health check

### **Data Endpoints**
- `POST /api/geoai/satellite-data` - Download satellite data
- `GET /api/geoai/data/{region}` - Get region data

## 📈 **Analysis Results**

### **Land Cover Classification Results**
```json
{
  "analysis_id": "analysis_20240115_143022_Nairobi",
  "region_name": "Nairobi",
  "analysis_type": "land_cover",
  "results": {
    "land_cover_classes": ["Forest", "Agriculture", "Urban", "Water", "Bare Soil"],
    "classification_accuracy": 0.87,
    "area_breakdown": {
      "Forest": 25.5,
      "Agriculture": 45.2,
      "Urban": 15.3,
      "Water": 8.7,
      "Bare Soil": 5.3
    },
    "confidence_map": "confidence_map.tif"
  },
  "status": "completed"
}
```

### **Change Detection Results**
```json
{
  "analysis_id": "analysis_20240115_143022_Mombasa",
  "region_name": "Mombasa",
  "analysis_type": "change_detection",
  "results": {
    "changes_detected": ["Deforestation", "Urban Expansion"],
    "change_areas": {
      "Deforestation": 2.3,
      "Urban Expansion": 1.8
    },
    "change_confidence": 0.84,
    "change_map": "change_map.tif"
  },
  "status": "completed"
}
```

### **Vegetation Analysis Results**
```json
{
  "analysis_id": "analysis_20240115_143022_Kisumu",
  "region_name": "Kisumu",
  "analysis_type": "vegetation",
  "results": {
    "ndvi_values": {
      "mean": 0.45,
      "min": 0.12,
      "max": 0.78,
      "std": 0.15
    },
    "vegetation_health": {
      "healthy": 65.2,
      "moderate": 25.8,
      "poor": 9.0
    },
    "biomass_estimation": {
      "total_biomass_tonnes": 1250.5,
      "biomass_density": 45.2
    }
  },
  "status": "completed"
}
```

## 🗺️ **Visualization**

### **1. Interactive Maps**
GeoAI results can be visualized on interactive maps using:
- **Leaflet.js** for web-based mapping
- **GeoJSON** for data exchange
- **Custom styling** for different analysis types

### **2. Charts and Graphs**
- **Pie charts** for land cover breakdown
- **Time series** for change detection
- **Heat maps** for vegetation health
- **Bar charts** for statistical summaries

### **3. Export Options**
- **GeoJSON** for GIS software
- **Shapefile** for ArcGIS
- **PNG/JPEG** for reports
- **CSV** for data analysis

## 🔧 **Configuration**

### **1. Satellite Data Sources**
```python
# Configure satellite sources in GeoAI service
SATELLITE_SOURCES = {
    'sentinel-2': {
        'resolution': '10m',
        'bands': ['B2', 'B3', 'B4', 'B8'],
        'update_frequency': '5 days'
    },
    'landsat-8': {
        'resolution': '30m',
        'bands': ['B2', 'B3', 'B4', 'B5'],
        'update_frequency': '16 days'
    },
    'sentinel-1': {
        'resolution': '10m',
        'polarization': ['VV', 'VH'],
        'update_frequency': '6 days'
    }
}
```

### **2. Analysis Parameters**
```python
# Configure analysis parameters
ANALYSIS_CONFIG = {
    'land_cover': {
        'model': 'random_forest',
        'classes': ['Forest', 'Agriculture', 'Urban', 'Water', 'Bare Soil'],
        'min_confidence': 0.7
    },
    'change_detection': {
        'threshold': 0.1,
        'min_change_area': 0.01
    },
    'vegetation': {
        'ndvi_threshold': 0.3,
        'health_categories': ['poor', 'moderate', 'healthy']
    }
}
```

## 🚀 **Deployment**

### **1. Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs geoai-api
```

### **2. Vercel Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
GEOAI_API_URL=https://your-geoai-service.vercel.app
```

### **3. Production Considerations**
- **GPU Support**: Enable GPU for faster AI processing
- **Data Storage**: Use cloud storage for satellite data
- **Caching**: Implement Redis caching for results
- **Monitoring**: Add health checks and logging

## 🔍 **Troubleshooting**

### **Common Issues**

1. **GeoAI Not Installed**
   ```bash
   pip install geoai-py
   # Or check installation
   python -c "import geoai; print(geoai.__version__)"
   ```

2. **Satellite Data Access**
   - Check API keys and permissions
   - Verify region coordinates
   - Ensure date range is valid

3. **Analysis Failures**
   - Check service logs: `docker-compose logs geoai-api`
   - Verify database connectivity
   - Check available disk space

4. **Performance Issues**
   - Increase memory allocation
   - Use GPU acceleration
   - Implement result caching

## 📚 **Resources**

- **GeoAI Documentation**: https://opengeoai.org
- **Sentinel Data**: https://scihub.copernicus.eu/
- **Landsat Data**: https://landsat.gsfc.nasa.gov/
- **NASA POWER**: https://power.larc.nasa.gov/

## 🤝 **Support**

For issues and questions:
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the comprehensive docs
- **Community**: Join discussions on GitHub

---

This integration provides powerful AI capabilities for your Kenya Climate Resilience Dashboard, enabling advanced geospatial analysis and environmental monitoring! 🌍🤖
