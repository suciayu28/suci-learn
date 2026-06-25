# DOKUMEN DELIVERABLES FINAL: SPESIFIKASI TEKNIS & PRD EVOLUSI
## PROYEK: LUMIER COSMETICS CRM
**Tanggal**: 25 Juni 2026  
**Status**: Final & Disetujui  
**Peran Kontributor**: Senior Product Manager, Business Analyst, CRM Consultant, UI/UX Designer, Frontend Architect.

---

## 1. Executive Summary

### 1.1 Latar Belakang & Masalah Industri
Industri kosmetik dan kecantikan modern di Asia Tenggara berkembang sangat pesat, ditandai dengan penetrasi pasar D2C (Direct-to-Consumer) yang masif serta ketergantungan yang tinggi pada jaringan reseller, agen, distributor, dan pemasaran berbasis influencer (afiliasi). Namun, sebagian besar brand kecantikan menghadapi kendala operasional yang kritis:
*   **Fragmentasi Data Pelanggan**: Data pembelian pelanggan tersebar di berbagai platform e-commerce, catatan manual reseller, dan kasir toko fisik, sehingga mempersulit analisis perilaku konsumen yang terpadu.
*   **Atribusi Pemasaran yang Buruk**: Sulit melacak performa nyata dari *influencer marketing* (melalui Kode Referral / *Creator Code*) secara akurat dan real-time.
*   **Rendahnya Retention Rate**: Produk skincare dan kosmetik memiliki siklus habis pakai yang dapat diprediksi. Tanpa adanya pengingat restock otomatis (*restock alert*), pelanggan sering beralih ke kompetitor saat produk mereka habis.
*   **Pengelolaan Membership Manual**: Skema loyalitas pelanggan (Bronze, Silver, Gold) sering kali dikelola secara manual oleh admin gudang atau agen, memicu kesalahan perhitungan komisi dan diskon bertingkat.

### 1.2 Solusi & Nilai Jual Utama (USP)
**Lumier Cosmetics CRM** hadir sebagai platform Software-as-a-Service (SaaS) B2B & D2C yang dirancang khusus untuk menjembatani masalah tersebut. Sistem ini menyatukan manajemen data identitas pelanggan, pelacakan geografis penjualan, keagenan afiliasi, loyalitas bertingkat, serta kecerdasan analitik untuk memprediksi pembelian ulang produk kecantikan. 

Dengan mengotomatisasi siklus dari retensi hingga pesanan ulang, Lumier Cosmetics CRM membantu brand meningkatkan *Customer Lifetime Value* (CLV), merampingkan operasional keagenan, dan memaksimalkan ROI pemasaran omni-channel.

---

## 2. Spesifikasi Tabel Skema Data Inti CRM Kosmetik

Berikut adalah representasi detail dari struktur database internal CRM kecantikan Lumier Cosmetics, yang terikat langsung (*data-bound*) dengan Landing Page dan modul analitik sistem.

### 2.1 Tabel Utama: `customers`
Tabel ini merekam profil lengkap identitas pelanggan, kontak, tingkat keanggotaan, atribut kampanye pemasaran, dan indikator aktivitas.

