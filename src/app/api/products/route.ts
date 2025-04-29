import { getPayloadClient } from '@/payload'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const payload = await getPayloadClient()
    const { searchParams } = new URL(request.url)
    const whereQuery = searchParams.get('where[slug][equals]')
    
    if (whereQuery) {
      // Fetch single product by slug
      const { docs } = await payload.find({
        collection: 'products',
        where: {
          slug: { equals: whereQuery }
        },
      })
      return NextResponse.json(docs[0] || null)
    }
    
    // Fetch all products when no query is provided
    const { docs } = await payload.find({
      collection: 'products',
      sort: 'id', // Sort by ID in ascending order (lowest first)
      limit: 100,
    })
    
    return NextResponse.json(docs)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

// Add POST method for creating new products
export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient()
    
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
        
        // Handle special fields like 'image' that might be a file or a reference
        if (key === 'image' && typeof value === 'string') {
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
    
    // Create the product using Payload CMS
    const product = await payload.create({
      collection: 'products',
      data,
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ 
      error: 'Error creating product', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// Add PATCH method for updating products
export async function PATCH(request: Request) {
  try {
    const payload = await getPayloadClient()
    
    // Get the form data from the request
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const id = data.id as string
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    
    // Update the product using Payload CMS
    const product = await payload.update({
      collection: 'products',
      id,
      data,
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Error updating product', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

// Add DELETE method for deleting products
export async function DELETE(request: Request) {
  try {
    const payload = await getPayloadClient()
    
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
        error: 'Product ID is required', 
        params: Object.fromEntries(searchParams.entries())
      }, { status: 400 })
    }
    
    console.log(`Attempting to delete product with ID: ${id}`)
    
    // Delete the product using Payload CMS
    const product = await payload.delete({
      collection: 'products',
      id,
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ 
      error: 'Error deleting product', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}