import { getPayloadClient } from '@/payload'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      throw new Error('Failed to initialize Payload client')
    }

    // Fetch the clients data
    const clients = await payload.find({
      collection: 'clients',
      sort: 'order',
      limit: 100,
    })

    if (!clients || !clients.docs) {
      throw new Error('No clients data received from database')
    }

    return NextResponse.json(clients.docs)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { 
        error: 'Error fetching clients', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Add POST method for creating new clients
export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      throw new Error('Failed to initialize Payload client')
    }
    
    // Get the form data from the request
    const formData = await request.formData()
    
    // Check if the data is coming as a _payload field (which contains JSON)
    const payloadField = formData.get('_payload')
    let data: Record<string, any>
    
    if (payloadField && typeof payloadField === 'string') {
      // Parse the JSON string from the _payload field
      try {
        data = JSON.parse(payloadField)
        console.log('Successfully parsed _payload JSON:', data)
      } catch (e) {
        console.error('Failed to parse _payload JSON:', e)
        return NextResponse.json({ 
          error: 'Failed to parse payload data', 
          details: e instanceof Error ? e.message : 'Unknown parsing error' 
        }, { status: 400 })
      }
    } else {
      // Fallback to processing individual form fields
      data = {}
      for (const [key, value] of formData.entries()) {
        if (key === '_payload') continue // Skip the _payload field
        
        // Handle special fields like 'logo' that might be a file or a reference
        if (key === 'logo' && typeof value === 'string') {
          // If it's a string, it's likely a reference ID
          data[key] = value
        } else if (value instanceof File) {
          // If it's a file, we need to handle it differently
          // For now, we'll just use the ID if provided in another field
          continue
        } else {
          // For regular fields, just add them to the data object
          data[key] = value
        }
      }
    }
    
    console.log('Final data for Payload:', data)
    
    // Create the client using Payload CMS
    const client = await payload.create({
      collection: 'clients',
      data,
    })
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { 
        error: 'Error creating client', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}

// Add PATCH method for updating clients
export async function PATCH(request: Request) {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      throw new Error('Failed to initialize Payload client')
    }
    
    // Get the form data from the request
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const id = data.id as string
    
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }
    
    // Update the client using Payload CMS
    const client = await payload.update({
      collection: 'clients',
      id,
      data,
    })
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { 
        error: 'Error updating client', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

// Add DELETE method for deleting clients
export async function DELETE(request: Request) {
  try {
    const payload = await getPayloadClient()
    if (!payload) {
      throw new Error('Failed to initialize Payload client')
    }
    
    // Get the URL params
    const { searchParams } = new URL(request.url)
    console.log('Delete request search params:', Object.fromEntries(searchParams.entries()))
    
    // Try to extract the ID from various possible parameter formats
    let id = searchParams.get('id')
    
    // If not found directly, try to parse from complex query params
    if (!id) {
      // Check for where[and][1][id][in][0] format (used by Payload admin)
      const complexId = searchParams.get('where[and][1][id][in][0]')
      if (complexId) {
        id = complexId
      }
      
      // Check for other possible formats
      if (!id) {
        for (const [key, value] of searchParams.entries()) {
          if (key.includes('id') && value) {
            console.log(`Found potential ID in param ${key}: ${value}`)
            id = value
            break
          }
        }
      }
    }
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Client ID is required', 
        params: Object.fromEntries(searchParams.entries())
      }, { status: 400 })
    }
    
    console.log(`Attempting to delete client with ID: ${id}`)
    
    // Delete the client using Payload CMS
    const client = await payload.delete({
      collection: 'clients',
      id,
    })
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { 
        error: 'Error deleting client', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
}