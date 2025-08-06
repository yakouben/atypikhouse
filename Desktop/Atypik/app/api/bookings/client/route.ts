import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    // First, get the user's bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    // If no bookings, return empty array
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Get property IDs from bookings
    const propertyIds = bookings.map(booking => booking.property_id);

    // Fetch properties for these bookings
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, name, location, images')
      .in('id', propertyIds);

    if (propertiesError) {
      console.error('Error fetching properties:', propertiesError);
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    // Create a map of properties by ID
    const propertiesMap = new Map();
    properties?.forEach(property => {
      propertiesMap.set(property.id, property);
    });

    // Combine bookings with their properties
    const bookingsWithProperties = bookings.map(booking => ({
      ...booking,
      properties: propertiesMap.get(booking.property_id) || {
        name: 'Propriété inconnue',
        location: 'Localisation inconnue',
        images: []
      }
    }));

    return NextResponse.json({ data: bookingsWithProperties });

  } catch (error) {
    console.error('Exception in client bookings API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 