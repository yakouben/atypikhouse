-- Fix RLS policies for bookings table - Run this in your Supabase SQL editor

-- First, let's check the current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'bookings' AND schemaname = 'public';

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;

-- Create new, more permissive RLS policies for bookings
-- Policy for viewing bookings (users can view their own bookings or bookings for properties they own)
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = client_id OR 
        auth.uid() IN (
            SELECT owner_id FROM public.properties WHERE id = property_id
        )
    );

-- Policy for inserting bookings (users can insert bookings where they are the client)
-- This is the key fix - we need to allow authenticated users to insert bookings
-- The issue is that client_id is the profile ID, not the auth user ID
CREATE POLICY "Users can insert their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (
        auth.uid() = client_id OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = client_id AND auth.uid() = id
        )
    );

-- Policy for updating bookings (users can update bookings they created or bookings for properties they own)
CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (
        auth.uid() = client_id OR 
        auth.uid() IN (
            SELECT owner_id FROM public.properties WHERE id = property_id
        )
    );

-- Policy for deleting bookings (users can delete bookings they created or bookings for properties they own)
CREATE POLICY "Users can delete their own bookings" ON public.bookings
    FOR DELETE USING (
        auth.uid() = client_id OR 
        auth.uid() IN (
            SELECT owner_id FROM public.properties WHERE id = property_id
        )
    );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'bookings' AND schemaname = 'public'; 