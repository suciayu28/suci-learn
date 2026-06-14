import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiStar, FiPercent, FiBox, FiArrowRight,
  FiHeart, FiTag, FiSend, FiShoppingBag, FiChevronUp, FiX, FiClock,
  FiUser, FiGrid, FiHome, FiSettings, FiLogOut, FiMapPin, FiGift, FiShield,
  FiTruck, FiCheckCircle, FiChevronRight, FiPackage, FiHelpCircle, FiCreditCard, FiRefreshCw, FiPhone, FiMail, FiArrowLeft, FiLock, FiMessageSquare
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
import { getCRMData } from "../lib/crmData";

// =========================================================================
// CUSTOM FOOTER LOCAL COMPONENT (DISESUAIKAN DENGAN GAMBAR DESAIN)
// =========================================================================
const CustomFooter = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-900 text-left w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Kolom 1: Brand/Logo */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4F5C18] text-white flex items-center justify-center font-serif italic font-bold text-base rounded-lg">L</div>
            <h3 className="text-sm font-black tracking-wider uppercase text-white">Lumière Atelier</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Menghadirkan harmoni kecantikan autentik lewat riset laboratorium kosmetik organik premium terpercaya.
          </p>
        </div>

        {/* Kolom 2: Hubungi Kami */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Hubungi Kami</h4>
          <ul className="space-y-2 p-0 list-none text-[11px]">
            <li className="flex items-center gap-2"><FiMapPin size={12} className="text-[#4F5C18]" /> Jl. Diponegoro No. 12, Bandung</li>
            <li className="flex items-center gap-2"><FiPhone size={12} className="text-[#4F5C18]" /> +62 812-3456-789</li>
            <li className="flex items-center gap-2"><FiMail size={12} className="text-[#4F5C18]" /> support@lumiere.com</li>
          </ul>
        </div>

        {/* Kolom 3: Tautan Cepat */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Tautan Cepat</h4>
          <ul className="space-y-2 p-0 list-none text-[11px]">
            <li><a href="#katalog" className="text-slate-400 hover:text-[#4F5C18] no-underline transition-colors">Katalog Utama</a></li>
            <li><a href="#lacak" className="text-slate-400 hover:text-[#4F5C18] no-underline transition-colors">Lacak Pengiriman</a></li>
            <li><a href="#kebijakan" className="text-slate-400 hover:text-[#4F5C18] no-underline transition-colors">Kebijakan Privasi</a></li>
          </ul>
        </div>

        {/* Kolom 4: Jam Operasional */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Jam Operasional</h4>
          <ul className="space-y-2 p-0 list-none text-[11px] text-slate-500">
            <li>Senin - Jumat: <span className="text-slate-400 font-medium">09.00 - 21.00 WIB</span></li>
            <li>Sabtu - Minggu: <span className="text-slate-400 font-medium">10.00 - 17.00 WIB</span></li>
          </ul>
        </div>

      </div>

      {/* Garis Pembatas Bawah & Hak Cipta */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 pt-6 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-medium uppercase tracking-wider">
        <p>© 2026 Lumière Atelier Workspace. Hak Cipta Dilindungi.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Terms</span>
          <span className="hover:text-slate-400 cursor-pointer">Privacy</span>
          <span className="hover:text-slate-400 cursor-pointer">Cookies</span>
        </div>
      </div>
    </footer>
  );
};

const LumiereShowcase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- STATE AUTHENTICATION ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // --- STATE DATA UTAMA ---
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentDashboardTab, setCurrentDashboardTab] = useState("katalog");
  // --- STATE UNTUK FORM FEEDBACK GUEST ---
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // --- DATA FEEDBACK YANG AKAN DIKIRIM KE ADMIN ---
  const [dynamicFeedbacks, setDynamicFeedbacks] = useState([
    { id: 1, name: "Risa Amelia", rating: 5, comment: "Serumnya cepat meresap, suka banget!", date: "12 Juni 2026" }
  ]);
  // --- STATE DYNAMIC CHECKOUT & ORDER HISTORY ---
  const [dynamicOrders, setDynamicOrders] = useState([
    { id: "LM-88429910X", date: "07 Juni 2026", total: "Rp 1.450.000", items: "2 Items (Lumiere Serum, Lip Tint)", status: "Dalam Pengiriman", step: 3, nama: "Risa Amelia", hp: "08123456789", alamat: "Jl. Diponegoro No. 12, Bandung", kurir: "J&T Express", payment: "Transfer Bank" },
    { id: "LM-77312544A", date: "28 Mei 2026", total: "Rp 680.000", items: "1 Item (Atelier Fragrance)", status: "Selesai", step: 4, nama: "Risa Amelia", hp: "08123456789", alamat: "Jl. Diponegoro No. 12, Bandung", kurir: "Sicepat Best", payment: "E-Wallet" }
  ]);
  // --- STATE FORM CHECKOUT ---
  const [checkoutForm, setCheckoutForm] = useState({
    nama: "",
    hp: "",
    alamat: "",
    kurir: "J&T Express (Rp 15.000)",
    payment: "Transfer Bank"
  });
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // --- REFS UNTUK AUTO-SCROLL INTERAKTIF ---
  const homeRef = useRef(null);
  const katalogRef = useRef(null);
  const lacakRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (location.state?.authSuccess) {
      setIsLoggedIn(true);
      setAlertMsg("Login Berhasil! Selamat datang di Workspace.");
      setTimeout(() => setAlertMsg(""), 4000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleScrollToSection = (elementRef, tabName = null) => {
    if (tabName) {
      setCurrentDashboardTab(tabName);
      if (tabName !== "pesanan") {
        setSelectedOrder(null);
      }
    }
    setTimeout(() => {
      elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  useEffect(() => {
    const db = getCRMData();
    const enrichedProducts = (db.products || []).map((p, idx) => {
      if (idx === 0) return { ...p, isPromo: true, discountTag: "30% OFF", originalPrice: "Rp 450.000", price: "Rp 315.000" };
      if (idx === 2) return { ...p, isPromo: true, discountTag: "Beli 1 Gratis 1", originalPrice: "Rp 280.000", price: "Rp 280.000" };
      return { ...p, isPromo: false };
    });
    setProducts(enrichedProducts);
  }, []);

  const promoProducts = useMemo(() => {
    return products.filter(p => p.isPromo === true);
  }, [products]);

  const categories = ["Semua", "Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"];

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "Semua") result = products.filter(p => p.tag === activeCategory);
    return showAll ? result : result.slice(0, 4);
  }, [products, activeCategory, showAll]);

  const handleAddToBag = (product) => {
    const numericPrice = typeof product.price === 'number' 
      ? product.price 
      : parseInt(String(product.price).replace(/[^0-9]/g, "")) || 0;
    setCartItems(prev => [...prev, { ...product, numericPrice, cartId: Date.now() }]);
    setAlertMsg(`${product.title} ditambahkan!`);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.numericPrice || 0), 0);
  }, [cartItems]);

  const deliveryCost = useMemo(() => {
    if (checkoutForm.kurir.includes("JNE")) return 18000;
    if (checkoutForm.kurir.includes("Sicepat")) return 25000;
    return 15000;
  }, [checkoutForm.kurir]);

  const handleGoToCheckoutPage = () => {
    if (!isLoggedIn) {
      setIsBagOpen(false);
      setAlertMsg("Akses Ditolak! Anda harus login terlebih dahulu.");
      setTimeout(() => {
        setAlertMsg("");
        navigate("/login"); 
      }, 2000);
      return;
    }
    setIsBagOpen(false);
    setCurrentDashboardTab("checkout");
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setAlertMsg("Sesi kedaluwarsa. Silakan login kembali.");
      return;
    }

    const itemNames = cartItems.map(i => i.title).join(", ");
    const totalItemsCount = cartItems.length;
    const randomInvoice = `LM-${Math.floor(10000000 + Math.random() * 90000000)}X`;
    const grandTotal = cartTotal + deliveryCost;
    const newOrder = {
      id: randomInvoice,
      date: "Hari Ini, 14 Juni 2026",
      total: `Rp ${grandTotal.toLocaleString("id-ID")}`,
      items: `${totalItemsCount} Item (${itemNames})`, 
      status: "Diterima Hub",
      step: 1,
      nama: checkoutForm.nama,
      hp: checkoutForm.hp,
      alamat: checkoutForm.alamat,
      kurir: checkoutForm.kurir,
      payment: checkoutForm.payment,
      breakdownItems: [...cartItems],
      subtotal: cartTotal,
      ongkir: deliveryCost
    };

    setDynamicOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setCartItems([]);
    setFeedbackSubmitted(false);
    setCommentInput("");
    setCurrentDashboardTab("detail-transaksi");
    setAlertMsg("Pesanan Sukses Dibuat!");
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) {
      setAlertMsg("Mohon tulis komentar ulasan Anda!");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      name: lastPlacedOrder?.nama || "Guest User",
      rating: Number(ratingInput),
      comment: commentInput,
      date: "Hari Ini, 14 Juni 2026"
    };
    setDynamicFeedbacks(prev => [newFeedback, ...prev]);
    setFeedbackSubmitted(true);
    setAlertMsg("Terima kasih! Ulasan dikirim ke sistem admin.");
    setTimeout(() => setAlertMsg(""), 3000);
  };

  return (
    <div ref={homeRef} className="bg-[#F5F5F2] min-h-screen font-sans text-slate-800 antialiased pt-24 w-full overflow-x-hidden">
      
      {/* ================= HEADER NAVIGATION ================= */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/40 px-6 md:px-12 flex justify-between items-center z-50 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-[#4F5C18] text-white flex items-center justify-center font-serif italic font-bold text-lg rounded-xl shadow-sm">L</div>
          <div className="text-left">
            <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Lumière Atelier</h1>
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase block mt-0.5">
              {isLoggedIn ? "Member Workspace" : "Guest Workspace"}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
          <button onClick={() => handleScrollToSection(homeRef, "katalog")} className={`hover:text-[#4F5C18] bg-transparent border-none p-0 font-bold uppercase tracking-wider cursor-pointer ${currentDashboardTab === 'katalog' ? 'text-[#4F5C18]' : 'text-slate-500'}`}>Katalog Produk</button>
          <button onClick={() => handleScrollToSection(lacakRef, "pesanan")} className={`hover:text-[#4F5C18] bg-transparent border-none p-0 font-bold uppercase tracking-wider cursor-pointer ${currentDashboardTab === 'pesanan' || currentDashboardTab === 'detail-transaksi' ? 'text-[#4F5C18]' : 'text-slate-500'}`}>Lacak Paket</button>
          <button onClick={() => handleScrollToSection(footerRef)} className="hover:text-[#4F5C18] bg-transparent border-none p-0 font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Kontak Kami</button>
        </div>

        <div className="flex items-center gap-3">
          <div onClick={() => setIsBagOpen(!isBagOpen)} className="relative px-4 py-2 bg-white border border-slate-200/80 rounded-xl cursor-pointer hover:border-slate-400 flex items-center gap-2 group">
            <FiShoppingBag size={14} className="text-slate-700" />
            <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Bag ({cartItems.length})</span>
            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center">{cartItems.length}</span>}
          </div>

          {isLoggedIn ? (
            <button onClick={() => { setIsLoggedIn(false); setCurrentDashboardTab("katalog"); }} className="px-4 py-2 bg-rose-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-rose-700 transition-all flex items-center gap-2 cursor-pointer border-none"><FiLogOut size={12} /> LOGOUT</button>
          ) : (
            <button onClick={() => navigate("/login")} className="px-4 py-2 bg-slate-950 text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-[#4F5C18] transition-all flex items-center gap-2 cursor-pointer border-none"><FiUser size={12} /> LOGIN</button>
          )}
        </div>
      </nav>

      {/* ================= DASHBOARD MAIN WRAPPER ================= */}
      <div className={`w-full px-6 md:px-12 py-6 grid gap-8 items-start ${currentDashboardTab === "katalog" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
        
        {/* SIDEBAR LEFT PANEL */}
        {currentDashboardTab !== "katalog" && (
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-28 text-left w-full">
            <div className="bg-white border border-slate-200/60 p-2 rounded-2xl shadow-2xs">
              <button onClick={() => { setCurrentDashboardTab("katalog"); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${currentDashboardTab === 'katalog' ? 'bg-[#4F5C18] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <span className="flex items-center gap-3"><FiGrid size={13} /> Belanja Katalog</span>
                <FiChevronRight size={12} />
              </button>
              <button onClick={() => { setCurrentDashboardTab("pesanan"); setSelectedOrder(null); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 mt-1 cursor-pointer ${currentDashboardTab === 'pesanan' || currentDashboardTab === 'detail-transaksi' ? 'bg-[#4F5C18] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                <span className="flex items-center gap-3"><FiTruck size={13} /> Lacak Pengiriman</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${currentDashboardTab === 'pesanan' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{dynamicOrders.length}</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 font-bold text-md shadow-inner"><FiUser size={16} /></div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">{isLoggedIn ? "Akun Terverifikasi" : "Sesi Pembeli Tamu"}</h3>
                  <span className={`text-[9px] font-extrabold tracking-wider uppercase mt-1 inline-block px-2 py-0.5 rounded-md ${isLoggedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-[#4F5C18]/10 text-[#4F5C18]'}`}>{isLoggedIn ? "Active Member" : "Guest Mode"}</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN PANEL CONTAINER */}
        <main className={`space-y-6 w-full ${currentDashboardTab === "katalog" ? "col-span-1" : "lg:col-span-9"}`}>
          
          {/* ================= TAB 1: VIEW KATALOG UTAMA ================= */}
          {currentDashboardTab === "katalog" && (
            <div className="space-y-8 animate-in fade-in duration-300 w-full">
              <div className="bg-white border border-slate-200/50 p-6 md:p-10 rounded-3xl text-left shadow-2xs relative overflow-hidden w-full">
                <HeroBanner title="Keindahan Autentik Tanpa Batas" description="Jelajahi koleksi mahakarya produk kecantikan dengan standar lab premium dari bahan organik pilihan." />
              </div>

              {/* SEKSI PRODUK PROMO SET ADMIN */}
              {promoProducts.length > 0 && (
                <div className="bg-gradient-to-br from-[#4F5C18]/10 to-transparent border border-[#4F5C18]/20 p-6 rounded-3xl text-left space-y-4">
                  <div className="flex items-center gap-2 text-[#4F5C18]">
                    <FiTag size={16} />
                    <h2 className="text-xs font-black uppercase tracking-widest">Special Laboratoire Offers (Promo Admin)</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {promoProducts.map((p) => (
                      <div key={p.id} className="bg-white border border-slate-200/50 p-4 rounded-2xl flex gap-4 items-center relative overflow-hidden">
                        <span className="absolute top-0 right-0 bg-rose-500 text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-bl-xl tracking-wider">
                          {p.discountTag || "PROMO"}
                        </span>
                        <div className="w-20 h-20 bg-slate-50 rounded-xl flex-shrink-0 overflow-hidden">
                          <AtelierProductCard {...p} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.tag}</span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs font-black text-rose-600">{p.price}</span>
                            <span className="text-[10px] text-slate-300 line-through font-medium">{p.originalPrice}</span>
                          </div>
                          <button onClick={() => handleAddToBag(p)} className="mt-2 px-3 py-1.5 bg-[#4F5C18] text-white text-[9px] font-bold uppercase tracking-wider rounded-lg border-none hover:bg-slate-950 transition-colors cursor-pointer">
                            Claim Deal
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div ref={katalogRef} className="scroll-mt-24 bg-white border border-slate-200/60 p-2 rounded-2xl flex flex-wrap gap-1 shadow-2xs w-full">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); setShowAll(false); }} className={`px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${activeCategory === cat ? 'bg-slate-950 text-white shadow-sm' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>{cat}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredProducts.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200/40 p-4 rounded-2xl flex flex-col justify-between hover:shadow-md transition-all text-left relative">
                    <div className="absolute top-6 left-6 z-10 bg-white/95 text-[8px] font-bold text-slate-600 uppercase tracking-widest px-2.5 py-1 rounded-md border border-slate-100">{item.tag}</div>
                    <div className="rounded-xl overflow-hidden bg-slate-50/50 w-full"><AtelierProductCard {...item} /></div>
                    <button onClick={() => handleAddToBag(item)} className="w-full mt-4 bg-slate-50 hover:bg-[#4F5C18] text-slate-800 hover:text-white text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200/60 shadow-2xs cursor-pointer"><FiShoppingBag size={12} /> Add to Workspace Bag</button>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <button onClick={() => setShowAll(!showAll)} className="px-10 py-3 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all shadow-2xs cursor-pointer hover:bg-slate-50">{showAll ? "Tampilkan Sedikit Koleksi" : "Buka Seluruh Koleksi Atelier"}</button>
              </div>
            </div>
          )}

          {/* ================= TAB 2: FORM CHECKOUT ================= */}
          {currentDashboardTab === "checkout" && isLoggedIn && (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xs animate-in fade-in duration-300 w-full">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <button onClick={() => setCurrentDashboardTab("katalog")} className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 border-none bg-transparent cursor-pointer"><FiArrowLeft size={16} /></button>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Form Alamat Pengiriman</h2>
              </div>

              <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Nama Penerima</label>
                    <input type="text" required placeholder="Ketik nama lengkap penerima paket..." value={checkoutForm.nama} onChange={(e) => setCheckoutForm({...checkoutForm, nama: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#4F5C18]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Nomor Handphone</label>
                    <input type="tel" required placeholder="Contoh: 0812XXXXXXXX" value={checkoutForm.hp} onChange={(e) => setCheckoutForm({...checkoutForm, hp: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#4F5C18]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Alamat Pengiriman Lengkap</label>
                    <textarea rows="3" required placeholder="Tulis nama jalan, Rt/Rw, Kecamatan, Kota, dan Provinsi tujuan..." value={checkoutForm.alamat} onChange={(e) => setCheckoutForm({...checkoutForm, alamat: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#4F5C18]"></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Pilihan Kurir</label>
                      <select value={checkoutForm.kurir} onChange={(e) => setCheckoutForm({...checkoutForm, kurir: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 focus:outline-none">
                        <option>J&T Express (Rp 15.000)</option>
                        <option>JNE Regular (Rp 18.000)</option>
                        <option>Sicepat Best (Rp 25.000)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Metode Pembayaran</label>
                      <select value={checkoutForm.payment} onChange={(e) => setCheckoutForm({...checkoutForm, payment: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 focus:outline-none">
                        <option>Transfer Bank</option>
                        <option>E-Wallet (OVO/Dana)</option>
                        <option>COD (Bayar di Tempat)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 h-fit space-y-4">
                  <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Ringkasan Biaya</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500"><span>Subtotal Belanja</span><span className="font-semibold text-slate-800">Rp {cartTotal.toLocaleString("id-ID")}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Ongkos Kirim Kurir</span><span className="font-semibold text-slate-800">Rp {deliveryCost.toLocaleString("id-ID")}</span></div>
                    <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between items-center text-sm font-bold text-slate-900"><span>Total Bayar</span><span className="text-[#4F5C18]">Rp {(cartTotal + deliveryCost).toLocaleString("id-ID")}</span></div>
                  </div>
                  <button type="submit" className="w-full bg-slate-950 text-white font-bold py-3.5 rounded-xl text-[10px] tracking-widest uppercase hover:bg-[#4F5C18] transition-all cursor-pointer shadow-xs border-none">Konfirmasi Transaksi</button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 3: INVOICE DETAIL & FEEDBACK FORM ================= */}
          {currentDashboardTab === "detail-transaksi" && lastPlacedOrder && (
            <div className="space-y-6 animate-in fade-in duration-300 w-full">
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Invoice Detail Transaksi</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">ID Order: <span className="font-mono font-bold text-slate-700">{lastPlacedOrder.id}</span></p>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-amber-700 px-3 py-1 rounded-md font-bold uppercase tracking-wider">{lastPlacedOrder.status}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Tujuan Pengiriman</h4>
                    <p className="font-bold text-slate-900">{lastPlacedOrder.nama} ({lastPlacedOrder.hp})</p>
                    <p className="text-slate-600 leading-relaxed">{lastPlacedOrder.alamat}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Sistem Logistik & Payment</h4>
                    <p className="text-slate-600">Kurir Pilihan: <strong className="text-slate-800">{lastPlacedOrder.kurir}</strong></p>
                    <p className="text-slate-600">Metode Pembayaran: <strong className="text-slate-800">{lastPlacedOrder.payment}</strong></p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daftar Produk Yang Dibeli</h3>
                  <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
                    {lastPlacedOrder.breakdownItems?.map((item, idx) => (
                      <div key={idx} className="p-3.5 flex justify-between items-center text-xs bg-white">
                        <span className="font-bold text-slate-800">{item.title} <strong className="text-slate-400 ml-1">x1</strong></span>
                        <span className="font-semibold text-slate-700">{item.price || `Rp ${item.numericPrice.toLocaleString("id-ID")}`}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setSelectedOrder(lastPlacedOrder); setCurrentDashboardTab("pesanan"); }} className="flex-1 py-3.5 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-xl hover:bg-[#4F5C18] transition-all cursor-pointer border-none">Pantau Lacak Pengiriman Kurir</button>
                  <button onClick={() => setCurrentDashboardTab("katalog")} className="px-6 py-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-widest text-center rounded-xl hover:bg-slate-100 transition-all cursor-pointer">Belanja Lagi</button>
                </div>
              </div>

              {/* SECTION INPUT RATING & FEEDBACK SYSTEM */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-2xs">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
                  <FiMessageSquare size={15} />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Atelier Experience (Rating & Feedback)</h3>
                </div>

                {!feedbackSubmitted ? (
                  <form onSubmit={handleSubmitFeedback} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Berikan Rating Bintang</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setRatingInput(star)} className="bg-transparent border-none p-0 cursor-pointer transition-transform hover:scale-110">
                            <FiStar size={20} fill={star <= ratingInput ? "#F59E0B" : "none"} className={star <= ratingInput ? "text-amber-500" : "text-slate-300"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Ulasan / Masukan Masuk ke Admin</label>
                      <textarea rows="3" required value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="Tulis kepuasan Anda belanja di Lumiere Atelier untuk evaluasi admin..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#4F5C18]"></textarea>
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-[#4F5C18] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border-none hover:bg-slate-950 transition-colors cursor-pointer">
                      Kirim Feedback Ke Admin
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs">
                    <FiCheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                    <p className="font-medium">Sukses! Data ulasan (Rating {ratingInput}/5) Anda telah berhasil disimpan ke database log *Rating and Feedback Admin*.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: SEKSI LACAK LOGISTIK ================= */}
          {currentDashboardTab === "pesanan" && (
            <div ref={lacakRef} className="scroll-mt-24 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xs animate-in fade-in duration-300 w-full">
              {!selectedOrder ? (
                <>
                  <div className="border-b border-slate-100 pb-4"><h2 className="text-md font-bold text-slate-900 uppercase tracking-tight">Pelacakan Pesanan Real-time</h2></div>
                  <div className="divide-y divide-slate-100">
                    {dynamicOrders.map((order) => (
                      <div key={order.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{order.id}</span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${order.step === 4 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{order.status}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 pt-1">{order.items}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5"><FiClock size={12} /> {order.date}</span>
                            <span className="flex items-center gap-1.5"><FiMapPin size={12} /> {order.alamat}</span>
                            <span className="flex items-center gap-1.5"><FiCreditCard size={12} /> {order.total}</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedOrder(order)} className="px-5 py-2.5 bg-slate-950 hover:bg-[#4F5C18] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-2xs"><FiTruck size={12} /> Live Tracking</button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-500 border-none bg-transparent cursor-pointer"><FiArrowLeft size={16} /></button>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Status Pelacakan Logistik</h2>
                        <p className="text-[11px] text-slate-400 mt-0.5">Resi System: <span className="font-mono font-bold text-slate-700">{selectedOrder.id}</span></p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-[#4F5C18]/10 text-[#4F5C18] px-3 py-1 rounded-md font-bold uppercase tracking-wider">{selectedOrder.kurir}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl text-xs">
                    <div><span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Nama Penerima</span><strong className="text-slate-800 font-bold">{selectedOrder.nama}</strong></div>
                    <div><span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Kontak HP</span><strong className="text-slate-800 font-semibold">{selectedOrder.hp}</strong></div>
                    <div><span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wider mb-0.5">Metode Pembayaran</span><strong className="text-slate-800 font-semibold">{selectedOrder.payment}</strong></div>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    <div className="relative flex gap-4 text-xs">
                      <div className={`absolute -left-[22px] w-[14px] h-[14px] rounded-full border-4 border-white shadow-xs ${selectedOrder.step >= 4 ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                      <div className="space-y-0.5 text-left"><p className={`font-bold ${selectedOrder.step === 4 ? 'text-emerald-700' : 'text-slate-800'}`}>Paket Diterima Pembeli</p><p className="text-[11px] text-slate-400 font-medium">Pesanan telah sampai di alamat tujuan dan diterima oleh yang bersangkutan.</p></div>
                    </div>
                    <div className="relative flex gap-4 text-xs">
                      <div className={`absolute -left-[22px] w-[14px] h-[14px] rounded-full border-4 border-white shadow-xs ${selectedOrder.step >= 3 ? 'bg-[#4F5C18]' : 'bg-slate-300'}`}></div>
                      <div className="space-y-0.5 text-left"><p className={`font-bold ${selectedOrder.step === 3 ? 'text-[#4F5C18]' : 'text-slate-800'}`}>Kurir Sedang Menuju Alamatmu</p><p className="text-[11px] text-slate-400 font-medium">Paket dibawa oleh kurir Atelier Express menuju lokasi rumah penerima.</p></div>
                    </div>
                    <div className="relative flex gap-4 text-xs">
                      <div className={`absolute -left-[22px] w-[14px] h-[14px] rounded-full border-4 border-white shadow-xs ${selectedOrder.step >= 2 ? 'bg-[#4F5C18]' : 'bg-slate-300'}`}></div>
                      <div className="space-y-0.5 text-left"><p className={`font-bold ${selectedOrder.step === 2 ? 'text-[#4F5C18]' : 'text-slate-800'}`}>Diproses di Sortation Hub Pusat</p><p className="text-[11px] text-slate-400 font-medium">Paket sedang disortir berdasarkan rute area kota tujuan pengiriman.</p></div>
                    </div>
                    <div className="relative flex gap-4 text-xs">
                      <div className={`absolute -left-[22px] w-[14px] h-[14px] rounded-full border-4 border-white shadow-xs ${selectedOrder.step >= 1 ? 'bg-[#4F5C18]' : 'bg-slate-300'}`}></div>
                      <div className="space-y-0.5 text-left"><p className={`font-bold ${selectedOrder.step === 1 ? 'text-[#4F5C18]' : 'text-slate-800'}`}>Logistik Diterima Gudang (Hub)</p><p className="text-[11px] text-slate-400 font-medium">Data transaksi sukses diverifikasi, paket dalam antrean packing sistem.</p></div>
                    </div>
                  </div>

                  <div className="pt-2"><button onClick={() => setSelectedOrder(null)} className="px-5 py-3 bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#4F5C18] transition-all cursor-pointer border-none shadow-2xs">Kembali ke Daftar Paket</button></div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ================= SEKSI COMPONENT BOTTOM: FEEDBACK LIST ================= */}
      <ContentSection className="bg-white border-t border-slate-200/60 mt-12 py-10">
        <div className="max-w-4xl mx-auto px-6 text-left space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FiStar size={14} className="text-amber-500 fill-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">Ulasan Pengunjung Atelier ({dynamicFeedbacks.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dynamicFeedbacks.map((fb) => (
              <div key={fb.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">{fb.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{fb.date}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <FiStar key={i} size={11} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">"{fb.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* ================= GLOBAL ALERTS SYSTEM ================= */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl flex items-center gap-3 z-50 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-5 h-5 bg-[#4F5C18] rounded-full flex items-center justify-center text-[10px] font-bold">✓</div>
          <span className="text-[11px] font-bold uppercase tracking-wider">{alertMsg}</span>
        </div>
      )}

      {/* ================= BAG SLIDEOVER DRAWER PANEL ================= */}
      {isBagOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs" onClick={() => setIsBagOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300 text-left">
            <div className="space-y-6 overflow-y-auto pr-1 flex-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-slate-900"><FiShoppingBag size={15} /><h3 className="text-xs font-black uppercase tracking-wider">Bag Items</h3></div>
                <button onClick={() => setIsBagOpen(false)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 border-none bg-transparent cursor-pointer"><FiX size={16} /></button>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-20 text-center space-y-2"><div className="w-12 h-12 bg-slate-50 text-slate-300 flex items-center justify-center rounded-full mx-auto"><FiShoppingBag size={20} /></div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace Bag Kosong</p></div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.cartId} className="bg-slate-50/70 border border-slate-200/40 p-3 rounded-xl flex items-center justify-between gap-3 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-slate-400 text-[10px]">✨</div>
                        <div><h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4><span className="text-[10px] font-bold text-[#4F5C18] block mt-0.5">{item.price}</span></div>
                      </div>
                      <button onClick={() => setCartItems(prev => prev.filter(i => i.cartId !== item.cartId))} className="p-1 hover:bg-rose-50 rounded-md text-slate-300 hover:text-rose-600 bg-transparent border-none cursor-pointer"><FiX size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-4 bg-white">
                <div className="flex justify-between items-center text-xs"><span className="text-slate-400 font-bold uppercase tracking-wider">Subtotal Ammount</span><strong className="text-slate-900 font-black text-sm">Rp {cartTotal.toLocaleString("id-ID")}</strong></div>
                <button onClick={handleGoToCheckoutPage} className="w-full bg-slate-950 text-white font-bold py-4 rounded-xl text-[10px] tracking-widest uppercase hover:bg-[#4F5C18] transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-xs">Periksa Pengiriman</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FOOTER ELEMENT ELEGAN CUSTOM COCOK DENGAN GAMBAR ================= */}
      <div ref={footerRef} className="scroll-mt-12 w-full">
        <CustomFooter />
      </div>

    </div>
  );
};

export default LumiereShowcase;