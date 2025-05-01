import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const depth = parseInt(searchParams.get('depth') || '1', 10);
    
    const payload = await getPayloadClient();
    
    // Fetch location data from payload
    const location = await payload.find({
      collection: 'location',
      limit,
      page,
      depth,
    });
    
    return NextResponse.json(location);
  } catch (error) {
    console.error('Error fetching location data:', error);
    return NextResponse.json({ error: 'Error fetching location data' }, { status: 500 });
  }
} 