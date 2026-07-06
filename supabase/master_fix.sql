-- ================================================================
-- LUMIÈRE CRM — MASTER FIX SCRIPT
-- Jalankan seluruh script ini di Supabase SQL Editor
-- ================================================================

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- BAGIAN 1: BUAT TABEL YANG BELUM ADA
-- ================================================================

-- Tabel customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    gender TEXT CHECK (gender IN ('Perempuan', 'Laki-laki')),
    date_of_birth DATE,
    city TEXT,
    address TEXT,
    loyalty_tier TEXT DEFAULT 'Bronze' CHECK (loyalty_tier IN ('Bronze', 'Silver', 'Gold')),
    membership_status TEXT DEFAULT 'Active' CHECK (membership_status IN ('Active', 'Inactive')),
    referral_code TEXT UNIQUE,
    source TEXT DEFAULT 'Website' CHECK (source IN ('Website', 'Instagram', 'TikTok', 'Referral')),
    promo_active BOOLEAN DEFAULT FALSE,
    total_transactions INT DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    join_date DATE DEFAULT CURRENT_DATE,
    last_transaction_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    tag TEXT,
    img_url TEXT,
    description TEXT,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel promo_items — TANPA GENERATED ALWAYS AS
CREATE TABLE IF NOT EXISTS promo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    original_price NUMERIC NOT NULL,
    discount_price NUMERIC NOT NULL,
    discount_percent NUMERIC,
    img_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT UNIQUE NOT NULL,
    customer_id UUID,
    customer_name TEXT,
    total_price NUMERIC NOT NULL DEFAULT 0,
    items_count INT DEFAULT 0,
    payment_method TEXT,
    status TEXT DEFAULT 'Pending',
    shipping_address TEXT,
    shipping_courier TEXT,
    tier TEXT DEFAULT 'Bronze',
    order_date DATE DEFAULT CURRENT_DATE,
    tracking_status INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel order_items — TANPA GENERATED ALWAYS AS (subtotal dihitung client)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID,
    product_title TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    quantity INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel feedback
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID,
    customer_name TEXT,
    product_id UUID,
    rating INT,
    comment TEXT,
    sentiment TEXT DEFAULT 'Neutral',
    status TEXT DEFAULT 'Pending',
    date DATE DEFAULT CURRENT_DATE,
    admin_reply TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel marketing_campaigns
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    source TEXT,
    conversions INT DEFAULT 0,
    reach NUMERIC DEFAULT 0,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel login (legacy)
CREATE TABLE IF NOT EXISTS login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'Customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- BAGIAN 2: FIX KOLOM YANG BERMASALAH (JIKA TABEL SUDAH ADA)
-- ================================================================

-- Fix promo_items: hapus kolom GENERATED ALWAYS AS, ganti dengan kolom biasa
DO $$
BEGIN
    -- Cek apakah discount_percent adalah generated column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'promo_items' 
        AND column_name = 'discount_percent'
        AND is_generated = 'ALWAYS'
    ) THEN
        ALTER TABLE promo_items DROP COLUMN discount_percent;
        ALTER TABLE promo_items ADD COLUMN discount_percent NUMERIC;
        RAISE NOTICE 'Fixed: promo_items.discount_percent changed from GENERATED to regular column';
    ELSE
        RAISE NOTICE 'OK: promo_items.discount_percent is already a regular column (or does not exist)';
    END IF;
END $$;

-- Fix order_items: hapus kolom subtotal GENERATED ALWAYS AS
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'subtotal'
        AND is_generated = 'ALWAYS'
    ) THEN
        ALTER TABLE order_items DROP COLUMN subtotal;
        RAISE NOTICE 'Fixed: order_items.subtotal GENERATED column removed';
    ELSE
        RAISE NOTICE 'OK: order_items.subtotal is fine';
    END IF;
END $$;

-- Tambahkan admin_reply ke feedback kalau belum ada
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS admin_reply TEXT;

-- ================================================================
-- BAGIAN 3: HAPUS SEMUA RLS POLICY LAMA
-- ================================================================

DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
    RAISE NOTICE 'All old RLS policies dropped';
END $$;

-- ================================================================
-- BAGIAN 4: AKTIFKAN RLS + BUAT POLICY BARU (ALLOW ALL — DEV MODE)
-- ================================================================

ALTER TABLE IF EXISTS login ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS promo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS marketing_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_login"              ON login              FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_customers"          ON customers          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_products"           ON products           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_promo_items"        ON promo_items        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_orders"             ON orders             FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_order_items"        ON order_items        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_feedback"           ON feedback           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_marketing"          ON marketing_campaigns FOR ALL USING (true) WITH CHECK (true);

-- ================================================================
-- BAGIAN 5: TEST INSERT — VERIFIKASI SEMUA BERJALAN
-- ================================================================

-- Test insert customers
INSERT INTO customers (full_name, username, email, phone, loyalty_tier, membership_status)
VALUES ('Test Customer', 'test_verify_' || floor(random()*99999)::text, 
        'test_verify_' || floor(random()*99999)::text || '@lumier.com',
        '08000000001', 'Bronze', 'Active')
ON CONFLICT DO NOTHING;

-- Test insert feedback
INSERT INTO feedback (customer_name, rating, comment, sentiment, status, date)
VALUES ('Test Verifikasi', 5, 'Script berjalan dengan benar!', 'Positive', 'Pending', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Test insert promo
INSERT INTO promo_items (title, original_price, discount_price, discount_percent, is_active)
VALUES ('Test Promo Fix', 100000, 75000, 25, true)
ON CONFLICT DO NOTHING;

-- ================================================================
-- BAGIAN 6: VERIFIKASI AKHIR
-- ================================================================

SELECT 'customers' as table_name, count(*) as row_count FROM customers
UNION ALL SELECT 'orders', count(*) FROM orders
UNION ALL SELECT 'order_items', count(*) FROM order_items  
UNION ALL SELECT 'feedback', count(*) FROM feedback
UNION ALL SELECT 'promo_items', count(*) FROM promo_items
UNION ALL SELECT 'products', count(*) FROM products
UNION ALL SELECT 'marketing_campaigns', count(*) FROM marketing_campaigns
ORDER BY table_name;
