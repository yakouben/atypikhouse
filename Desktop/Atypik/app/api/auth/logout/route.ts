import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    console.log('Testing logout functionality...');
    
    // Test the logout
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout test failed:', error);
      return NextResponse.json({ 
        success: false,
        error: error.message 
      }, { status: 500 });
    }

    console.log('Logout test successful');
    return NextResponse.json({ 
      success: true,
      message: 'Logout functionality working correctly'
    });

  } catch (error) {
    console.error('Logout test error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 