| Nama Kolom | Tipe Data | Deskripsi / Aturan Bisnis | Relasi / Catatan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key unik pelanggan. | Dibuat otomatis saat registrasi. |
| `name` | `VARCHAR(150)` | Nama lengkap pelanggan (terbaca pada profil). | Wajib diisi. |
| `username` | `VARCHAR(50)` | Nickname atau username unik untuk login member. | Unik. |
| `email` | `VARCHAR(100)` | Alamat email aktif untuk notifikasi otomatis. | Unik. |
| `phone` | `VARCHAR(20)` | Nomor HP aktif yang terintegrasi dengan WhatsApp Gateway. | Unik. Format internasional (`08...` atau `+62...`). |
| `gender` | `VARCHAR(10)` | Jenis Kelamin (`Laki-laki` / `Perempuan`) untuk segmentasi riasan. | Segmentasi pemasaran produk pria vs wanita. |
| `dob` | `DATE` | Tanggal Lahir pelanggan. | Pemicu promo hari ulang tahun otomatis. |
| `city` | `VARCHAR(100)` | Kota tempat tinggal saat ini. | Segmentasi logistik dan wilayah pemasaran. |
| `province` | `VARCHAR(100)` | Provinsi tempat tinggal saat ini. | Analisis geospasial penjualan daerah. |
| `joinDate` | `DATE` | Tanggal pendaftaran akun pertama kali. | Penentuan umur keanggotaan. |
| `status` | `VARCHAR(15)` | Status keaktifan akun (`Active` / `Inactive`). | Boolean control / Filter segmentasi aktif. |
| `loyalty` | `VARCHAR(15)` | Level Membership (`Bronze`, `Silver`, `Gold`). | Penentu diskon bertingkat & alokasi reward. |
| `referralCode` | `VARCHAR(50)` | Kode afiliasi / Creator Code yang digunakan saat mendaftar. | Menghubungkan user dengan reseller atau influencer. |
| `feedback` | `TEXT` | Catatan ulasan performa produk terakhir. | Diambil dari ulasan bintang 5 atau review. |
| `totalTransactions` | `NUMERIC(15,2)` | Total nilai belanja kumulatif (Customer Lifetime Value - CLV). | Akumulasi otomatis dari transaksi selesai. |
| `itemsCount` | `INTEGER` | Total kuantitas barang kecantikan yang pernah dibeli. | Untuk statistik volume produk terjual. |
| `paymentMethod` | `VARCHAR(50)` | Metode pembayaran yang paling sering digunakan. | Contoh: `Virtual Account`, `GoPay`, `Midtrans`. |
| `lastTransactionDate`| `DATE` | Tanggal transaksi pembelian terakhir. | Acuan penghitungan prediksi restock alert. |
| `source` | `VARCHAR(50)` | Sumber atribusi pendaftaran (`Instagram`, `TikTok`, `Website`). | Jalur atribusi kampanye pemasaran. |
| `promoActive` | `BOOLEAN` | Apakah kupon diskon/status promo sedang aktif untuk user ini. | Otomatisasi push notification. |

### 2.2 Tabel Pendukung: `orders`
Tabel transaksi penjualan yang terakumulasi ke total transaksi di tabel pelanggan.

| Nama Kolom | Tipe Data | Deskripsi | Relasi |
| :--- | :--- | :--- | :--- |
| `order_id` | `VARCHAR(50)` | Primary Key nomor invoice pesanan resmi. | - |
| `customer_id` | `UUID` | ID Pelanggan yang melakukan transaksi. | Foreign Key ke `customers.id`. |
| `totalPrice` | `NUMERIC(15,2)`| Total nilai belanja pada transaksi ini. | Diakumulasikan ke `totalTransactions`. |
| `status` | `VARCHAR(20)` | Status pengiriman (`Pending`, `Completed`, `Cancelled`). | Mempengaruhi kalkulasi omset riil. |
| `order_date` | `DATE` | Tanggal dilakukannya transaksi. | Diperbarui ke `lastTransactionDate` pelanggan. |
| `products` | `JSONB` | Array daftar produk yang dibeli (nama produk, qty, harga). | Menyimpan item kosmetik terperinci. |

### 2.3 Tabel Analisis Kampanye: `campaigns`
Melacak efektivitas pemasaran di berbagai saluran akuisisi.

| Nama Kolom | Tipe Data | Deskripsi | Jalur Atribusi |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | ID unik kampanye pemasaran. | - |
| `name` | `VARCHAR(150)` | Nama kampanye pemasaran kecantikan. | Contoh: "Glow Summer Campaign". |
| `source` | `VARCHAR(50)` | Saluran pemasaran (`Instagram`, `TikTok`, `Referral`, `Website`).| Terikat dengan field `source` pada `customers`. |
| `budget` | `NUMERIC(15,2)`| Anggaran biaya yang dikeluarkan untuk kampanye. | Penghitungan ROI. |
| `reach` | `INTEGER` | Jumlah impresi atau jangkauan tayang iklan. | KPI Awareness. |
| `conversions` | `INTEGER` | Jumlah registrasi trial / transaksi baru yang dihasilkan. | KPI Konversi. |

---

## 3. Penjabaran Lengkap Konten Teks Landing Page (Kronologis V1 - V3)

Landing Page Lumier Cosmetics CRM berevolusi melalui 3 iterasi berdasarkan skala bisnis dan kompleksitas konversi yang ditargetkan.

