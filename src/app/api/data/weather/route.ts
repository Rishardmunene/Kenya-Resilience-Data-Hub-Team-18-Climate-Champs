import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    
    const stationId = searchParams.get('station_id');
    const stationCode = searchParams.get('station_code');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT 
        wd.id, wd.station_id, wd.timestamp,
        wd.temperature_celsius, wd.humidity_percent, wd.rainfall_mm,
        wd.wind_speed_kmh, wd.wind_direction_degrees,
        wd.atmospheric_pressure_hpa, wd.solar_radiation_wm2,
        wd.visibility_km, wd.cloud_cover_percent, wd.data_quality,
        ws.station_code, ws.station_name, ws.latitude, ws.longitude,
        r.county_name, r.name as region_name
      FROM weather_data wd
      JOIN weather_stations ws ON wd.station_id = ws.id
      LEFT JOIN regions r ON ws.region_id = r.id
      WHERE 1=1
    `;

    if (stationId) {
      query = sql`${query} AND wd.station_id = ${stationId}`;
    }

    if (stationCode) {
      query = sql`${query} AND ws.station_code = ${stationCode}`;
    }

    if (startDate) {
      query = sql`${query} AND wd.timestamp >= ${startDate}::timestamp`;
    }

    if (endDate) {
      query = sql`${query} AND wd.timestamp <= ${endDate}::timestamp`;
    }

    query = sql`${query} ORDER BY wd.timestamp DESC LIMIT ${limit} OFFSET ${offset}`;

    const weatherData = await query;

    return NextResponse.json({
      success: true,
      data: weatherData,
      count: weatherData.length,
      pagination: {
        limit,
        offset,
        hasMore: weatherData.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const body = await request.json();

    const {
      station_id,
      timestamp,
      temperature_celsius,
      humidity_percent,
      rainfall_mm,
      wind_speed_kmh,
      wind_direction_degrees,
      atmospheric_pressure_hpa,
      solar_radiation_wm2,
      visibility_km,
      cloud_cover_percent,
      data_quality = 'good'
    } = body;

    const result = await sql`
      INSERT INTO weather_data (
        station_id, timestamp, temperature_celsius, humidity_percent,
        rainfall_mm, wind_speed_kmh, wind_direction_degrees,
        atmospheric_pressure_hpa, solar_radiation_wm2,
        visibility_km, cloud_cover_percent, data_quality
      ) VALUES (
        ${station_id}, ${timestamp}, ${temperature_celsius}, ${humidity_percent},
        ${rainfall_mm}, ${wind_speed_kmh}, ${wind_direction_degrees},
        ${atmospheric_pressure_hpa}, ${solar_radiation_wm2},
        ${visibility_km}, ${cloud_cover_percent}, ${data_quality}
      ) RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Weather data created successfully'
    });

  } catch (error) {
    console.error('Error creating weather data:', error);
    return NextResponse.json(
      { error: 'Failed to create weather data' },
      { status: 500 }
    );
  }
}
