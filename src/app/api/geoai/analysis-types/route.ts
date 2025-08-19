import { NextResponse } from 'next/server';

const GEOAI_API_URL = process.env.GEOAI_API_URL || 'http://localhost:8001';

export async function GET() {
  try {
    const response = await fetch(`${GEOAI_API_URL}/analysis-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GeoAI API error: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in GeoAI analysis-types endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get analysis types',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
