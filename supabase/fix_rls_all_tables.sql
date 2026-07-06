-- ===============================================
-- RLS POLICY FIX - TABEL LOGIN
-- ===============================================
-- Script ini untuk mengizinkan semua operasi di tabel login
-- Cocok untuk development, gunakan dengan bijak!

-- 1. Aktifkan RLS
ALTER TABLE IF EXISTS login ENABLE ROW LEVEL SECURITY;

-- 2. Hapus policy lama jika ada
DROP POLICY IF EXISTS "Enable full access for all users on login" ON login;
DROP POLICY IF EXISTS "Enable read access for all users" ON login;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON login;

-- 3. Buat policy yang mengizinkan SEMUA operasi (insert, select, update, delete)
-- untuk SEMUA pengguna (bahkan yang belum login)
-- PERINGAT: Hanya untuk development!
CREATE POLICY "Allow all operations on login"
ON login
FOR ALL
USING (true)
WITH CHECK (true);

-- ===============================================
-- Atau, jika ingin lebih aman:
-- ===============================================
-- Policy berikut adalah alternatif yang lebih aman (uncomment jika ingin menggunakannya:

/*
-- Policy untuk mengizinkan semua orang INSERT (bahkan yang tidak login)
CREATE POLICY "Allow public insert on login"
ON login
FOR INSERT
WITH CHECK (true);

-- Policy untuk mengizinkan semua orang SELECT
CREATE POLICY "Allow public select on login"
ON login
FOR SELECT
USING (true);

-- Policy untuk mengizinkan update dan delete juga
CREATE POLICY "Allow all operations on login"
ON login
FOR ALL
USING (true)
WITH CHECK (true);
*/

-- ===============================================
-- Verifikasi
-- ===============================================
SELECT * FROM pg_policies WHERE tablename = 'login';
