# PRD V3: VERSI LENGKAP (COMPLETE VERSION)
## Proyek: Lumier Cosmetics CRM - Landing Page

---

## 1. Visi Produk & Journey
*   **Visi Produk**: Menjadi platform SaaS tata kelola hubungan pelanggan kosmetik terdepan di Asia Tenggara yang mendorong pertumbuhan bisnis kecantikan lewat kekuatan data analitik prediktif dan otomatisasi kampanye pemasaran omni-channel.
*   **Perjalanan Pengguna (User Journey)**:
    Pengunjung Landing Page $\rightarrow$ Eksplorasi Fitur $\rightarrow$ Uji Coba Kalkulator & Simulator $\rightarrow$ Pengisian Form Trial $\rightarrow$ Data tersinkronisasi ke database lokal $\rightarrow$ Peningkatan Live Counter $\rightarrow$ Pengguna Aktif.

---

## 2. Fitur Interaktif Baru & Otomatisasi (PRD V3 Utama)

### 2.1 Kalkulator ROI & Slider Harga
*   Slider interaktif (100 s.d. 10.000 kustomer/reseller).
*   Menampilkan biaya langganan bulanan SaaS secara transparan.
*   Menghitung estimasi jam kerja admin gudang/sales yang dihemat.
*   Memproyeksikan potensi peningkatan omset dari repeat order restock alert.

### 2.2 Simulator WhatsApp Gateway Real-time
*   Mockup frame smartphone interaktif yang menyimulasikan notifikasi WhatsApp masuk.
*   Dropdown template pesan (Restock alert, Birthday coupon, Welcome bonus, Komisi reseller).
*   Textarea kustomisasi teks pesan yang mendukung tag dinamis `{Name}` dan `{Referral}`.
*   Logika pengiriman simulasi real-time yang langsung merubah UI mockup smartphone.

### 2.3 Browser Skema Database Kustom
*   Tampilan penjelajah tab (Identitas, Kontak, Membership, Transaksi).
*   Menyajikan skema database internal secara visual mencakup nama kolom, tipe data, dan tujuannya bagi CRM.

### 2.4 Sentimen Analitik Review Simulator
*   Pilihan review kustomer tiruan (Positif, Netral, Negatif).
*   Menghitung persentase skor sentimen.
*   Memperlihatkan pemicu workflow otomatis (misal: otomatis membuat Tiket CS Prioritas Utama untuk ulasan bintang 1).

### 2.5 Form Trial Aktif (Data-bound)
*   Formulir pendaftaran free trial 14 hari yang terintegrasi.
*   Setiap kali pendaftaran berhasil, data baru masuk ke array kustomer LocalStorage, memicu pembaruan Live Counter di halaman utama secara real-time.

---

## 3. Matriks KPI Dashboard & Formula
*   **Click-Through Rate (CTR)**: $\text{CTR} = \left( \frac{\text{Klik Tautan}}{\text{Impresi Kampanye}} \right) \times 100\%$
*   **Conversion Rate**: $\text{Conversion Rate} = \left( \frac{\text{User Trial Terdaftar}}{\text{Unique Visitors}} \right) \times 100\%$
*   **Customer Retention Rate (CRR)**: $\text{CRR} = \left( \frac{E - N}{S} \right) \times 100\%$
*   **Customer Lifetime Value (CLV)**: $\text{CLV} = \text{Rata-rata Belanja} \times \text{Frekuensi Belanja Per Tahun} \times \text{Umur Hubungan (Tahun)}$
*   **Monthly Recurring Revenue (MRR)**: $\text{MRR} = \sum \left( \text{Jumlah User Langganan} \times \text{Tarif Bulanan Paket} \right)$
*   **Customer Acquisition Cost (CAC)**: $\text{CAC} = \frac{\text{Total Biaya Pemasaran \& Sales}}{\text{Jumlah Pelanggan Baru Terakuisisi}}$
