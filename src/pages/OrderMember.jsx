import React, { useState, useMemo, useEffect } from "react";
import { 
  FiShoppingBag, FiTruck, FiCheckCircle, FiClock, 
  FiCreditCard, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiUser,
  FiStar, FiMessageSquare, FiGift, FiMapPin, FiLogOut, FiEdit2,
  FiMail, FiPhone, FiPackage, FiPercent, FiSettings
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
  const [paymentMethod, setPaymentMethod] = useState("Virtual Account");
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
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${activePage === "katalog" ? "bg-[#4F5C18] text-white" : "text-slate-500 hover:bg-[#FAF9F5] bg-transparent"}`}
            >
              Belanja
            </button>
            <button 
              onClick={() => setActivePage("lacak")} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative border-none cursor-pointer ${activePage === "lacak" ? "bg-[#4F5C18] text-white" : "text-slate-500 hover:bg-[#FAF9F5] bg-transparent"}`}
            >
              Lacak Pesanan
              {activeOrder && trackingStatus < 4 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white animate-pulse"></span>
              )}
            </button>
            <button 
              onClick={() => setActivePage("profil")} 
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer ${activePage === "profil" ? "bg-[#4F5C18] text-white" : "text-slate-500 hover:bg-[#FAF9F5] bg-transparent"}`}
            >
              Profil Akun
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <button onClick={handleLogout} className="text-rose-600 hover:bg-rose-50 p-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-colors border-none bg-transparent cursor-pointer">
              <FiLogOut size={13} /><span className="hidden sm:inline">Keluar</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ================= KONTEN UTAMA ================= */}
      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        
        {/* WIDGET CARD AKUN MEMBER - LUXURY DESIGN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 text-left">
          {/* Card VIP Digital */}
          <div className="lg:col-span-8 bg-gradient-to-br from-[#1C1C1C] via-[#2D2D2D] to-[#121212] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] group border border-amber-500/20 animate-in fade-in duration-500">
            {/* Hologram/Glass overlay effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_60%)]"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-500"></div>
            
            {/* Card Header */}
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-500">Lumière Privé</span>
                <h3 className="font-serif font-black text-2xl tracking-tight">VIP ACCESS CARD</h3>
              </div>
              {/* Metallic chip */}
              <div className="w-12 h-9 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 rounded-lg shadow-inner relative overflow-hidden border border-amber-300">
                <div className="absolute top-0 bottom-0 left-1/3 right-1/3 border-x border-amber-600/30"></div>
                <div className="absolute left-0 right-0 top-1/3 bottom-1/3 border-y border-amber-600/30"></div>
              </div>
            </div>

            {/* Card Body (User Info) */}
            <div className="space-y-4 pt-6 relative z-10">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Card Holder</p>
                  <p className="font-poppins font-black text-lg md:text-xl tracking-wide text-white leading-none mt-2">{userProfile.name}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> {userProfile.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6 relative z-10 text-[9px] font-mono text-slate-400">
              <div>
                <span className="block uppercase text-[8px] text-slate-500 font-bold">Member Since</span>
                <span className="font-bold text-slate-300">{userProfile.joinDate}</span>
              </div>
              <div className="text-right">
                <span className="block uppercase text-[8px] text-slate-500 font-bold">Exclusive Benefit</span>
                <span className="font-bold text-amber-500">20% FLAT DISCOUNT</span>
              </div>
            </div>
          </div>

          {/* Loyalty Reward Widget */}
          <div className="lg:col-span-4 bg-white border border-[#EAE9E1] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group animate-in fade-in duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F5C18]/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Available Rewards Balance</span>
              <div className="flex items-baseline gap-1.5">
                <h4 className="text-4xl font-black text-[#4F5C18] tracking-tight">1,420</h4>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Points</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pt-2 text-left">
                Poin diperoleh dari setiap transaksi. Tukarkan poin Anda dengan produk sampel gratis atau voucher belanja eksklusif.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <FiGift size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-left">Next Tier Progress</span>
                <span className="text-xs font-black text-[#262626] block text-left mt-0.5">80 PTS to Platinum tier</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- HALAMAN 1: EDIT PROFILE --- */}
        {activePage === "profil" && (
          <div className="max-w-3xl mx-auto text-left bg-white border border-[#EAE9E1] rounded-2xl shadow-xs overflow-hidden animate-in fade-in duration-500">
            <div className="p-6 md:p-8 border-b border-[#EAE9E1] bg-[#FAF9F5] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4F5C18]/10 rounded-xl text-[#4F5C18] flex items-center justify-center"><FiEdit2 size={20} /></div>
              <div>
                <h3 className="font-serif text-xl font-black text-[#262626]">Pengaturan Profil Akun</h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbarui data personal pengiriman barang dan kredensial kontak resmi Anda.</p>
              </div>
            </div>
            <form onSubmit={handleProfileSave} className="p-6 md:p-8 space-y-6">
              {isSavedNotice && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in duration-350">
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
                <button type="submit" className="px-6 py-3 bg-[#4F5C18] hover:bg-[#3d4712] border-none text-white text-[10px] font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer shadow-xs">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        )}

        {/* --- HALAMAN 2: TRACKING LOGISTIK --- */}
        {activePage === "lacak" && (
          <div className="max-w-4xl mx-auto text-left space-y-6 animate-in fade-in duration-500">
            {!activeOrder ? (
              <div className="bg-white border border-[#EAE9E1] rounded-2xl p-16 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-300 mx-auto"><FiPackage size={28} /></div>
                <div>
                  <h4 className="font-serif text-lg font-black text-[#262626]">Tidak Ada Resi Aktif</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Anda belum melakukan transaksi belanja saat ini. Lakukan pemesanan kosmetik di halaman katalog untuk melihat pelacakan logistik.</p>
                </div>
                <button onClick={() => setActivePage("katalog")} className="mt-2 bg-[#4F5C18] hover:bg-[#3d4712] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl border-none cursor-pointer shadow-xs">Mulai Belanja Sekarang</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white border border-[#EAE9E1] rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4F5C18]"></div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#EAE9E1] pb-5">
                    <div>
                      <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">No. Resi Pengiriman</span>
                      <h3 className="font-serif text-xl font-black text-[#262626]">{activeOrder.orderId}</h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block font-black uppercase">Metode Kurir</span>
                      <span className="text-xs font-black text-[#4F5C18]">{activeOrder.courier}</span>
                    </div>
                  </div>

                  {/* BAR ANIMASI TRACKING */}
                  <div className="py-12 bg-[#FAF9F5] rounded-3xl border border-gray-150 p-6 md:p-8 my-6">
                    <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto">
                      {/* Grey track */}
                      <div className="absolute left-0 right-0 top-6 h-1.5 bg-gray-200 rounded-full z-0"></div>
                      {/* Active track */}
                      <div className="absolute left-0 top-6 h-1.5 bg-[#4F5C18] rounded-full transition-all duration-700 ease-out z-0" style={{ width: `${((trackingStatus - 1) / 3) * 100}%` }}></div>

                      {[
                        { step: 1, label: "Diproses", desc: "Penyiapan Formula", icon: <FiPackage size={14} /> },
                        { step: 2, label: "Sortir", desc: "Quality Check", icon: <FiSettings size={14} /> },
                        { step: 3, label: "Dalam Pengiriman", desc: "Lumiere Express", icon: <FiTruck size={14} /> },
                        { step: 4, label: "Diterima", desc: "Selesai", icon: <FiCheckCircle size={14} /> }
                      ].map((s) => {
                        const isActive = trackingStatus === s.step;
                        const isCompleted = trackingStatus > s.step;
                        const isReached = trackingStatus >= s.step;
                        
                        return (
                          <div key={s.step} className="flex flex-col items-center relative z-10 w-1/4">
                            <div className="relative flex items-center justify-center">
                              {/* Pulsing ring for current step */}
                              {isActive && (
                                <span className="absolute -inset-2 rounded-full bg-[#4F5C18]/25 animate-ping"></span>
                              )}
                              
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                                isCompleted 
                                  ? "bg-[#4F5C18] text-[#F2F7D6] border-[#4F5C18] shadow-md shadow-[#4F5C18]/10" 
                                  : isActive 
                                    ? "bg-white text-[#4F5C18] border-[#4F5C18] shadow-md shadow-[#4F5C18]/20 font-black" 
                                    : "bg-white text-slate-300 border-gray-200"
                              }`}>
                                {isCompleted ? <FiCheckCircle size={16} /> : s.icon}
                              </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase mt-3 tracking-wider text-center ${isReached ? "text-[#262626]" : "text-slate-400"}`}>{s.label}</span>
                            <span className="text-[9px] text-slate-400 hidden md:block mt-1 text-center font-medium">{s.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {trackingStatus < 4 && (
                    <div className="bg-[#FAF9F5] border border-[#EAE9E1] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-left gap-4">
                      <span className="text-slate-500 font-medium">💡 *Tombol Simulasi Kurir:* Jalankan status paket secara berkala untuk keperluan testing dashboard.</span>
                      <button onClick={() => setTrackingStatus(p => Math.min(p + 1, 4))} className="bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-wider text-[9px] px-3.5 py-2 rounded border-none cursor-pointer shadow-xs shrink-0">Perbarui Status Kurir</button>
                    </div>
                  )}
                </div>

                {/* AREA RATING REVIEW JIKA BARANG SUDAH SAMPAI */}
                {trackingStatus === 4 && (
                  <div className="bg-white border border-[#EAE9E1] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs animate-in fade-in duration-500">
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
                                <span className="text-[8px] bg-white border border-gray-250 px-2 py-0.5 rounded font-black text-[#4F5C18] uppercase">{item.tag}</span>
                                <h5 className="font-black text-xs text-[#262626] mt-1">{item.title}</h5>
                              </div>
                            </div>
                            <div className="flex-1 space-y-2 w-full sm:w-auto">
                              {isReviewed ? (
                                <span className="text-xs text-emerald-600 font-bold block text-left sm:text-right">✓ Ulasan produk ini berhasil dikirim.</span>
                              ) : (
                                <>
                                  <div className="flex gap-1 justify-start sm:justify-end">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button key={star} type="button" onClick={() => setRatings(p => ({...p, [item.id]: star}))} className="bg-transparent border-none p-0 cursor-pointer">
                                        <FiStar size={16} className={star <= (ratings[item.id] || 0) ? "text-amber-500 fill-amber-500" : "text-slate-300"} />
                                      </button>
                                    ))}
                                  </div>
                                  <textarea placeholder="Tulis testimoni Anda mengenai produk ini..." value={feedbacks[item.id] || ""} onChange={(e) => setFeedbacks(p => ({...p, [item.id]: e.target.value}))} className="w-full bg-white border border-[#EAE9E1] text-xs p-2.5 rounded-lg focus:outline-none resize-none" rows={2} />
                                  <div className="flex justify-end"><button onClick={() => handleSubmitReview(item.id)} className="bg-[#262626] hover:bg-[#4F5C18] text-white border-none cursor-pointer font-black text-[9px] uppercase tracking-wider px-3.5 py-2 rounded shadow-xs">Kirim Ulasan</button></div>
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
              <button onClick={() => setCurrentStep("katalog")} className={`pb-0.5 px-2 transition-all border-none bg-transparent cursor-pointer border-b-2 font-black ${currentStep === "katalog" ? "border-[#4F5C18] text-[#4F5C18]" : "border-transparent text-slate-400"}`}>1. Katalog</button>
              <span className="text-slate-300">/</span>
              <button onClick={() => cart.length > 0 && setCurrentStep("checkout")} disabled={cart.length === 0} className={`pb-0.5 px-2 transition-all border-none bg-transparent cursor-pointer border-b-2 font-black ${currentStep === "checkout" ? "border-[#4F5C18] text-[#4F5C18]" : "border-transparent text-slate-400 disabled:opacity-30"}`}>2. Checkout</button>
            </div>

            {/* SEKSI LANGKAH 1: LIST KATALOG BARANG */}
            {currentStep === "katalog" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start animate-in fade-in duration-500">
                
                {/* GRID PRODUK UTAMA */}
                <div className={`${cart.length === 0 ? "lg:col-span-12" : "lg:col-span-8"} space-y-6 transition-all duration-500`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EAE9E1] pb-4 gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-black text-[#262626]">Atelier Signature Collection</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Formula murni bersertifikasi organik eksklusif bagi member.</p>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${activeTab === cat ? "bg-[#262626] text-white border-none" : "bg-white text-slate-400 border border-[#EAE9E1]"}`}>
                          {cat === "Semua" ? "All Categories" : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GRID CARD KOSMETIK */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 ${cart.length === 0 ? "md:grid-cols-3 lg:grid-cols-4" : ""} gap-6 transition-all duration-500`}>
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="bg-white border border-[#EAE9E1] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#4F5C18] transition-all duration-300 flex flex-col justify-between group">
                        
                        <div className="relative overflow-hidden aspect-square bg-[#FAF9F5] flex items-center justify-center">
                          <span className="absolute top-2.5 left-2.5 bg-white/95 text-[8px] font-black text-[#262626] px-2.5 py-1 rounded shadow-xs uppercase tracking-wider z-10">{product.tag}</span>
                          
                          {product.isPromo && (
                            <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded shadow-xs uppercase tracking-wider z-10 flex items-center gap-0.5">
                              <FiPercent size={8} /> Promo
                            </span>
                          )}

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

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-left">
                          <div className="space-y-1">
                            <h4 className="font-black text-sm text-[#262626] tracking-tight line-clamp-1 group-hover:text-[#4F5C18] transition-colors">{product.title}</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">Formula organik premium tersertifikasi untuk kesehatan kulit sensitif.</p>
                          </div>
                          
                          {/* AREA DETAIL STRUKTUR HARGA MEMBER */}
                          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE9E1]/50 space-y-1">
                            {product.isPromo ? (
                              <>
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span>Harga Normal:</span>
                                  <span className="line-through">{product.originalPrice}</span>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-[#EAE9E1]/40">
                                  <span className="text-[10px] font-bold text-[#4F5C18]">Harga Promo Member:</span>
                                  <span className="text-sm font-black text-[#4F5C18] tracking-tight">{product.memberPrice}</span>
                                </div>
                                <div className="pt-1.5 flex justify-end">
                                  <span className="text-[8px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded uppercase tracking-wider">Save 20% + Promo</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between text-[10px] text-slate-400">
                                  <span>Status Produk:</span>
                                  <span className="text-slate-500 font-bold">Harga Normal</span>
                                </div>
                                <div className="flex items-center justify-between pt-1 border-t border-[#EAE9E1]/40">
                                  <span className="text-[10px] font-bold text-slate-600">Harga Member:</span>
                                  <span className="text-sm font-black text-slate-700 tracking-tight">{product.memberPrice}</span>
                                </div>
                                <div className="pt-1.5 flex justify-end">
                                  <span className="text-[8px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">Member Price</span>
                                </div>
                              </>
                            )}
                          </div>

                          <button onClick={() => handleAddToCart(product)} className="w-full bg-[#262626] hover:bg-[#4F5C18] text-white text-[10px] font-black tracking-widest uppercase py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer">
                            Masukkan Keranjang
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONDITIONAL SIDEBAR CART */}
                {cart.length > 0 && (
                  <div className="lg:col-span-4 bg-white border border-[#EAE9E1] rounded-2xl p-6 h-fit sticky top-24 space-y-6 shadow-xs animate-in fade-in duration-350">
                    <div className="border-b border-[#EAE9E1] pb-3 flex items-center justify-between">
                      <h3 className="font-black text-xs uppercase tracking-wider text-[#262626] flex items-center gap-2">
                        <FiShoppingBag className="text-[#4F5C18]" /> Tas Belanja ({cart.length})
                      </h3>
                      <button onClick={() => setCart([])} className="text-slate-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 bg-transparent border-none cursor-pointer"><FiTrash2 /> Reset</button>
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
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-rose-600 bg-transparent border-none p-0 cursor-pointer"><FiMinus size={10} /></button>
                            <span className="text-xs font-black text-[#262626] w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-[#4F5C18] bg-transparent border-none p-0 cursor-pointer"><FiPlus size={10} /></button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-b border-[#EAE9E1]/60 pb-4 text-xs text-left">
                      <div className="flex justify-between text-slate-400"><span>Estimasi Subtotal</span><span className="font-bold text-[#262626]">Rp {subtotal.toLocaleString("id-ID")}</span></div>
                      <div className="flex justify-between text-slate-400"><span>Poin Didapat</span><span className="font-bold text-amber-600">+{totalWeightPoints} PTS</span></div>
                    </div>

                    <button onClick={() => setCurrentStep("checkout")} className="w-full bg-[#4F5C18] hover:bg-[#262626] text-white text-[10px] font-black tracking-widest uppercase py-3.5 rounded-xl transition-all border-none cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                      Lanjut Ke Checkout <FiArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* SEKSI LANGKAH 2: FORM ISI CHECKOUT */}
            {currentStep === "checkout" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start animate-in fade-in duration-500">
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

                  {/* CARDS FOR SHIPPING SELECTION */}
                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1.5">
                      <FiTruck size={12} /> Opsi Ekspedisi Kurir
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "Lumiere Express (Next Day)", label: "Lumiere Express", type: "Next Day", price: 25000, desc: "Tiba esok hari sebelum jam 12 siang." },
                        { id: "Sicepat Reguler", label: "Sicepat Reguler", type: "Regular", price: 12000, desc: "Estimasi pengiriman 2-3 hari kerja." },
                        { id: "J&T Eco Service", label: "J&T Eco Service", type: "Eco", price: 12000, desc: "Layanan ekonomis ramah lingkungan." }
                      ].map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setCourier(c.id)}
                          className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                            courier === c.id
                              ? "bg-[#FAF9F5] border-[#4F5C18] shadow-xs"
                              : "bg-white border-gray-200 hover:border-[#4F5C18]/40"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-poppins font-black text-xs text-[#262626]">{c.label}</h5>
                              <span className="text-[9px] bg-[#FAF9F5] text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider block w-fit mt-1">{c.type}</span>
                            </div>
                            {courier === c.id && <span className="w-4 h-4 rounded-full bg-[#4F5C18] flex items-center justify-center text-white"><FiCheckCircle size={10} className="stroke-white fill-white" /></span>}
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                            <span className="text-[10px] text-slate-400 font-medium">{c.desc}</span>
                            <span className="text-xs font-black text-[#4F5C18]">Rp {c.price.toLocaleString("id-ID")}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CARDS FOR PAYMENT SELECTION */}
                  <div className="space-y-3 pt-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18] flex items-center gap-1.5">
                      <FiCreditCard size={12} /> Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: "Virtual Account", name: "Virtual Account", desc: "BCA / Mandiri VA", logoBg: "bg-blue-50 text-blue-700" },
                        { id: "GoPay", name: "GoPay E-Wallet", desc: "Instan dengan GoPay", logoBg: "bg-teal-50 text-teal-700" },
                        { id: "ShopeePay", name: "ShopeePay Instant", desc: "Bayar via Shopee", logoBg: "bg-orange-50 text-orange-700" },
                        { id: "Bank Transfer", name: "Bank Transfer", desc: "Konfirmasi Manual", logoBg: "bg-gray-50 text-gray-700" }
                      ].map((pm) => (
                        <div
                          key={pm.id}
                          onClick={() => setPaymentMethod(pm.id)}
                          className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                            paymentMethod === pm.id
                              ? "bg-[#FAF9F5] border-[#4F5C18] shadow-xs"
                              : "bg-white border-gray-200 hover:border-[#4F5C18]/40"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-xl text-xs font-bold ${pm.logoBg}`}>
                              <FiCreditCard size={16} />
                            </div>
                            {paymentMethod === pm.id && <span className="w-4 h-4 rounded-full bg-[#4F5C18] flex items-center justify-center text-white"><FiCheckCircle size={10} className="stroke-white fill-white" /></span>}
                          </div>
                          <div className="mt-4 text-left">
                            <h5 className="font-poppins font-black text-xs text-[#262626]">{pm.name}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5">{pm.desc}</p>
                          </div>
                        </div>
                      ))}
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
                    <button onClick={() => setCurrentStep("katalog")} className="bg-[#FAF9F5] hover:bg-[#EAE9E1]/50 border border-[#EAE9E1] text-[#262626] text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-all">Kembali</button>
                    <button onClick={handlePlaceOrder} className="bg-[#262626] hover:bg-[#4F5C18] border-none text-white text-[10px] font-black uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-all shadow-md">Bayar Sekarang</button>
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
          <p>© 2026 Lumière Privé. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <a href="#privacy" className="hover:text-[#4F5C18] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#4F5C18] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default OrderMember;