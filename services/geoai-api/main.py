from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import json
import os
from datetime import datetime, timedelta
import logging

# Geospatial and AI imports
import numpy as np
import pandas as pd
import geopandas as gpd
import rasterio
from rasterio.mask import mask
from rasterio.warp import calculate_default_transform, reproject, Resampling
import folium
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import cv2
from PIL import Image
import requests
import json
from shapely.geometry import Point, Polygon, box
import pyproj
from sentinelsat import SentinelAPI, read_geojson, geojson_to_wkt
import ee
from datetime import datetime, timedelta
import os
import tempfile
import logging

# Initialize Earth Engine (for Google Earth Engine data)
try:
    ee.Initialize()
    EARTH_ENGINE_AVAILABLE = True
except Exception as e:
    print(f"Warning: Earth Engine not initialized: {e}")
    EARTH_ENGINE_AVAILABLE = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GeoAI Climate Analysis API",
    description="AI-powered geospatial analysis for Kenya Climate Resilience Dashboard",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize geospatial services
try:
    # Initialize Sentinel API (you'll need to add credentials)
    # sentinel_api = SentinelAPI('username', 'password', 'https://scihub.copernicus.eu/dhus')
    logger.info("Geospatial services initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize geospatial services: {e}")

# Mock data for development (replace with real API calls)
MOCK_SATELLITE_DATA = {
    "sentinel-2": {
        "bands": ["B2", "B3", "B4", "B8", "B11", "B12"],
        "resolution": 10,
        "coverage": "Global"
    },
    "landsat-8": {
        "bands": ["B2", "B3", "B4", "B5", "B6", "B7"],
        "resolution": 30,
        "coverage": "Global"
    }
}

# Pydantic models
class AnalysisRequest(BaseModel):
    region_name: str
    latitude: float
    longitude: float
    radius_km: float = 10.0
    start_date: str
    end_date: str
    analysis_type: str  # 'land_cover', 'change_detection', 'vegetation', 'water'
    satellite_source: str = 'sentinel-2'  # 'sentinel-2', 'landsat-8', 'sentinel-1'

class SatelliteDataRequest(BaseModel):
    region_name: str
    latitude: float
    longitude: float
    start_date: str
    end_date: str
    satellite_source: str = 'sentinel-2'
    cloud_cover: float = 0.1

class AIAnalysisResult(BaseModel):
    analysis_id: str
    region_name: str
    analysis_type: str
    results: Dict[str, Any]
    metadata: Dict[str, Any]
    created_at: str

# Background task for long-running analyses
async def run_ai_analysis(analysis_id: str, request: AnalysisRequest):
    """Background task for running AI analysis"""
    try:
        logger.info(f"Starting AI analysis {analysis_id} for {request.region_name}")
        
        # Download satellite data
        satellite_data = await download_satellite_data(
            latitude=request.latitude,
            longitude=request.longitude,
            start_date=request.start_date,
            end_date=request.end_date,
            satellite_source=request.satellite_source,
            radius_km=request.radius_km
        )
        
        # Run AI analysis based on type
        if request.analysis_type == 'land_cover_classification':
            results = await run_land_cover_analysis(satellite_data, request)
        elif request.analysis_type == 'change_detection':
            results = await run_change_detection_analysis(satellite_data, request)
        elif request.analysis_type == 'vegetation_health':
            results = await run_vegetation_analysis(satellite_data, request)
        elif request.analysis_type == 'water_body_detection':
            results = await run_water_analysis(satellite_data, request)
        elif request.analysis_type == 'drought_monitoring':
            results = await run_drought_monitoring_analysis(satellite_data, request)
        elif request.analysis_type == 'soil_moisture':
            results = await run_soil_moisture_analysis(satellite_data, request)
        elif request.analysis_type == 'urban_expansion':
            results = await run_urban_expansion_analysis(satellite_data, request)
        else:
            raise ValueError(f"Unknown analysis type: {request.analysis_type}")
        
        # Save results to database
        await save_analysis_results(analysis_id, request, results)
        
        logger.info(f"Completed AI analysis {analysis_id}")
        
    except Exception as e:
        logger.error(f"Error in AI analysis {analysis_id}: {e}")
        await save_analysis_error(analysis_id, str(e))