### 3.1 PRD V1 – Basic Version (Fokus: Validasi Pasar & Tangkap Lead Awal)
*   **Tujuan Produk**: Menyebarkan informasi awal kehadiran platform dan menangkap minat pendaftaran trial pertama (Lead Acquisition).
*   **Navigasi**: Logo Lumier Cosmetics CRM, menu tautan minimalis (Home, Features, Pricing, Contact), dan tombol utama "Login".
*   **Hero Copywriting**:
    *   *Headline*: "Kelola Bisnis Kosmetik Lebih Mudah dengan Lumier Cosmetics CRM"
    *   *Subheadline*: "Satukan data identitas pelanggan, level membership, kode referral reseller, dan riwayat transaksi kecantikan dalam satu platform SaaS modern."
    *   *CTA*: Tombol utama "Mulai Gratis" dan tombol sekunder "Lihat Demo".
*   **Fitur Dasar**:
    1.  *Customer Identity Management*: Penyimpanan profil demografi pembeli kosmetik secara rapi.
    2.  *Contact & Geo-Tracking*: Pengarsipan nomor kontak dan peta geospasial pelanggan.
    3.  *Basic Membership Tiers*: Pengelompokan status member reseller/agen.
    4.  *Transaction History Logs*: Pencatatan data belanja secara terpusat.
*   **Metrik Sukses**: Jumlah pengunjung halaman (Visitor), persentase klik CTA utama (CTR), dan rasio pentalan (Bounce Rate).

### 3.2 PRD V2 – Intermediate Version (Fokus: Social Proof & Segmentasi Persona)
*   **Tujuan Bisnis**: Meningkatkan registrasi trial sebesar 35%, mengotomatisasi penjadwalan demo produk untuk distributor skala besar, dan meredam friksi dengan memaparkan solusi nyata atas kendala *user persona*.
*   **Peta Masalah & Solusi (Problem/Solution Block)**:
    *   *Pemilik Brand*: Data konsumen berserak di riban reseller $\rightarrow$ CRM menyatukannya dalam satu pusat data.
    *   *Marketing Manager*: Sulit memprediksi kapan stok skincare pelanggan akan habis $\rightarrow$ Restock Alert System otomatis menghitung siklus habis pakai.
    *   *Reseller/Influencer*: Salah perhitungan bonus komisi kode referral $\rightarrow$ Dashboard referral transparan yang mencatat komisi secara real-time.
*   **Metrik Live Counter (Social Proof)**: Menampilkan data riil dari database internal, berupa total active customer (800+), total produk kosmetik terjual, dan jumlah kode referral influencer yang aktif.
*   **8 Fitur CRM Utama**:
    1.  *Customer 360 View*: Profiling demografi, jenis kelamin, dan tanggal lahir pelanggan.
    2.  *Geo-Contact Filter*: Penyaringan kontak berbasis kota/provinsi untuk pengiriman logistik.
    3.  *Tiered Membership*: Pembagian reward otomatis level Bronze, Silver, dan Gold.
    4.  *Referral & Creator Engine*: Pelacakan komisi penjualan real-time berbasis kode afiliasi.
    5.  *Transaction Ledger*: Rekap CLV, item produk yang dibeli, dan metode pembayaran.
    6.  *Restock Alert System*: Pengingat otomatis belanja ulang berdasarkan tanggal transaksi terakhir.
    7.  *Review & Feedback Hub*: Pusat ulasan efikasi produk dan analisis sentimen kepuasan pelanggan.
    8.  *Performance Analytics*: Visualisasi grafik tren omset dan atribusi pemasaran.

### 3.3 PRD V3 – Complete Version (Fokus: Otomatisasi Omni-Channel & CRM Pipeline)
*   **Visi Produk**: Menjadi platform SaaS tata kelola hubungan pelanggan kosmetik terdepan di Asia Tenggara yang mendorong pertumbuhan bisnis kecantikan lewat kekuatan data analitik prediktif dan otomatisasi kampanye pemasaran omni-channel.
*   **Struktur Tambahan**:
    *   *CRM Live Workflow Pipeline*: Visualisasi alur bagaimana data pelanggan baru mengalir ke database, naik tier membership, memicu restock alert, hingga memicu kampanye promo otomatis.
    *   *Integrations Grid*: Panel visual integrasi dengan Supabase DB, WhatsApp Gateway Engine, Email Automation Server, Google Calendar Sales Scheduler, dan Payment Gateway (Midtrans/Xendit).
    *   *Reseller Case Study*: Bedah kasus nyata keberhasilan salah satu brand kosmetik meningkatkan repeat order hingga 150% menggunakan kode referral dan retensi tersistem.
    *   *AIDA Copywriting Matrix*: Pengkondisian psikologis pengunjung dari tahap Attention hingga Action.

