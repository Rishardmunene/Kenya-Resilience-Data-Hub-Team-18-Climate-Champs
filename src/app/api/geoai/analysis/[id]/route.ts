import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;
    
    // Get analysis from memory store (serverless-compatible)
    if (!(global as any).analysisStore) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    const analysis = (global as any).analysisStore.get(analysisId);
    
    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error in GeoAI analysis endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get analysis results',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
