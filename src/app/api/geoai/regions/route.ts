import { NextResponse } from 'next/server';

export async function GET() {
  const kenyaRegions = [
    {
      name: "Nairobi",
      latitude: -1.2921,
      longitude: 36.8219,
      county_code: "047"
    },
    {
      name: "Mombasa",
      latitude: -4.0435,
      longitude: 39.6682,
      county_code: "001"
    },
    {
      name: "Kisumu",
      latitude: -0.0917,
      longitude: 34.7680,
      county_code: "042"
    },
    {
      name: "Nakuru",
      latitude: -0.3031,
      longitude: 36.0800,
      county_code: "032"
    },
    {
      name: "Eldoret",
      latitude: 0.5204,
      longitude: 35.2699,
      county_code: "027"
    },
    {
      name: "Meru",
      latitude: 0.0500,
      longitude: 37.6500,
      county_code: "012"
    },
    {
      name: "Nyeri",
      latitude: -0.4167,
      longitude: 36.9500,
      county_code: "019"
    },
    {
      name: "Thika",
      latitude: -1.0332,
      longitude: 37.0692,
      county_code: "022"
    },
    {
      name: "Machakos",
      latitude: -1.5167,
      longitude: 37.2667,
      county_code: "016"
    },
    {
      name: "Kakamega",
      latitude: 0.2833,
      longitude: 34.7500,
      county_code: "037"
    }
  ];
  
  return NextResponse.json({ regions: kenyaRegions });
}
