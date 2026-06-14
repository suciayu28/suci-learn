import React, { useState, useMemo, useEffect } from "react";
import { 
  FiShoppingBag, FiTruck, FiCheckCircle, FiClock, 
  FiCreditCard, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiUser,
  FiStar, FiMessageSquare, FiGift, FiMapPin, FiLogOut, FiEdit2,
  FiMail, FiPhone, FiPackage
} from "react-icons/fi";
import { getCRMData } from "../lib/crmData";

const OrderMember = ({ onLogout }) => {
  // --- STATE NAVIGASI PORTAL ---
  const [activePage, setActivePage] = useState("katalog"); 

  // --- STATE DATA PROFILE USER ---
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    tier: "Gold Tier",
    joinDate: ""
  });

  const [editForm, setEditForm] = useState({ ...userProfile });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // --- STATE UTAMA BELANJA ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentStep, setCurrentStep] = useState("katalog"); 
  const [activeTab, setActiveTab] = useState("Semua");
  
  // --- STATE FORM CHECKOUT ---
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [courier, setCourier] = useState("Lumiere Express (Next Day)");
  
  // --- STATE DATA PESANAN & TRACKING ---
  const [activeOrder, setActiveOrder] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState(1); 

  // --- STATE RATING & FEEDBACK ---
  const [ratings, setRatings] = useState({}); 
  const [feedbacks, setFeedbacks] = useState({}); 
  const [submittedReviews, setSubmittedReviews] = useState([]); 

  // =========================================================================
  // SYNC PROFILE & GENERATE HARGA MEMBER (DISKON 20%)
  // =========================================================================
  useEffect(() => {
    const session = localStorage.getItem("userLoggedIn");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const mergedData = {
          name: parsed.name || parsed.username || "Member Premium",
          email: parsed.email || "member@lumiere.com",
          phone: parsed.phone || parsed.telepon || "-",
          address: parsed.address || parsed.alamat || "Alamat belum diatur. Silakan perbarui di menu Profil Akun.",
          tier: "Gold Tier",
          joinDate: parsed.joinDate || "12 Januari 2025"
        };
        setUserProfile(mergedData);
        setEditForm(mergedData);
      } catch (e) {
        console.error("Gagal membaca sesi user aktif", e);
      }
    }

    const db = getCRMData();
    const memberProducts = (db.products || []).map((p) => {
      const productName = p.title ? p.title.toLowerCase() : "";
      const basePrice = parseInt(p.price.replace(/[^\d]/g, ""));
      const discountedPriceNum = basePrice * 0.8;
      const formattedDiscountedPrice = `Rp ${discountedPriceNum.toLocaleString("id-ID")}`;
      const isPromoItem = productName.includes("lipstick") || productName.includes("serum") || productName.includes("hydrating");
      
      return {
        ...p,
        isPromo: isPromoItem,
        originalPrice: p.price, 
        memberPrice: formattedDiscountedPrice 
      };
    });
    setProducts(memberProducts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    if (typeof onLogout === "function") {
      onLogout(); 
    } else {
      window.location.href = "/"; 
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setUserProfile({ ...editForm });
    
    const existingSession = localStorage.getItem("userLoggedIn");
    let updatedSession = { ...editForm };
    if (existingSession) {
      try {
        updatedSession = { ...JSON.parse(existingSession), ...editForm };
      } catch(e) {}
    }
    localStorage.setItem("userLoggedIn", JSON.stringify(updatedSession));
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const categories = ["Semua", "Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"];
  const filteredProducts = useMemo(() => {
    if (activeTab === "Semua") return products;
    return products.filter(p => p.tag === activeTab);
  }, [products, activeTab]);

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const priceNum = parseInt(item.memberPrice.replace(/[^\d]/g, ""));
      return acc + (priceNum * item.quantity);
    }, 0);
  }, [cart]);

  const shippingCost = cart.length > 0 ? (courier.includes("Next Day") ? 25000 : 12000) : 0;
  const totalWeightPoints = cart.reduce((acc, item) => acc + item.quantity, 0) * 10;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    
    const orderData = {
      orderId: `LMR-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }),
      items: [...cart],
      subtotal: subtotal,
      shipping: shippingCost,
      total: subtotal + shippingCost,
      pointsEarned: totalWeightPoints,
      address: editForm.address,
      payment: paymentMethod,
      courier: courier,
    };

    setActiveOrder(orderData);
    setCart([]); 
    setCurrentStep("katalog");
    setTrackingStatus(1); 
    setActivePage("lacak"); 
  };

  const handleSubmitReview = (productId) => {
    if (!ratings[productId]) {
      alert("Silakan berikan rating bintang terlebih dahulu.");
      return;
    }
    setSubmittedReviews(prev => [...prev, productId]);
  };

  const getProductBgGradient = (tag) => {
    if (tag === "Perawatan Kulit") return "from-[#E3EAD8] to-[#C2D1AF]";
    if (tag === "Tata Rias") return "from-[#FCEAE6] to-[#E8C5C0]";
    if (tag === "Parfum") return "from-[#E6EEFA] to-[#BACFEE]";
    return "from-[#F5F5F0] to-[#D5D5D0]";
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#262626] font-sans antialiased flex flex-col justify-between w-full">
      
      {/* ================= BAR NAVBAR UTAMA ================= */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#EAE9E1] sticky top-0 z-50 text-left">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4F5C18] block leading-none mb-1">Lumière Cosmetics</span>
            <h1 className="font-serif font-black text-xl tracking-tight text-[#262626] leading-none">MEMBER PORTAL</h1>
          </div>
          
          <nav className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={() => setActivePage("katalog")} 
              className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${activePage === "katalog" ? "bg-[#262626] text-white" : "text-slate-500 hover:bg-[#FAF9F5]"}`}
            >
              Belanja
            </button>
            <button 
              onClick={() => setActivePage("lacak")} 
              className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all relative ${activePage === "lacak" ? "bg-[#262626] text-white" : "text-slate-500 hover:bg-[#FAF9F5]"}`}
            >
              Lacak Pesanan
              {activeOrder && trackingStatus < 4 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <button 
              onClick={() => setActivePage("profil")} 
              className={`px-3 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${activePage === "profil" ? "bg-[#262626] text-white" : "text-slate-500 hover:bg-[#FAF9F5]"}`}
            >
              Profil Akun
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <button onClick={handleLogout} className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors">
              <FiLogOut size={13} /><span className="hidden sm:inline">Keluar</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        
        {/* WIDGET CARD AKUN MEMBER */}
        <div className="bg-white border border-[#EAE9E1] rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F5C18]/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-full bg-[#262626] text-[#F2F7D6] flex items-center justify-center font-bold shadow-md shrink-0 border border-[#4F5C18]/20">
              <FiUser size={24} className="text-[#E3EAD8]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif font-black text-xl tracking-tight text-[#262626]">Halo, {userProfile.name}</h2>
                <span className="bg-[#4F5C18] text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm shadow-xs">{userProfile.tier}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Potongan diskon eksklusif <span className="font-bold text-[#4F5C18]">20% otomatis</span> melekat di profil Anda.</p>
            </div>
          </div>
          <div className="bg-[#FAF9F5] px-4 py-3 rounded-xl border border-[#EAE9E1] flex items-center gap-3 w-full md:w-auto relative z-10">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600"><FiGift size={16} /></div>
            <div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Loyalty Reward Balance</span>
              <span className="text-base font-black text-[#4F5C18] tracking-tight">1,420 <span className="text-[10px] font-bold text-slate-500">PTS</span></span>
            </div>
          </div>
        </div>

        {/* --- AKALAMAN 1: EDIT PROFILE --- */}
        {activePage === "profil" && (
          <div className="max-w-3xl mx-auto text-left bg-white border border-[#EAE9E1] rounded-2xl shadow-xs overflow-hidden animate-fadeIn">
            <div className="p-6 md:p-8 border-b border-[#EAE9E1] bg-[#FAF9F5] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4F5C18]/10 rounded-xl text-[#4F5C18] flex items-center justify-center"><FiEdit2 size={20} /></div>
              <div>
                <h3 className="font-serif text-xl font-black text-[#262626]">Pengaturan Profil Akun</h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbarui data personal pengiriman barang dan kredensial kontak resmi Anda.</p>
              </div>
            </div>
            <form onSubmit={handleProfileSave} className="p-6 md:p-8 space-y-6">
              {isSavedNotice && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn">
                  <FiCheckCircle size={16} className="text-emerald-600" /> Profil berhasil diperbarui secara real-time!
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1"><FiUser size={12} /> Nama Lengkap</label>
                  <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#FAF9F5] border border-[#EAE9E1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#4F5C18] focus:bg-white font-medium transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1"><FiMail size={12} /> Alamat Email</label>
                  <input type="email" required value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-[#FAF9F5] border border-[#EAE9E1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#4F5C18] focus:bg-white font-medium transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1"><FiPhone size={12} /> No. Telepon / WhatsApp</label>
                  <input type="text" required value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-[#FAF9F5] border border-[#EAE9E1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#4F5C18] focus:bg-white font-medium transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1"><FiClock size={12} /> Terdaftar Sejak</label>
                  <input type="text" disabled value={editForm.joinDate || "12 Januari 2025"} className="w-full bg-[#EAE9E1]/40 border border-[#EAE9E1] text-slate-400 rounded-xl p-3 text-xs cursor-not-allowed" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1"><FiMapPin size={12} /> Alamat Pengiriman Utama</label>
                <textarea required rows={3} value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} className="w-full bg-[#FAF9F5] border border-[#EAE9E1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#4F5C18] focus:bg-white resize-none font-medium transition-all" />
              </div>
              <div className="pt-4 border-t border-[#EAE9E1] flex justify-end">
                <button type="submit" className="px-6 py-3 bg-[#4F5C18] text-white text-[10px] font-black tracking-widest uppercase rounded-xl transition-all">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        )}

        {/* --- HALAMAN 2: TRACKING LOGISTIK --- */}
        {activePage === "lacak" && (
          <div className="max-w-4xl mx-auto text-left space-y-6 animate-fadeIn">
            {!activeOrder ? (
              <div className="bg-white border border-[#EAE9E1] rounded-2xl p-16 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-300 mx-auto"><FiPackage size={28} /></div>
                <div>
                  <h4 className="font-serif text-lg font-black text-[#262626]">Tidak Ada Resi Aktif</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Anda belum melakukan transaksi belanja saat ini. Lakukan pemesanan kosmetik di halaman katalog untuk melihat pelacakan logistik.</p>
                </div>
                <button onClick={() => setActivePage("katalog")} className="mt-2 bg-[#4F5C18] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl">Mulai Belanja Sekarang</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-[#EAE9E1] rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500"></div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EAE9E1] pb-5">
                    <div>
                      <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">No. Resi Pengiriman</span>
                      <h3 className="font-serif text-xl font-black text-[#262626]">{activeOrder.orderId}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-black uppercase">Metode Kurir</span>
                      <span className="text-xs font-black text-[#4F5C18]">{activeOrder.courier}</span>
                    </div>
                  </div>

                  {/* BAR ANIMASI TRACKING */}
                  <div className="py-10">
                    <div className="relative flex justify-between items-center w-full max-w-2xl mx-auto">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 z-0"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 z-0" style={{ width: `${((trackingStatus - 1) / 3) * 100}%` }}></div>

                      {[
                        { step: 1, label: "Diproses", desc: "Penyiapan Formula" },
                        { step: 2, label: "Gudang Sortir", desc: "Quality Check" },
                        { step: 3, label: "Kurir Jalan", desc: "Dalam Perjalanan" },
                        { step: 4, label: "Selesai", desc: "Paket Diterima" }
                      ].map((s) => (
                        <div key={s.step} className="flex flex-col items-center relative z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all border-2 ${trackingStatus >= s.step ? "bg-amber-500 text-white border-amber-500 shadow-md" : "bg-white text-slate-300 border-slate-200"}`}>
                            {trackingStatus > s.step ? <FiCheckCircle size={14} /> : s.step}
                          </div>
                          <span className={`text-[10px] font-black uppercase mt-2 tracking-tight ${trackingStatus >= s.step ? "text-[#262626]" : "text-slate-400"}`}>{s.label}</span>
                          <span className="text-[9px] text-slate-400 hidden sm:block mt-0.5 font-medium">{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {trackingStatus < 4 && (
                    <div className="bg-[#FAF9F5] border border-[#EAE9E1] p-4 rounded-xl flex items-center justify-between text-xs text-left">
                      <span className="text-slate-500 font-medium">💡 *Tombol Simulasi Kurir:* Jalankan status paket secara berkala untuk keperluan testing dashboard.</span>
                      <button onClick={() => setTrackingStatus(p => Math.min(p + 1, 4))} className="bg-amber-500 text-white font-black uppercase tracking-wider text-[9px] px-3 py-1.5 rounded shadow-xs shrink-0 ml-2">Perbarui Status Kurir</button>
                    </div>
                  )}
                </div>

                {/* AREA RATING REVIEW JIKA BARANG SUDAH SAMPAI */}
                {trackingStatus === 4 && (
                  <div className="bg-white border border-[#EAE9E1] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs animate-fadeIn">
                    <div className="border-b border-[#EAE9E1] pb-4 flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FiMessageSquare size={18} /></div>
                      <div>
                        <h4 className="font-serif text-lg font-black text-[#262626]">Paket Telah Sampai! Tulis Ulasan Anda</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Berikan nilai kepuasan untuk barang-barang premium yang sudah Anda terima.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {activeOrder.items.map((item) => {
                        const isReviewed = submittedReviews.includes(item.id);
                        return (
                          <div key={item.id} className="border border-[#EAE9E1] p-4 rounded-xl bg-[#FAF9F5]/50 flex flex-col sm:flex-row gap-5 justify-between items-center">
                            <div className="flex items-center gap-4 max-w-sm w-full text-left">
                              <div className="w-16 h-16 rounded-xl bg-white border border-[#EAE9E1] overflow-hidden shrink-0">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="text-[8px] bg-white border px-2 py-0.5 rounded font-black text-[#4F5C18] uppercase">{item.tag}</span>
                                <h5 className="font-black text-xs text-[#262626] mt-1">{item.title}</h5>
                              </div>
                            </div>
                            <div className="flex-1 space-y-2 w-full sm:w-auto">
                              {isReviewed ? (
                                <span className="text-xs text-emerald-600 font-bold block text-right">✓ Ulasan produk ini berhasil dikirim.</span>
                              ) : (
                                <>
                                  <div className="flex gap-1 justify-start sm:justify-end">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button key={star} type="button" onClick={() => setRatings(p => ({...p, [item.id]: star}))}>
                                        <FiStar size={16} className={star <= (ratings[item.id] || 0) ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                                      </button>
                                    ))}
                                  </div>
                                  <textarea placeholder="Tulis testimoni Anda mengenai produk ini..." value={feedbacks[item.id] || ""} onChange={(e) => setFeedbacks(p => ({...p, [item.id]: e.target.value}))} className="w-full bg-white border border-[#EAE9E1] text-xs p-2.5 rounded-lg focus:outline-none resize-none" rows={2} />
                                  <div className="flex justify-end"><button onClick={() => handleSubmitReview(item.id)} className="bg-[#262626] text-white font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded shadow-xs">Kirim Ulasan</button></div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- HALAMAN 3: KATALOG KATALOG DAN PROSES CHECKOUT --- */}
        {activePage === "katalog" && (
          <>
            <div className="flex justify-center items-center gap-1 md:gap-3 mb-10 text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] bg-white border border-[#EAE9E1] py-3.5 px-4 rounded-xl shadow-xs max-w-2xl mx-auto">
              <button onClick={() => setCurrentStep("katalog")} className={`pb-0.5 px-2 transition-all border-b-2 font-black ${currentStep === "katalog" ? "border-[#4F5C18] text-[#4F5C18]" : "border-transparent text-slate-400"}`}>1. Katalog</button>
              <span className="text-slate-300">/</span>
              <button onClick={() => cart.length > 0 && setCurrentStep("checkout")} disabled={cart.length === 0} className={`pb-0.5 px-2 transition-all border-b-2 font-black ${currentStep === "checkout" ? "border-[#4F5C18] text-[#4F5C18]" : "border-transparent text-slate-400 disabled:opacity-30"}`}>2. Checkout</button>
            </div>

            {/* SEKSI LANGKAH 1: LIST KATALOG BARANG */}
            {currentStep === "katalog" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start animate-fadeIn">
                
                {/* GRID PRODUK UTAMA: Otomatis Full Width jika cart kosong */}
                <div className={`${cart.length === 0 ? "lg:col-span-12" : "lg:col-span-8"} space-y-6 transition-all duration-500`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE9E1] pb-4 gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-black text-[#262626]">Atelier Signature Collection</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Formula murni bersertifikasi organik eksklusif bagi member.</p>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => setActiveTab(cat)} className={`px-3.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === cat ? "bg-[#262626] text-white" : "bg-white text-slate-400 border border-[#EAE9E1]"}`}>
                          {cat === "Semua" ? "All Categories" : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GRID CARD KOSMETIK: Kolom di-re-arrange dinamis sesuai kondisi isi Cart */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${cart.length === 0 ? "md:grid-cols-3 lg:grid-cols-4" : ""} gap-6 transition-all duration-500`}>
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white border border-[#EAE9E1] rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-[#4F5C18] transition-all duration-300 group">
                        <div>
                          
                          {/* CONTAINER IMAGE DENGAN GRADIENT & REAL FIX MENGGUNAKAN 'product.img' */}
                          <div className={`bg-gradient-to-br ${getProductBgGradient(product.tag)} rounded-xl p-2 mb-4 flex flex-col justify-center items-center min-h-[220px] max-h-[220px] relative overflow-hidden shadow-inner`}>
                            <span className="absolute top-2.5 left-2.5 bg-white/90 text-[8px] font-black text-[#262626] px-2.5 py-1 rounded shadow-xs uppercase tracking-wider z-10">{product.tag}</span>
                            
                            {product.img ? (
                              <img 
                                src={product.img} 
                                alt={product.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            <div className="hidden flex-col items-center justify-center text-[#262626]/60">
                              <FiShoppingBag size={24} className="mb-2" />
                              <span className="text-[9px] tracking-widest uppercase font-black opacity-40">Lumière Atelier</span>
                            </div>
                          </div>

                          <h4 className="font-black text-base text-[#262626] tracking-tight line-clamp-1">{product.title}</h4>
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">Diformulasikan secara klinis dari botani organik demi kesehatan kulit sensitif jangka panjang.</p>
                          
                          {/* AREA DETAIL STRUKTUR HARGA MEMBER */}
                          <div className="mt-4 bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE9E1]/50 space-y-1">
                            {product.isPromo ? (
                              <>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>Harga Normal:</span>
                                  <span className="line-through">{product.originalPrice}</span>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-[#EAE9E1]/40">
                                  <span className="text-xs font-bold text-[#4F5C18]">Harga Promo:</span>
                                  <span className="text-base font-black text-[#4F5C18] tracking-tight">{product.memberPrice}</span>
                                </div>
                                <div className="pt-1.5 flex justify-end">
                                  <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md uppercase tracking-wider">SAVE 20%</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>Status Produk:</span>
                                  <span className="text-slate-500 font-bold">Harga Normal</span>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-[#EAE9E1]/40">
                                  <span className="text-xs font-bold text-slate-600">Harga Resmi:</span>
                                  <span className="text-base font-black text-slate-700 tracking-tight">{product.memberPrice}</span>
                                </div>
                                <div className="pt-1.5 flex justify-end">
                                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wider">Member Price</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <button onClick={() => handleAddToCart(product)} className="w-full mt-4 bg-[#262626] hover:bg-[#4F5C18] text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                          Masukkan Keranjang
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONDITIONAL SIDEBAR CART: HANYA MERENDER JIKA INPUT DATA CART BERISI (cart.length > 0) */}
                {cart.length > 0 && (
                  <div className="lg:col-span-4 bg-white border border-[#EAE9E1] rounded-2xl p-6 h-fit sticky top-24 space-y-6 shadow-xs animate-fadeIn">
                    <div className="border-b border-[#EAE9E1] pb-3 flex items-center justify-between">
                      <h3 className="font-black text-xs uppercase tracking-wider text-[#262626] flex items-center gap-2">
                        <FiShoppingBag className="text-[#4F5C18]" /> Tas Belanja ({cart.length})
                      </h3>
                      <button onClick={() => setCart([])} className="text-slate-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><FiTrash2 /> Reset</button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-3 border-b border-[#EAE9E1]/60 pb-4 pr-1">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-[#FAF9F5] p-2 rounded-xl flex items-center justify-between gap-3 border border-[#EAE9E1]/40">
                          <div className="w-12 h-12 bg-white rounded-lg border border-[#EAE9E1] overflow-hidden shrink-0">
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-black text-[#262626] line-clamp-1 text-left">{item.title}</h5>
                            <span className="text-[11px] font-bold text-[#4F5C18] block text-left">{item.memberPrice}</span>
                          </div>
                          <div className="flex items-center bg-white rounded-lg border border-[#EAE9E1] p-1 gap-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-rose-600"><FiMinus size={10} /></button>
                            <span className="text-xs font-black text-[#262626] w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-[#4F5C18]"><FiPlus size={10} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-b border-[#EAE9E1]/60 pb-4 text-xs">
                      <div className="flex justify-between text-slate-400"><span>Estimasi Subtotal</span><span className="font-bold text-[#262626]">Rp {subtotal.toLocaleString("id-ID")}</span></div>
                      <div className="flex justify-between text-slate-400"><span>Poin Didapat</span><span className="font-bold text-amber-600">+{totalWeightPoints} PTS</span></div>
                    </div>

                    <button onClick={() => setCurrentStep("checkout")} className="w-full bg-[#4F5C18] hover:bg-[#262626] text-white text-[10px] font-black tracking-widest uppercase py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                      Lanjut Ke Checkout <FiArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SEKSI LANGKAH 2: FORM ISI CHECKOUT */}
            {currentStep === "checkout" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start animate-fadeIn">
                <div className="lg:col-span-8 bg-white border border-[#EAE9E1] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
                  <div>
                    <h3 className="font-serif text-xl font-black text-[#262626]">Detail Konfirmasi Pengiriman</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Harap periksa kelayakan alamat destinasi utama kurir logistik kami.</p>
                  </div>

                  <div className="border border-[#EAE9E1] p-4 rounded-xl bg-[#FAF9F5] space-y-2 relative">
                    <span className="absolute top-3.5 right-4 text-[#4F5C18]"><FiMapPin size={16} /></span>
                    <h5 className="text-xs font-black text-[#262626] uppercase tracking-wider">Alamat Tujuan Pengiriman</h5>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{editForm.address}</p>
                    <div className="pt-2 flex items-center gap-4 text-[10px] text-slate-400 font-bold border-t border-[#EAE9E1]/60">
                      <span>{editForm.name}</span>
                      <span>•</span>
                      <span>{editForm.phone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1.5"><FiTruck size={12} /> Opsi Ekspedisi Kurir</label>
                      <select value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full bg-[#FAF9F5] border border-[#EAE9E1] rounded-xl p-3 text-xs focus:outline-none font-medium text-slate-700">
                        <option value="Lumiere Express (Next Day)">Lumiere Express (Next Day) - Rp 25.000</option>
                        <option value="Sicepat Reguler">Sicepat Reguler - Rp 12.000</option>
                        <option value="J&T Eco Service">J&T Eco Service - Rp 12.000</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1.5"><FiCreditCard size={12} /> Metode Pembayaran Virtual</label>
                      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-[#FAF9F5] border border-[#EAE9E1] rounded-xl p-3 text-xs focus:outline-none font-medium text-slate-700">
                        <option value="Bank Transfer">Bank Transfer (Manual Check)</option>
                        <option value="Virtual Account">BCA / Mandiri Virtual Account</option>
                        <option value="GoPay">GoPay E-Wallet</option>
                        <option value="ShopeePay">ShopeePay Instant</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* INVOICE FINAL SIDEBAR */}
                <div className="lg:col-span-4 bg-white border border-[#EAE9E1] rounded-2xl p-6 space-y-4 shadow-xs">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#262626] border-b border-[#EAE9E1] pb-3">Ringkasan Faktur</h4>
                  
                  <div className="max-h-[200px] overflow-y-auto space-y-3 border-b border-[#EAE9E1]/60 pb-3 pr-1">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs text-slate-500 gap-3">
                        <div className="w-9 h-9 rounded bg-[#FAF9F5] border border-[#EAE9E1] overflow-hidden shrink-0">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <span className="line-clamp-1 flex-1 pr-2 text-left">{item.title} <span className="font-black text-[#4F5C18]">x{item.quantity}</span></span>
                        <span className="font-bold text-[#262626]">Rp {(parseInt(item.memberPrice.replace(/[^\d]/g, "")) * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs border-b border-[#EAE9E1]/60 pb-3">
                    <div className="flex justify-between text-slate-400"><span>Subtotal Item</span><span className="font-bold text-[#262626]">Rp {subtotal.toLocaleString("id-ID")}</span></div>
                    <div className="flex justify-between text-slate-400"><span>Ongkos Kirim</span><span className="font-bold text-[#262626]">Rp {shippingCost.toLocaleString("id-ID")}</span></div>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs font-black uppercase text-[#262626]">Total Pembayaran</span>
                    <span className="text-lg font-black text-[#4F5C18] tracking-tight">Rp {(subtotal + shippingCost).toLocaleString("id-ID")}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={() => setCurrentStep("katalog")} className="bg-[#FAF9F5] hover:bg-[#EAE9E1]/50 border border-[#EAE9E1] text-[#262626] text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all">Kembali</button>
                    <button onClick={handlePlaceOrder} className="bg-[#262626] hover:bg-[#4F5C18] text-white text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md">Bayar Sekarang</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

     {/* ================= BRAND FOOTER ================= */}
      <footer className="bg-white border-t border-[#EAE9E1] py-8 text-center text-xs text-slate-400 font-medium w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Lumière Atelier. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <a href="#privacy" className="hover:text-[#4F5C18]">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#4F5C18]">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default OrderMember;