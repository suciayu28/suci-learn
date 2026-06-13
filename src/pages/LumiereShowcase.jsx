import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiStar, FiPercent, FiBox, FiArrowRight,
  FiHeart, FiTag, FiSend, FiShoppingBag, FiChevronUp, FiX, FiClock,
  FiUser, FiGrid, FiHome, FiSettings, FiLogOut, FiMapPin, FiGift, FiShield,
  FiTruck, FiCheckCircle, FiChevronRight, FiPackage, FiHelpCircle, FiCreditCard, FiRefreshCw, FiPhone, FiMail
} from "react-icons/fi";

// IMPORT KOMPONEN ASLI
import LumiereButton from "../components/basic/LumiereButton";
import LumiereBadge from "../components/basic/LumiereBadge";
import LumiereAvatar from "../components/basic/LumiereAvatar";
import LumiereIcon from "../components/basic/LumiereIcon";
import LumiereInput from "../components/form/LumiereInput";
import AtelierProductCard from "../components/data-display/AtelierProductCard";
import HeroBanner from "../components/section/HeroBanner";
import ContentSection from "../components/section/ContentSection";
import Footer from "../components/layout/Footer"; 
import { getCRMData } from "../lib/crmData";

const LumiereShowcase = () => {
  const navigate = useNavigate();
  
  // --- STATE ASLI ---
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State navigasi internal dashboard
  const [currentDashboardTab, setCurrentDashboardTab] = useState("katalog"); 

  // --- REFS UNTUK AUTO-SCROLL INTERAKTIF ---
  const homeRef = useRef(null);
  const katalogRef = useRef(null);
  const lacakRef = useRef(null);
  const footerRef = useRef(null);
  const emailInputRef = useRef(null);

  // Fungsi handler untuk smooth scroll antar bagian halaman dashboard
  const handleScrollToSection = (elementRef, tabName = null) => {
    if (tabName) {
      setCurrentDashboardTab(tabName);
      if (tabName === "pesanan") {
        setIsHistoryOpen(true);
        setSelectedOrder(null);
      } else {
        setIsHistoryOpen(false);
      }
    }
    
    setTimeout(() => {
      elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Mock Data Riwayat Transaksi Guest
  const orderHistoryData = [
    { id: "LM-88429910X", date: "07 Juni 2026", total: "Rp 1.450.000", items: "2 Items (Lumiere Serum, Lip Tint)", status: "Dalam Pengiriman", step: 3 },
    { id: "LM-77312544A", date: "28 Mei 2026", total: "Rp 680.000", items: "1 Item (Atelier Fragrance)", status: "Selesai", step: 4 }
  ];

  useEffect(() => {
    if (subscribed && emailInputRef.current) {
      emailInputRef.current.blur();
      setEmail("");
    }
  }, [subscribed]);

  useEffect(() => {
    const db = getCRMData();
    setProducts(db.products || []);
  }, []);

  const categories = ["Semua", "Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"];

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "Semua") result = products.filter(p => p.tag === activeCategory);
    return showAll ? result : result.slice(0, 4);
  }, [products, activeCategory, showAll]);

  const handleAddToBag = (product) => {
    setCartItems(prev => [...prev, { ...product, cartId: Date.now() }]);
    setAlertMsg(`${product.title} ditambahkan!`);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  return (
    <div ref={homeRef} className="bg-[#F5F5F2] min-h-screen font-sans text-slate-800 antialiased pt-24 w-full overflow-x-hidden">
      
      {/* ================= HEADER / TOPBAR NAVIGATION ================= */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/40 px-6 md:px-12 flex justify-between items-center z-50 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-[#4F5C18] text-white flex items-center justify-center font-serif italic font-bold text-lg rounded-xl shadow-sm">
            L
          </div>
          <div className="text-left">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Lumière Atelier</h1>
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase block mt-0.5">Customer Workspace</span>
          </div>
        </div>

        {/* Menu Navigasi Tengah */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
          <button 
            onClick={() => handleScrollToSection(homeRef, "katalog")} 
            className={`hover:text-[#4F5C18] transition-colors cursor-pointer bg-transparent border-none p-0 font-bold uppercase tracking-wider ${currentDashboardTab === 'katalog' ? 'text-[#4F5C18]' : 'text-slate-500'}`}
          >
            Katalog Produk
          </button>
          <button 
            onClick={() => handleScrollToSection(lacakRef, "pesanan")} 
            className={`hover:text-[#4F5C18] transition-colors cursor-pointer bg-transparent border-none p-0 font-bold uppercase tracking-wider ${currentDashboardTab === 'pesanan' ? 'text-[#4F5C18]' : 'text-slate-500'}`}
          >
            Lacak Paket
          </button>
          <button 
            onClick={() => handleScrollToSection(footerRef)} 
            className="hover:text-[#4F5C18] transition-colors cursor-pointer bg-transparent border-none p-0 font-bold uppercase tracking-wider text-slate-500"
          >
            Kontak Kami
          </button>
        </div>

        {/* Akses Cepat Keranjang & Admin */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setIsBagOpen(!isBagOpen)}
            className="relative px-4 py-2 bg-white border border-slate-200/80 rounded-xl cursor-pointer hover:border-slate-400 flex items-center gap-2 group"
          >
            <FiShoppingBag size={14} className="text-slate-700" />
            <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Bag ({cartItems.length})</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>

          <button 
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-slate-950 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-[#4F5C18] transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiLogOut size={12} /> Admin
          </button>
        </div>
      </nav>

      {/* ================= DASHBOARD MAIN WRAPPER ================= */}
      {/* DINAMIS GRID: Jika tab katalog aktif, gunakan lebar penuh grid-cols-1 tanpa membagi space untuk sidebar */}
      <div className={`w-full px-6 md:px-12 py-6 grid gap-8 items-start ${
        currentDashboardTab === "katalog" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"
      }`}>
        
        {/* SIDEBAR LEFT PANEL - Hanya muncul jika tab BUKAN katalog */}
        {currentDashboardTab !== "katalog" && (
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-28 text-left w-full">
            <div className="bg-white border border-slate-200/60 p-2 rounded-2xl shadow-2xs">
              <button 
                onClick={() => { setCurrentDashboardTab("katalog"); setIsHistoryOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  currentDashboardTab === 'katalog' ? 'bg-[#4F5C18] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3"><FiGrid size={13} /> Belanja Katalog</span>
                <FiChevronRight size={12} />
              </button>
              
              <button 
                onClick={() => { setCurrentDashboardTab("pesanan"); setIsHistoryOpen(true); setSelectedOrder(null); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 mt-1 cursor-pointer ${
                  currentDashboardTab === 'pesanan' ? 'bg-[#4F5C18] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3"><FiTruck size={13} /> Lacak Pengiriman</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${currentDashboardTab === 'pesanan' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {orderHistoryData.length}
                </span>
              </button>
            </div>

            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 font-bold text-md shadow-inner">
                  <FiUser size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Sesi Pembeli Tamu</h3>
                  <span className="text-[9px] text-[#4F5C18] font-extrabold tracking-wider uppercase mt-1 inline-block bg-[#4F5C18]/10 px-2 py-0.5 rounded-md">
                    Active Guest
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
                ID Sesi Anda disimpan di lokal browser ini untuk kenyamanan pelacakan instan tanpa registrasi.
              </div>
            </div>
          </aside>
        )}

        {/* MAIN PANEL CONTAINER */}
        {/* DINAMIS COL-SPAN: Mengambil seluruh kolom jika tab katalog aktif */}
        <main className={`space-y-6 w-full ${currentDashboardTab === "katalog" ? "col-span-1" : "lg:col-span-9"}`}>
          
          {/* TAB 1: VIEW KATALOG UTAMA (SEKARANG FULL WIDTH) */}
          {currentDashboardTab === "katalog" && (
            <div className="space-y-6 animate-in fade-in duration-300 w-full">
              <div className="bg-white border border-slate-200/50 p-6 md:p-10 rounded-3xl text-left shadow-2xs relative overflow-hidden w-full">
                <HeroBanner
                  title="Keindahan Autentik Tanpa Batas"
                  description="Jelajahi koleksi mahakarya produk kecantikan dengan standar lab premium dari bahan organik pilihan."
                />
              </div>

              {/* Kategori Filter Tab */}
              <div ref={katalogRef} className="scroll-mt-24 bg-white border border-slate-200/60 p-2 rounded-2xl flex flex-wrap gap-1 shadow-2xs w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                    className={`px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      activeCategory === cat ? 'bg-slate-950 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid Produk - Diubah menjadi 3 Kolom di layar besar karena sudah full width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredProducts.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200/40 p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all text-left relative">
                    <div className="absolute top-6 left-6 z-10 bg-white/95 text-[8px] font-bold text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded-md border border-slate-100">
                      {item.tag}
                    </div>
                    <div className="rounded-xl overflow-hidden bg-slate-50/50 w-full">
                      <AtelierProductCard {...item} />
                    </div>
                    <button 
                      onClick={() => handleAddToBag(item)}
                      className="w-full mt-4 bg-slate-50 hover:bg-[#4F5C18] text-slate-800 hover:text-white text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200/60 shadow-2xs cursor-pointer"
                    >
                      <FiShoppingBag size={12} /> Add to Workspace Bag
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-10 py-3 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all shadow-2xs cursor-pointer hover:bg-slate-50"
                >
                  {showAll ? "Tampilkan Sedikit Koleksi" : "Buka Seluruh Koleksi Atelier"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SEKSI LACAK LOGISTIK */}
          {currentDashboardTab === "pesanan" && (
            <div ref={lacakRef} className="scroll-mt-24 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xs animate-in fade-in duration-300 w-full">
              {!selectedOrder ? (
                <>
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-md font-bold text-slate-900 uppercase tracking-tight">Pelacakan Pesanan Real-time</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {orderHistoryData.map((order) => (
                      <div key={order.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{order.id}</span>
                            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${order.step === 4 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              • {order.status}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 mt-1">{order.items}</p>
                          <p className="text-xs text-slate-400">{order.date} • Total: <span className="font-semibold text-slate-800">{order.total}</span></p>
                        </div>
                        <button
                          onClick={() => { setSelectedOrder(order); setIsHistoryOpen(true); }}
                          className="px-4 py-2.5 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#4F5C18] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FiTruck size={12} /> Live Tracking
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6 w-full">
                  <button onClick={() => setSelectedOrder(null)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0">
                    ← Kembali ke Daftar Pembelian
                  </button>
                  <div className="border border-slate-100 p-6 bg-white rounded-2xl relative flex justify-between items-center overflow-x-auto w-full">
                    <div className="absolute left-10 right-10 top-10 h-0.5 bg-slate-100 -z-0"></div>
                    {["Diterima Hub", "Lolos QC Lab", "Dalam Perjalanan", "Selesai Diterima"].map((label, idx) => {
                      const currentStep = idx + 1;
                      const isPast = selectedOrder.step >= currentStep;
                      return (
                        <div key={label} className="flex flex-col items-center relative z-10 bg-white px-3 min-w-[90px]">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${isPast ? 'bg-[#4F5C18] text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {selectedOrder.step > currentStep ? <FiCheckCircle size={14} /> : `0${currentStep}`}
                          </div>
                          <span className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-wide text-center">{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* SHOPPING BAG DRAWER OVERLAY */}
      {isBagOpen && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col justify-between shadow-2xl text-left animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2"><FiShoppingBag /> Bag Items</h3>
                <button onClick={() => setIsBagOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 cursor-pointer"><FiX size={16} /></button>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[65vh]">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-slate-800">{item.title}</span>
                    <button onClick={() => setCartItems(prev => prev.filter(i => i.cartId !== item.cartId))} className="text-slate-300 hover:text-rose-500 cursor-pointer"><FiX size={13} /></button>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { setIsBagOpen(false); setCurrentDashboardTab("pesanan"); }} className="w-full py-3.5 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl cursor-pointer">Periksa Pengiriman</button>
          </div>
        </div>
      )}

      {/* RICH DARK PREMIUM FOOTER */}
      <footer ref={footerRef} className="w-full bg-[#030712] text-left text-slate-400 pt-16 pb-12 mt-28 border-t border-slate-900 scroll-mt-24 relative px-6 md:px-12">
        <div className="absolute -top-5 right-12">
          <button 
            onClick={() => homeRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 rounded-full flex items-center justify-center hover:border-slate-600 hover:text-white transition-all shadow-md cursor-pointer"
            title="Kembali ke Atas"
          >
            <FiChevronUp size={18} />
          </button>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/60">
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4F5C18] text-white flex items-center justify-center font-serif italic font-bold text-sm rounded-lg">
                L
              </div>
              <span className="text-white font-bold tracking-wide text-md uppercase">Lumière Atelier</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Sistem Manajemen Hub Hubungan Pelanggan (CRM) & Katalog Interaktif Eksklusif untuk penelusuran produk estetika organik berstandar internasional.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button onClick={() => handleScrollToSection(homeRef, "katalog")} className="hover:text-[#A3E635] text-left transition-colors cursor-pointer bg-transparent border-none p-0 text-slate-400 font-semibold uppercase tracking-wider">
                  Katalog Utama
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection(lacakRef, "pesanan")} className="hover:text-[#A3E635] text-left transition-colors cursor-pointer bg-transparent border-none p-0 text-slate-400 font-semibold uppercase tracking-wider">
                  Lacak Paket
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Kontak Kami</h4>
            <div className="text-xs space-y-2 leading-relaxed">
              <p className="font-semibold text-slate-300">Lumière Global Laboratories</p>
              <p className="text-slate-500">Jl. Aesthetic Boulevard No. 88, Menteng, Jakarta Pusat</p>
              <p className="text-[#A3E635] font-bold pt-1">support@lumiereatelier.com</p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Jaminan Mutu</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="text-slate-300">✓ Teruji Klinis Derma-Lab</li>
              <li>✓ Terdaftar BPOM RI & Halal</li>
              <li>✓ Enkripsi Data Kuki Lokal Aman</li>
            </ul>
          </div>
        </div>

        <div className="w-full pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Lumière Atelier CRM System. All rights reserved.
          </div>
        </div>
      </footer>

      {/* FLOATING popup TOAST ALERT */}
      {alertMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl animate-in fade-in duration-200">
          {alertMsg}
        </div>
      )}
    </div>
  );
};

export default LumiereShowcase;