import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }

    if (!user) {
      console.error('Upload failed: User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting image upload for user:', user.id);

    const formData = await request.formData();
    const imageUrls: string[] = [];
    const errors: string[] = [];

    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Error listing buckets:', bucketError);
      return NextResponse.json({ error: 'Storage configuration error' }, { status: 500 });
    }

    console.log('Available buckets:', buckets?.map(b => b.name));

    const bucketExists = buckets?.some(bucket => bucket.name === 'images');
    if (!bucketExists) {
      console.error('Bucket images does not exist');
      return NextResponse.json({ 
        error: 'Storage bucket not found. Please create the images bucket in Supabase.' 
      }, { status: 500 });
    }

    console.log('Bucket exists, processing files...');

    // Process each uploaded file
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const file = value;
        
        console.log('Processing file:', file.name, 'Size:', file.size);
        
        try {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            const errorMsg = `Invalid file type: ${file.type}`;
            console.error(errorMsg);
            errors.push(errorMsg);
            continue;
          }

          // Generate unique filename
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

          console.log('Uploading to path:', fileName);

          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            const errorMsg = `Failed to upload ${file.name}: ${error.message}`;
            console.error(errorMsg);
            errors.push(errorMsg);
            continue;
          }

          console.log('File uploaded successfully:', data);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

          console.log('Public URL generated:', publicUrl);
          imageUrls.push(publicUrl);
          
        } catch (fileError) {
          const errorMsg = `Error processing ${file.name}: ${fileError}`;
          console.error(errorMsg);
          errors.push(errorMsg);
        }
      }
    }

    // If we have any errors, return them
    if (errors.length > 0) {
      console.error('Upload completed with errors:', errors);
      return NextResponse.json({ 
        error: `Upload completed with errors: ${errors.join(', ')}`,
        imageUrls, // Return any successfully uploaded images
        errors 
      }, { status: 207 }); // 207 Multi-Status
    }

    console.log('All images uploaded successfully:', imageUrls);

    return NextResponse.json({ 
      imageUrls, 
      error: null 
    });
  } catch (error) {
    console.error('Exception in POST /api/properties/upload-images:', error);
    return NextResponse.json({ 
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 