import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    
    const countyCode = searchParams.get('county_code');
    const countyName = searchParams.get('county_name');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT 
        id, name, county_code, county_name, sub_county, ward,
        latitude, longitude, area_km2, population, elevation_m,
        created_at, updated_at
      FROM regions
      WHERE 1=1
    `;

    if (countyCode) {
      query = sql`${query} AND county_code = ${countyCode}`;
    }

    if (countyName) {
      query = sql`${query} AND county_name ILIKE ${`%${countyName}%`}`;
    }

    query = sql`${query} ORDER BY county_name LIMIT ${limit} OFFSET ${offset}`;

    const regions = await query;

    return NextResponse.json({
      success: true,
      data: regions,
      count: regions.length,
      pagination: {
        limit,
        offset,
        hasMore: regions.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    const {
      name,
      county_code,
      county_name,
      sub_county,
      ward,
      latitude,
      longitude,
      area_km2,
      population,
      elevation_m
    } = body;

    const result = await sql`
      INSERT INTO regions (
        name, county_code, county_name, sub_county, ward,
        latitude, longitude, area_km2, population, elevation_m
      ) VALUES (
        ${name}, ${county_code}, ${county_name}, ${sub_county}, ${ward},
        ${latitude}, ${longitude}, ${area_km2}, ${population}, ${elevation_m}
      ) RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Region created successfully'
    });

  } catch (error) {
    console.error('Error creating region:', error);
    return NextResponse.json(
      { error: 'Failed to create region' },
      { status: 500 }
    );
  }
}
