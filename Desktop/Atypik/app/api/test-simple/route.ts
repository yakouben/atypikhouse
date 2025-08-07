import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Simple properties test...');
    
    // Test 1: Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey || !serviceKey) {
      return NextResponse.json({ 
        error: 'Environment variables missing',
        supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
        supabaseKey: supabaseKey ? 'Set' : 'Missing',
        serviceKey: serviceKey ? 'Set' : 'Missing'
      }, { status: 500 });
    }

    // Test 2: Check if we can connect to the database
    const { data: testData, error: testError } = await supabaseAdmin
      .from('properties')
      .select('count')
      .limit(1);
    
    if (testError) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: testError.message,
        hint: testError.hint,
        code: testError.code
      }, { status: 500 });
    }

    // Test 3: Check authentication
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: authError.message
      }, { status: 500 });
    }

    // Test 4: Try to insert a simple test record
    const testProperty = {
      name: 'Test Property Simple',
      category: 'cabane_arbre',
      price_per_night: 100.00,
      description: 'Test description',
      location: 'Test location',
      max_guests: 2,
      owner_id: user?.id || '00000000-0000-0000-0000-000000000000',
      is_published: true,
      is_available: true
    };

    console.log('Attempting to insert test property:', testProperty);

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('properties')
      .insert(testProperty)
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ 
        error: 'Failed to insert test property',
        details: insertError.message,
        hint: insertError.hint,
        code: insertError.code,
        testProperty,
        userExists: !!user,
        userId: user?.id
      }, { status: 500 });
    }

    // Clean up test record
    if (insertData) {
      await supabaseAdmin
        .from('properties')
        .delete()
        .eq('id', insertData.id);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Properties table is working correctly!',
      testInsertSuccessful: true,
      userExists: !!user,
      userId: user?.id
    });

  } catch (error) {
    console.error('Exception in test-simple:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
} 