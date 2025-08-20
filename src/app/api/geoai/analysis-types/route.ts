import { NextResponse } from 'next/server';

export async function GET() {
  const analysisTypes = [
    {
      id: 'land_cover_classification',
      name: 'Land Cover Classification',
      description: 'Classify land types (forest, agriculture, urban, water) using satellite imagery',
      satellite_sources: ['sentinel-2', 'landsat-8']
    },
    {
      id: 'vegetation_health',
      name: 'Vegetation Health Analysis',
      description: 'Monitor vegetation health and biomass using NDVI and other vegetation indices',
      satellite_sources: ['sentinel-2', 'landsat-8']
    },
    {
      id: 'water_body_detection',
      name: 'Water Body Detection',
      description: 'Detect and analyze water bodies, rivers, and lakes for flood monitoring',
      satellite_sources: ['sentinel-2', 'sentinel-1']
    },
    {
      id: 'change_detection',
      name: 'Land Use Change Detection',
      description: 'Detect changes in land use over time for environmental monitoring',
      satellite_sources: ['sentinel-2', 'landsat-8']
    },
    {
      id: 'drought_monitoring',
      name: 'Drought Monitoring',
      description: 'Monitor drought conditions using temperature and vegetation data',
      satellite_sources: ['sentinel-2', 'landsat-8']
    },
    {
      id: 'soil_moisture',
      name: 'Soil Moisture Analysis',
      description: 'Analyze soil moisture content for agricultural planning',
      satellite_sources: ['sentinel-1', 'sentinel-2']
    },
    {
      id: 'urban_expansion',
      name: 'Urban Expansion Analysis',
      description: 'Monitor urban growth and development patterns',
      satellite_sources: ['sentinel-2', 'landsat-8']
    }
  ];
  
  return NextResponse.json({ analysis_types: analysisTypes });
}
