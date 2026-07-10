import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  FiStar, FiTag, FiX, FiArrowRight, FiUser, FiPhone, FiMail,
  FiActivity, FiTrendingUp, FiUsers, FiSettings, FiCheck,
  FiChevronDown, FiAlertCircle, FiDatabase, FiLayers,
  FiMessageSquare, FiCalendar, FiShield, FiGlobe, FiChevronLeft, FiChevronRight,
  FiClock, FiDollarSign, FiSmartphone, FiMessageCircle, FiBookOpen, FiShare2,
  FiGift, FiPercent, FiShoppingBag, FiCheckCircle, FiCopy, FiMapPin,
  FiShoppingCart, FiPlus, FiMinus, FiLoader
} from "react-icons/fi";

// Fallback gambar per kategori
const CATEGORY_IMGS = {
  "Tata Rias":       "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
  "Perawatan Kulit": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
  "Parfum":          "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
  "Alat Kecantikan": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
};
const getFallbackImg = (tag) => CATEGORY_IMGS[tag] || CATEGORY_IMGS["Tata Rias"];
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { getCRMData } from "../lib/crmData";

const LumiereShowcase = () => {
  const navigate = useNavigate();
  
  // --- STATE CART & CHECKOUT ---
  const [showcaseCart, setShowcaseCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showcaseProducts, setShowcaseProducts] = useState([]); // dari Supabase

  // --- STATE DATA UNTUK DISPLAY ---
  const [crmDb, setCrmDb] = useState({ customers: [], orders: [], reviews: [], campaigns: [] });
  const [alertMsg, setAlertMsg] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState("operational"); // operational, analytical, collaborative, strategic
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: "", email: "", phone: "", company: "", date: "" });
  const [newsletterForm, setNewsletterForm] = useState({ name: "", email: "", source: "Website" });

  // --- 1. STATE UNTUK KOMPONEN INTERAKTIF BARU ---
  // Slider ROI
  const [resellerCount, setResellerCount] = useState(500);
  // Simulator WA Gateway
  const [simulatedTemplate, setSimulatedTemplate] = useState("restock");
  const [customMsg, setCustomMsg] = useState("");
  const [phoneMessages, setPhoneMessages] = useState([]);
  const [isBlasting, setIsBlasting] = useState(false);
  // Browser Skema Database
  const [activeSchemaTab, setActiveSchemaTab] = useState("identity");
  // Review Sentiment Analyzer
  const [selectedReviewId, setSelectedReviewId] = useState(1);

  // --- REFS SEKSI UNTUK NAVIGASI ---
  const homeRef = useRef(null);
  const catalogPromoRef = useRef(null);
  const problemRef = useRef(null);
  const calculatorRef = useRef(null);
  const simulatorRef = useRef(null);
  const schemaRef = useRef(null);
  const featuresRef = useRef(null);
  const sentimentRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const contactRef = useRef(null);

  // --- STATE PROMO & KATALOG ---
  const [promoTimeLeft, setPromoTimeLeft] = useState({ hours: 14, minutes: 45, seconds: 20 });
  const [copiedCoupon, setCopiedCoupon] = useState("");
  const [selectedPromoCategory, setSelectedPromoCategory] = useState("Semua");

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- AMBIL DATA DARI CRM DATA ASLI ---
  useEffect(() => {
    const db = getCRMData();
    setCrmDb(db);
  }, []);

  // --- FETCH PRODUK & PROMO DARI SUPABASE ---
  useEffect(() => {
    const fetchShowcaseData = async () => {
      setLoadingProducts(true);
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );
        const [{ data: catalogData }, { data: promoData }] = await Promise.all([
          sb.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }),
          sb.from('promo_items').select('*').eq('is_active', true).order('created_at', { ascending: false })
        ]);

        let all = [];
        if (catalogData && catalogData.length > 0) {
          all = [...all, ...catalogData.map(p => ({
            id: p.id, title: p.title, tag: p.tag || 'Tata Rias',
            img: p.img_url || getFallbackImg(p.tag),
            img_url: p.img_url,
            price: typeof p.price === 'number' ? p.price : 0,
            isPromo: false, source: 'catalog'
          }))];
        }
        if (promoData && promoData.length > 0) {
          all = [...all, ...promoData.map(p => ({
            id: p.id, title: p.title, tag: 'Tata Rias',
            img: p.img_url || getFallbackImg('Tata Rias'),
            img_url: p.img_url,
            price: typeof p.original_price === 'number' ? p.original_price : 0,
            promoPrice: typeof p.discount_price === 'number' ? p.discount_price : 0,
            discountPercent: p.discount_percent || 0,
            isPromo: true, source: 'promo'
          }))];
        }
        setShowcaseProducts(all.length > 0 ? all : crmDb.products || []);
      } catch (e) {
        console.warn('Fallback to crmDb products:', e);
        setShowcaseProducts(crmDb.products || []);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchShowcaseData();
  }, []);

  // --- CART HELPERS ---
  const addToCart = (product) => {
    setShowcaseCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setShowcaseCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const removeFromCart = (id) => setShowcaseCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = useMemo(() => {
    return showcaseCart.reduce((sum, i) => {
      const price = i.isPromo && i.promoPrice ? i.promoPrice : i.price;
      return sum + price * i.qty;
    }, 0);
  }, [showcaseCart]);

  const cartCount = showcaseCart.reduce((s, i) => s + i.qty, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutSuccess(true);
    setShowcaseCart([]);
    setTimeout(() => setIsCheckoutSuccess(false), 3000);
  };

  // --- COUNTDOWN TIMER FLASH SALE ---
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(""), 2000);
  };

  // --- CALCULATOR ROI CALCULATIONS ---
  const subscriptionCost = useMemo(() => {
    return 499000 + (resellerCount * 1250);
  }, [resellerCount]);

  const adminHoursSaved = useMemo(() => {
    return Math.round(resellerCount * 0.35);
  }, [resellerCount]);

  const estimatedRevenueIncrease = useMemo(() => {
    return resellerCount * 380000;
  }, [resellerCount]);

  // --- SIMULATOR TEMPLATE OPTIONS ---
  const templates = {
    restock: {
      title: "Pemberitahuan Restock Skincare",
      defaultText: "Halo {Name}, serum Rose favoritmu dibeli 25 hari lalu dan diperkirakan segera habis. Klaim kupon diskon 15% ini: RESTOCK15 untuk beli kembali hari ini! Link: lumier.co/r15"
    },
    birthday: {
      title: "Kupon Selamat Ulang Tahun",
      defaultText: "Selamat Ulang Tahun {Name}! 🎂 Rayakan hari istimewamu dengan diskon eksklusif 25% untuk semua kosmetik Lumiere. Masukkan kode: BEAUTYDAY. Khusus hari ini!"
    },
    welcome: {
      title: "Poin Pendaftaran Member Baru",
      defaultText: "Selamat bergabung di Lumier Member, {Name}! Akun Bronze Anda telah aktif. Dapatkan gratis 100 poin loyalitas pertama yang bisa ditukar di pembelian berikutnya."
    },
    commission: {
      title: "Klaim Komisi Reseller",
      defaultText: "Hai Sis {Name}, total komisi dari kode referral Anda CREATOR-{Referral} minggu ini sebesar Rp 1.450.000 telah sukses ditransfer ke rekening Anda. Sukses terus!"
    }
  };

  // Update default message when template selection changes
  useEffect(() => {
    setCustomMsg(templates[simulatedTemplate].defaultText);
  }, [simulatedTemplate]);

  const handleSimulateBlast = () => {
    setIsBlasting(true);
    setPhoneMessages([]);
    
    // Ambil contoh nama kustomer acak dari database
    const randomCust = crmDb.customers[Math.floor(Math.random() * crmDb.customers.length)] || { name: "Syafira Bella", referralCode: "SYA421" };
    
    let processedText = customMsg
      .replace(/{Name}/g, randomCust.name)
      .replace(/{Referral}/g, randomCust.referralCode.replace("CREATOR-", ""));

    setTimeout(() => {
      // Menambahkan notifikasi getaran / sound simulated
      setPhoneMessages([
        {
          id: 1,
          sender: "Lumier WhatsApp CRM Gateway",
          text: processedText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "sent"
        }
      ]);
      setIsBlasting(false);
      setAlertMsg("Simulasi WhatsApp Blast Berhasil Terkirim ke Mockup!");
      setTimeout(() => setAlertMsg(""), 3500);
    }, 1200);
  };

  // --- DATABASE SCHEMA TABS ---
  const schemaData = {
    identity: {
      title: "Data Identitas Pelanggan",
      description: "Menyimpan profil utama untuk personalisasi interaksi kecantikan.",
      fields: [
        { name: "Customer ID", type: "UUID (Primary Key)", purpose: "Kunci unik relasi ke seluruh tabel riwayat." },
        { name: "Nama Lengkap", type: "VARCHAR(150)", purpose: "Personalisasi nama di WhatsApp gateway & email." },
        { name: "Jenis Kelamin", type: "VARCHAR(10)", purpose: "Menentukan rekomendasi produk (pria vs wanita)." },
        { name: "Tanggal Lahir", type: "DATE", purpose: "Pemicu promo diskon khusus hari ulang tahun." }
      ]
    },
    contact: {
      title: "Kontak & Geografis",
      description: "Menyimpan detail saluran komunikasi dan peta pengiriman logistik.",
      fields: [
        { name: "Nomor HP", type: "VARCHAR(20)", purpose: "Target pengiriman WhatsApp blast restock alert." },
        { name: "Email", type: "VARCHAR(100)", purpose: "Saluran pengiriman invoice, newsletter, & katalog." },
        { name: "Kota / Provinsi", type: "VARCHAR(100)", purpose: "Pemetaan area penjualan terlaris & rute pengiriman." }
      ]
    },
    membership: {
      title: "Akun & Keagenan",
      description: "Pusat tata kelola loyalty tier dan pelacakan komisi afiliasi.",
      fields: [
        { name: "Level Membership", type: "VARCHAR(15)", purpose: "Bronze, Silver, Gold - Menentukan potongan diskon bertingkat." },
        { name: "Creator Code", type: "VARCHAR(50)", purpose: "Atribusi transaksi ke influencer / reseller perujuk." },
        { name: "Status Aktif", type: "BOOLEAN", purpose: "Mengontrol keaktifan member dalam program loyalti." }
      ]
    },
    transaction: {
      title: "Transaksi & CLV",
      description: "Informasi performa finansial per kustomer.",
      fields: [
        { name: "Total Transaksi", type: "NUMERIC(15,2)", purpose: "Customer Lifetime Value (CLV) untuk leveling keanggotaan." },
        { name: "Kuantitas Item", type: "INTEGER", purpose: "Menghitung total produk kosmetik yang dibeli." },
        { name: "Tanggal Terakhir", type: "DATE", purpose: "Data dasar perhitungan sisa stok skincare kustomer." }
      ]
    }
  };

  // --- REVIEW SENTIMENT ANALYZER SIMULATOR ---
  const sentimentReviews = [
    {
      id: 1,
      name: "Bella Wijaya",
      avatar: "B",
      rating: 5,
      comment: "Serum Rose ini beneran magis! Kulit beruntusan dan kemerahan saya langsung calming dalam 4 hari pakai. Teksturnya ringan banget.",
      score: { positive: 96, neutral: 4, negative: 0 },
      action: "Pemicu Loyalitas: Otomatis mengirimkan Voucher Terima Kasih bintang 5 & menambahkan 150 Poin Reward."
    },
    {
      id: 2,
      name: "Dewi Kartika",
      avatar: "D",
      rating: 3,
      comment: "Warna cushion-nya bagus dan cocok di tone kulit aku, tapi sayangnya pengiriman logistiknya lambat banget hampir seminggu.",
      score: { positive: 45, neutral: 35, negative: 20 },
      action: "Pemicu Kolaborasi: Otomatis mendistribusikan laporan delay kurir ke tim logistik & kirim pesan maaf WhatsApp."
    },
    {
      id: 3,
      name: "Clara Tan",
      avatar: "C",
      rating: 1,
      comment: "Lipcream-nya bikin bibir saya pecah-pecah parah dan gatal. Kayaknya ga cocok banget untuk bibir sensitif.",
      score: { positive: 2, neutral: 10, negative: 88 },
      action: "Pemicu CS Utama: Mengeluarkan notifikasi alarm merah ke manager & otomatis membuat Tiket CS Prioritas Maksimal."
    }
  ];

  const currentSentimentReview = useMemo(() => {
    return sentimentReviews.find(r => r.id === selectedReviewId);
  }, [selectedReviewId]);

  // --- FILTER & AGREGASI DATA UNTUK GRAFIK & LIVE COUNTER ---
  const activeCustomersCount = useMemo(() => {
    return crmDb.customers.filter(c => c.status === "Active").length;
  }, [crmDb]);

  const totalProductsSold = useMemo(() => {
    return crmDb.customers.reduce((sum, c) => sum + (c.itemsCount || 0), 0);
  }, [crmDb]);

  const activeReferralCodes = useMemo(() => {
    const codes = crmDb.customers.map(c => c.referralCode).filter(Boolean);
    return new Set(codes).size;
  }, [crmDb]);

  const totalRevenue = useMemo(() => {
    return crmDb.customers.reduce((sum, c) => sum + (c.totalTransactions || 0), 0);
  }, [crmDb]);

  // 4. Riwayat Transaksi Terkini
  const recentTransactions = useMemo(() => {
    return crmDb.customers.slice(0, 5);
  }, [crmDb]);

  // 1. Area Chart (Tren Pendapatan Bulanan dalam Juta Rupiah)
  const monthlyRevenueData = useMemo(() => {
    const months = {
      "01": { name: "Jan", revenue: 0 },
      "02": { name: "Feb", revenue: 0 },
      "03": { name: "Mar", revenue: 0 },
      "04": { name: "Apr", revenue: 0 },
      "05": { name: "May", revenue: 0 }
    };
    crmDb.customers.forEach(c => {
      if (c.joinDate) {
        const parts = c.joinDate.split("/");
        const m = parts[1];
        if (months[m]) {
          months[m].revenue += (c.totalTransactions || 0);
        }
      }
    });
    return Object.values(months).map(item => ({
      name: item.name,
      Revenue: Math.round(item.revenue / 1000000) // Konversi ke juta
    }));
  }, [crmDb]);

  // 2. Pie Chart (Distribusi Level Membership)
  const membershipDistribution = useMemo(() => {
    const counts = { Gold: 0, Silver: 0, Bronze: 0 };
    crmDb.customers.forEach(c => {
      if (counts[c.loyalty] !== undefined) counts[c.loyalty]++;
    });
    return [
      { name: "Gold", value: counts.Gold, color: "#4F5C18" }, // Olive Green
      { name: "Silver", value: counts.Silver, color: "#a3b18a" }, // Sage Green
      { name: "Bronze", value: counts.Bronze, color: "#dad7cd" } // Warm Beige
    ];
  }, [crmDb]);

  // 3. Bar Chart (Atribusi Sumber Pemasaran)
  const marketingAttribution = useMemo(() => {
    const counts = { Instagram: 0, TikTok: 0, Referral: 0, Website: 0 };
    crmDb.customers.forEach(c => {
      if (counts[c.source] !== undefined) counts[c.source]++;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      Pendaftar: counts[key]
    }));
  }, [crmDb]);

  // --- SUBMIT HANDLING ---
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterForm.name || !newsletterForm.email) {
      setAlertMsg("Mohon isi nama dan email Anda.");
      setTimeout(() => setAlertMsg(""), 3000);
      return;
    }

    const newCustomer = {
      id: `CUST-${(crmDb.customers.length + 1).toString().padStart(3, "0")}`,
      name: newsletterForm.name,
      username: newsletterForm.name.toLowerCase().replace(/\s+/g, "") + (crmDb.customers.length + 1),
      email: newsletterForm.email,
      phone: `0812-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      gender: Math.random() > 0.5 ? "Perempuan" : "Laki-laki",
      dob: "1998-05-12",
      city: "Jakarta",
      joinDate: "25/06/2026",
      status: "Active",
      loyalty: "Bronze",
      referralCode: "CREATOR-TRIAL",
      feedback: null,
      totalTransactions: 350000,
      itemsCount: 1,
      paymentMethod: "GoPay",
      lastTransactionDate: "25/06/2026",
      source: newsletterForm.source,
      promoActive: true
    };

    const updatedCustomers = [newCustomer, ...crmDb.customers];
    const updatedDb = { ...crmDb, customers: updatedCustomers };
    setCrmDb(updatedDb);

    // Simpan ke local storage
    localStorage.setItem("crm_customers", JSON.stringify(updatedCustomers));

    setAlertMsg(`Uji Coba Berhasil! Selamat datang ${newsletterForm.name}. Live Counter terupdate!`);
    setNewsletterForm({ name: "", email: "", source: "Website" });
    setTimeout(() => setAlertMsg(""), 5000);
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!demoForm.name || !demoForm.email || !demoForm.date) {
      setAlertMsg("Mohon lengkapi formulir jadwal demo.");
      setTimeout(() => setAlertMsg(""), 3000);
      return;
    }
    setAlertMsg(`Jadwal demo berhasil diajukan untuk tanggal ${demoForm.date}. Advisor kami akan segera menghubungi Anda.`);
    setIsDemoModalOpen(false);
    setDemoForm({ name: "", email: "", phone: "", company: "", date: "" });
    setTimeout(() => setAlertMsg(""), 5000);
  };

  // --- FAQS DATA ---
  const faqs = [
    {
      q: "Apakah Lumier Cosmetics CRM dapat dihubungkan dengan toko online saya di Shopify atau WooCommerce?",
      a: "Ya, benar. Lumier Cosmetics CRM menyediakan integrasi API terbuka yang memungkinkan sinkronisasi data transaksi otomatis dari Shopify, WooCommerce, Tokopedia, dan Shopee secara real-time ke database pusat CRM Anda."
    },
    {
      q: "Bagaimana cara kerja WhatsApp Gateway dalam memicu pengingat restock skincare pelanggan?",
      a: "Sistem secara otomatis memantau tanggal transaksi terakhir dan jenis produk yang dibeli pelanggan. Jika pelanggan membeli serum berukuran 30ml yang diperkirakan habis dalam 30 hari, sistem akan mengirimkan pengingat restock personal melalui WhatsApp secara otomatis pada hari ke-25."
    },
    {
      q: "Apakah saya bisa membatasi hak akses data pelanggan untuk tim CS (Customer Service) dan agen penjualan?",
      a: "Bisa. Lumier Cosmetics CRM dilengkapi dengan fitur Role-Based Access Control (RBAC). Anda dapat membatasi akses sehingga agen hanya melihat data rujukan mereka sendiri, sedangkan tim CS hanya memiliki izin membaca data keluhan pelanggan tanpa dapat mengekspor seluruh database."
    },
    {
      q: "Bagaimana cara sistem menghitung bonus komisi untuk influencer yang membagikan Kode Referral?",
      a: "Setiap kali pelanggan baru melakukan transaksi dan memasukkan Kode Referral/Creator Code khusus di halaman checkout, sistem akan merekam transaksi tersebut dan mengalokasikan persentase komisi secara real-time ke akun influencer terkait berdasarkan skema komisi yang Anda tentukan di dashboard admin."
    },
    {
      q: "Apakah data pelanggan kami dijamin keamanannya dan tidak akan bocor?",
      a: "Keamanan data adalah prioritas utama kami. Seluruh database pelanggan disimpan di server cloud terenkripsi (Supabase/AWS) dengan protokol SSL/TLS untuk pengiriman data dan enkripsi AES-256 pada tingkat penyimpanan data. Kami juga melakukan backup database harian secara otomatis."
    },
    {
      q: "Bagaimana tingkat diskon bertingkat diterapkan pada level keanggotaan Bronze, Silver, dan Gold?",
      a: "Diskon bertingkat dihitung otomatis berdasarkan akumulasi nilai transaksi pelanggan (CLV). Level Bronze mendapatkan diskon dasar 5%, Silver mendapatkan diskon 10% beserta kupon ulang tahun, dan level Gold mendapatkan diskon 15%, prioritas pengiriman, serta akses gratis ke produk sampel baru."
    },
    {
      q: "Apakah ada batasan jumlah data pelanggan yang dapat disimpan di dalam sistem?",
      a: "Paket Free Trial kami mendukung penyimpanan hingga 1.000 data pelanggan. Untuk paket Enterprise, database kami menggunakan kapasitas penyimpanan dinamis yang mampu menampung jutaan baris data pelanggan, riwayat pembelian, dan catatan kampanye tanpa penurunan performa sistem."
    },
    {
      q: "Apakah kami bisa mengustomisasi kuesioner pada Review & Feedback Hub?",
      a: "Sangat bisa. Anda dapat menambahkan pertanyaan spesifik, seperti jenis kulit pelanggan (kering, berminyak, sensitif) atau tingkat efikasi produk (misal: meredakan kemerahan dalam 3 hari) untuk mengumpulkan sentimen ulasan yang lebih presisi dan bernilai tinggi bagi tim R&D produk Anda."
    },
    {
      q: "Apakah sistem ini mendukung pelacakan wilayah sebaran pembeli secara geografis?",
      a: "Ya. Modul Geo-Contact Filter kami memetakan alamat pembeli berdasarkan Kota dan Provinsi. Anda dapat melihat peta visual wilayah sebaran penjualan terbesar guna memprioritaskan alokasi stok produk di gudang cabang terdekat."
    },
    {
      q: "Bagaimana cara memulai uji coba gratis Lumier Cosmetics CRM?",
      a: "Anda cukup mengisi formulir pendaftaran newsletter/trial di bagian bawah landing page ini. Akun demo instan akan langsung dibuatkan dan Anda dapat mengeksplorasi seluruh fitur dasar CRM kami selama 14 hari tanpa dipungut biaya apapun."
    }
  ];

  // --- TESTIMONIALS ---
  const testimonials = [
    {
      quote: "Sebelum menggunakan Lumier Cosmetics CRM, data pembeli kami tersebar di ratusan reseller WA dan Excel. Sekarang, semuanya tersinkronisasi dalam satu dashboard. Repeat order kami melonjak hingga 45% berkat sistem Restock Alert otomatis!",
      name: "Sari Indah",
      role: "Founder RoseAllDay Skincare",
      metrics: "+45% Repeat Order"
    },
    {
      quote: "Pelacakan Creator Code influencer jadi sangat mudah. Kami bisa mengukur ROI setiap rupiah yang kami bayarkan untuk endorsement di TikTok secara transparan. Sistem komisi reseller otomatisnya juga berjalan tanpa selisih hitung.",
      name: "Rian Wijaya",
      role: "Direktur Pemasaran Lumina Cosmetics",
      metrics: "3.8x ROI Influencer"
    },
    {
      quote: "Tingkatan membership Gold, Silver, Bronze dari Lumier memotivasi reseller kami untuk terus meningkatkan penjualan demi mendapatkan margin diskon yang lebih tinggi. Efisiensi operasional admin gudang pun meningkat drastis.",
      name: "Clara Tan",
      role: "CEO BellaBeauty Distributor",
      metrics: "+80% Produktivitas Agen"
    }
  ];

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div ref={homeRef} className="bg-[#FAF9F5] min-h-screen text-[#262626] font-sans antialiased flex flex-col justify-between pt-20 w-full overflow-x-hidden">
      
      {/* ================= STICKY NAVBAR (OLIVE & CHARCOAL) ================= */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 md:px-16 flex justify-between items-center z-40 shadow-2xs">
        <div className="flex items-center cursor-pointer" onClick={() => scrollToSection(homeRef)}>
          <span className="font-poppins font-bold text-xl tracking-tight text-[#262626] flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#4F5C18] flex items-center justify-center text-white text-base font-extrabold shadow-xs">L</span>
            Lumier <span className="text-[#4F5C18] font-normal italic">Cosmetics CRM</span>
          </span>
        </div>

        {/* Menu Tautan Tengah */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollToSection(homeRef)} className="bg-transparent border-none cursor-pointer text-[#4F5C18] hover:text-[#262626] transition-all duration-300">Home</button>
          <button onClick={() => scrollToSection(catalogPromoRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Produk & Promo</button>
          <button onClick={() => scrollToSection(problemRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Pain Points</button>
          <button onClick={() => scrollToSection(calculatorRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">ROI Calculator</button>
          <button onClick={() => scrollToSection(simulatorRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Simulator</button>
          <button onClick={() => scrollToSection(schemaRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Skema DB</button>
          <button onClick={() => scrollToSection(featuresRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Fitur CRM</button>
          <button onClick={() => scrollToSection(faqRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">FAQ</button>
        </div>

        {/* Menu Sisi Kanan (Auth & Booking) */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/login")} className="hidden sm:inline-block text-xs font-bold text-[#4F5C18] hover:text-[#262626] transition-all bg-transparent border-none cursor-pointer">
            Masuk Member
          </button>
          <button onClick={() => setIsDemoModalOpen(true)} className="px-5 py-2.5 bg-[#4F5C18] hover:bg-[#3d4712] text-white text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300 border-none flex items-center gap-2 shadow-xs cursor-pointer">
            <FiCalendar size={12} /> Jadwalkan Demo
          </button>
        </div>
      </nav>

      {/* ================= HERO SECTION (ASIMETRIS & MEWAH) ================= */}
      <section className="px-6 md:px-16 py-16 md:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left relative">
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#F2F7D6]/60 rounded-full blur-3xl -z-10"></div>
        
        {/* Sisi Kiri: Teks & CTA */}
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F2F7D6] text-[#4F5C18] border border-[#E2E9B8]">
            <FiActivity size={10} className="animate-pulse" /> Platform B2B & D2C Eksklusif
          </span>
          <h1 className="text-4xl md:text-[54px] font-poppins font-black tracking-tight text-[#262626] leading-[1.08]">
            Kuasai Loyalitas <br />
            <span className="italic font-light text-[#4F5C18] font-serif">Kustomer Kosmetik Anda</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
            Satu-satunya CRM kecantikan yang mengaitkan transaksi ritel, diskon reseller bertingkat, dan peringatan restock WhatsApp otomatis dalam satu database terpusat yang aman.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button onClick={() => scrollToSection(contactRef)} className="px-7 py-3.5 bg-[#4F5C18] hover:bg-[#3d4712] text-white text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300 flex items-center gap-2 border-none shadow-md cursor-pointer">
              Mulai Uji Coba Gratis <FiArrowRight />
            </button>
            <button onClick={() => setIsDemoModalOpen(true)} className="px-7 py-3.5 bg-white border border-gray-200 hover:border-[#4F5C18] text-[#262626] hover:text-[#4F5C18] text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer shadow-2xs">
              Jadwalkan Demo
            </button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 border-t border-gray-200/50">
            <div className="flex items-center gap-1"><FiShield /> Server Lokal Aman</div>
            <div className="flex items-center gap-1"><FiCheck /> Pemasangan 10 Menit</div>
            <div className="flex items-center gap-1"><FiGlobe /> Integrasi WhatsApp API</div>
          </div>
        </div>
        
        {/* Sisi Kanan: Live Dashboard Preview (Grafik Dinamis & UI Premium) */}
        <div className="lg:col-span-6 bg-white border border-gray-200/80 p-6 rounded-2xl shadow-md w-full space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2F7D6]/30 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4F5C18]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#a3b18a]"></span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">LUMIERE_ANALYTICS_v2.0</span>
            </div>
            <span className="text-[9px] bg-[#F2F7D6] text-[#4F5C18] font-bold px-2 py-0.5 rounded font-mono">SUPABASE_CONNECTED</span>
          </div>

          {/* Tren Pendapatan Bulanan */}
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tren Pendapatan Bulanan (Juta Rp)</span>
              <span className="text-xs font-black text-[#4F5C18] flex items-center gap-0.5"><FiTrendingUp /> +24% MoM</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F5C18" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4F5C18" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => `Rp ${value} Jt`} />
                  <Area type="monotone" dataKey="Revenue" stroke="#4F5C18" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dua Grafik Mini */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Membership Donut Chart */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Membership Tiers</span>
              <div className="h-28 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={membershipDistribution} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={4} dataKey="value">
                      {membershipDistribution.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} stroke="#fff" strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[8px] text-slate-400 font-bold uppercase">Total</span>
                  <span className="text-xs font-extrabold text-slate-800">{crmDb.customers.length}</span>
                </div>
              </div>
              <div className="flex justify-center gap-3 text-[9px] font-bold text-slate-500 mt-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4F5C18]"></span> Gold</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#a3b18a]"></span> Silver</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#dad7cd]"></span> Bronze</span>
              </div>
            </div>

            {/* Bar Chart Pendaftar */}
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Atribusi Sumber User</span>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketingAttribution}>
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="Pendaftar" fill="#4F5C18" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ================= SOCIAL PROOF & LIVE COUNTERS (OLIVE & CHARCOAL) ================= */}
      <section className="bg-[#262626] text-white py-12 px-6 md:px-16 w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/2 rounded-full -ml-32 -mt-32 blur-3xl"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#a3b18a] font-bold">Kustomer Aktif</span>
            <h3 className="text-3xl md:text-5xl font-mono font-black text-[#F2F7D6]">{activeCustomersCount}+</h3>
            <p className="text-[10px] text-slate-400">Live data-bound counter</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#a3b18a] font-bold">Kosmetik Terjual</span>
            <h3 className="text-3xl md:text-5xl font-mono font-black text-[#F2F7D6]">{totalProductsSold.toLocaleString()}+</h3>
            <p className="text-[10px] text-slate-400">Terdistribusi lewat agen</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#a3b18a] font-bold">Kode Referral</span>
            <h3 className="text-3xl md:text-5xl font-mono font-black text-[#F2F7D6]">{activeReferralCodes}</h3>
            <p className="text-[10px] text-slate-400">Afiliator & reseller aktif</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#a3b18a] font-bold">Omset Terkunci</span>
            <h3 className="text-3xl md:text-5xl font-mono font-black text-[#F2F7D6]">Rp {(totalRevenue / 1000000000).toFixed(1)}M</h3>
            <p className="text-[10px] text-slate-400">Customer Lifetime Value</p>
          </div>
        </div>
      </section>

      {/* ================= CATALOG & PROMOTIONS SECTION (RETAIL & D2C SHOWCASE) ================= */}
      <section ref={catalogPromoRef} className="bg-white border-y border-gray-150 py-20 px-6 md:px-16 w-full text-left scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F2F7D6] text-[#4F5C18] border border-[#E2E9B8]">
                <FiTag size={10} /> D2C Storefront & Promo
              </span>
              <h2 className="text-3xl md:text-4xl font-poppins font-black text-[#262626] leading-tight">
                Katalog Kosmetik & Promo Eksklusif
              </h2>
              <p className="text-slate-500 text-sm max-w-2xl">
                Temukan lini kosmetik premium Lumiere dan penawaran menarik hari ini. Gabung member untuk mendapatkan benefit diskon bertingkat yang terintegrasi penuh ke CRM.
              </p>
            </div>
            
            {/* Countdown Flash Sale */}
            <div className="bg-[#FAF9F5] border border-gray-200/80 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xs">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl animate-pulse">
                <FiClock size={20} />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Flash Sale Berakhir Dalam</span>
                <div className="flex items-center gap-2 font-mono text-lg font-black text-[#262626]">
                  <span className="bg-[#262626] text-white px-2.5 py-1 rounded-lg text-sm">{String(promoTimeLeft.hours).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-[#262626] text-white px-2.5 py-1 rounded-lg text-sm">{String(promoTimeLeft.minutes).padStart(2, '0')}</span>
                  <span>:</span>
                  <span className="bg-[#262626] text-white px-2.5 py-1 rounded-lg text-sm">{String(promoTimeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vouchers & Coupons Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Voucher 1 */}
            <div className="bg-gradient-to-br from-[#FAF9F5] to-white border border-gray-200/80 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2F7D6]/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-500"></div>
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-[#4F5C18] text-white px-2 py-0.5 rounded">NEW USER</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5"><FiGift /> Member Signup</span>
                </div>
                <h4 className="text-lg font-poppins font-black text-[#262626]">Kupon Pendaftaran Baru</h4>
                <p className="text-xs text-slate-500">Gratis 100 poin loyalitas pertama langsung terdaftar di CRM untuk ditukar diskon belanja.</p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-gray-200 pt-4">
                <div className="font-mono text-sm font-black text-[#4F5C18]">GLOWSUMMER</div>
                <button
                  onClick={() => handleCopyCoupon("GLOWSUMMER")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border-none flex items-center gap-1.5 ${
                    copiedCoupon === "GLOWSUMMER" ? "bg-emerald-600 text-white" : "bg-[#4F5C18] hover:bg-[#3d4712] text-white"
                  }`}
                >
                  {copiedCoupon === "GLOWSUMMER" ? (<><FiCheckCircle size={12} /> Tersalin!</>) : (<><FiCopy size={12} /> Salin Kode</>)}
                </button>
              </div>
            </div>

            {/* Voucher 2 */}
            <div className="bg-gradient-to-br from-[#FAF9F5] to-white border border-gray-200/80 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2F7D6]/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-500"></div>
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded">FLASH SALE</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5"><FiPercent /> Potongan 25%</span>
                </div>
                <h4 className="text-lg font-poppins font-black text-[#262626]">Diskon Ulang Tahun Member</h4>
                <p className="text-xs text-slate-500">Gunakan kupon ultah ini khusus bagi kustomer yang berulang tahun bulan ini (terikat DOB di CRM).</p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-gray-200 pt-4">
                <div className="font-mono text-sm font-black text-[#4F5C18]">BEAUTYDAY</div>
                <button
                  onClick={() => handleCopyCoupon("BEAUTYDAY")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border-none flex items-center gap-1.5 ${
                    copiedCoupon === "BEAUTYDAY" ? "bg-emerald-600 text-white" : "bg-[#4F5C18] hover:bg-[#3d4712] text-white"
                  }`}
                >
                  {copiedCoupon === "BEAUTYDAY" ? (<><FiCheckCircle size={12} /> Tersalin!</>) : (<><FiCopy size={12} /> Salin Kode</>)}
                </button>
              </div>
            </div>

            {/* Voucher 3 */}
            <div className="bg-gradient-to-br from-[#FAF9F5] to-white border border-gray-200/80 p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F2F7D6]/20 rounded-full blur-xl group-hover:scale-150 transition-all duration-500"></div>
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-500 text-white px-2 py-0.5 rounded">RESTOCK DEALS</span>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5"><FiShoppingBag /> Peringatan Beli Kembali</span>
                </div>
                <h4 className="text-lg font-poppins font-black text-[#262626]">Restock Alert Voucher</h4>
                <p className="text-xs text-slate-500">Dapatkan potongan Rp 150.000 untuk transaksi repeat order skincare favorit Anda di portal kami.</p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-gray-200 pt-4">
                <div className="font-mono text-sm font-black text-[#4F5C18]">RESTOCK15</div>
                <button
                  onClick={() => handleCopyCoupon("RESTOCK15")}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer border-none flex items-center gap-1.5 ${
                    copiedCoupon === "RESTOCK15" ? "bg-emerald-600 text-white" : "bg-[#4F5C18] hover:bg-[#3d4712] text-white"
                  }`}
                >
                  {copiedCoupon === "RESTOCK15" ? (<><FiCheckCircle size={12} /> Tersalin!</>) : (<><FiCopy size={12} /> Salin Kode</>)}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Categories Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-[#FAF9F5] p-2 rounded-2xl max-w-2xl mx-auto border border-gray-150">
            {["Semua", "Tata Rias", "Perawatan Kulit", "Parfum", "Alat Kecantikan"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedPromoCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border-none cursor-pointer ${
                  selectedPromoCategory === cat
                    ? "bg-[#4F5C18] text-white shadow-xs"
                    : "bg-transparent text-slate-500 hover:text-[#4F5C18]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <FiLoader className="w-8 h-8 text-[#4F5C18] animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Memuat katalog produk...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showcaseProducts.length > 0 ? showcaseProducts : [])
                .filter(p => selectedPromoCategory === "Semua" || p.tag === selectedPromoCategory)
                .map((product) => {
                  const basePrice  = product.price || 0;
                  const promoPrice = product.isPromo && product.promoPrice ? product.promoPrice : Math.round(basePrice * 0.75);
                  const memberPrice = Math.round(basePrice * 0.80);
                  const inCart = showcaseCart.find(i => i.id === product.id);

                  return (
                    <div key={product.id} className="bg-white border border-[#F3F3F3] rounded-2xl overflow-hidden hover:border-[#4F5C18] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                      <div className="relative overflow-hidden aspect-square bg-[#FAF9F5]">
                        <img
                          src={product.img_url || product.img || getFallbackImg(product.tag)}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          onError={(e) => { const f = getFallbackImg(product.tag); if (e.target.src !== f) e.target.src = f; }}
                        />
                        <span className="absolute top-3 left-3 bg-[#4F5C18] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {product.tag}
                        </span>
                        {product.isPromo && (
                          <span className="absolute top-3 right-3 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                            <FiPercent size={8} /> {product.discountPercent || 25}% OFF
                          </span>
                        )}
                        {inCart && (
                          <span className="absolute bottom-3 right-3 bg-[#4F5C18] text-white text-[9px] font-bold px-2 py-1 rounded-lg">
                            ✓ {inCart.qty} di Keranjang
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-poppins font-bold text-sm text-[#262626] line-clamp-1 group-hover:text-[#4F5C18] transition-colors">{product.title}</h4>
                          <p className="text-[11px] text-slate-400">Dermatologically tested premium beauty product.</p>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-1 border-t border-gray-50 pt-3">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Harga Asli:</span>
                            <span className="text-xs text-slate-400 line-through">Rp {basePrice.toLocaleString('id-ID')}</span>
                          </div>
                          {product.isPromo && (
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Promo Flash:</span>
                              <span className="text-sm font-black text-rose-500">Rp {promoPrice.toLocaleString('id-ID')}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-baseline bg-[#F2F7D6]/50 p-1.5 rounded-lg border border-[#E2E9B8]/40">
                            <span className="text-[8px] text-[#4F5C18] font-bold uppercase tracking-wider">Harga Member CRM:</span>
                            <span className="text-xs font-black text-[#4F5C18]">Rp {memberPrice.toLocaleString('id-ID')} (-20%)</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 py-2.5 bg-[#4F5C18] hover:bg-[#3d4712] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                          >
                            <FiShoppingCart size={12} /> {inCart ? 'Tambah Lagi' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={() => navigate('/login')}
                            className="px-3 py-2.5 bg-white border border-[#E2E9B8] text-[#4F5C18] hover:bg-[#F2F7D6] text-[10px] font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
                            title="Login untuk harga member"
                          >
                            <FiUser size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {showcaseProducts.filter(p => selectedPromoCategory === "Semua" || p.tag === selectedPromoCategory).length === 0 && !loadingProducts && (
                <div className="col-span-4 text-center py-12 text-slate-400 italic text-sm">
                  Belum ada produk di kategori ini. Admin dapat menambahkan lewat Catalog Management.
                </div>
              )}
            </div>
          )}

          {/* Floating Cart Button */}
          {cartCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-8 right-8 z-50 bg-[#262626] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:bg-[#4F5C18] transition-all cursor-pointer border border-white/10 animate-bounce"
            >
              <FiShoppingCart size={16} />
              <span className="text-[10px] font-black tracking-widest uppercase">Keranjang ({cartCount})</span>
            </button>
          )}

          {/* CRM Integration Notice Panel */}
          <div className="bg-[#FAF9F5] border border-gray-200/80 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 md:max-w-2xl">
              <h5 className="font-poppins font-bold text-sm text-[#262626] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4F5C18] animate-pulse"></span>
                Bagaimana Retail Terhubung dengan CRM Kami?
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Setiap kali kustomer melakukan pembelian kosmetik di sini, data transaksi, level membership (Bronze/Silver/Gold), total belanja (CLV), dan tanggal transaksi terakhir akan langsung masuk ke database CRM. Hal ini memicu otomatisasi restock alert, perhitungan poin, dan promo personalisasi.
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#262626] hover:bg-[#1a1a1a] text-[#F2F7D6] text-xs font-bold rounded-xl transition-all border-none flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap self-start md:self-auto"
            >
              Simulasikan Login Member & Belanja <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= PROBLEM SECTION (INDUSTRY PAIN POINTS) ================= */}
      <section ref={problemRef} className="px-6 md:px-16 py-20 max-w-6xl mx-auto w-full text-left scroll-mt-20 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">Kebocoran Omset Kosmetik</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-black text-[#262626] leading-tight">Kebocoran Finansial Retail Kecantikan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-250/50 hover:border-[#4F5C18] hover:shadow-sm transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#F2F7D6] flex items-center justify-center text-[#4F5C18]"><FiUsers size={20} /></div>
            <h3 className="font-poppins font-bold text-lg text-[#262626]">Pusat Data Kustomer Buta</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jaringan agen atau marketplace menyembunyikan detail pembeli. Anda kehilangan kontak langsung untuk membina retensi jangka panjang kustomer.
            </p>
            <div className="text-[10px] text-[#4F5C18] font-bold uppercase tracking-wider">Kehilangan Peluang Repeat Order</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-250/50 hover:border-[#4F5C18] hover:shadow-sm transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#F2F7D6] flex items-center justify-center text-[#4F5C18]"><FiActivity size={20} /></div>
            <h3 className="font-poppins font-bold text-lg text-[#262626]">Produk Habis Tanpa Notifikasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Skincare & serum memiliki siklus habis pakai. Tanpa notifikasi restock otomatis, kustomer akan beralih ke brand kompetitor saat skincare mereka habis.
            </p>
            <div className="text-[10px] text-[#4F5C18] font-bold uppercase tracking-wider">Kustomer Churn ke Kompetitor</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-250/50 hover:border-[#4F5C18] hover:shadow-sm transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#F2F7D6] flex items-center justify-center text-[#4F5C18]"><FiSettings size={20} /></div>
            <h3 className="font-poppins font-bold text-lg text-[#262626]">Sengketa Komisi Agen</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Perhitungan komisi referral manual memakan waktu berhari-hari dan rawan kesalahan hitung. Mengurangi semangat influencer atau reseller memasarkan produk Anda.
            </p>
            <div className="text-[10px] text-[#4F5C18] font-bold uppercase tracking-wider">Loyalitas Agen Menurun</div>
          </div>
        </div>
      </section>

      {/* ================= 2. KOMPONEN BARU: INTERACTIVE ROI CALCULATOR ================= */}
      <section ref={calculatorRef} className="bg-white border-y border-gray-200 py-20 px-6 md:px-16 w-full text-left scroll-mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">// ROI Calculator & Slider Harga</span>
            <h2 className="text-3xl font-poppins font-black text-[#262626] leading-tight">Hitung Estimasi Pertumbuhan Omset & Efisiensi Admin</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Geser slider untuk menentukan jumlah total reseller/kustomer aktif Anda saat ini. Lihat estimasi biaya langganan bulanan CRM, jam kerja admin yang dihemat, dan potensi omset tambahan yang didapatkan dari repeat order.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Jumlah Reseller / Kustomer</span>
                <span className="text-base font-black text-[#4F5C18]">{resellerCount.toLocaleString()} Mitra</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="10000" 
                step="100"
                value={resellerCount} 
                onChange={(e) => setResellerCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F5C18]"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>100 Mitra</span>
                <span>5,000 Mitra</span>
                <span>10,000 Mitra</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#F2F7D6]/40 p-6 rounded-xl border border-[#E2E9B8] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><FiDollarSign /> Langganan Bulanan</span>
                <h4 className="text-xl font-black text-[#262626]">Rp {subscriptionCost.toLocaleString()}</h4>
              </div>
              <p className="text-[10px] text-slate-500">Biaya transparan dasar + Rp 1.250 per mitra terdaftar.</p>
            </div>

            <div className="bg-[#F2F7D6]/40 p-6 rounded-xl border border-[#E2E9B8] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><FiClock /> Jam Admin Dihemat</span>
                <h4 className="text-xl font-black text-[#262626]">{adminHoursSaved} Jam / bln</h4>
              </div>
              <p className="text-[10px] text-slate-500">Otomatisasi invoice, komisi referral, & blast pesan kustomer.</p>
            </div>

            <div className="bg-[#F2F7D6]/40 p-6 rounded-xl border border-[#E2E9B8] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1"><FiTrendingUp /> Potensi Tambahan Omset</span>
                <h4 className="text-xl font-black text-emerald-700">Rp {(estimatedRevenueIncrease / 1000000).toFixed(0)} Juta</h4>
              </div>
              <p className="text-[10px] text-slate-500">Hasil rata-rata repeat order skincare dari Restock Alert.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. KOMPONEN BARU: REAL-TIME WHATSAPP GATEWAY SIMULATOR ================= */}
      <section ref={simulatorRef} className="px-6 md:px-16 py-20 max-w-7xl mx-auto w-full text-left scroll-mt-20 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">// Whatsapp Blast Engine Mockup</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-black text-[#262626]">Simulasikan Pengiriman Pesan Otomatis WhatsApp Gateway</h2>
          <p className="text-xs text-slate-500">
            Pilih template notifikasi CRM kosmetik di panel kiri dan sesuaikan isi pesan. Klik tombol simulasi untuk melihat bagaimana kustomer menerima notifikasi WhatsApp secara real-time di mockup smartphone sebelah kanan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Panel Kontrol Kiri */}
          <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-gray-200 shadow-2xs space-y-5">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-gray-100 pb-2">CRM Message Control Center</h3>
            
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Pilih Template Otomatisasi</label>
              <select 
                value={simulatedTemplate} 
                onChange={(e) => setSimulatedTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none bg-white text-slate-700 font-bold"
              >
                <option value="restock">Pemberitahuan Restock Skincare (Berdasarkan transaksi terakhir)</option>
                <option value="birthday">Birthday Coupon Blast (Berdasarkan Tanggal Lahir)</option>
                <option value="welcome">Selamat Bergabung Member (Loyalty Bronze Welcome)</option>
                <option value="commission">Pencairan Komisi Referral (Influencer Atribusi)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold uppercase text-slate-500">Isi Teks Notifikasi (Mendukung Tag Dinamis)</label>
                <span className="text-[9px] text-slate-400 font-bold">Gunakan: &#123;Name&#125;, &#123;Referral&#125;</span>
              </div>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#4F5C18] text-slate-700 leading-relaxed font-sans"
              />
            </div>

            <button
              onClick={handleSimulateBlast}
              disabled={isBlasting}
              className="w-full py-3 bg-[#4F5C18] hover:bg-[#3d4712] text-white text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all border-none flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <FiMessageCircle size={14} />
              {isBlasting ? "Mengirim Pesan Simulasi..." : "Simulasikan Blast WhatsApp"}
            </button>
          </div>

          {/* Mockup Smartphone Kanan */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[280px] h-[550px] bg-[#262626] rounded-[3rem] p-3 shadow-xl border-4 border-slate-700 flex flex-col justify-between">
              {/* Speaker & Kamera depan */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#262626] rounded-b-xl z-20 flex justify-center items-center gap-2">
                <span className="w-10 h-1 bg-slate-600 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-slate-800 rounded-full"></span>
              </div>
              
              {/* Layar HP Mockup */}
              <div className="w-full h-full bg-[#efeae2] rounded-[2.5rem] overflow-hidden flex flex-col relative pt-6 justify-between">
                
                {/* Header WA Mockup */}
                <div className="bg-[#075e54] text-white px-4 py-2 flex items-center justify-between text-[10px] shrink-0 shadow-sm relative z-10">
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="w-5 h-5 rounded-full bg-[#4F5C18] flex items-center justify-center text-[9px] font-bold">LM</span>
                    <div className="space-y-0.5">
                      <span className="block font-bold">Lumier Cosmetics CRM</span>
                      <span className="block text-[7px] text-emerald-100 font-semibold">Online & Gateway Active</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold bg-[#128c7e] px-1.5 py-0.5 rounded">API GATEWAY</span>
                </div>

                {/* Body Chat WA Mockup */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col justify-end font-sans">
                  {phoneMessages.length === 0 ? (
                    <div className="text-center my-auto p-4 space-y-2">
                      <FiSmartphone size={32} className="mx-auto text-slate-300 animate-bounce" />
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Menunggu Simulasi Kirim...</p>
                      <p className="text-[8px] text-slate-400">Klik tombol di sebelah kiri untuk melihat pesan masuk.</p>
                    </div>
                  ) : (
                    phoneMessages.map((msg) => (
                      <div key={msg.id} className="bg-white p-2.5 rounded-lg shadow-2xs border border-gray-150/50 max-w-[85%] self-start relative text-[9px] leading-relaxed text-[#262626] font-medium">
                        <span className="block font-bold text-slate-400 text-[8px] uppercase tracking-wider mb-0.5">{msg.sender}</span>
                        <p>{msg.text}</p>
                        <div className="text-right text-[7px] text-slate-400 font-bold mt-1.5 flex items-center justify-end gap-1">
                          {msg.time} <span className="text-emerald-500">✓✓</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer WA Mockup */}
                <div className="bg-gray-100/90 px-3 py-2 border-t border-gray-200/80 flex items-center gap-2 shrink-0">
                  <div className="bg-white rounded-full flex-1 px-3 py-1 text-[8px] text-slate-400 select-none">
                    Ketik balasan untuk CS...
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#075e54] flex items-center justify-center text-white text-[10px] shrink-0 font-bold">✈</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. KOMPONEN BARU: CUSTOM FIELDS SCHEMA BROWSER ================= */}
      <section ref={schemaRef} className="bg-[#FAF9F5] border-y border-gray-200 py-20 px-6 md:px-16 w-full text-left scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">// Struktur Custom Fields Database</span>
              <h2 className="text-3xl font-poppins font-black text-[#262626] leading-tight">Visualisasikan Skema Database Ritel Kosmetik Anda</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                Platform CRM kecantikan kami telah dirancang dengan tabel-tabel data relasional kustom bawaan yang siap menampung profil pelanggan kecantikan Anda demi kelancaran otomatisasi promosi.
              </p>
            </div>
            
            <div className="lg:col-span-5 flex flex-wrap gap-1.5 lg:justify-end">
              {Object.keys(schemaData).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveSchemaTab(key)}
                  className={`px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${activeSchemaTab === key ? 'bg-[#4F5C18] border-[#4F5C18] text-white shadow-2xs' : 'bg-white border-gray-200 text-slate-600 hover:border-[#4F5C18]'}`}
                >
                  {key === "identity" ? "Identitas" : key === "contact" ? "Kontak" : key === "membership" ? "Membership" : "Transaksi"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-poppins font-bold text-[#262626] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F5C18]"></span>
                {schemaData[activeSchemaTab].title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{schemaData[activeSchemaTab].description}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-slate-400 uppercase text-[9px] font-bold tracking-widest">
                    <th className="py-2.5">Nama Kolom DB</th>
                    <th className="py-2.5">Tipe Data</th>
                    <th className="py-2.5">Tujuan dalam Pemasaran CRM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-slate-600 font-medium">
                  {schemaData[activeSchemaTab].fields.map((field, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono font-bold text-[#4F5C18]">{field.name}</td>
                      <td className="py-3 font-mono text-[10px] text-slate-400">{field.type}</td>
                      <td className="py-3 text-slate-500 leading-normal">{field.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 4-DIMENSIONAL FEATURE GRID ================= */}
      <section ref={featuresRef} className="px-6 md:px-16 py-20 max-w-7xl mx-auto w-full text-left scroll-mt-20 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">Pilar Fungsional Utama</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-black text-[#262626] leading-tight">4 Dimensi Kemampuan Lumier Cosmetics CRM</h2>
        </div>

        {/* Tab Header */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-slate-100 pb-4">
          {[
            { id: "operational", name: "Operational CRM", desc: "Manajemen Data & Kasir" },
            { id: "analytical", name: "Analytical CRM", desc: "Data Analitik & Grafik" },
            { id: "collaborative", name: "Collaborative CRM", desc: "Feedback & CS Delegasi" },
            { id: "strategic", name: "Strategic CRM", desc: "Algoritma Retensi & Loyalitas" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-lg text-left transition-all duration-300 cursor-pointer border ${activeTab === tab.id ? 'bg-[#4F5C18] border-[#4F5C18] text-white shadow-md' : 'bg-white border-gray-200 text-slate-700 hover:border-[#4F5C18]'}`}
            >
              <h4 className="text-xs font-bold tracking-wide">{tab.name}</h4>
              <p className={`text-[9px] ${activeTab === tab.id ? 'text-lime-200' : 'text-slate-400'}`}>{tab.desc}</p>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-[#F2F7D6]/10 p-6 md:p-8 rounded-2xl border border-[#E2E9B8] grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            {activeTab === "operational" && (
              <>
                <h3 className="text-xl font-poppins font-black text-[#262626]">Operasionalisasi Data Penjualan & Pelanggan</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Modul ini menangkap otomatisasi input profil baru saat transaksi checkout. Mempercepat kerja admin dan CS dengan mengarsipkan nomor telepon (integrasi WA Gateway) serta melacak Creator Code/Referral Code yang dipakai pembeli.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Pencatatan UUID otomatis per customer baru</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Sinkronisasi database kasir & e-commerce terpadu</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Manajemen arsip kontak digital pembeli secara rapi</li>
                </ul>
              </>
            )}

            {activeTab === "analytical" && (
              <>
                <h3 className="text-xl font-poppins font-black text-[#262626]">Kecerdasan Analitik & Visualisasi Tren</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gunakan visual grafik Recharts interaktif untuk memonitor tren omset bulanan secara real-time. Lacak performa kampanye di berbagai media (TikTok vs Instagram vs Website) dan petakan sebaran pelanggan terbesar berdasarkan Kota/Provinsi.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Grafik Area perbandingan pendapatan bulanan</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Analisis atribusi ROI saluran promosi marketing</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Pemetaan visual geospasial penjualan daerah</li>
                </ul>
              </>
            )}

            {activeTab === "collaborative" && (
              <>
                <h3 className="text-xl font-poppins font-black text-[#262626]">Kolaborasi Penanganan Keluhan & Review</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Satukan review kepuasan dan ulasan efikasi produk kosmetik dalam satu hub. Alokasikan keluhan pelanggan secara otomatis ke tim CS terkait, lengkap dengan push notification untuk memastikan respon cepat demi menjaga kepuasan pembeli.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Review & Feedback Hub dengan sentimen analisis</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Delegasi tiket keluhan langsung ke dasbor tim CS</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Notifikasi status pengiriman barang dari logistik</li>
                </ul>
              </>
            )}

            {activeTab === "strategic" && (
              <>
                <h3 className="text-xl font-poppins font-black text-[#262626]">Strategi Retensi & Program Loyalitas Premium</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Terapkan algoritma retensi prediktif berbasis tanggal transaksi terakhir. Sistem akan mengirim kupon diskon terarah (promo active) untuk merebut kembali pelanggan pasif, serta mengelola diskon bertingkat untuk level keanggotaan Gold.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Alarm pengingat belanja ulang skincare otomatis</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Pembagian diskon & bonus otomatis level Gold/Silver</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#4F5C18]" /> Otomatisasi blasting blast kupon bagi user yang tidak aktif</li>
                </ul>
              </>
            )}
          </div>

          <div className="md:col-span-5 bg-white p-5 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-[#4F5C18] uppercase font-mono tracking-wider">Interactive Live Log</h4>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {recentTransactions.map((c) => (
                <div key={c.id} className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-[10px]">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">{c.name}</span>
                    <span className="block text-slate-400 font-mono text-[9px]">{c.id} | {c.city}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="font-bold text-[#4F5C18]">Rp {c.totalTransactions.toLocaleString()}</span>
                    <span className={`block font-bold ${c.loyalty === 'Gold' ? 'text-amber-600' : c.loyalty === 'Silver' ? 'text-slate-400' : 'text-slate-500'}`}>{c.loyalty} Tier</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 italic text-center font-mono">Database internal sinkronisasi sukses.</p>
          </div>
        </div>
      </section>

      {/* ================= 5. KOMPONEN BARU: SENTIMENT REVIEW ANALYZER SIMULATOR ================= */}
      <section ref={sentimentRef} className="bg-white border-y border-gray-200 py-20 px-6 md:px-16 w-full text-left scroll-mt-20">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">// Review & Feedback Sentimen Analitik</span>
            <h2 className="text-2xl md:text-3xl font-poppins font-black text-[#262626]">Deteksi Sentimen Ulasan & Pemicu Tindakan Otomatis</h2>
            <p className="text-xs text-slate-500">
              Uji coba kecerdasan analitik ulasan kami. Klik salah satu ulasan dari kustomer di bawah ini untuk melihat hasil analisis persentase skor sentimen serta tindakan otomatis (workflow trigger) yang langsung dieksekusi oleh CRM.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Kolom Kiri: Pilihan Ulasan */}
            <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
              {sentimentReviews.map((rev) => (
                <div 
                  key={rev.id}
                  onClick={() => setSelectedReviewId(rev.id)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${selectedReviewId === rev.id ? 'bg-[#F2F7D6]/30 border-[#4F5C18] shadow-2xs' : 'bg-white border-gray-200 hover:border-slate-400'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#4F5C18] text-white flex items-center justify-center font-bold text-[9px]">{rev.avatar}</span>
                      <span className="text-xs font-bold text-slate-800">{rev.name}</span>
                    </div>
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={10} fill={i < rev.rating ? "#f59e0b" : "none"} className={i < rev.rating ? "text-amber-500" : "text-slate-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">"{rev.comment}"</p>
                </div>
              ))}
            </div>

            {/* Kolom Kanan: Detail Analisis Sentimen */}
            <div className="lg:col-span-7 bg-gray-50/50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-gray-200/50 pb-2">Analisis Sentimen Kustomer: {currentSentimentReview.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{currentSentimentReview.comment}"</p>
                
                {/* Sentiment Score Bars */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-600">
                      <span>Sentimen Positif</span>
                      <span>{currentSentimentReview.score.positive}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${currentSentimentReview.score.positive}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-600">
                      <span>Sentimen Netral</span>
                      <span>{currentSentimentReview.score.neutral}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 transition-all duration-500" style={{ width: `${currentSentimentReview.score.neutral}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-600">
                      <span>Sentimen Negatif</span>
                      <span>{currentSentimentReview.score.negative}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: `${currentSentimentReview.score.negative}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Triggered */}
              <div className="bg-white p-4 rounded-xl border border-gray-150 flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-[#F2F7D6] flex items-center justify-center text-[#4F5C18] shrink-0"><FiCheck size={16} /></div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Tindakan Workflow CRM Terpicu:</h5>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1">{currentSentimentReview.action}</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= RESELLER CASE STUDY BREAKDOWN ================= */}
      <section className="bg-slate-50 border-y border-slate-200/50 py-20 px-6 md:px-16 text-left w-full scroll-mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">// Studi Kasus Kemitraan</span>
            <h2 className="text-3xl font-poppins font-black text-[#262626] leading-tight">Glow Skincare Sukses Melejitkan Repeat Order 150%</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sebelum bermitra dengan Lumier, Glow Skincare mengalami kesulitan memetakan rute logistik dan mencatat total komisi reseller mereka secara tertib. CRM kami sukses mengotomatisasi restock alert dan mendistribusikan loyalitas point.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2 text-center">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-lg font-extrabold text-[#4F5C18]">150%</span>
                <span className="block text-[8px] uppercase font-bold text-slate-400">Repeat Order</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-lg font-extrabold text-[#4F5C18]">12k+</span>
                <span className="block text-[8px] uppercase font-bold text-slate-400">Mitra Aktif</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <span className="text-lg font-extrabold text-[#4F5C18]">100%</span>
                <span className="block text-[8px] uppercase font-bold text-slate-400">Akurasi Komisi</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Siklus Pertumbuhan (Cosmetics Retail Cycle)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-[#F2F7D6]/30 p-3 rounded-lg border border-[#E2E9B8] space-y-1 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#4F5C18]">1. Discovery</span>
                <p className="text-[9px] text-slate-500 leading-normal">Menjelajahi kosmetik via promosi sosial.</p>
              </div>
              <div className="bg-[#F2F7D6]/30 p-3 rounded-lg border border-[#E2E9B8] space-y-1 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#4F5C18]">2. Checkout</span>
                <p className="text-[9px] text-slate-500 leading-normal">Membeli produk via referral reseller.</p>
              </div>
              <div className="bg-[#F2F7D6]/30 p-3 rounded-lg border border-[#E2E9B8] space-y-1 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#4F5C18]">3. Poin & Tier</span>
                <p className="text-[9px] text-slate-500 leading-normal">Total transaksi naik, level loyalitas naik otomatis.</p>
              </div>
              <div className="bg-[#F2F7D6]/30 p-3 rounded-lg border border-[#E2E9B8] space-y-1 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#4F5C18]">4. Retention</span>
                <p className="text-[9px] text-slate-500 leading-normal">Blast WhatsApp restock saat kosmetik habis.</p>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-4 text-[10px] text-slate-500 flex items-center gap-2">
              <FiCheck className="text-[#4F5C18] shrink-0" />
              <span>Otomatisasi siklus retensi menyelamatkan brand Anda dari kebocoran kustomer pasif secara berkala.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS CAROUSEL ================= */}
      <section className="bg-white border-y border-gray-200 py-20 px-6 md:px-16 w-full text-center">
        <div className="max-w-4xl mx-auto space-y-8 relative">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">Testimoni Pengguna Sukses</span>
          
          {/* Slide Box */}
          <div className="bg-gray-50/50 p-8 md:p-12 rounded-2xl border border-gray-200 shadow-sm space-y-6 min-h-64 flex flex-col justify-between transition-all duration-500">
            <div className="flex justify-center gap-1 text-[#4F5C18]">
              <FiStar size={16} fill="#4F5C18" />
              <FiStar size={16} fill="#4F5C18" />
              <FiStar size={16} fill="#4F5C18" />
              <FiStar size={16} fill="#4F5C18" />
              <FiStar size={16} fill="#4F5C18" />
            </div>
            <p className="text-slate-600 text-sm md:text-base italic leading-relaxed max-w-2xl mx-auto">
              "{testimonials[testimonialIndex].quote}"
            </p>
            <div className="space-y-1">
              <h4 className="font-poppins font-bold text-[#262626]">{testimonials[testimonialIndex].name}</h4>
              <p className="text-[11px] text-slate-400 font-medium">{testimonials[testimonialIndex].role}</p>
              <span className="inline-block text-[10px] bg-[#F2F7D6] text-[#4F5C18] font-bold px-2.5 py-0.5 rounded mt-1 font-mono">{testimonials[testimonialIndex].metrics}</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <button onClick={handlePrevTestimonial} className="w-10 h-10 rounded-full bg-white border border-gray-200 text-slate-600 hover:text-[#4F5C18] hover:border-[#4F5C18] flex items-center justify-center transition-all cursor-pointer shadow-2xs">
              <FiChevronLeft size={18} />
            </button>
            <button onClick={handleNextTestimonial} className="w-10 h-10 rounded-full bg-white border border-gray-200 text-slate-600 hover:text-[#4F5C18] hover:border-[#4F5C18] flex items-center justify-center transition-all cursor-pointer shadow-2xs">
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ================= FAQ ACCORDION SYSTEM ================= */}
      <section ref={faqRef} className="px-6 md:px-16 py-20 max-w-4xl mx-auto w-full text-left scroll-mt-20 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">Tanya Jawab Umum</span>
          <h2 className="text-2xl md:text-3xl font-poppins font-black text-[#262626] leading-tight">FAQ Sistem CRM Kosmetik</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200/50 pb-4">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left py-3 font-poppins font-bold text-slate-800 hover:text-[#4F5C18] transition-all bg-transparent border-none cursor-pointer"
              >
                <span className="text-sm pr-4">{idx + 1}. {faq.q}</span>
                <FiChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${activeFaq === idx ? "transform rotate-180 text-[#4F5C18]" : "text-slate-400"}`} />
              </button>
              {activeFaq === idx && (
                <div className="pl-4 pr-6 py-2 text-xs text-slate-500 leading-relaxed border-l-2 border-[#4F5C18] bg-[#F2F7D6]/20 rounded-r-md transition-all">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CONVERSION BLOCK & NEWSLETTER CAPTURE ================= */}
      <section ref={contactRef} className="bg-[#262626] text-white py-20 px-6 md:px-16 w-full text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F5C18]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3b18a] block">Mulai Uji Coba Gratis</span>
            <h2 className="text-3xl md:text-4xl font-poppins font-black text-white leading-tight">Siap Meningkatkan Repeat Order Skincare Anda?</h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Daftar uji coba gratis platform Lumier Cosmetics CRM selama 14 hari penuh. Hubungkan data reseller Anda dan rasakan kemudahan otomasi pesan pengingat restock skincare.
            </p>
            <div className="space-y-3 text-xs text-[#a3b18a] font-mono pt-2">
              <p className="flex items-center gap-2.5"><FiPhone className="text-[#4F5C18]" /> +62 812-9988-7766</p>
              <p className="flex items-center gap-2.5"><FiMail className="text-[#4F5C18]" /> hello@lumiercrm.com</p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#FAF9F5] text-slate-800 p-8 rounded-2xl shadow-2xl border border-gray-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Daftar Free Trial Instant</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Isi formulir ini untuk pendaftaran akun trial instant 14 hari. Live database counter di atas akan mendeteksi pendaftaran Anda secara otomatis!</p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newsletterForm.name}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, name: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={newsletterForm.email}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, email: e.target.value })}
                    placeholder="nama@perusahaan.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sumber Informasi</label>
                  <select
                    value={newsletterForm.source}
                    onChange={(e) => setNewsletterForm({ ...newsletterForm, source: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none bg-white text-slate-700 font-semibold"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Referral">Referral / Rekomendasi</option>
                    <option value="Website">Website / Pencarian</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4F5C18] hover:bg-[#3d4712] text-white font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all duration-300 border-none shadow-md cursor-pointer mt-2"
              >
                Mulai Uji Coba Gratis
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ================= SYSTEM ALERTS ================= */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 bg-[#4F5C18] border border-[#E2E9B8] text-white px-5 py-3.5 rounded-lg flex items-center gap-2.5 z-50 shadow-xl text-xs font-bold uppercase tracking-wider transition-all animate-bounce">
          <FiAlertCircle size={14} /> {alertMsg}
        </div>
      )}

      {/* ================= JADWALKAN DEMO MODAL ================= */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#262626]/60 backdrop-blur-xs" onClick={() => setIsDemoModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-left z-10 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="font-poppins font-bold text-sm text-slate-900">Jadwalkan Demo Lumier CRM</h3>
              <button onClick={() => setIsDemoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Kerja</label>
                  <input
                    type="email"
                    required
                    value={demoForm.email}
                    onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                    placeholder="nama@instansi.com"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">No. HP (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    value={demoForm.phone}
                    onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Brand / Instansi</label>
                <input
                  type="text"
                  required
                  value={demoForm.company}
                  onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                  placeholder="Nama brand kecantikan Anda"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pilih Tanggal Janji Temu</label>
                <input
                  type="date"
                  required
                  value={demoForm.date}
                  onChange={(e) => setDemoForm({ ...demoForm, date: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#4F5C18] outline-none bg-white text-slate-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4F5C18] hover:bg-[#3d4712] text-white font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all duration-300 border-none shadow-md cursor-pointer mt-2"
              >
                Ajukan Jadwal Demo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= FOOTER & FOOTPRINT SITEMAP ================= */}
      <footer className="bg-[#262626] border-t border-slate-800 text-slate-400 py-16 px-6 md:px-16 w-full text-left mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-slate-800 pb-12 mb-8">
          
          <div className="space-y-4">
            <span className="font-poppins font-bold text-lg text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#4F5C18] flex items-center justify-center text-white text-xs font-black">L</span>
              Lumier CRM & Cosmetics
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Platform manajemen hubungan kustomer B2B & D2C terpadu untuk industri kosmetik, skincare, dan distributor kecantikan di Asia Tenggara.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
              <div className="flex items-start gap-2.5">
                <FiMapPin className="text-[#a3b18a] shrink-0 mt-0.5" size={14} />
                <span>Jl. Kemang Raya No. 45, Bangka, Mampang Prapatan, Jakarta Selatan, 12730, Indonesia</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-[#a3b18a] shrink-0" size={14} />
                <span>+62 (21) 7884-1200 / +62 812-9988-1200</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="text-[#a3b18a] shrink-0" size={14} />
                <span>support@lumier.co / sales@lumier.co</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiClock className="text-[#a3b18a] shrink-0" size={14} />
                <span>Senin - Jumat, 09:00 - 18:00 WIB</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Solutions</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => scrollToSection(catalogPromoRef)} className="bg-transparent border-none p-0 text-slate-400 hover:text-white transition-all cursor-pointer">D2C Produk & Promo</button></li>
              <li><a href="#" className="hover:text-white transition-all">Operational CRM</a></li>
              <li><a href="#" className="hover:text-white transition-all">Analytical Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-all">WhatsApp Gateway API</a></li>
              <li><a href="#" className="hover:text-white transition-all">Loyalty Management</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Resources</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white transition-all">Panduan Teknis Arsitektur</a></li>
              <li><a href="#" className="hover:text-white transition-all">Dokumentasi API Supabase</a></li>
              <li><a href="#" className="hover:text-white transition-all">Skema Data Inti Kosmetik</a></li>
              <li><a href="#" className="hover:text-white transition-all">Studi Kasus Repeat Order</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Legal & Support</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white transition-all">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-all">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-all">GDPR & Security Compliant</a></li>
              <li><a href="#" className="hover:text-white transition-all">Hubungi CS / Advisor</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
          <p>Lumier Cosmetics CRM © 2026. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">TikTok</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">YouTube</a>
          </div>
        </div>
      </footer>

      {/* ===== MODAL KERANJANG BELANJA ===== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="font-poppins font-black text-xl text-[#262626] flex items-center gap-2">
                <FiShoppingCart className="text-[#4F5C18]" /> Keranjang Belanja
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-none">
                <FiX size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {showcaseCart.map(item => {
                const displayPrice = item.isPromo && item.promoPrice ? item.promoPrice : item.price;
                return (
                  <div key={item.id} className="flex items-center gap-3 bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE9E1]">
                    <img
                      src={item.img_url || item.img || getFallbackImg(item.tag)}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-xl"
                      onError={(e) => { const f = getFallbackImg(item.tag); if (e.target.src !== f) e.target.src = f; }}
                    />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-xs text-[#262626] line-clamp-1">{item.title}</p>
                      <p className="text-[10px] text-[#4F5C18] font-bold">Rp {displayPrice.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-100">
                      <button onClick={() => updateQty(item.id, -1)} className="text-gray-400 hover:text-[#4F5C18] cursor-pointer bg-transparent border-none p-0"><FiMinus size={11} /></button>
                      <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-gray-400 hover:text-[#4F5C18] cursor-pointer bg-transparent border-none p-0"><FiPlus size={11} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 cursor-pointer bg-transparent border-none p-0"><FiX size={14} /></button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-5 mt-4 space-y-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Pembayaran</span>
                <span className="text-xl font-black text-[#4F5C18]">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-[10px] text-amber-700 font-bold">
                💡 Daftar sebagai Member untuk harga lebih hemat hingga 20% + tracking pesanan!
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#4F5C18] hover:bg-[#262626] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg shadow-[#4F5C18]/20"
              >
                <FiCheckCircle size={14} /> Konfirmasi Pesanan
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-transparent border border-[#4F5C18] text-[#4F5C18] py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-[#F2F7D6]"
              >
                <FiUser size={12} /> Login Dulu untuk Harga Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL CHECKOUT BERHASIL ===== */}
      {isCheckoutSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full mx-4 text-center shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <FiCheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4F5C18] block mb-1">Lumière Cosmetics</span>
            <h3 className="font-poppins font-black text-2xl text-[#262626] mb-3">Pesanan Diterima!</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              Terima kasih telah berbelanja. Daftar sebagai Member untuk<br/>tracking pesanan & diskon eksklusif!
            </p>
            <button
              onClick={() => { setIsCheckoutSuccess(false); navigate('/login'); }}
              className="w-full bg-[#4F5C18] hover:bg-[#262626] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none"
            >
              Daftar / Login Member
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* WHATSAPP FLOATING BUTTON - Sales Automation                  */}
      {/* ============================================================ */}
      <a
        href="https://wa.me/62877573317?text=Halo%20Lumier%20Cosmetics!%20Saya%20ingin%20bertanya%20mengenai%20produk%20anda."
        target="_blank"
        rel="noopener noreferrer"
        title="Hubungi Kami via WhatsApp"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#25D366",
          color: "#fff",
          padding: "14px 20px",
          borderRadius: "50px",
          boxShadow: "0 8px 30px rgba(37,211,102,0.45)",
          textDecoration: "none",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: "12px",
          letterSpacing: "0.05em",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.07)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,211,102,0.55)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,211,102,0.45)";
        }}
      >
        {/* WhatsApp SVG Icon */}
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.51L4 29l7.697-1.81A12.93 12.93 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
          <path d="M22.003 19.207c-.308-.154-1.82-.898-2.103-.999-.283-.102-.488-.154-.694.154-.205.308-.795.999-.974 1.205-.18.205-.359.231-.667.077-.308-.154-1.3-.479-2.476-1.528-.915-.816-1.532-1.823-1.712-2.131-.18-.308-.019-.474.135-.627.138-.138.308-.359.462-.538.154-.18.205-.308.308-.513.102-.205.051-.385-.026-.538-.077-.154-.694-1.672-.951-2.29-.25-.601-.505-.52-.694-.53l-.59-.01c-.205 0-.538.077-.82.385-.283.308-1.077 1.052-1.077 2.566s1.103 2.977 1.257 3.182c.154.205 2.17 3.313 5.258 4.644.735.317 1.308.506 1.755.648.737.234 1.409.201 1.94.122.591-.088 1.82-.744 2.077-1.462.257-.718.257-1.333.18-1.462-.077-.128-.283-.205-.59-.359z" fill="#25D366"/>
        </svg>
        Hubungi Kami
      </a>

    </div>
  );
};

export default LumiereShowcase;