---

## 4. Deskripsi Tekstual Komponen Arsitektur Visual

### 4.1 Sitemap Halaman (Information Architecture)
1.  **Header & Sticky Navbar**:
    *   Sisi Kiri: Logo "Lumier Cosmetics CRM" (Brand Identity).
    *   Sisi Tengah: Tautan jangkar internal (Home, Features, CRM Solutions, Pricing, FAQ, Contact).
    *   Sisi Kanan: Tombol "Member Login" & Tombol CTA "Coba Gratis".
2.  **Hero Block Area**:
    *   Left Column: Value Proposition utama, subheadline, tombol CTA ganda, dan sub-text jaminan keamanan data.
    *   Right Column: Mockup Live Dashboard (Visualisasi grafik Recharts, total transaksi bulanan, sirkulasi member).
3.  **Trust & Social Proof Bar**:
    *   Logo-logo brand kosmetik terkemuka yang memakai jasa platform.
    *   Live Counter: Angka real-time database (Active Customers, Products Sold, Creator Codes).
4.  **Problem & Solution Block**:
    *   Komparasi kolom "Kondisi Manual Tanpa CRM" vs "Kondisi Efisien Bersama Lumier CRM".
5.  **Interactive CRM Pipeline (Workflow Visual)**:
    *   Visualisasi tahapan berurutan: Registrasi $\rightarrow$ Pembelian $\rightarrow$ Poin Membership $\rightarrow$ Prediksi Siklus Produk $\rightarrow$ Blast WhatsApp Pengingat Restock.
6.  **4-Dimensional Feature Grid (Operational, Analytical, Collaborative, Strategic)**:
    *   Tab interaktif yang mengelompokkan ke-4 kategori CRM.
7.  **Dashboard Visual Engine (Interactive Preview)**:
    *   Komponen visual tempat calon pelanggan mencoba memfilter data tiruan (misal: melihat grafik pendapatan berubah berdasarkan kota atau metode pembayaran).
8.  **Integrations Showcase**:
    *   Kartu visual logo-logo platform eksternal dengan indikator status "Connected".
9.  **Reseller Case Study Breakdown**:
    *   Bagian mini-studi kasus dengan infografis pencapaian ROI.
10. **Testimonials Carousel**:
    *   Ulasan geser dengan foto, nama brand, dan kutipan hasil bisnis.
11. **FAQ Accordion System**:
    *   Daftar tanya-jawab klik-buka (10 FAQ modular).
12. **Conversion Block & Lead Newsletter Capture**:
    *   Formulir input nama, email, dan drop-down pilihan "Sumber Informasi" (Atribusi Pemasaran) untuk pendaftaran free trial.
13. **Footer**:
    *   Footprint Sitemap: Tautan produk, sumber daya, legalitas (TOS, Privacy Policy), informasi kontak CS, dan ikon media sosial.

### 4.2 User Conversion Flow Diagram
```
[Pengunjung Masuk Landing Page]
      │
      ├─► Membaca Value Prop & Melihat Live Database Counter (Attention)
      │
      ├─► Mengeksplorasi Tab Fitur 4-Dimensi & Studi Kasus (Interest)
      │
      ├─► Menguji Dashboard Preview & Membaca Testimoni (Desire)
      │
      └─► Mengambil Tindakan (Action)
            │
            ├──► Klik "Jadwalkan Demo" ──► Mengisi Form Google Calendar Scheduler
            │
            └──► Mengisi Form Trial ──────► Data Tersimpan di Supabase/LocalStorage ──► Masuk Dashboard CRM
```

### 4.3 CRM Workflow Pipeline Integration
1.  **Tahap Input (Operational CRM)**:
    *   Pelanggan e-commerce melakukan transaksi menggunakan kode referral `CREATOR-AMI201` $\rightarrow$ API CRM menangkap data identitas pelanggan dan nilai transaksi.
