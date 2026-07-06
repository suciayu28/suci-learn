# ===============================================
# LUMIÈRE ATELIER CRM - SUPABASE INTEGRATION GUIDE
# ===============================================

## 📋 Langkah-Langkah Penggunaan

### 1. Konfigurasi Awal

1. **Salin file template konfigurasi:**
   ```bash
   cp .env.example .env
   ```

2. **Isi variabel lingkungan di file `.env`:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

3. **Dapatkan kredensial Supabase:**
   - Buka [Supabase Dashboard](https://supabase.com/dashboard)
   - Pilih proyek Anda
   - Buka menu **Project Settings** → **API**
   - Copy `URL` dan `anon/public` key

---

## 2. Menjalankan Test Koneksi

Tambahkan komponen `SupabaseConnectionTest` ke halaman mana saja untuk memverifikasi koneksi:

```jsx
import SupabaseConnectionTest from './components/SupabaseConnectionTest';

function MyPage() {
  return <SupabaseConnectionTest />;
}
```

---

## 3. Contoh Penggunaan API Layer

### Import yang Dibutuhkan
```jsx
import { 
  supabase, 
  authAPI, 
  productsAPI, 
  customersAPI,
  ordersAPI,
  promoAPI,
  feedbackAPI
} from '../lib/supabase';
```

---

### Autentikasi
```jsx
// Sign In
try {
  const { user, session } = await authAPI.signInWithEmail({
    email: 'user@example.com',
    password: 'password123'
  });
  console.log('Signed in:', user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Sign Up
try {
  const { user } = await authAPI.signUp({
    email: 'new@example.com',
    password: 'password123'
  });
} catch (error) {
  console.error('Signup failed:', error);
}

// Sign Out
await authAPI.signOut();

// Reset Password
await authAPI.resetPasswordForEmail('user@example.com', {
  redirectTo: window.location.origin + '/reset-password'
});
```

---

### Produk
```jsx
// Dapatkan semua produk aktif
const products = await productsAPI.getAllProducts({ isActive: true });

// Dapatkan produk berdasarkan kategori
const skincareProducts = await productsAPI.getAllProducts({ 
  tag: 'Perawatan Kulit' 
});

// Dapatkan produk by ID
const product = await productsAPI.getProductById('product-uuid');

// Tambah produk baru
const newProduct = await productsAPI.createProduct({
  title: 'Serum Vitamin C',
  price: 350000,
  tag: 'Perawatan Kulit',
  img_url: 'https://...',
  stock_quantity: 50
});

// Update produk
await productsAPI.updateProduct('product-uuid', {
  price: 320000,
  stock_quantity: 45
});

// Hapus produk
await productsAPI.deleteProduct('product-uuid');
```

---

### Promo Items
```jsx
// Dapatkan semua promo aktif
const promos = await promoAPI.getAllPromoItems({ isActive: true });
```

---

### Customers
```jsx
// Dapatkan semua customer
const customers = await customersAPI.getAllCustomers();

// Search customer
const searchResults = await customersAPI.getAllCustomers({
  search: 'Amanda'
});

// Filter by tier
const goldMembers = await customersAPI.getAllCustomers({
  loyaltyTier: 'Gold'
});

// Tambah customer baru
const newCustomer = await customersAPI.createCustomer({
  full_name: 'Amanda Putri',
  username: 'amanda123',
  email: 'amanda@example.com',
  phone: '08123456789',
  loyalty_tier: 'Bronze'
});
```

---

### Orders
```jsx
// Dapatkan semua pesanan
const orders = await ordersAPI.getAllOrders();

// Filter by status
const completedOrders = await ordersAPI.getAllOrders({
  status: 'Completed'
});

// Dapatkan detail pesanan beserta item
const order = await ordersAPI.getOrderById('order-uuid');

// Buat pesanan baru
const newOrder = await ordersAPI.createOrder({
  order_id: 'ORD-001',
  customer_name: 'Amanda Putri',
  total_price: 500000,
  status: 'Pending',
  payment_method: 'Virtual Account'
});
```

---

### Feedback
```jsx
// Dapatkan semua feedback
const feedbacks = await feedbackAPI.getAllFeedback();

// Filter by status
const approvedFeedback = await feedbackAPI.getAllFeedback({
  status: 'Approved'
});

// Submit feedback baru
await feedbackAPI.submitFeedback({
  customer_name: 'Amanda',
  rating: 5,
  comment: 'Produknya luar biasa!',
  sentiment: 'Positive'
});
```

---

## 4. Error Handling

Setiap API method akan melempar error jika terjadi kesalahan. Gunakan try-catch:

```jsx
import { SupabaseError } from '../lib/supabase';

try {
  const products = await productsAPI.getAllProducts();
} catch (error) {
  if (error instanceof SupabaseError) {
    console.error('Supabase Error:', error.message);
    console.error('Error Code:', error.code);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## 5. Penggunaan Klien Langsung (Advanced)

Jika Anda membutuhkan akses langsung ke klien Supabase:

```jsx
import { supabase } from '../lib/supabase';

// Query custom
const { data, error } = await supabase
  .from('products')
  .select('title, price')
  .eq('is_active', true)
  .order('price', { ascending: true })
  .limit(10);
```

---

## 6. Struktur File

```
src/
├── lib/
│   └── supabase.js          # Klien Supabase & API Layer
├── components/
│   └── SupabaseConnectionTest.jsx  # Test koneksi
├── services/
│   └── supabaseClient.js    # (Lama, masih ada untuk backward compatibility)
└── ...
```

---

## 7. Catatan Keamanan

- ✅ **Jangan commit file `.env` ke git** (sudah diignore secara default)
- ✅ Gunakan `anon/public` key di client-side, **JANGAN gunakan service_role key**
- ✅ Pastikan RLS (Row Level Security) diaktifkan dan dikonfigurasi dengan benar di Supabase
- ✅ Gunakan environment variables untuk semua konfigurasi sensitif

---

## 8. Troubleshooting

### Error: "new row violates row-level security policy"
Jalankan script di `supabase/fix_rls_login.sql` di Supabase SQL Editor.

### Error: "Supabase URL and Anon Key must be defined"
Pastikan file `.env` Anda sudah diisi dengan benar.

### Error: CORS policy blocked
Pastikan URL aplikasi Anda sudah ditambahkan di **Supabase Dashboard** → **Authentication** → **URL Configuration**.

---

## 9. Skema Database

Untuk melihat dan mengimplementasikan skema database lengkap, lihat:
- `supabase/schema.sql` - Skema lengkap
- `supabase/fix_rls_login.sql` - Perbaikan RLS untuk tabel login

---

## 🚀 Selamat Menggunakan!
Untuk bantuan lebih lanjut, lihat [Dokumentasi Supabase](https://supabase.com/docs).
