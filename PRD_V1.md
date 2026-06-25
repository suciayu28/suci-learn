# PRD V1: VERSI DASAR (BASIC VERSION)
## Proyek: Lumier Cosmetics CRM - Landing Page

---

## 1. Executive Summary & Goals
*   **Tujuan Utama**: Memperkenalkan eksistensi Lumier Cosmetics CRM kepada pelaku bisnis kecantikan dan menangkap minat pendaftaran awal (Lead Acquisition).
*   **Target Pengguna**: Owner Brand Kosmetik Lokal, Distributor Utama Skincare, Jaringan Agen & Reseller Kosmetik, Toko Kosmetik Retail.
*   **Metrik Sukses**: Jumlah pengunjung halaman (Visitor), CTR tombol CTA, dan Bounce Rate halaman.

---

## 2. Struktur Landing Page V1

### 2.1 Navbar
*   Logo Lumier Cosmetics CRM
*   Tautan Jangkar: Home, Features, Pricing, Contact
*   Tombol Navigasi: Login (Supabase Auth)

### 2.2 Hero Section
*   **Headline**: "Kelola Bisnis Kosmetik Lebih Mudah dengan Lumier Cosmetics CRM"
*   **Subheadline**: "Satukan data identitas pelanggan, level membership, kode referral reseller, dan riwayat transaksi kecantikan dalam satu platform SaaS modern."
*   **Call-to-Action (CTA)**:
    *   Button 1: "Mulai Gratis" (Mengarahkan ke form trial di bagian bawah).
    *   Button 2: "Lihat Demo" (Membuka mockup preview/modul video).

### 2.3 Features Section (Daftar Fitur Minimalis)
*   **Customer Identity Management**: Penyimpanan database profil pembeli kosmetik secara rapi.
*   **Contact & Geo-Tracking**: Pengarsipan nomor kontak dan segmentasi wilayah pelanggan.
*   **Basic Membership Tiers**: Pengelompokan status member reseller/agen.
*   **Transaction History Logs**: Pencatatan data belanja secara terpusat.

### 2.4 Footer
*   Informasi kontak brand.
*   Email support resmi.
*   Tautan media sosial.
*   Copyright banner.

---

## 3. Spesifikasi Skema Database Minimum
Struktur data minimum yang diimplementasikan pada versi dasar:
*   `id`: UUID (Primary Key)
*   `name`: Nama Lengkap
*   `email`: Alamat Email
*   `loyalty`: Level Membership (Bronze, Silver, Gold)
*   `totalTransactions`: Nilai Belanja Kumulatif