2.  **Tahap Analitik (Analytical CRM)**:
    *   Sistem mengalokasikan data ke kota asal pembeli, menghitung kontribusi omset terhadap kode referral tersebut, dan memperbarui grafik Recharts.
3.  **Tahap Kolaborasi (Collaborative CRM)**:
    *   Sistem mengirimkan notifikasi internal kepada admin gudang untuk packing dan email konfirmasi pengiriman barang otomatis kepada pelanggan.
4.  **Tahap Strategis (Strategic CRM)**:
    *   Sistem mencatat tanggal transaksi terakhir. Berdasarkan produk yang dibeli (misal: Serum Rose 30ml habis dalam 30 hari), sistem menyetel alarm *restock alert* pada hari ke-25 untuk memicu WhatsApp Blast pengingat beli kembali dengan kupon diskon 10%.

---

## 5. Panduan Teknis Arsitektur Kode Frontend

Frontend Landing Page dibangun menggunakan ekosistem **React 19**, **Vite**, **Tailwind CSS v4**, dan **Recharts** untuk visualisasi analitik yang dinamis.

### 5.1 Struktur Komponen Landing Page (`LumiereShowcase.jsx`)
Kode dipecah ke dalam fungsi-fungsi internal atau komponen pembantu guna memastikan performa tinggi dan rendering modular:
1.  **State Management**:
    *   `customers`: Menyimpan array database pelanggan lengkap untuk penghitungan agregasi statistik.
    *   `selectedCity`: Untuk interaksi filter pada visualisasi Dashboard.
    *   `newsletterForm`: Menyimpan state `name`, `email`, dan `source` (atribusi pemasaran).
    *   `demoForm`: Menyimpan nama instansi, nomor telepon, dan tanggal jadwal demo.
2.  **Statistik Agregat (useMemo)**:
    *   *Total Active Customers*: Menghitung jumlah record berstatus `Active`.
    *   *Total Products Sold*: Menjumlahkan kuantitas dari database order.
    *   *Total Revenue*: Menjumlahkan nilai transaksi kumulatif seluruh pelanggan.
    *   *Membership Tier Distribution*: Memetakan jumlah member Gold, Silver, dan Bronze untuk diumpankan ke Donut Chart.
    *   *Marketing Source Distribution*: Mengagregasi atribusi pendaftaran untuk Bar Chart.

### 5.2 Implementasi Recharts Engine
Visualisasi analitik diintegrasikan secara elegan menggunakan komponen responsif dari Recharts:
*   **Area Chart (Tren Pendapatan Bulanan)**:
    *   Menggunakan data transaksi teragregasi berdasarkan bulan pendaftaran pelanggan (`joinDate`).
    *   Pewarnaan menggunakan gradien linear warna primer magenta (`#c026d3`) ke pink (`#9d174d`) dengan opasitas rendah.
*   **Pie/Donut Chart (Distribusi Level Membership)**:
    *   Visualisasi pembagian tier member (`Gold`, `Silver`, `Bronze`).
    *   Menggunakan properti `innerRadius` untuk membentuk efek cincin (donut).
    *   Palet warna: Emas (`#fbbf24`), Perak (`#94a3b8`), dan Perunggu/Rose Muda (`#fda4af`).
*   **Bar Chart (Atribusi Saluran Pemasaran)**:
    *   Menampilkan jumlah konversi per saluran: TikTok, Instagram, Referral, dan Website.
    *   Bar vertikal dengan sudut membulat (*radius*) untuk menjaga estetika modern SaaS.

---

## 6. Landing Page Copywriting Matrix (AIDA Framework)

Penyusunan teks landing page didesain secara strategis untuk menuntun psikologis calon pembeli (pemilik brand kecantikan) hingga bersedia mendaftar.

