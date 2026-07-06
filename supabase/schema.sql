-- ===============================================
-- LUMIÈRE ATELIER CRM - SUPABASE DATABASE SCHEMA
-- ===============================================
-- Production-Ready Database Schema for Luxury Cosmetics CRM
-- Includes: Auth, Users, Customers, Products, Orders, Promo, Feedback & More
-- ===============================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===============================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ===============================================

-- Table: profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'Customer' CHECK (role IN ('Admin', 'Customer', 'Guest')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: login (legacy login table for backward compatibility)
CREATE TABLE IF NOT EXISTS login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT, -- Note: In production, use Supabase Auth instead
    name TEXT,
    role TEXT DEFAULT 'Customer' CHECK (role IN ('Admin', 'Customer', 'Guest')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 2. CUSTOMER MANAGEMENT
-- ===============================================

-- Table: customers
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

-- ===============================================
-- 3. PRODUCT CATALOG
-- ===============================================

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    tag TEXT CHECK (tag IN ('Tata Rias', 'Perawatan Kulit', 'Parfum', 'Alat Kecantikan')),
    img_url TEXT,
    description TEXT,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: promo_items
CREATE TABLE IF NOT EXISTS promo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    original_price NUMERIC NOT NULL,
    discount_price NUMERIC NOT NULL,
    discount_percent NUMERIC GENERATED ALWAYS AS (
        ROUND(((original_price - discount_price) / original_price) * 100)
    ) STORED,
    img_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 4. ORDER & TRANSACTION MANAGEMENT
-- ===============================================

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT UNIQUE NOT NULL, -- Human-readable order ID like "ORD-001"
    customer_id UUID REFERENCES customers(id),
    customer_name TEXT,
    total_price NUMERIC NOT NULL,
    items_count INT DEFAULT 0,
    payment_method TEXT CHECK (payment_method IN ('Virtual Account', 'Credit Card', 'GoPay', 'ShopeePay', 'Bank Transfer')),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    shipping_address TEXT,
    shipping_courier TEXT,
    tier TEXT CHECK (tier IN ('Bronze', 'Silver', 'Gold')),
    order_date DATE DEFAULT CURRENT_DATE,
    tracking_status INT DEFAULT 1, -- 1: Diproses, 2: Sortir, 3: Dalam Pengiriman, 4: Diterima
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_title TEXT,
    price NUMERIC NOT NULL,
    quantity INT DEFAULT 1,
    subtotal NUMERIC GENERATED ALWAYS AS (price * quantity) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 5. MEMBERSHIP & LOYALTY
-- ===============================================

-- Table: membership_tiers
CREATE TABLE IF NOT EXISTS membership_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_name TEXT UNIQUE NOT NULL CHECK (tier_name IN ('Bronze', 'Silver', 'Gold')),
    discount_percent NUMERIC DEFAULT 0,
    min_spent NUMERIC DEFAULT 0,
    points_multiplier NUMERIC DEFAULT 1,
    benefits TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: loyalty_points
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    points NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('Earned', 'Redeemed')),
    description TEXT,
    order_id UUID REFERENCES orders(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 6. FEEDBACK & REVIEWS
-- ===============================================

-- Table: feedback
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    customer_name TEXT,
    product_id UUID REFERENCES products(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    sentiment TEXT CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Spam', 'Archived')),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================================
-- 7. MARKETING & CAMPAIGNS
-- ===============================================

-- Table: marketing_campaigns
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

-- ===============================================
-- 8. STORAGE BUCKETS CONFIGURATION
-- ===============================================

-- Insert storage buckets for product images, customer avatars, etc.
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('product-images', 'Product Images', TRUE),
    ('customer-avatars', 'Customer Avatars', TRUE),
    ('marketing-assets', 'Marketing Assets', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ===============================================
-- 9. INDEXES FOR PERFORMANCE
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty ON customers(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_products_tag ON products(tag);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
CREATE INDEX IF NOT EXISTS idx_promo_items_active ON promo_items(is_active);

-- ===============================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ===============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- Login table policies (for backward compatibility)
CREATE POLICY "Enable full access for authenticated users on login" 
    ON login FOR ALL 
    USING (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
    ON profiles FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Customers policies
CREATE POLICY "Authenticated users can view customers" 
    ON customers FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage customers" 
    ON customers FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Products policies
CREATE POLICY "Everyone can view active products" 
    ON products FOR SELECT 
    USING (is_active = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage products" 
    ON products FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Promo Items policies
CREATE POLICY "Everyone can view active promo items" 
    ON promo_items FOR SELECT 
    USING (is_active = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage promo items" 
    ON promo_items FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Orders policies
CREATE POLICY "Users can view their own orders" 
    ON orders FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM profiles p 
        JOIN customers c ON p.email = c.email 
        WHERE p.id = auth.uid() AND c.id = orders.customer_id
    ) OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

CREATE POLICY "Admins can manage orders" 
    ON orders FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Order Items policies
CREATE POLICY "Users can view their own order items" 
    ON order_items FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM orders o
        JOIN profiles p ON p.email = (SELECT email FROM customers WHERE id = o.customer_id)
        WHERE p.id = auth.uid() AND o.id = order_items.order_id
    ) OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

CREATE POLICY "Admins can manage order items" 
    ON order_items FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Feedback policies
CREATE POLICY "Everyone can view approved feedback" 
    ON feedback FOR SELECT 
    USING (status = 'Approved' OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can submit feedback" 
    ON feedback FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage feedback" 
    ON feedback FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Marketing Campaigns policies
CREATE POLICY "Authenticated users can view campaigns" 
    ON marketing_campaigns FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage campaigns" 
    ON marketing_campaigns FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Membership Tiers policies
CREATE POLICY "Everyone can view membership tiers" 
    ON membership_tiers FOR SELECT 
    USING (true);

CREATE POLICY "Admins can manage tiers" 
    ON membership_tiers FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Loyalty Points policies
CREATE POLICY "Users can view their own points" 
    ON loyalty_points FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM profiles p 
        JOIN customers c ON p.email = c.email 
        WHERE p.id = auth.uid() AND c.id = loyalty_points.customer_id
    ) OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

CREATE POLICY "Admins can manage loyalty points" 
    ON loyalty_points FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin'
    ));

-- Storage policies
CREATE POLICY "Public Access to product images" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'product-images');

CREATE POLICY "Admin can upload product images" 
    ON storage.objects FOR INSERT 
    WITH CHECK (
        bucket_id = 'product-images' AND 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin can update/delete product images" 
    ON storage.objects FOR ALL 
    USING (
        bucket_id = 'product-images' AND 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
    );

-- ===============================================
-- 11. DATABASE FUNCTIONS & TRIGGERS
-- ===============================================

-- Function: Update updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at column
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'profiles', 'login', 'customers', 'products', 'promo_items', 
        'orders', 'feedback', 'marketing_campaigns', 
        'membership_tiers'
    ]
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        ', t, t);
    END LOOP;
END $$;

-- Function: Generate referral code automatically
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
    initials TEXT;
    random_num TEXT;
BEGIN
    IF NEW.referral_code IS NULL THEN
        -- Take first 3 uppercase letters of name
        initials := UPPER(SUBSTRING(REGEXP_REPLACE(NEW.full_name, '\s', '', 'g'), 1, 3));
        -- Generate random 3-digit number
        random_num := LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
        NEW.referral_code := 'CREATOR-' || initials || random_num;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_referral_code
BEFORE INSERT ON customers
FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

-- Function: Auto-calculate order_id
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TRIGGER AS $$
DECLARE
    order_count INT;
BEGIN
    IF NEW.order_id IS NULL THEN
        SELECT COUNT(*) + 1 INTO order_count FROM orders;
        NEW.order_id := 'ORD-' || LPAD(order_count::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_order_id
BEFORE INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION generate_order_id();

-- ===============================================
-- 12. SEED DATA
-- ===============================================

-- Insert default membership tiers
INSERT INTO membership_tiers (tier_name, discount_percent, min_spent, points_multiplier, benefits)
VALUES 
    ('Bronze', 0, 0, 1, ARRAY['Basic Access', 'Birthday Reward']),
    ('Silver', 10, 5000000, 1.5, ARRAY['10% Discount', 'Priority Shipping', 'Exclusive Offers']),
    ('Gold', 20, 20000000, 2, ARRAY['20% Discount', 'Free Shipping', 'Early Access', 'VIP Support'])
ON CONFLICT (tier_name) DO NOTHING;

-- ===============================================
-- SCHEMA COMPLETE!
-- ===============================================
