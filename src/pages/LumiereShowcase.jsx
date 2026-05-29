import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Import navigasi
import {
  FiStar, FiPercent, FiBox, FiArrowRight,
  FiHeart, FiTag, FiSend, FiShoppingBag, FiChevronUp, FiX, FiClock
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

const LumiereShowcase = () => {
  const navigate = useNavigate(); // Inisialisasi navigasi
  
  // --- STATE ---
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [isBagOpen, setIsBagOpen] = useState(false);

  // --- DATA PRODUK ---
  const categories = ["Semua", "Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"];
  const allProducts = [
    { id: 1, title: "Velvet Lipstick", price: "Rp 350.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "Glow Cushion", price: "Rp 525.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "Rose Serum", price: "Rp 850.000", tag: "Perawatan Kulit", img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600" },
    { id: 4, title: "Silk Blush", price: "Rp 420.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800" },
    { id: 5, title: "Midnight Oud", price: "Rp 1.200.000", tag: "Parfum", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600" },
    { id: 6, title: "Facial Roller", price: "Rp 275.000", tag: "Alat Kecantikan", img: "https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=600" },
    { id: 7, title: "Cleansing Balm", price: "Rp 310.000", tag: "Perawatan Kulit", img: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=600" },
    { id: 8, title: "Eye Palette", price: "Rp 680.000", tag: "Tata Rias", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600" },
  ];

  // --- LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (activeCategory !== "Semua") result = allProducts.filter(p => p.tag === activeCategory);
    return showAll ? result : result.slice(0, 4);
  }, [activeCategory, showAll]);

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
    <div className="bg-[#F3F3F3] min-h-screen font-poppins text-[#262626] overflow-x-hidden selection:bg-[#4F5C18] selection:text-white">
      
      {/* FLOATING BAG & NAVIGATION */}
      <div className="fixed top-8 right-8 z-[100] flex flex-col items-end gap-3">
        <div 
          onClick={() => setIsBagOpen(!isBagOpen)}
          className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white flex items-center gap-4 transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="relative">
            <FiShoppingBag size={22} className="text-[#4F5C18]" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#4F5C18] text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {cartItems.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#4F5C18]">My Atelier Bag</span>
        </div>

        {/* Dropdown Menu */}
        {isBagOpen && (
          <div className="w-80 bg-white rounded-[2.5rem] shadow-3xl border border-gray-100 p-8 animate-in fade-in slide-in-from-top-5">
            <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Keranjang Belanja</h4>
              <FiX className="cursor-pointer text-gray-300 hover:text-red-500 transition-colors" onClick={() => setIsBagOpen(false)} />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-5 pr-2 mb-8 custom-scrollbar">
              {cartItems.length > 0 ? cartItems.map((item) => (
                <div key={item.cartId} className="flex items-center gap-4 group">
                  <img src={item.img} alt={item.title} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                  <div className="flex-grow">
                    <p className="text-[11px] font-bold text-[#262626]">{item.title}</p>
                    <p className="text-[10px] text-[#4F5C18] font-medium">{item.price}</p>
                  </div>
                  <button onClick={() => setCartItems(prev => prev.filter(i => i.cartId !== item.cartId))} className="text-gray-200 hover:text-red-400 p-2 transition-colors">
                    <FiX size={14} />
                  </button>
                </div>
              )) : (
                <div className="text-center py-6">
                  <FiShoppingBag size={24} className="mx-auto text-gray-200 mb-2" />
                  <p className="text-[10px] text-gray-400 italic">Belum ada pilihan keindahan.</p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <button 
                onClick={() => navigate("/order-history")}
                className="w-full py-4 bg-[#4F5C18] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#3a4412] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#4F5C18]/20"
              >
                <FiClock /> Riwayat Pesanan
              </button>
              <button 
                onClick={() => navigate("/customers")}
                className="w-full py-4 bg-white border border-[#F3F3F3] text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-gray-50 transition-all"
              >
                Customer Management
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ALERT TOAST */}
      {alertMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#262626] text-white px-10 py-5 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-[#4F5C18] flex items-center gap-3">
             <FiHeart className="text-[#4F5C18] fill-[#4F5C18]" /> {alertMsg}
          </div>
        </div>
      )}

      {/* --- HERO --- */}
      <section className="relative pt-20 pb-20 px-6">
        <HeroBanner
          title="Seni Memancarkan Pesona"
          description="Eksplorasi koleksi kosmetik premium Lumière yang dirancang di Atelier kami dengan presisi tinggi."
        />
        <div className="mt-16 flex justify-center items-center gap-8 flex-wrap">
          <div className="bg-[#4F5C18] px-12 py-5 rounded-full flex items-center gap-4 shadow-2xl shadow-[#4F5C18]/30 transition-all hover:scale-105">
            <FiPercent className="text-white" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">LUMIERE30 — DISKON 30%</span>
          </div>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 space-y-40 pb-32">
        
        {/* CATEGORIES */}
        <section className="text-center">
          <span className="inline-block px-5 py-2 rounded-full bg-[#4F5C18]/10 text-[#4F5C18] text-[9px] font-black uppercase tracking-[0.4em] mb-10">Select Your Essence</span>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                  activeCategory === cat ? "bg-[#4F5C18] text-white shadow-xl" : "bg-white text-gray-400 hover:text-[#4F5C18]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <ContentSection title="Esensi Ikonik" subtitle="The Atelier Collection">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProducts.map((item) => (
              <div key={item.id} className="relative group">
                <AtelierProductCard {...item} />
                <button 
                  onClick={() => handleAddToBag(item)}
                  className="absolute bottom-6 right-6 bg-[#4F5C18] text-white p-5 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl z-20"
                >
                  <FiShoppingBag size={22} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-24 text-center">
            <LumiereButton
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="px-20 py-8 border-2 border-[#4F5C18] text-[#4F5C18] font-black tracking-[0.3em] hover:bg-[#4F5C18] hover:text-white rounded-full transition-all"
            >
              {showAll ? "Tutup Koleksi" : "Lihat Seluruh Koleksi"}
            </LumiereButton>
          </div>
        </ContentSection>

        {/* CALL TO ACTION */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 bg-white p-16 rounded-[4rem] border border-gray-100 shadow-sm flex flex-col justify-center">
            <h3 className="text-4xl font-playfair italic mb-8">Gabung di Atelier</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <LumiereInput type="email" placeholder="Alamat Email Anda" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-grow bg-[#F3F3F3] h-16 rounded-2xl px-8 border-none" />
              <LumiereButton type="submit" className="h-16 px-12 bg-[#262626] text-white rounded-2xl">
                {subscribed ? "Terdaftar" : "Join Now"}
              </LumiereButton>
            </form>
          </div>
          <div className="lg:col-span-2 bg-[#4F5C18] p-16 rounded-[4rem] text-white text-center flex flex-col items-center justify-center shadow-2xl shadow-[#4F5C18]/20">
            <FiBox size={40} className="mb-6 opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-4">Lumière Store</h3>
            <p className="text-xs opacity-70 tracking-widest leading-loose">Pondok Indah Mall 3, <br/>Jakarta Selatan.</p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default LumiereShowcase;