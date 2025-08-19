import { NextRequest, NextResponse } from 'next/server';

const GEOAI_API_URL = process.env.GEOAI_API_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request to GeoAI Python service
    const response = await fetch(`${GEOAI_API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`GeoAI API error: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in GeoAI analyze endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to start analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
