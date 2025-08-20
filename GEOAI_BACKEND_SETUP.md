# GeoAI Python Backend Setup

This document explains how to set up and use the Python backend for the GeoAI climate analysis functionality.

## 🚀 Quick Start

### 1. Start the Python Backend

```bash
# Make the script executable (if not already)
chmod +x start-geoai-backend.sh

# Start the backend
./start-geoai-backend.sh
```

The backend will start on `http://localhost:8001`

### 2. Test the Backend

```bash
# Test all functionality
python3 test-geoai-backend.py
```

### 3. Use with Frontend

The frontend is already configured to connect to the Python backend. Just start your Next.js application:

```bash
npm run dev
```

## 📋 Requirements

- Python 3.8+
- pip
- Virtual environment (recommended)

## 🔧 Installation

The startup script will automatically:
1. Create a virtual environment
2. Install all required dependencies
3. Start the FastAPI server

### Manual Installation

If you prefer to install manually:

```bash
cd services/geoai-api
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

## 📊 Available Analysis Types

The backend supports 7 different climate analysis types:

1. **Land Cover Classification** - Classify land types (forest, agriculture, urban, water)
2. **Vegetation Health Analysis** - Monitor vegetation health using NDVI
3. **Water Body Detection** - Detect and analyze water bodies
4. **Land Use Change Detection** - Detect changes over time
5. **Drought Monitoring** - Monitor drought conditions
6. **Soil Moisture Analysis** - Analyze soil moisture content
7. **Urban Expansion Analysis** - Monitor urban growth patterns

## 🌍 Supported Regions

All 47 Kenya counties are supported with realistic coordinates and climate data patterns.

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### Analysis Types
```
GET /analysis-types
```

### Kenya Regions
```
GET /regions/kenya
```

### Start Analysis
```
POST /analyze
{
  "region_name": "Nairobi",
  "latitude": -1.2921,
  "longitude": 36.8219,
  "radius_km": 10.0,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31",
  "analysis_type": "land_cover_classification",
  "satellite_source": "sentinel-2"
}
```

### Get Analysis Results
```
GET /analysis/{analysis_id}
```

## 🛠️ Development

### Adding New Analysis Types

1. Add the analysis type to the `ANALYSIS_TYPES` list in `main.py`
2. Create a new analysis function (e.g., `run_new_analysis`)
3. Add the case to the analysis routing logic

### Adding Real Satellite Data

To connect to real satellite data sources:

1. **Sentinel Hub**: Add credentials to environment variables
2. **Google Earth Engine**: Initialize with service account
3. **NASA APIs**: Add API keys for Landsat data

### Example: Adding Sentinel Hub

```python
# In main.py
import sentinelhub
from sentinelhub import SHConfig

config = SHConfig()
config.sh_client_id = os.getenv('SENTINEL_CLIENT_ID')
config.sh_client_secret = os.getenv('SENTINEL_CLIENT_SECRET')

# Use in download_satellite_data function
```

## 🐳 Docker Deployment

The backend is configured for Docker deployment:

```bash
# Build the image
docker build -t geoai-backend ./services/geoai-api

# Run the container
docker run -p 8001:8001 geoai-backend
```

## 🔍 Troubleshooting

### Common Issues

1. **Port 8001 already in use**
   ```bash
   lsof -ti:8001 | xargs kill -9
   ```

2. **Python dependencies not found**
   ```bash
   cd services/geoai-api
   pip install -r requirements.txt
   ```

3. **Frontend can't connect to backend**
   - Ensure backend is running on port 8001
   - Check CORS settings in `main.py`
   - Verify `GEOAI_API_URL` environment variable

### Logs

Check the backend logs for detailed error information:

```bash
# If running with uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8001 --log-level debug

# If running with Docker
docker logs <container_id>
```

## 📈 Performance

- **Processing Time**: 10-40 seconds per analysis (simulated)
- **Memory Usage**: ~500MB for typical analysis
- **Concurrent Requests**: Supports multiple simultaneous analyses

## 🔐 Security

For production deployment:

1. Add authentication to API endpoints
2. Use HTTPS
3. Implement rate limiting
4. Add input validation
5. Use environment variables for sensitive data

## 📚 Libraries Used

- **FastAPI**: Web framework
- **NumPy/Pandas**: Data processing
- **GeoPandas**: Geospatial data
- **Rasterio**: Raster data processing
- **Scikit-learn**: Machine learning
- **OpenCV**: Image processing
- **Folium**: Interactive maps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## 📄 License

This project is part of the Kenya Climate Resilience Dashboard.