async def download_satellite_data(latitude: float, longitude: float, start_date: str, 
                                end_date: str, satellite_source: str, radius_km: float):
    """Download satellite data for the specified region and time period"""
    try:
        # Create a bounding box around the point
        bbox = create_bounding_box(latitude, longitude, radius_km)
        
        # For now, return mock data with realistic structure
        # In production, this would query Sentinel Hub, Earth Engine, or other APIs
        return {
            "satellite_source": satellite_source,
            "latitude": latitude,
            "longitude": longitude,
            "start_date": start_date,
            "end_date": end_date,
            "bbox": bbox,
            "data_available": True,
            "bands": MOCK_SATELLITE_DATA.get(satellite_source, {}).get("bands", []),
            "resolution": MOCK_SATELLITE_DATA.get(satellite_source, {}).get("resolution", 10),
            "cloud_cover": np.random.uniform(0.1, 0.3),
            "acquisition_date": start_date
        }
    except Exception as e:
        logger.error(f"Error downloading satellite data: {e}")
        raise

def create_bounding_box(lat: float, lon: float, radius_km: float):
    """Create a bounding box around a point"""
    # Approximate conversion: 1 degree ≈ 111 km
    lat_delta = radius_km / 111.0
    lon_delta = radius_km / (111.0 * np.cos(np.radians(lat)))
    
    return {
        "min_lat": lat - lat_delta,
        "max_lat": lat + lat_delta,
        "min_lon": lon - lon_delta,
        "max_lon": lon + lon_delta
    }

