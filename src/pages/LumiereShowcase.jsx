import React, { useState, useMemo, useEffect, useRef } from "react"; // 1. Ditambahkan useEffect dan useRef di sini
import { useNavigate } from "react-router-dom"; // Import navigasi
import {
  FiStar, FiPercent, FiBox, FiArrowRight,
  FiHeart, FiTag, FiSend, FiShoppingBag, FiChevronUp, FiX, FiClock,
  FiUser, FiGrid, FiHome, FiSettings, FiLogOut, FiMapPin, FiGift, FiShield,
  FiTruck, FiCheckCircle, FiChevronRight, FiPackage
} from "react-icons/fi";

// IMPORT KOMPONEN
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
  const navigate = useNavigate(); // Inisialisasi navigasi
  
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [isBagOpen, setIsBagOpen] = useState(false);

  // BARU: State untuk mengontrol Modal Riwayat & Detail Lacak Pesanan
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Menampung data pesanan yang sedang dilacak

  // Mock Data Riwayat Transaksi Guest
  const orderHistoryData = [
    { id: "LM-88429910X", date: "07 Juni 2026", total: "Rp 1.450.000", items: "2 Items (Lumiere Serum, Lip Tint)", status: "Dalam Pengiriman", step: 3 },
    { id: "LM-77312544A", date: "28 Mei 2026", total: "Rp 680.000", items: "1 Item (Atelier Fragrance)", status: "Selesai", step: 4 }
  ];

  // 2. Inisialisasi useRef untuk menangkap elemen DOM input email newsletter
  const emailInputRef = useRef(null);

  // 3. Implementasi useEffect untuk merespon interaksi setelah user klik subscribe
  useEffect(() => {
    if (subscribed && emailInputRef.current) {
      emailInputRef.current.blur(); // Melepas fokus kursor dari input setelah berhasil submit
      setEmail(""); // Mengosongkan form input email
    }
  }, [subscribed]); // Berjalan setiap kali nilai state 'subscribed' berubah

  // Load products from localStorage mock db
  useEffect(() => {
    const db = getCRMData();
    setProducts(db.products || []);
  }, []);

  // --- DATA PRODUK ---
  const categories = ["Semua", "Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"];

  // --- LOGIC ---
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <div className="bg-[#FAF9F7] min-h-screen font-poppins text-[#262626] overflow-x-hidden selection:bg-[#4F5C18] selection:text-white pt-28">
      
      {/* NEW TOP HEADER NAVBAR (GUEST DASHBOARD STYLE) */}
      <header className="w-full bg-white/95 backdrop-blur-2xl border-b border-gray-100/80 py-5 px-12 flex justify-between items-center fixed top-0 left-0 right-0 z-[90] shadow-[0_2px_20px_-5px_rgba(0,0,0,0.03)]">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#4F5C18] text-white flex items-center justify-center font-serif italic font-black text-xl shadow-md shadow-[#4F5C18]/20 transition-transform hover:scale-105 duration-200">
            L.
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-xl tracking-tight text-black leading-none">Lumière</span>
            <span className="text-[10px] text-gray-400 font-bold tracking-[0.15em] uppercase mt-1">Guest Dashboard</span>
          </div>
        </div>
        
        {/* Middle Side: Dashboard Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          <button className="flex items-center gap-2.5 text-[12px] font-black uppercase tracking-wider text-[#4F5C18] relative after:absolute after:bottom-[-22px] after:left-0 after:right-0 after:h-[3px] after:bg-[#4F5C18] after:rounded-full">
            <FiHome size={15} /> Katalog Utama
          </button>
          <button 
            onClick={() => {
              setIsHistoryOpen(true);
              setSelectedOrder(null); // Reset ke list riwayat awal
              setIsBagOpen(false);
            }} 
            className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#4F5C18] transition-colors relative group py-1"
          >
            <FiClock size={15} /> Riwayat Belanja
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4F5C18] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Right Side: Profile & Admin Action */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3.5 border-r border-gray-100 pr-5">
            <div className="w-11 h-11 rounded-full bg-[#4F5C18]/10 text-[#4F5C18] flex items-center justify-center font-bold">
              <FiUser size={18} />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13px] font-bold text-gray-800 leading-tight">Guest User</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wide mt-0.5">Standard Access</span>
            </div>
          </div>

          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#4F5C18] active:scale-98 transition-all flex items-center gap-2.5 shadow-md shadow-black/5 cursor-pointer"
          >
            <FiLogOut size={13} /> Admin Panel
          </button>
        </div>
      </header>
      
      {/* FLOATING BAG & NAVIGATION */}
      <div className="fixed top-28 right-8 z-[100] flex flex-col items-end gap-3">
        <div 
          onClick={() => setIsBagOpen(!isBagOpen)}
          className="bg-white/95 backdrop-blur-md p-4.5 px-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-4 transition-all hover:scale-105 hover:border-[#4F5C18]/20 cursor-pointer group"
        >
          <div className="relative">
            <FiShoppingBag size={24} className="text-[#4F5C18] transition-transform group-hover:rotate-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartItems.length}
              </span>
            )}
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#4F5C18]">My Atelier Bag</span>
        </div>

        {/* Dropdown Menu */}
        {isBagOpen && (
          <div className="w-96 bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-gray-100 p-8 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Keranjang Belanja</h4>
              <button className="p-1.5 rounded-full hover:bg-gray-50 transition-colors">
                <FiX className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors" size={16} onClick={() => setIsBagOpen(false)} />
              </button>
            </div>
            
            <div className="max-h-72 overflow-y-auto space-y-4 pr-2 mb-6 custom-scrollbar">
              {cartItems.length > 0 ? cartItems.map((item) => (
                <div key={item.cartId} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition-all group">
                  <img src={item.img} alt={item.title} className="w-16 h-16 rounded-xl object-cover shadow-xs border border-gray-100" />
                  <div className="flex-grow">
                    <p className="text-[13px] font-bold text-[#262626] line-clamp-1">{item.title}</p>
                    <p className="text-[11px] text-[#4F5C18] font-semibold mt-0.5">{item.price}</p>
                  </div>
                  <button onClick={() => setCartItems(prev => prev.filter(i => i.cartId !== item.cartId))} className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50/50 transition-all">
                    <FiX size={16} />
                  </button>
                </div>
              )) : (
                <div className="text-center py-10">
                  <FiShoppingBag size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-[11px] text-gray-400 font-medium italic">Belum ada pilihan keindahan.</p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  setIsHistoryOpen(true);
                  setSelectedOrder(null);
                  setIsBagOpen(false);
                }}
                className="w-full py-4 bg-[#4F5C18] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#3a4412] active:scale-99 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#4F5C18]/10"
              >
                <FiClock size={14} /> Riwayat Pesanan
              </button>
              <button 
                onClick={() => navigate("/login")}
                className="w-full py-3.5 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all cursor-pointer"
              >
                Admin Panel Login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL DIALOG RIWAYAT BELANJA & LACAK PESANAN (BARU & INTERAKTIF) --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-3xl border border-gray-100 p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Dekorasi Ambient Accent */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#4F5C18]/5 rounded-bl-full pointer-events-none"></div>
            
            {/* Header Modal */}
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F5C18] bg-[#4F5C18]/10 px-3 py-1 rounded-full">
                  {selectedOrder ? "Pelacakan Real-time" : "Daftar Pembelian"}
                </span>
                <h3 className="text-2xl font-serif font-black tracking-tight mt-2 text-gray-900">
                  {selectedOrder ? "Detail Pelacakan Kurir" : "Riwayat Belanja Anda"}
                </h3>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-700"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* TAMPILAN 1: LIST RIWAYAT PESANAN */}
            {!selectedOrder ? (
              <div className="space-y-4 max-h-[26rem] overflow-y-auto pr-1 custom-scrollbar">
                {orderHistoryData.map((order) => (
                  <div key={order.id} className="bg-gray-50/70 border border-gray-100 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-gray-200 transition-all">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-mono font-bold text-gray-800">{order.id}</span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${order.step === 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[13px] font-bold text-gray-900">{order.items}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{order.date} • Total: <span className="text-[#4F5C18] font-semibold">{order.total}</span></p>
                    </div>
                    {/* BUTTON LACAK PESANAN */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-5 py-3 bg-[#4F5C18] text-white text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-[#3b4513] transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
                    >
                      <FiTruck size={14} /> Lacak Pesanan <FiChevronRight size={12}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* TAMPILAN 2: DETAIL PROSES LACAK SETELAH KLIK */
              <div className="animate-in slide-in-from-right-5 duration-300">
                {/* Tombol Kembali ke List Riwayat */}
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="mb-4 text-[11px] font-bold text-gray-400 hover:text-[#4F5C18] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  ← Kembali ke Riwayat Belanja
                </button>

                {/* Ringkasan Resi */}
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex justify-between items-center mb-6 text-left">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No. Resi Digital</p>
                    <p className="text-[13px] font-mono font-black text-gray-800">{selectedOrder.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-[12px] font-black text-[#4F5C18]">{selectedOrder.status}</p>
                  </div>
                </div>

                {/* Progress Bar Visual Linimasa */}
                <div className="border border-gray-100 rounded-3xl p-6 mb-6 bg-white shadow-2xs">
                  <div className="relative flex justify-between items-center w-full">
                    <div className="absolute left-4 right-4 top-5 h-1 bg-gray-200 -z-10"></div>
                    <div 
                      className="absolute left-4 top-5 h-1 bg-[#4F5C18] -z-10 transition-all duration-500"
                      style={{ width: `${((selectedOrder.step - 1) / 3) * 100}%` }}
                    ></div>

                    {/* Node 1 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedOrder.step >= 1 ? 'bg-[#4F5C18] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                        {selectedOrder.step > 1 ? <FiCheckCircle size={16} /> : "01"}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider mt-2">Diterima</span>
                    </div>

                    {/* Node 2 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedOrder.step >= 2 ? 'bg-[#4F5C18] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                        {selectedOrder.step > 2 ? <FiCheckCircle size={16} /> : "02"}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider mt-2">Dikemas</span>
                    </div>

                    {/* Node 3 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedOrder.step >= 3 ? 'bg-[#4F5C18] text-white shadow-md' : 'bg-gray-200 text-gray-400'} ${selectedOrder.step === 3 && 'animate-pulse'}`}>
                        {selectedOrder.step > 3 ? <FiCheckCircle size={16} /> : <FiTruck size={16} />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider mt-2">Dikirim</span>
                    </div>

                    {/* Node 4 */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedOrder.step >= 4 ? 'bg-[#4F5C18] text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                        {selectedOrder.step === 4 ? <FiCheckCircle size={16} /> : "04"}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider mt-2">Selesai</span>
                    </div>
                  </div>
                </div>

                {/* Log Perjalanan Paket Tergantung Step */}
                <div className="space-y-4 max-h-40 overflow-y-auto pr-1 custom-scrollbar text-left border-l border-gray-100 pl-2">
                  {selectedOrder.step === 3 ? (
                    <>
                      <div className="flex gap-4 border-l-2 border-[#4F5C18] pl-4 relative">
                        <div className="absolute w-2 h-2 rounded-full bg-[#4F5C18] -left-[5px] top-1.5"></div>
                        <div>
                          <p className="text-[12px] font-bold text-gray-800">Kurir sedang menuju ke lokasi rumah Anda</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">Hari ini — Paket dibawa oleh kurir partner Lumiere Express Hub Selatan.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 border-l-2 border-gray-200 pl-4 relative">
                        <div className="absolute w-2 h-2 rounded-full bg-gray-300 -left-[5px] top-1.5"></div>
                        <div>
                          <p className="text-[12px] font-medium text-gray-600">Pesanan lolos Quality Control & diserahkan ke Ekspedisi</p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">{selectedOrder.date}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-4 border-l-2 border-emerald-500 pl-4 relative">
                      <div className="absolute w-2 h-2 rounded-full bg-emerald-500 -left-[5px] top-1.5"></div>
                      <div>
                        <p className="text-[12px] font-bold text-gray-800">Paket Diterima dengan Selamat</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">Diterima langsung oleh Penghuni Rumah / Pembeli.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Modal */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsHistoryOpen(false)}
                className="px-6 py-3 bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT TOAST */}
      {alertMsg && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#262626] text-white px-12 py-5 rounded-full shadow-3xl text-[11px] font-black uppercase tracking-[0.25em] border border-[#4F5C18]/30 flex items-center gap-3.5">
             <FiHeart className="text-[#4F5C18] fill-[#4F5C18]" size={14} /> {alertMsg}
          </div>
        </div>
      )}

      {/* --- HERO WITH MODERNISED BACKGROUND --- */}
      <section className="relative pt-8 pb-16 px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-white via-white to-[#EBF2E7] rounded-[2.5rem] p-6 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] border border-white">
          <HeroBanner
            title="Seni Memancarkan Pesona"
            description="Eksplorasi koleksi kosmetik premium Lumière yang dirancang di Atelier kami dengan presisi tinggi."
          />
          <div className="mt-12 mb-4 flex justify-center items-center gap-8 flex-wrap">
            <div className="bg-white border border-[#4F5C18]/15 px-10 py-4 rounded-2xl flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-[#4F5C18]/10 flex items-center justify-center text-[#4F5C18]">
                <FiPercent size={15} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#4F5C18]">PROMO GUEST: LUMIERE30 — DISKON 30%</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 space-y-28 pb-24">
        
        {/* NEW DASHBOARD TAB STYLE CATEGORIES */}
        <section className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 mb-4 gap-3">
            <div className="text-left w-full sm:w-auto">
              <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-400">Kategori Eksklusif</h3>
              <p className="text-[12px] text-gray-500 font-medium mt-0.5">Pilih esensi kecantikan personal Anda</p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#4F5C18]/10 text-[#4F5C18] text-[10px] font-black uppercase tracking-widest self-start sm:self-auto">
              {activeCategory} Selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5 p-1.5 bg-gray-50 rounded-2xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                className={`flex-grow sm:flex-grow-0 px-8 py-4 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === cat 
                    ? "bg-[#4F5C18] text-white shadow-lg shadow-[#4F5C18]/10 scale-102" 
                    : "text-gray-500 hover:bg-white hover:text-[#4F5C18] hover:shadow-2xs"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCTS SECTION WITH HOVER INTERACTION CARDS */}
        <ContentSection title="Esensi Ikonik" subtitle="The Atelier Collection">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {filteredProducts.map((item) => (
              <div key={item.id} className="relative group bg-white p-5 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between">
                <div className="overflow-hidden rounded-2xl relative mb-3">
                  <AtelierProductCard {...item} />
                </div>
                <button 
                  onClick={() => handleAddToBag(item)}
                  className="w-full mt-4 bg-[#4F5C18] text-white py-3.5 px-4 rounded-xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2.5 text-[11px] font-black uppercase tracking-widest shadow-md shadow-[#4F5C18]/10 hover:bg-[#3d4713]"
                >
                  <FiShoppingBag size={15} /> Add to Bag
                </button>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-16 py-4.5 bg-white border border-gray-200 text-[#4F5C18] text-[11px] font-black tracking-[0.25em] uppercase rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all shadow-2xs hover:shadow-md"
            >
              {showAll ? "Tutup Koleksi" : "Lihat Seluruh Koleksi"}
            </button>
          </div>
        </ContentSection>

        {/* CUSTOMIZED MODERN CALL TO ACTION BANNER */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white p-14 sm:p-20 rounded-[2.5rem] border border-gray-100 shadow-2xs flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#4F5C18]/4 rounded-bl-full pointer-events-none"></div>
            <span className="text-[10px] font-black tracking-[0.25em] text-[#4F5C18] uppercase mb-3 flex items-center gap-2">
              <FiGift size={13}/> Newsletter Perks
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-gray-900 mb-3">Gabung di Atelier</h3>
            <p className="text-[13px] text-gray-400 mb-8 leading-relaxed max-w-md">Dapatkan info rilis produk eksklusif dan adaptasi tren kecantikan lab langsung ke email Anda.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3.5">
              {/* 4. Ditambahkan properti ref={emailInputRef} pada komponen LumiereInput di bawah ini */}
              <LumiereInput 
                ref={emailInputRef}
                type="email" 
                placeholder="Masukkan alamat email aktif anda..." 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="flex-grow bg-gray-50 h-16 rounded-xl px-6 border border-gray-200 focus:bg-white focus:border-[#4F5C18] text-[13px] transition-all" 
              />
              <button type="submit" className="h-16 px-10 bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2.5 shadow-md">
                {subscribed ? "Terdaftar ✓" : <>Join Now <FiArrowRight size={14}/></>}
              </button>
            </form>
          </div>
          
          <div className="lg:col-span-2 bg-[#4F5C18] p-14 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl shadow-[#4F5C18]/10 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-black/10 rounded-full transition-transform group-hover:scale-110 duration-500"></div>
            <div>
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-8 shadow-inner">
                <FiBox size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider mb-3">Lumière Store</h3>
              <p className="text-[13px] opacity-85 tracking-wide leading-relaxed">Kunjungi gerai fisik *offline* kami untuk konsultasi warna kulit personal secara instan bersama pakar kosmetik.</p>
            </div>
            <div className="mt-12 pt-5 border-t border-white/10 flex items-center gap-2.5 text-[12px] opacity-90 font-medium">
              <FiMapPin size={15} className="text-white/80"/> Pondok Indah Mall 3, Jakarta Selatan.
            </div>
          </div>
        </section>
      </div>

      {/* ADDED: GUEST DASHBOARD SYSTEM FOOTER AREA */}
      <footer className="w-full bg-white border-t border-gray-100 py-8 px-12 flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 text-[12px] text-gray-400 font-medium">
        <div className="flex items-center gap-2">
          <FiShield className="text-[#4F5C18]" size={15} />
          <span>&copy; {new Date().getFullYear()} Lumière Atelier. Powered by CRM Local System.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block shadow-xs"></span> Environment: Guest Environment
          </span>
          <span className="text-gray-200">|</span>
          <span className="text-gray-400 hover:text-[#4F5C18] cursor-pointer transition-colors">Privacy & Terms</span>
        </div>
      </footer>

      <Footer />
    </div>
  );
};

export default LumiereShowcase;