| Tahap AIDA | Komponen Landing Page | Sasaran Psikologis | Copywriting Tekstual (Bahasa Indonesia) |
| :--- | :--- | :--- | :--- |
| **Attention** | Hero Section Headline & Subheadline | Menangkap perhatian dalam 3 detik pertama dengan menyorot solusi rasa sakit utama. | **Headline**: "CRM Modern untuk Bisnis Kosmetik Masa Kini"<br>**Subheadline**: "Tingkatkan repeat order produk kecantikan Anda hingga 150% dengan otomatisasi pengingat restock, manajemen reseller, dan analitik database terpusat." |
| **Interest** | Problem & Solution Block, Live Counter | Membuat audiens sadar akan kebocoran omset akibat sistem pencatatan manual. | "Apakah data pembeli Anda terserak di ratusan reseller? Berhentilah kehilangan pelanggan setia. Pantau aktivitas geospasial pembeli, hitung bonus komisi afiliasi secara otomatis, dan ketahui persis kapan stok skincare mereka habis pakai." |
| **Desire** | Tab Fitur 4-Dimensi, Live Dashboard Preview | Membangun hassat dengan memperlihatkan kemudahan operasional jika menggunakan platform. | "Kendali penuh atas pertumbuhan brand Anda ada di ujung jari. Lihat bagaiman sistem mengelompokkan level membership (Bronze, Silver, Gold) secara otomatis dan memicu pengingat belanja otomatis lewat WhatsApp Gateway." |
| **Action** | Free Trial Form & Google Calendar Scheduler | Menghilangkan friksi pendaftaran dan mendorong konversi langsung. | "Mulai uji coba gratis 14 hari sekarang. Tanpa kartu kredit. Masukkan nama dan email Anda untuk langsung menguji dashboard real-time kami." |

---

## 7. FAQ Accordion System (10 Tanya-Jawab Modular)

Berikut adalah konten utuh dari 10 pertanyaan modular seputar sistem CRM kosmetik yang diimplementasikan pada komponen FAQ Accordion.

#### Q1: Apakah Lumier Cosmetics CRM dapat dihubungkan dengan toko online saya di Shopify atau WooCommerce?
> **A1**: Ya, benar. Lumier Cosmetics CRM menyediakan integrasi API terbuka yang memungkinkan sinkronisasi data transaksi otomatis dari Shopify, WooCommerce, Tokopedia, dan Shopee secara real-time ke database pusat CRM Anda.

#### Q2: Bagaimana cara kerja WhatsApp Gateway dalam memicu pengingat restock skincare pelanggan?
> **A2**: Sistem secara otomatis memantau tanggal transaksi terakhir dan jenis produk yang dibeli pelanggan. Jika pelanggan membeli serum berukuran 30ml yang diperkirakan habis dalam 30 hari, sistem akan mengirimkan pengingat restock personal melalui WhatsApp secara otomatis pada hari ke-25.

#### Q3: Apakah saya bisa membatasi hak akses data pelanggan untuk tim CS (Customer Service) dan agen penjualan?
> **A3**: Bisa. Lumier Cosmetics CRM dilengkapi dengan fitur *Role-Based Access Control* (RBAC). Anda dapat membatasi akses sehingga agen hanya melihat data rujukan mereka sendiri, sedangkan tim CS hanya memiliki izin membaca data keluhan pelanggan tanpa dapat mengekspor seluruh database.

#### Q4: Bagaimana cara sistem menghitung bonus komisi untuk influencer yang membagikan Kode Referral?
> **A4**: Setiap kali pelanggan baru melakukan transaksi dan memasukkan Kode Referral/Creator Code khusus di halaman checkout, sistem akan merekam transaksi tersebut dan mengalokasikan persentase komisi secara real-time ke akun influencer terkait berdasarkan skema komisi yang Anda tentukan di dashboard admin.

#### Q5: Apakah data pelanggan kami dijamin keamanannya dan tidak akan bocor?
> **A5**: Keamanan data adalah prioritas utama kami. Seluruh database pelanggan disimpan di server cloud terenkripsi (Supabase/AWS) dengan protokol SSL/TLS untuk pengiriman data dan enkripsi AES-256 pada tingkat penyimpanan data. Kami juga melakukan backup database harian secara otomatis.

#### Q6: Bagaimana tingkat diskon bertingkat diterapkan pada level keanggotaan Bronze, Silver, dan Gold?
> **A6**: Diskon bertingkat dihitung otomatis berdasarkan akumulasi nilai transaksi pelanggan (CLV). Level Bronze mendapatkan diskon dasar 5%, Silver mendapatkan diskon 10% beserta kupon ulang tahun, dan level Gold mendapatkan diskon 15%, prioritas pengiriman, serta akses gratis ke produk sampel baru.

