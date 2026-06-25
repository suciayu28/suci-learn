# DOKUMEN PRD KRONOLOGIS V1, V2, & V3
## PROYEK: LUMIER COSMETICS CRM (LANDING PAGE)
**Versi**: 1.0 (Final Redesign)  
**Tema Warna**: Olive Green (`#4F5C18`) & Charcoal (`#262626`)  
**Penyusun**: Antigravity AI Coding Assistant  

---

## 1. Pendahuluan & Konteks Sistem
Landing Page **Lumier Cosmetics CRM** dikembangkan secara kronologis melalui tiga iterasi (V1, V2, dan V3). Seluruh fitur didesain menggunakan gaya **SaaS Kecantikan Modern & Mewah**, menggunakan palet warna proyek asli Anda (Olive Green & Charcoal), dan terikat langsung (*data-bound*) dengan database tiruan lokal yang bersumber dari [crmData.js](file:///C:/suci-learn/suci-learn/src/lib/crmData.js) (LocalStorage).

---

## 2. PRD V1: Fondasi Landing Page & Database Dasar

### 2.1 Tujuan & Ruang Lingkup V1
Membangun keberadaan digital awal untuk Lumier Cosmetics CRM guna memicu minat awal calon distributor/reseller (Lead Acquisition).

### 2.2 Komponen UI yang Diimplementasikan
*   **Sticky Navbar (Header)**: Logo "Lumier Cosmetics CRM", link jangkar minimalis (Home, Features, Pricing, Contact), dan tombol "Login" / "Member Area".
*   **Hero Area Utama**:
    *   *Headline*: "Kuasai Loyalitas Kustomer Kosmetik Anda" (Bahasa Indonesia sesuai tema kecantikan).
    *   *Subheadline*: "Satu-satunya CRM kecantikan yang mengaitkan transaksi ritel, diskon reseller bertingkat, dan peringatan restock WhatsApp otomatis dalam satu database."
    *   *CTA*: Tombol "Mulai Gratis" (mengarahkan ke Form Trial di bawah) dan tombol "Jadwalkan Demo".
*   **Footer**: Sitemap dasar untuk legalitas, bantuan, dan media sosial.

### 2.3 Hubungan Implementasi Kode
*   Seluruh struktur ini diletakkan pada berkas [LumiereShowcase.jsx](file:///C:/suci-learn/suci-learn/src/pages/LumiereShowcase.jsx) dan dihubungkan ke rute utama `/` di [App.jsx](file:///C:/suci-learn/suci-learn/src/App.jsx).

---

## 3. PRD V2: Peningkatan Interaktivitas & Social Proof

### 3.1 Tujuan & Ruang Lingkup V2
Membangun kepercayaan sosial (*social proof*) dan meredam kekhawatiran kustomer dengan menyajikan solusi nyata atas masalah industri kecantikan (Excel manual, hilangnya kontak kustomer, dan salah hitung komisi).

### 3.2 Komponen UI yang Diimplementasikan
*   **Live Database Counter (Social Proof)**:
    *   *Tampilan*: 4 indikator data (Kustomer Aktif, Kosmetik Terjual, Kode Referral Aktif, Omset Terkumpul).
    *   *Logika*: Angka dihitung secara dinamis dari database localstorage `crm_customers` menggunakan `useMemo` React (Baris 63 s.d. 75).
*   **Problem & Pain Points Block**:
    *   *Tampilan*: Kartu perbandingan kegagalan sistem manual (Data Kustomer Buta, Skincare Habis Tanpa Alarm, Sengketa Komisi).
*   **4-Dimensional Feature Grid**:
    *   *Tampilan*: Tab menu interaktif untuk menampilkan 8 kemampuan CRM utama.
    *   *Logika*: Menggunakan state `activeTab` (operational, analytical, collaborative, strategic) untuk beralih konten tanpa reload halaman.
*   **Testimonial Slider**:
    *   *Tampilan*: Panel ulasan geser dari pemilik brand kecantikan.
    *   *Logika*: Menggunakan state `testimonialIndex` dan tombol navigasi kiri-kanan.
*   **FAQ Accordion (10 Modular Q&A)**:
    *   *Tampilan*: Daftar pertanyaan umum yang dapat diklik untuk membaca jawaban.
    *   *Logika*: State `activeFaq` mengontrol visibilitas tinggi elemen accordion secara mulus.

---

## 4. PRD V3: Komponen Interaktif Premium & Analitik Tingkat Lanjut

### 4.1 Tujuan & Ruang Lingkup V3
Membuat landing page terasa interaktif, fungsional, dan membuktikan efektivitas CRM melalui simulasi visual canggih.

### 4.2 Komponen UI Premium yang Diimplementasikan
1.  **Kalkulator ROI Slider**:
    *   *Fungsi*: Membiarkan pengunjung menggeser jumlah reseller/kustomer aktif mereka (100 s.d. 10.000).
    *   *Logika*: Mengubah state `resellerCount` dan secara otomatis menghitung biaya langganan, jam kerja admin yang dihemat, serta potensi omset baru (Baris 64 s.d. 75).
2.  **Simulator WhatsApp Gateway Real-time**:
    *   *Fungsi*: Mockup smartphone WhatsApp untuk menguji pengiriman blast notifikasi CRM.
    *   *Logika*: Menangkap template pesan kustom, memproses tag dinamis seperti `{Name}` dan `{Referral}`, serta memicu notifikasi visual chat masuk di mockup HP saat tombol diklik (Baris 102 s.d. 128).
3.  **Browser Skema Database Kustom**:
    *   *Fungsi*: Menampilkan tabel relasional custom fields CRM (Identitas, Kontak, Akun, Transaksi).
    *   *Logika*: Memanfaatkan state `activeSchemaTab` untuk memfilter data tabel visual (Baris 649 s.d. 703).
4.  **Sentimen Analitik Review Simulator**:
    *   *Fungsi*: Mensimulasikan deteksi skor positif/negatif ulasan kecantikan.
    *   *Logika*: Pengguna mengeklik ulasan, dan sistem secara dinamis memperbarui bar tingkat sentimen serta menjelaskan aksi workflow CRM yang terpicu (Baris 864 s.d. 949).
5.  **Formulir Pendaftaran Trial Aktif (Data-bound)**:
    *   *Fungsi*: Menangkap input pendaftar free trial (Nama, Email, Sumber Informasi).
    *   *Logika*: Menyimpan pendaftar langsung ke database lokal (`localStorage.setItem`). Hal ini memicu pembaruan angka Live Database Counter di atas secara instan untuk membuktikan integrasi data-bound (Baris 130 s.d. 169).
6.  **Dashboard Visual Engine (Recharts)**:
    *   *Area Chart*: Tren pendapatan bulanan brand zaitun zesty.
    *   *Donut Chart*: Presentasi sirkulasi tingkat keanggotaan (Gold, Silver, Bronze).
    *   *Bar Chart*: Atribusi saluran pendaftaran user (Instagram, TikTok, Referral, Web).
