import { NextRequest, NextResponse } from 'next/server';
import { dataImportService } from '@/utils/dataImport';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, source } = body;

    let result;

    switch (type) {
      case 'weather':
        // Validate weather data before import
        const validationResults = data.map((point: any) => 
          dataImportService.validateWeatherData(point)
        );
        
        const invalidData = validationResults.filter((v: any) => !v.isValid);
        if (invalidData.length > 0) {
          return NextResponse.json({
            error: 'Invalid weather data detected',
            invalidData
          }, { status: 400 });
        }

        result = await dataImportService.importWeatherData(data);
        break;

      case 'regions':
        result = await dataImportService.importRegionData(data);
        break;

      case 'climate_indicators':
        result = await dataImportService.importClimateIndicators(data);
        break;

      case 'nasa_weather':
        const { latitude, longitude, startDate, endDate } = data;
        const nasaData = await dataImportService.fetchNASAWeatherData(
          latitude, longitude, startDate, endDate
        );
        result = await dataImportService.importWeatherData(nasaData);
        break;

      case 'sample_weather':
        const { stationCode, days = 30 } = data;
        const sampleData = dataImportService.generateSampleWeatherData(stationCode, days);
        result = await dataImportService.importWeatherData(sampleData);
        break;

      default:
        return NextResponse.json({
          error: 'Invalid import type. Supported types: weather, regions, climate_indicators, nasa_weather, sample_weather'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${type} data`,
      result,
      source
    });

  } catch (error) {
    console.error('Data import error:', error);
    return NextResponse.json({
      error: 'Failed to import data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'sample') {
      // Generate sample data for testing
      const sampleWeatherData = dataImportService.generateSampleWeatherData('WILSON', 7);
      
      return NextResponse.json({
        success: true,
        data: sampleWeatherData,
        message: 'Sample weather data generated for testing'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Data import API is ready',
      supportedTypes: [
        'weather',
        'regions', 
        'climate_indicators',
        'nasa_weather',
        'sample_weather'
      ],
      endpoints: {
        'POST /api/data/import': 'Import data from various sources',
        'GET /api/data/import?type=sample': 'Generate sample weather data'
      }
    });

  } catch (error) {
    console.error('Error in import API:', error);
    return NextResponse.json({
      error: 'Failed to process request'
    }, { status: 500 });
  }
}
