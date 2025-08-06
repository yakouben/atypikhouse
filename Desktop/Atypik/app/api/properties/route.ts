import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cookies } from 'next/headers';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const propertyData = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'price_per_night', 'description', 'location', 'max_guests'];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json({ 
          error: `Field ${field} is required` 
        }, { status: 400 });
      }
    }

    // Add owner_id and timestamps
    const newProperty = {
      ...propertyData,
      owner_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('properties')
      .insert(newProperty)
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('Exception in POST /api/properties:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { searchParams } = new URL(request.url);
    
    const ownerId = searchParams.get('ownerId');
    const published = searchParams.get('published');
    const available = searchParams.get('available');

    let query = supabase
      .from('properties')
      .select(`
        *,
        profiles!properties_owner_id_fkey(full_name, email)
      `)
      .order('created_at', { ascending: false });

    // Filter by owner if specified
    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    // Filter by published status
    if (published === 'true') {
      query = query.eq('is_published', true);
    }

    // Filter by availability
    if (available === 'true') {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('Exception in GET /api/properties:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 