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

# GeoAI imports
try:
    import geoai
    from geoai import GeoAI
    from geoai.utils import download_sentinel_data, process_satellite_imagery
    from geoai.models import LandCoverClassifier, ChangeDetector
    from geoai.visualization import create_interactive_map
except ImportError:
    print("Warning: GeoAI not installed. Install with: pip install geoai-py")

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

# Initialize GeoAI
try:
    geoai_instance = GeoAI()
    logger.info("GeoAI initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize GeoAI: {e}")
    geoai_instance = None

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
        if request.analysis_type == 'land_cover':
            results = await run_land_cover_analysis(satellite_data, request)
        elif request.analysis_type == 'change_detection':
            results = await run_change_detection_analysis(satellite_data, request)
        elif request.analysis_type == 'vegetation':
            results = await run_vegetation_analysis(satellite_data, request)
        elif request.analysis_type == 'water':
            results = await run_water_analysis(satellite_data, request)
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
        if geoai_instance:
            # Use GeoAI to download satellite data
            data = geoai_instance.download_satellite_data(
                latitude=latitude,
                longitude=longitude,
                start_date=start_date,
                end_date=end_date,
                satellite_source=satellite_source,
                radius_km=radius_km
            )
            return data
        else:
            # Mock data for testing
            return {
                "satellite_source": satellite_source,
                "latitude": latitude,
                "longitude": longitude,
                "start_date": start_date,
                "end_date": end_date,
                "data_available": True
            }
    except Exception as e:
        logger.error(f"Error downloading satellite data: {e}")
        raise

async def run_land_cover_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run land cover classification analysis"""
    try:
        if geoai_instance:
            # Use GeoAI land cover classifier
            classifier = LandCoverClassifier()
            results = classifier.classify(satellite_data)
            
            return {
                "land_cover_classes": results.get("classes", []),
                "classification_accuracy": results.get("accuracy", 0.85),
                "area_breakdown": results.get("area_breakdown", {}),
                "confidence_map": results.get("confidence_map", None)
            }
        else:
            # Mock results for testing
            return {
                "land_cover_classes": ["Forest", "Agriculture", "Urban", "Water", "Bare Soil"],
                "classification_accuracy": 0.87,
                "area_breakdown": {
                    "Forest": 25.5,
                    "Agriculture": 45.2,
                    "Urban": 15.3,
                    "Water": 8.7,
                    "Bare Soil": 5.3
                },
                "confidence_map": "mock_confidence_map.tif"
            }
    except Exception as e:
        logger.error(f"Error in land cover analysis: {e}")
        raise

async def run_change_detection_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run change detection analysis"""
    try:
        if geoai_instance:
            # Use GeoAI change detector
            detector = ChangeDetector()
            results = detector.detect_changes(satellite_data)
            
            return {
                "changes_detected": results.get("changes", []),
                "change_areas": results.get("change_areas", {}),
                "change_confidence": results.get("confidence", 0.82),
                "change_map": results.get("change_map", None)
            }
        else:
            # Mock results for testing
            return {
                "changes_detected": ["Deforestation", "Urban Expansion", "Agricultural Expansion"],
                "change_areas": {
                    "Deforestation": 2.3,
                    "Urban Expansion": 1.8,
                    "Agricultural Expansion": 3.2
                },
                "change_confidence": 0.84,
                "change_map": "mock_change_map.tif"
            }
    except Exception as e:
        logger.error(f"Error in change detection analysis: {e}")
        raise

async def run_vegetation_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run vegetation analysis (NDVI, health monitoring)"""
    try:
        if geoai_instance:
            # Use GeoAI vegetation analysis
            results = geoai_instance.analyze_vegetation(satellite_data)
            
            return {
                "ndvi_values": results.get("ndvi", {}),
                "vegetation_health": results.get("health", {}),
                "biomass_estimation": results.get("biomass", {}),
                "vegetation_map": results.get("vegetation_map", None)
            }
        else:
            # Mock results for testing
            return {
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
                },
                "vegetation_map": "mock_vegetation_map.tif"
            }
    except Exception as e:
        logger.error(f"Error in vegetation analysis: {e}")
        raise

async def run_water_analysis(satellite_data: Dict, request: AnalysisRequest):
    """Run water body analysis"""
    try:
        if geoai_instance:
            # Use GeoAI water analysis
            results = geoai_instance.analyze_water_bodies(satellite_data)
            
            return {
                "water_bodies": results.get("water_bodies", []),
                "water_quality": results.get("quality", {}),
                "water_extent": results.get("extent", {}),
                "water_map": results.get("water_map", None)
            }
        else:
            # Mock results for testing
            return {
                "water_bodies": [
                    {"name": "Lake Victoria", "area_km2": 68.8, "type": "lake"},
                    {"name": "River Nile", "length_km": 12.5, "type": "river"}
                ],
                "water_quality": {
                    "turbidity": "low",
                    "chlorophyll": "moderate",
                    "water_clarity": "good"
                },
                "water_extent": {
                    "total_area_km2": 81.3,
                    "percentage_of_region": 8.7
                },
                "water_map": "mock_water_map.tif"
            }
    except Exception as e:
        logger.error(f"Error in water analysis: {e}")
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
            "id": "land_cover",
            "name": "Land Cover Classification",
            "description": "Classify land cover types using satellite imagery",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        },
        {
            "id": "change_detection",
            "name": "Change Detection",
            "description": "Detect changes in land use over time",
            "satellite_sources": ["sentinel-2", "landsat-8"]
        },
        {
            "id": "vegetation",
            "name": "Vegetation Analysis",
            "description": "Analyze vegetation health and biomass",
            "satellite_sources": ["sentinel-2", "sentinel-1"]
        },
        {
            "id": "water",
            "name": "Water Body Analysis",
            "description": "Analyze water bodies and quality",
            "satellite_sources": ["sentinel-2", "sentinel-1"]
        }
    ]
    
    return {"analysis_types": analysis_types}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