#### Q7: Apakah ada batasan jumlah data pelanggan yang dapat disimpan di dalam sistem?
> **A7**: Paket *Free Trial* kami mendukung penyimpanan hingga 1.000 data pelanggan. Untuk paket *Enterprise*, database kami menggunakan kapasitas penyimpanan dinamis yang mampu menampung jutaan baris data pelanggan, riwayat pembelian, dan catatan kampanye tanpa penurunan performa sistem.

#### Q8: Apakah kami bisa mengustomisasi kuesioner pada Review & Feedback Hub?
> **A8**: Sangat bisa. Anda dapat menambahkan pertanyaan spesifik, seperti jenis kulit pelanggan (kering, berminyak, sensitif) atau tingkat efikasi produk (misal: meredakan kemerahan dalam 3 hari) untuk mengumpulkan sentimen ulasan yang lebih presisi dan bernilai tinggi bagi tim R&D produk Anda.

#### Q9: Apakah sistem ini mendukung pelacakan wilayah sebaran pembeli secara geografis?
> **A9**: Ya. Modul *Geo-Contact Filter* kami memetakan alamat pembeli berdasarkan Kota dan Provinsi. Anda dapat melihat peta visual wilayah sebaran penjualan terbesar guna memprioritaskan alokasi stok produk di gudang cabang terdekat.

#### Q10: Bagaimana cara memulai uji coba gratis Lumier Cosmetics CRM?
> **A10**: Anda cukup mengisi formulir pendaftaran newsletter/trial di bagian bawah landing page ini. Akun demo instan akan langsung dibuatkan dan Anda dapat mengeksplorasi seluruh fitur dasar CRM kami selama 14 hari tanpa dipungut biaya apapun.

---

## 8. Definisi Formula Kalkulasi Matriks Keberhasilan (KPI Dashboard)

Matriks performa di bawah ini diformulasikan secara matematis untuk memonitor kesehatan bisnis dan konversi kampanye pada Dashboard CRM.

### 8.1 Matriks Akuisisi & Kampanye
*   **Click-Through Rate (CTR) Iklan**: Rasio jumlah klik pada tautan referral/iklan dibandingkan dengan total impresi penayangan iklan.
    $$\text{CTR} = \left( \frac{\text{Total Klik Tautan}}{\text{Total Impresi Kampanye}} \right) \times 100\%$$

*   **Trial Registration Rate (Conversion Rate Halaman)**: Persentase pengunjung landing page yang sukses mendaftar akun trial gratis.
    $$\text{Conversion Rate} = \left( \frac{\text{Jumlah User Trial Terdaftar}}{\text{Total Pengunjung Unik (Unique Visitors)}} \right) \times 100\%$$

### 8.2 Matriks Retensi & Nilai Pelanggan
*   **Customer Retention Rate (CRR)**: Persentase pelanggan aktif yang tetap bertransaksi di akhir periode waktu tertentu dibandingkan dengan awal periode.
    $$\text{CRR} = \left( \frac{E - N}{S} \right) \times 100\%$$
    *Di mana:*
    *   $E = \text{Jumlah pelanggan pada akhir periode}$
    *   $N = \text{Jumlah pelanggan baru yang didapatkan selama periode tersebut}$
    *   $S = \text{Jumlah pelanggan pada awal periode}$

*   **Customer Lifetime Value (CLV)**: Estimasi total pendapatan rata-rata yang dihasilkan oleh satu pelanggan selama masa keaktifan mereka belanja di brand Anda.
    $$\text{CLV} = \text{Rata-rata Nilai Belanja Per Transaksi} \times \text{Frekuensi Rata-rata Pembelian Per Tahun} \times \text{Rata-rata Umur Hubungan Pelanggan (Tahun)}$$

### 8.3 Matriks Keuangan & Pertumbuhan SaaS
*   **Monthly Recurring Revenue (MRR)**: Total pendapatan berulang yang didapatkan dari paket langganan aktif pelanggan CRM setiap bulannya.
    $$\text{MRR} = \sum \left( \text{Jumlah Pengguna Paket Langganan} \times \text{Tarif Langganan Bulanan Paket} \right)$$

*   **Customer Acquisition Cost (CAC)**: Biaya yang dikeluarkan untuk mendapatkan satu pelanggan baru, mencakup anggaran iklan dan operasional sales.
    $$\text{CAC} = \frac{\text{Total Biaya Pemasaran \& Operasional Penjualan}}{\text{Jumlah Pelanggan Baru yang Berhasil Didapatkan}}$$
