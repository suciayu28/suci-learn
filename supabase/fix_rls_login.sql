-- ===============================================
-- QUICK FIX: RLS POLICY FOR LOGIN TABLE
-- ===============================================
-- Run this in Supabase SQL Editor to fix the "new row violates row-level security policy" error

-- 1. Make sure RLS is enabled on login table
ALTER TABLE IF EXISTS login ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any
DROP POLICY IF EXISTS "Enable full access for authenticated users on login" ON login;

-- 3. Create a permissive policy for the login table (for backward compatibility)
CREATE POLICY "Enable full access for all users on login" 
    ON login FOR ALL 
    USING (true)
    WITH CHECK (true);

-- ===============================================
-- ALTERNATIVE: If you want to disable RLS completely for login table (not recommended for production)
-- Uncomment the line below:
-- ===============================================
-- ALTER TABLE login DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- DONE! Now you should be able to create accounts without RLS errors
-- ===============================================
