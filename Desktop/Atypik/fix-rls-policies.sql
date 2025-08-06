-- Fix RLS policies for profiles table
-- Run this in your Supabase SQL editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new, more permissive policies

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile (more permissive for signup)
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        (auth.uid() IS NOT NULL)
    ); 