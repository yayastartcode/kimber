import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/payload'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const depth = parseInt(searchParams.get('depth') || '1', 10);
    
    const payload = await getPayloadClient();
    
    // Fetch how-to data from payload
    const howTo = await payload.find({
      collection: 'how-to',
      limit,
      page,
      depth,
    });
    
    return NextResponse.json(howTo);
  } catch (error) {
    console.error('Error fetching how-to data:', error);
    return NextResponse.json({ error: 'Error fetching how-to data' }, { status: 500 });
  }
}

// Add POST method for creating new how-to content
export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    
    // Get the form data or JSON from the request
    let data;
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      data = await request.json();
    } else {
      // Handle form data
      const formData = await request.formData();
      
      // Check if the data is coming as a _payload field (which contains JSON)
      const payloadField = formData.get('_payload');
      
      if (payloadField && typeof payloadField === 'string') {
        // Parse the JSON string from the _payload field
        try {
          data = JSON.parse(payloadField);
          console.log('Successfully parsed _payload JSON:', data);
        } catch (e) {
          console.error('Failed to parse _payload JSON:', e);
          return NextResponse.json({ 
            error: 'Failed to parse payload data', 
            details: e instanceof Error ? e.message : 'Unknown parsing error' 
          }, { status: 400 });
        }
      } else {
        // Process form data fields
        data = Object.fromEntries(formData);
      }
    }
    
    console.log('Creating how-to content with data:', data);
    
    // Create the how-to content using Payload CMS
    const howToContent = await payload.create({
      collection: 'how-to',
      data,
    });
    
    return NextResponse.json(howToContent);
  } catch (error) {
    console.error('Error creating how-to content:', error);
    return NextResponse.json({ 
      error: 'Error creating how-to content', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

// Add PATCH method for updating how-to content
export async function PATCH(request: Request) {
  try {
    const payload = await getPayloadClient();
    
    // Get the data from the request
    let data;
    const contentType = request.headers.get('content-type');
    let id;
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      const jsonData = await request.json();
      id = jsonData.id;
      data = jsonData;
    } else {
      // Handle form data
      const formData = await request.formData();
      id = formData.get('id') as string;
      data = Object.fromEntries(formData);
    }
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    console.log(`Updating how-to content with ID: ${id}`);
    
    // Update the how-to content using Payload CMS
    const howToContent = await payload.update({
      collection: 'how-to',
      id,
      data,
    });
    
    return NextResponse.json(howToContent);
  } catch (error) {
    console.error('Error updating how-to content:', error);
    return NextResponse.json({ 
      error: 'Error updating how-to content', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// Add DELETE method for deleting how-to content
export async function DELETE(request: Request) {
  try {
    const payload = await getPayloadClient();
    
    // Get the URL params
    const { searchParams } = new URL(request.url);
    console.log('Delete request search params:', Object.fromEntries(searchParams.entries()));
    
    // Try to extract the ID from various possible parameter formats
    let id = searchParams.get('id');
    
    // If not found directly, try to parse from complex query params
    if (!id) {
      // Check for where[and][1][id][in][0] format (used by Payload admin)
      const complexId = searchParams.get('where[and][1][id][in][0]');
      if (complexId) {
        id = complexId;
      }
      
      // Check for other possible formats
      if (!id) {
        for (const [key, value] of searchParams.entries()) {
          if (key.includes('id') && value) {
            console.log(`Found potential ID in param ${key}: ${value}`);
            id = value;
            break;
          }
        }
      }
    }
    
    if (!id) {
      return NextResponse.json({ 
        error: 'How-to content ID is required', 
        params: Object.fromEntries(searchParams.entries())
      }, { status: 400 });
    }
    
    console.log(`Attempting to delete how-to content with ID: ${id}`);
    
    // Delete the how-to content using Payload CMS
    const howToContent = await payload.delete({
      collection: 'how-to',
      id,
    });
    
    return NextResponse.json(howToContent);
  } catch (error) {
    console.error('Error deleting how-to content:', error);
    return NextResponse.json({ 
      error: 'Error deleting how-to content', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 