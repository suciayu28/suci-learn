import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  FiStar, FiTag, FiShoppingBag, FiX, FiArrowRight,
  FiUser, FiPhone, FiMail
} from "react-icons/fi";

// IMPORT KOMPONEN ASLI PROYEK ANDA
import HeroBanner from "../components/section/HeroBanner";
import AtelierProductCard from "../components/data-display/AtelierProductCard";
import Footer from "../components/layout/Footer"; 
import { getCRMData } from "../lib/crmData";

const LumiereShowcase = () => {
  const navigate = useNavigate();
  
  // --- STATE DATA UNTUK DISPLAY ---
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // --- REFS SEKSI UNTUK NAVIGASI ---
  const homeRef = useRef(null);
  const shopRef = useRef(null);
  const aboutRef = useRef(null);
  const bestSellerRef = useRef(null);
  const promoRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (elementRef) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // --- AMBIL DATA DARI CRM DATA ASLI ---
  useEffect(() => {
    const db = getCRMData();
    setProducts(db.products || []);
  }, []);

  // --- FILTER DATA UNTUK SEKSI KHUSUS ---
  const categories = ["Semua", "Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"];

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "Semua") result = products.filter(p => p.tag === activeCategory);
    return showAll ? result : result.slice(0, 4);
  }, [products, activeCategory, showAll]);

  const bestSellers = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  const promoProducts = useMemo(() => {
    return products.slice(1, 3).map((p, idx) => ({
      ...p,
      discountTag: idx === 0 ? "30% OFF" : "Beli 1 Gratis 1",
      originalPrice: "Rp 350.000"
    }));
  }, [products]);

  const handleAddGuestCart = (product) => {
    setCartItems(prev => [...prev, { ...product, cartId: Date.now() }]);
    setAlertMsg(`${product.title} masuk ke Bag Tamu!`);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleRedirectToLogin = () => {
    setIsBagOpen(false);
    setAlertMsg("Mengalihkan ke halaman login member...");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div ref={homeRef} className="bg-[#FAF9F5] min-h-screen text-[#262626] font-sans antialiased flex flex-col justify-between pt-20 w-full overflow-x-hidden">
      
      {/* ================= NAVIGATION BAR ================= */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-[#F3F3F3] px-6 md:px-16 flex justify-between items-center z-50 transition-all">
        <div className="flex items-center cursor-pointer" onClick={() => scrollToSection(homeRef)}>
          <span className="font-serif italic font-black text-2xl tracking-tight text-[#262626]">lumière Cosmetics</span>
        </div>

        {/* Menu Tautan Tengah */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <button onClick={() => scrollToSection(homeRef)} className="bg-transparent border-none cursor-pointer text-[#4F5C18] hover:text-[#262626] transition-all duration-300">Home</button>
          <button onClick={() => scrollToSection(shopRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Shop</button>
          <button onClick={() => scrollToSection(aboutRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">About Us</button>
          <button onClick={() => scrollToSection(bestSellerRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Best Seller</button>
          <button onClick={() => scrollToSection(promoRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Promo</button>
          <button onClick={() => scrollToSection(contactRef)} className="bg-transparent border-none cursor-pointer hover:text-[#4F5C18] transition-all duration-300">Contact</button>
        </div>

        {/* Menu Sisi Kanan (Cart & Button) */}
        <div className="flex items-center gap-6">
          <div onClick={() => setIsBagOpen(!isBagOpen)} className="relative py-2 flex items-center gap-2 cursor-pointer text-slate-600 hover:text-[#4F5C18] transition-all duration-200">
            <FiShoppingBag size={16} className="transform -translate-y-[1px]" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Cart</span>
            {cartItems.length > 0 && (
              <span className="bg-[#4F5C18] w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center transition-all animate-scaleIn">{cartItems.length}</span>
            )}
          </div>

          <button onClick={() => navigate("/login")} className="px-5 py-2.5 bg-[#262626] text-white text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-[#4F5C18] transition-all duration-300 border-none flex items-center gap-2 shadow-xs cursor-pointer">
            <FiUser size={12} /> Member Area
          </button>
        </div>
      </nav>

      {/* ================= SEKSI 1: HOME (HERO) ================= */}
      <section className="px-6 md:px-16 py-16 md:py-28 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center text-left scroll-mt-20">
        
        {/* Sisi Kiri: Teks Utama */}
        <div className="lg:col-span-6 space-y-6 md:pr-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] block">Lumière Cosmetics Paris</span>
          <h1 className="text-4xl md:text-[54px] font-serif tracking-tight text-[#262626] leading-[1.15]">
            Kemewahan riasan <br /><span className="italic font-light text-[#4F5C18]">organik premium.</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md leading-relaxed">
            Formulasi kosmetik botani kelas dunia yang dirancang khusus untuk menonjolkan kecantikan autentik Anda tanpa merusak skin-barrier.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <button onClick={() => scrollToSection(shopRef)} className="px-6 py-3 bg-[#4F5C18] text-white text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-[#262626] transition-all duration-300 flex items-center gap-2 border-none cursor-pointer">
              Mulai Belanja <FiArrowRight />
            </button>
            <button onClick={() => navigate("/login")} className="px-6 py-3 bg-white border border-[#F3F3F3] text-[#262626] text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-[#F3F3F3] transition-all duration-300 cursor-pointer">
              Registrasi Member
            </button>
          </div>
        </div>
        
        {/* Sisi Kanan: Hero Banner (Dilebarkan & Sesuai Desain Baru) */}
        <div className="lg:col-span-6 bg-white border border-[#F3F3F3] p-5 rounded-2xl shadow-xs w-full flex justify-center">
          <div className="w-full">
            <HeroBanner title="Lumière Workspace" description="Masuk sebagai member resmi untuk menikmati akses pelacakan logistik real-time, poin loyalty, dan diskon hingga 50%." />
          </div>
        </div>

      </section>

      {/* ================= SEKSI 2: SHOP (KATALOG DAN FILTER PRESET) ================= */}
      <section ref={shopRef} className="px-6 md:px-16 py-20 max-w-7xl mx-auto w-full text-left scroll-mt-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F3F3F3] pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18]">Explore Collections</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#262626]">Katalog Riasan Lengkap</h2>
          </div>
          
          {/* Kategori Filter */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => { setActiveCategory(cat); setShowAll(false); }} 
                className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer border-none ${activeCategory === cat ? 'bg-[#4F5C18] text-white' : 'bg-transparent text-slate-400 hover:text-[#262626]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Katalog Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <div key={item.id} className="bg-white border border-[#F3F3F3] p-4 rounded-xl flex flex-col justify-between hover:border-[#4F5C18] hover:shadow-xs transition-all duration-300">
              <div className="bg-[#F3F3F3]/50 rounded-lg overflow-hidden mb-4 relative">
                <span className="absolute top-2 left-2 bg-white text-[8px] font-bold text-[#4F5C18] px-2 py-0.5 rounded border border-[#F3F3F3] z-10 uppercase tracking-wider">{item.tag}</span>
                <AtelierProductCard {...item} />
              </div>
              <button onClick={() => handleAddGuestCart(item)} className="w-full bg-[#F3F3F3] hover:bg-[#4F5C18] text-[#262626] hover:text-white text-[10px] font-bold tracking-widest uppercase py-2.5 rounded-sm transition-all duration-300 border border-transparent cursor-pointer">
                + Add To Bag
              </button>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button onClick={() => setShowAll(!showAll)} className="px-6 py-3 bg-white border border-[#F3F3F3] text-[#262626] text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-[#F3F3F3] hover:text-[#4F5C18] transition-all duration-300 cursor-pointer">
            {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua Produk"}
          </button>
        </div>
      </section>

      {/* ================= SEKSI 3: ABOUT US (MENGGUNAKAN UNGU & ABU-ABU LEMBUT) ================= */}
      <section ref={aboutRef} className="bg-[#F4F3FF] border-y border-[#F3F3F3] py-24 px-6 md:px-16 text-left w-full scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18]">Our Signature Story</span>
            <h2 className="text-3xl font-serif text-[#262626]">Mengapa Memilih Lumière?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3 bg-white p-6 rounded-xl border border-transparent hover:border-[#4F5C18] transition-all">
              <span className="text-[#4F5C18] font-mono text-xs block">// 01</span>
              <h3 className="font-serif text-lg text-[#262626]">Lab-Tested Pure</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Formulasi bersertifikasi internasional bebas merkuri, paraben, dan pewarna sintetis berbahaya.</p>
            </div>
            <div className="space-y-3 bg-white p-6 rounded-xl border border-transparent hover:border-[#4F5C18] transition-all">
              <span className="text-[#4F5C18] font-mono text-xs block">// 02</span>
              <h3 className="font-serif text-lg text-[#262626]">Non-Comedogenic</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Sangat ringan di wajah, tidak menyumbat pori-pori, dan aman digunakan untuk kulit rentan berjerawat.</p>
            </div>
            <div className="space-y-3 bg-white p-6 rounded-xl border border-transparent hover:border-[#4F5C18] transition-all">
              <span className="text-[#4F5C18] font-mono text-xs block">// 03</span>
              <h3 className="font-serif text-lg text-[#262626]">Sustainable Beauty</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Seluruh wadah produk dapat didaur ulang demi menjaga kelestarian lingkungan bumi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SEKSI 4: BEST SELLER ================= */}
      <section ref={bestSellerRef} className="px-6 md:px-16 py-20 max-w-7xl mx-auto w-full text-left scroll-mt-20 space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18]">Most Loved By Community</span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#262626]">Produk Terlaris Minggu Ini</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((item) => (
            <div key={item.id} className="bg-white border border-[#F3F3F3] p-5 rounded-xl flex items-center gap-5 hover:border-[#4F5C18] transition-all duration-300">
              <div className="w-20 h-20 bg-[#F3F3F3] rounded-lg overflow-hidden shrink-0">
                <AtelierProductCard {...item} />
              </div>
              <div className="space-y-1.5">
                <div className="flex text-[#4F5C18] gap-0.5">
                  <FiStar size={10} fill="#4F5C18" /><FiStar size={10} fill="#4F5C18" /><FiStar size={10} fill="#4F5C18" /><FiStar size={10} fill="#4F5C18" /><FiStar size={10} fill="#4F5C18" />
                </div>
                <h4 className="text-xs font-bold text-[#262626] line-clamp-1">{item.title}</h4>
                <p className="text-xs font-black text-slate-600">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SEKSI 5: PROMO ================= */}
      <section ref={promoRef} className="bg-[#F3F3F3]/60 border-y border-[#F3F3F3] py-20 px-6 md:px-16 w-full text-left scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-2 text-[#262626]">
            <FiTag size={16} className="text-[#4F5C18]" />
            <h3 className="text-xs font-black uppercase tracking-widest">Penawaran Spesial Terbatas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promoProducts.map((p, idx) => (
              <div key={idx} className="bg-white border border-[#F3F3F3] p-5 rounded-xl flex gap-5 items-center relative hover:border-[#4F5C18] transition-all duration-300">
                <span className="absolute top-4 right-4 bg-[#4F5C18] text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-sm tracking-wider">
                  {p.discountTag}
                </span>
                <div className="w-16 h-16 bg-[#F3F3F3] rounded-lg overflow-hidden shrink-0">
                  <AtelierProductCard {...p} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">{p.tag}</span>
                  <h4 className="text-xs font-bold text-[#262626]">{p.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-[#262626]">{p.price}</span>
                    <span className="text-[10px] text-slate-300 line-through font-medium">{p.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SEKSI 6: CONTACT ================= */}
      <section ref={contactRef} className="bg-[#262626] text-white py-20 px-6 md:px-16 w-full text-left scroll-mt-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Hubungi Advisor Kami</span>
            <h2 className="text-3xl font-serif text-white leading-snug">Butuh bantuan konsultasi warna foundation?</h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Beauty Advisor handal kami aktif melayani konsultasi pemilihan item kosmetik terbaik yang paling serasi dengan tone kulit Anda.
            </p>
            <div className="pt-4 space-y-2.5 text-xs text-slate-300 font-mono">
              <p className="flex items-center gap-2.5"><FiPhone className="text-[#4F5C18]" /> +62 812-9988-7766</p>
              <p className="flex items-center gap-2.5"><FiMail className="text-[#4F5C18]" /> hello@lumiereCosmetics.com</p>
            </div>
          </div>
          <div className="bg-[#333333] p-8 rounded-xl border border-transparent flex flex-col justify-center text-center space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Siap Melakukan Transaksi Resmi?</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">Silakan masuk ke akun member Anda untuk melakukan checkout instan dan memantau kurir logistik.</p>
            <div className="pt-2">
              <button onClick={() => navigate("/login")} className="px-6 py-3 bg-[#4F5C18] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-white hover:text-[#262626] transition-all duration-300 border-none cursor-pointer">Login Akun Member</button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYSTEM ALERTS ================= */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 bg-[#262626] border border-[#4F5C18] text-white px-5 py-3.5 rounded-lg flex items-center gap-2 z-50 shadow-xl text-xs font-bold uppercase tracking-wider transition-all">
          <span className="text-[#4F5C18]">✓</span> {alertMsg}
        </div>
      )}

      {/* ================= CART SLIDEOVER PANEL ================= */}
      {isBagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xs" onClick={() => setIsBagOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 text-left z-10">
            <div className="space-y-6 overflow-y-auto pr-1 flex-1">
              <div className="flex items-center justify-between border-b border-[#F3F3F3] pb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#262626]">Guest Shopping Bag</h3>
                <button onClick={() => setIsBagOpen(false)} className="p-1 text-slate-400 hover:text-[#262626] border-none bg-transparent cursor-pointer"><FiX size={16} /></button>
              </div>

              {cartItems.length === 0 ? (
                <p className="text-center text-xs font-bold text-slate-300 py-12 uppercase tracking-widest">Bag Masih Kosong</p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="bg-[#F3F3F3] p-3 rounded-lg flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#262626] line-clamp-1">{item.title}</h4>
                        <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{item.price}</span>
                      </div>
                      <button onClick={() => setCartItems(prev => prev.filter(i => i.cartId !== item.cartId))} className="p-1 text-slate-300 hover:text-rose-600 bg-transparent border-none cursor-pointer"><FiX size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-[#F3F3F3] pt-4 space-y-3">
                <div className="bg-[#F4F3FF] p-3 rounded-lg border border-transparent text-[11px] text-[#262626] leading-normal font-medium">
                  Anda berada dalam mode tamu. Silakan masuk akun terlebih dahulu untuk memproses pembuatan invoice pesanan resmi.
                </div>
                <button onClick={handleRedirectToLogin} className="w-full bg-[#4F5C18] text-white font-bold py-3.5 rounded-sm text-[10px] tracking-widest uppercase hover:bg-[#262626] transition-all duration-300 border-none cursor-pointer">Login & Lanjut Checkout</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <div className="w-full"><Footer /></div>

    </div>
  );
};

export default LumiereShowcase;