async def run_land_cover_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run land cover classification analysis"""
    try:
        # Generate realistic land cover classification results
        # In production, this would use actual satellite imagery and ML models
        
        # Simulate different land cover patterns based on region
        region_name = request.region_name.lower()
        
        if 'nairobi' in region_name:
            # Urban area
            area_breakdown = {
                "Urban": 45.2,
                "Forest": 15.3,
                "Agriculture": 25.7,
                "Water": 8.1,
                "Bare Soil": 5.7
            }
        elif 'mombasa' in region_name:
            # Coastal area
            area_breakdown = {
                "Water": 35.2,
                "Urban": 25.3,
                "Forest": 20.1,
                "Agriculture": 15.4,
                "Bare Soil": 4.0
            }
        elif 'kisumu' in region_name:
            # Lakeside area
            area_breakdown = {
                "Water": 28.7,
                "Agriculture": 40.2,
                "Forest": 18.5,
                "Urban": 10.1,
                "Bare Soil": 2.5
            }
        else:
            # Default rural area
            area_breakdown = {
                "Agriculture": 45.2,
                "Forest": 25.5,
                "Urban": 15.3,
                "Water": 8.7,
                "Bare Soil": 5.3
            }
        
        # Calculate total area and percentages
        total_area = sum(area_breakdown.values())
        area_percentages = {k: (v / total_area) * 100 for k, v in area_breakdown.items()}
        
        return {
            "land_cover_classes": list(area_breakdown.keys()),
            "classification_accuracy": np.random.uniform(0.85, 0.95),
            "area_breakdown": area_percentages,
            "total_area_km2": total_area,
            "confidence_map": f"land_cover_{request.region_name.lower()}.tif",
            "analysis_method": "Random Forest Classification",
            "satellite_bands_used": satellite_data.get("bands", []),
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in land cover analysis: {e}")
        raise

async def run_change_detection_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run change detection analysis"""
    try:
        # Generate realistic change detection results
        # In production, this would compare satellite imagery from different time periods
        
        # Simulate different change patterns based on region and time period
        region_name = request.region_name.lower()
        start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
        end_date = datetime.strptime(request.end_date, "%Y-%m-%d")
        time_span_years = (end_date - start_date).days / 365.25
        
        if 'nairobi' in region_name:
            # Urban area - likely urban expansion
            changes_detected = ["Urban Expansion", "Infrastructure Development", "Green Space Reduction"]
            change_areas = {
                "Urban Expansion": round(2.5 * time_span_years, 2),
                "Infrastructure Development": round(1.2 * time_span_years, 2),
                "Green Space Reduction": round(0.8 * time_span_years, 2)
            }
        elif 'mombasa' in region_name:
            # Coastal area - tourism development
            changes_detected = ["Tourism Development", "Coastal Infrastructure", "Mangrove Changes"]
            change_areas = {
                "Tourism Development": round(1.8 * time_span_years, 2),
                "Coastal Infrastructure": round(1.5 * time_span_years, 2),
                "Mangrove Changes": round(0.5 * time_span_years, 2)
            }
        else:
            # Rural area - agricultural changes
            changes_detected = ["Agricultural Expansion", "Deforestation", "Water Body Changes"]
            change_areas = {
                "Agricultural Expansion": round(3.2 * time_span_years, 2),
                "Deforestation": round(1.5 * time_span_years, 2),
                "Water Body Changes": round(0.3 * time_span_years, 2)
            }
        
        total_change_area = sum(change_areas.values())
        
        return {
            "changes_detected": changes_detected,
            "change_areas": change_areas,
            "total_change_area_km2": total_change_area,
            "change_confidence": np.random.uniform(0.82, 0.92),
            "change_map": f"change_detection_{request.region_name.lower()}.tif",
            "analysis_period": f"{request.start_date} to {request.end_date}",
            "change_rate_per_year": round(total_change_area / time_span_years, 2),
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in change detection analysis: {e}")
        raise

async def run_vegetation_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run vegetation analysis (NDVI, health monitoring)"""
    try:
        # Generate realistic vegetation analysis results
        # In production, this would calculate NDVI from satellite bands
        
        region_name = request.region_name.lower()
        
        # Simulate different vegetation patterns based on region
        if 'nairobi' in region_name:
            # Urban area - mixed vegetation
            ndvi_values = {
                "mean": 0.35,
                "min": 0.08,
                "max": 0.65,
                "std": 0.18
            }
            vegetation_health = {
                "healthy": 45.2,
                "moderate": 35.8,
                "poor": 19.0
            }
            biomass_estimation = {
                "total_biomass_tonnes": 850.3,
                "biomass_density": 28.5
            }
        elif 'kisumu' in region_name:
            # Lakeside area - good vegetation
            ndvi_values = {
                "mean": 0.58,
                "min": 0.25,
                "max": 0.82,
                "std": 0.12
            }
            vegetation_health = {
                "healthy": 75.2,
                "moderate": 20.8,
                "poor": 4.0
            }
            biomass_estimation = {
                "total_biomass_tonnes": 1450.7,
                "biomass_density": 52.3
            }
        else:
            # Rural area - agricultural vegetation
            ndvi_values = {
                "mean": 0.48,
                "min": 0.15,
                "max": 0.75,
                "std": 0.16
            }
            vegetation_health = {
                "healthy": 68.5,
                "moderate": 25.3,
                "poor": 6.2
            }
            biomass_estimation = {
                "total_biomass_tonnes": 1250.5,
                "biomass_density": 45.2
            }
        
        return {
            "ndvi_values": ndvi_values,
            "vegetation_health": vegetation_health,
            "biomass_estimation": biomass_estimation,
            "vegetation_map": f"vegetation_{request.region_name.lower()}.tif",
            "analysis_method": "NDVI-based Vegetation Analysis",
            "satellite_bands_used": ["Red", "NIR"],
            "vegetation_indices": ["NDVI", "EVI", "SAVI"],
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in vegetation analysis: {e}")
        raise

async def run_water_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run water body analysis"""
    try:
        # Generate realistic water body analysis results
        # In production, this would use water detection algorithms on satellite imagery
        
        region_name = request.region_name.lower()
        
        # Simulate different water patterns based on region
        if 'kisumu' in region_name:
            # Lakeside area - major water bodies
            water_bodies = [
                {"name": "Lake Victoria", "area_km2": 68.8, "type": "lake", "depth_avg_m": 40},
                {"name": "River Nyando", "length_km": 15.2, "type": "river", "width_avg_m": 25},
                {"name": "Kisumu Bay", "area_km2": 12.5, "type": "bay", "depth_avg_m": 8}
            ]
            water_quality = {
                "turbidity": "moderate",
                "chlorophyll": "high",
                "water_clarity": "moderate",
                "ph_level": 7.2
            }
            water_extent = {
                "total_area_km2": 96.5,
                "percentage_of_region": 12.3
            }
        elif 'mombasa' in region_name:
            # Coastal area - ocean and coastal waters
            water_bodies = [
                {"name": "Indian Ocean", "area_km2": 45.2, "type": "ocean", "depth_avg_m": 200},
                {"name": "Mombasa Harbor", "area_km2": 8.7, "type": "harbor", "depth_avg_m": 15},
                {"name": "Creek Waters", "area_km2": 5.3, "type": "creek", "depth_avg_m": 3}
            ]
            water_quality = {
                "turbidity": "low",
                "chlorophyll": "moderate",
                "water_clarity": "good",
                "ph_level": 8.1
            }
            water_extent = {
                "total_area_km2": 59.2,
                "percentage_of_region": 18.7
            }
        else:
            # Inland area - rivers and small water bodies
            water_bodies = [
                {"name": "Local River", "length_km": 8.5, "type": "river", "width_avg_m": 12},
                {"name": "Reservoir", "area_km2": 3.2, "type": "reservoir", "depth_avg_m": 6}
            ]
            water_quality = {
                "turbidity": "moderate",
                "chlorophyll": "low",
                "water_clarity": "good",
                "ph_level": 6.8
            }
            water_extent = {
                "total_area_km2": 11.7,
                "percentage_of_region": 4.2
            }
        
        return {
            "water_bodies": water_bodies,
            "water_quality": water_quality,
            "water_extent": water_extent,
            "water_map": f"water_bodies_{request.region_name.lower()}.tif",
            "analysis_method": "Water Body Detection Algorithm",
            "satellite_bands_used": ["Blue", "Green", "NIR", "SWIR"],
            "water_indices": ["NDWI", "MNDWI"],
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in water analysis: {e}")
        raise

async def run_drought_monitoring_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run drought monitoring analysis"""
    try:
        region_name = request.region_name.lower()
        
        # Simulate drought conditions based on region
        if 'nairobi' in region_name:
            drought_severity = "Low"
            affected_area_percentage = 8.5
            vegetation_stress = "Low"
            rainfall_deficit = -15.3
        elif 'mombasa' in region_name:
            drought_severity = "Very Low"
            affected_area_percentage = 2.1
            vegetation_stress = "Very Low"
            rainfall_deficit = -5.2
        else:
            drought_severity = "Moderate"
            affected_area_percentage = 18.5
            vegetation_stress = "Moderate"
            rainfall_deficit = -25.3
        
        return {
            "drought_severity_index": np.random.uniform(2.5, 4.0),
            "affected_area_percentage": affected_area_percentage,
            "vegetation_stress": vegetation_stress,
            "rainfall_deficit": rainfall_deficit,
            "drought_duration": "3 months",
            "risk_level": "Medium" if drought_severity == "Moderate" else "Low",
            "drought_map": f"drought_{request.region_name.lower()}.tif",
            "analysis_method": "Drought Severity Index",
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in drought monitoring analysis: {e}")
        raise

async def run_soil_moisture_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run soil moisture analysis"""
    try:
        region_name = request.region_name.lower()
        
        # Simulate soil moisture patterns
        if 'kisumu' in region_name:
            moisture_content = 0.42
            moisture_distribution = "High"
            dry_areas_percentage = 8.1
        elif 'mombasa' in region_name:
            moisture_content = 0.38
            moisture_distribution = "Moderate"
            dry_areas_percentage = 15.2
        else:
            moisture_content = 0.34
            moisture_distribution = "Variable"
            dry_areas_percentage = 22.1
        
        return {
            "average_moisture_content": moisture_content,
            "moisture_distribution": moisture_distribution,
            "dry_areas_percentage": dry_areas_percentage,
            "optimal_moisture_zones": 100 - dry_areas_percentage,
            "irrigation_recommendation": "Moderate" if moisture_content < 0.35 else "Low",
            "seasonal_trend": "Decreasing",
            "soil_moisture_map": f"soil_moisture_{request.region_name.lower()}.tif",
            "analysis_method": "Soil Moisture Index",
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in soil moisture analysis: {e}")
        raise

async def run_urban_expansion_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run urban expansion analysis"""
    try:
        region_name = request.region_name.lower()
        
        # Simulate urban expansion patterns
        if 'nairobi' in region_name:
            urban_area = 245.6
            growth_rate = "+4.2% annually"
            new_developments = 156
        elif 'mombasa' in region_name:
            urban_area = 185.3
            growth_rate = "+3.8% annually"
            new_developments = 98
        else:
            urban_area = 125.7
            growth_rate = "+2.5% annually"
            new_developments = 67
        
        return {
            "urban_area_km2": urban_area,
            "growth_rate": growth_rate,
            "new_developments": new_developments,
            "infrastructure_gaps": 23,
            "population_density": "2,450/km²",
            "planning_recommendations": ["Green spaces", "Public transport", "Waste management"],
            "urban_expansion_map": f"urban_expansion_{request.region_name.lower()}.tif",
            "analysis_method": "Urban Growth Detection",
            "processing_date": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in urban expansion analysis: {e}")
        raise

async def save_analysis_results(analysis_id: str, request: AnalysisRequest, results: Dict):
    """Save analysis results to database"""
    # This would connect to your PostgreSQL database
    # For now, we'll just log the results
    logger.info(f"Saving results for analysis {analysis_id}")
    logger.info(f"Results: {json.dumps(results, indent=2)}")

async def save_analysis_error(analysis_id: str, error_message: str):
    """Save analysis error to database"""
    logger.error(f"Analysis {analysis_id} failed: {error_message}")

# API Endpoints
@app.get("/")
async def root():
    return {"message": "GeoAI Climate Analysis API", "status": "running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "geoai_available": geoai_instance is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze", response_model=AIAnalysisResult)
async def start_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """Start an AI-powered geospatial analysis"""
    try:
        # Generate unique analysis ID
        analysis_id = f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{request.region_name}"
        
        # Add analysis to background tasks
        background_tasks.add_task(run_ai_analysis, analysis_id, request)
        
        return AIAnalysisResult(
            analysis_id=analysis_id,
            region_name=request.region_name,
            analysis_type=request.analysis_type,
            results={"status": "processing"},
            metadata={
                "satellite_source": request.satellite_source,
                "radius_km": request.radius_km,
                "start_date": request.start_date,
                "end_date": request.end_date
            },
            created_at=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error starting analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/{analysis_id}")
async def get_analysis_results(analysis_id: str):
    """Get analysis results by ID"""
    try:
        # This would query your database
        # For now, return mock data
        return {
            "analysis_id": analysis_id,
            "status": "completed",
            "results": {
                "land_cover_classes": ["Forest", "Agriculture", "Urban"],
                "classification_accuracy": 0.87
            },
            "created_at": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting analysis results: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/satellite-data")
async def download_satellite_data_endpoint(request: SatelliteDataRequest):
    """Download satellite data for a region"""
    try:
        data = await download_satellite_data(
            latitude=request.latitude,
            longitude=request.longitude,
            start_date=request.start_date,
            end_date=request.end_date,
            satellite_source=request.satellite_source,
            radius_km=10.0
        )
        
        return {
            "success": True,
            "data": data,
            "message": f"Satellite data downloaded for {request.region_name}"
        }
        
    except Exception as e:
        logger.error(f"Error downloading satellite data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/regions/kenya")
async def get_kenya_regions():
    """Get list of Kenya regions for analysis"""
    kenya_regions = [
        {
            "name": "Nairobi",
            "latitude": -1.2921,
            "longitude": 36.8219,
            "county_code": "047"
        },
        {
            "name": "Mombasa",
            "latitude": -4.0435,
            "longitude": 39.6682,
            "county_code": "001"
        },
        {
            "name": "Kisumu",
            "latitude": -0.0917,
            "longitude": 34.7680,
            "county_code": "042"
        },
        {
            "name": "Nakuru",
            "latitude": -0.3031,
            "longitude": 36.0800,
            "county_code": "032"
        },
        {
            "name": "Eldoret",
            "latitude": 0.5204,
            "longitude": 35.2699,
            "county_code": "027"
        }
    ]
    
    return {"regions": kenya_regions}

@app.get("/analysis-types")
async def get_analysis_types():
    """Get available analysis types"""
    analysis_types = [
        {
            "id": "land_cover_classification",
            "name": "Land Cover Classification",
            "description": "Classify land types (forest, agriculture, urban, water) using satellite imagery",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        },
        {
            "id": "vegetation_health",
            "name": "Vegetation Health Analysis",
            "description": "Monitor vegetation health and biomass using NDVI and other vegetation indices",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        },
        {
            "id": "water_body_detection",
            "name": "Water Body Detection",
            "description": "Detect and analyze water bodies, rivers, and lakes for flood monitoring",
            "satellite_sources": ["sentinel-2", "sentinel-1"]
        },
        {
            "id": "change_detection",
            "name": "Land Use Change Detection",
            "description": "Detect changes in land use over time for environmental monitoring",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        },
        {
            "id": "drought_monitoring",
            "name": "Drought Monitoring",
            "description": "Monitor drought conditions using temperature and vegetation data",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        },
        {
            "id": "soil_moisture",
            "name": "Soil Moisture Analysis",
            "description": "Analyze soil moisture content for agricultural planning",
            "satellite_sources": ["sentinel-1", "sentinel-2"]
        },
        {
            "id": "urban_expansion",
            "name": "Urban Expansion Analysis",
            "description": "Monitor urban growth and development patterns",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        }
    ]
    
    return {"analysis_types": analysis_types}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
