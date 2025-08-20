#!/usr/bin/env python3

import requests
import json
import time

# Test the GeoAI Python backend
GEOAI_API_URL = "http://localhost:8001"

def test_backend_health():
    """Test if the backend is running"""
    try:
        response = requests.get(f"{GEOAI_API_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is healthy!")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running on port 8001?")
        return False

def test_analysis_types():
    """Test getting analysis types"""
    try:
        response = requests.get(f"{GEOAI_API_URL}/analysis-types")
        if response.status_code == 200:
            data = response.json()
            print("✅ Analysis types retrieved successfully!")
            print(f"Found {len(data['analysis_types'])} analysis types:")
            for analysis_type in data['analysis_types']:
                print(f"  - {analysis_type['name']} ({analysis_type['id']})")
            return True
        else:
            print(f"❌ Failed to get analysis types: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing analysis types: {e}")
        return False

def test_kenya_regions():
    """Test getting Kenya regions"""
    try:
        response = requests.get(f"{GEOAI_API_URL}/regions/kenya")
        if response.status_code == 200:
            data = response.json()
            print("✅ Kenya regions retrieved successfully!")
            print(f"Found {len(data['regions'])} regions:")
            for region in data['regions']:
                print(f"  - {region['name']} ({region['county_code']})")
            return True
        else:
            print(f"❌ Failed to get Kenya regions: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing Kenya regions: {e}")
        return False

def test_analysis_request():
    """Test starting an analysis"""
    try:
        analysis_request = {
            "region_name": "Nairobi",
            "latitude": -1.2921,
            "longitude": 36.8219,
            "radius_km": 10.0,
            "start_date": "2024-01-01",
            "end_date": "2024-01-31",
            "analysis_type": "land_cover_classification",
            "satellite_source": "sentinel-2"
        }
        
        response = requests.post(
            f"{GEOAI_API_URL}/analyze",
            json=analysis_request,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analysis started successfully!")
            print(f"Analysis ID: {data['analysis_id']}")
            print(f"Status: {data['status']}")
            return data['analysis_id']
        else:
            print(f"❌ Failed to start analysis: {response.status_code}")
            print(f"Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error testing analysis request: {e}")
        return None

def test_analysis_results(analysis_id):
    """Test getting analysis results"""
    if not analysis_id:
        return False
        
    try:
        response = requests.get(f"{GEOAI_API_URL}/analysis/{analysis_id}")
        if response.status_code == 200:
            data = response.json()
            print("✅ Analysis results retrieved successfully!")
            print(f"Status: {data.get('status', 'unknown')}")
            if 'results' in data:
                print("Results available!")
            return True
        else:
            print(f"❌ Failed to get analysis results: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing analysis results: {e}")
        return False

def main():
    print("🧪 Testing GeoAI Python Backend...")
    print("=" * 50)
    
    # Test 1: Health check
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start it first:")
        print("   ./start-geoai-backend.sh")
        return
    
    print("\n" + "=" * 50)
    
    # Test 2: Analysis types
    test_analysis_types()
    
    print("\n" + "=" * 50)
    
    # Test 3: Kenya regions
    test_kenya_regions()
    
    print("\n" + "=" * 50)
    
    # Test 4: Start analysis
    analysis_id = test_analysis_request()
    
    if analysis_id:
        print("\n" + "=" * 50)
        
        # Test 5: Get results (may still be processing)
        print("Waiting 5 seconds before checking results...")
        time.sleep(5)
        test_analysis_results(analysis_id)
    
    print("\n" + "=" * 50)
    print("🎉 Testing completed!")

if __name__ == "__main__":
    main()
