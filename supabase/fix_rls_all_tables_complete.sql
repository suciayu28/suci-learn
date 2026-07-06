-- ===============================================
-- RLS POLICY FIX - SEMUA TABEL (UNTUK DEVELOPMENT)
-- ===============================================
-- Script ini untuk mengizinkan semua operasi di semua tabel
-- Cocok untuk development, gunakan dengan bijak!

-- 1. Aktifkan RLS untuk semua tabel (jika belum aktif)
ALTER TABLE IF EXISTS login ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS loyalty_points ENABLE ROW LEVEL SECURITY;

-- 2. Hapus policy lama jika ada
DROP POLICY IF EXISTS "Allow all operations on login" ON login;
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all operations on customers" ON customers;
DROP POLICY IF EXISTS "Allow all operations on products" ON products;
DROP POLICY IF EXISTS "Allow all operations on promo_items" ON promo_items;
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow all operations on feedback" ON feedback;
DROP POLICY IF EXISTS "Allow all operations on marketing_campaigns" ON marketing_campaigns;
DROP POLICY IF EXISTS "Allow all operations on membership_tiers" ON membership_tiers;
DROP POLICY IF EXISTS "Allow all operations on loyalty_points" ON loyalty_points;

-- 3. Buat policy yang mengizinkan SEMUA operasi untuk SEMUA pengguna
-- PERINGATAN: Hanya untuk development! Jangan gunakan di production!
CREATE POLICY "Allow all operations on login" ON login FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on promo_items" ON promo_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on feedback" ON feedback FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on marketing_campaigns" ON marketing_campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on membership_tiers" ON membership_tiers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on loyalty_points" ON loyalty_points FOR ALL USING (true) WITH CHECK (true);

-- ===============================================
-- Verifikasi
-- ===============================================
SELECT tablename, policyname FROM pg_policies ORDER BY tablename;
