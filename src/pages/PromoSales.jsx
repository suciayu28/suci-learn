import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { 
  FiPlus, 
  FiX, 
  FiSave, 
  FiTrendingUp, 
  FiPercent,
  FiPlay,
  FiPause,
  FiTag,
  FiSearch,
  FiClock
} from "react-icons/fi"; 

// --- IMPORT DATA YANG SUDAH DIPISAHKAN ---
import { initialPromoProducts, defaultNewProductState } from "../data/promoData";

const PromoSales = () => {
  // --- STATE FOR EVENT STATUS & TIMER ---
  const [isEventLive, setIsEventLive] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 9, seconds: 16 });

  // --- STATE FOR MODAL FORM VISIBILITY ---
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- STATE FOR NEW PRODUCT FORM (Menggunakan data default dari file data) ---
  const [newProduct, setNewProduct] = useState(defaultNewProductState);

  const titleInputRef = useRef(null);

  // --- STATE DATA PRODUK (Mengambil initial data dari file data) ---
  const [promoProducts, setPromoProducts] = useState(initialPromoProducts);

  const [searchQuery, setSearchQuery] = useState("");
  const [discountFilter, setDiscountFilter] = useState("Semua Polongan Harga");

  // --- EFFECT: TIMER COUNTDOWN ---
  useEffect(() => {
    let timer;
    if (isEventLive) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          clearInterval(timer);
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isEventLive]);

  useEffect(() => {
    if (isFormOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 150);
    }
  }, [isFormOpen]);

  const calculatedDiscountPercent = () => {
    const original = parseFloat(newProduct.originalPrice);
    const discount = parseFloat(newProduct.discountPrice);
    if (original && discount && original > discount) {
      return Math.round(((original - discount) / original) * 100);
    }
    return 0;
  };

  const handleSaveCatalog = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.originalPrice || !newProduct.discountPrice) {
      alert("Mohon lengkapi nama produk dan harga terlebih dahulu.");
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80";
    const createdProduct = {
      id: Date.now(),
      title: newProduct.title,
      originalPrice: parseInt(newProduct.originalPrice),
      discountPrice: parseInt(newProduct.discountPrice),
      discountPercent: calculatedDiscountPercent(),
      img: newProduct.img.trim() !== "" ? newProduct.img : defaultImg
    };

    setPromoProducts([createdProduct, ...promoProducts]);
    setNewProduct(defaultNewProductState); // Reset form menggunakan default state
    setIsFormOpen(false);
  };

  const totalItems = promoProducts.length;
  const averageDiscount = totalItems > 0 
    ? (promoProducts.reduce((sum, p) => sum + p.discountPercent, 0) / totalItems).toFixed(1) 
    : 0;
  const bigDiscountCount = promoProducts.filter(p => p.discountPercent >= 30).length;

  const filteredProducts = promoProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (discountFilter === "Diskon Besar (>=30%)") return matchesSearch && product.discountPercent >= 30;
    if (discountFilter === "Diskon Menengah (20%-29%)") return matchesSearch && product.discountPercent >= 20 && product.discountPercent < 30;
    if (discountFilter === "Diskon Kecil (<20%)") return matchesSearch && product.discountPercent < 20;
    return matchesSearch;
  });

  const formatIDR = (num) => "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    // ... Sisa kode return JSX Anda ke bawah sama persis tidak ada yang berubah ...
    <div className="animate-in fade-in duration-500 pb-12 px-8 pt-6 font-poppins text-[#262626] w-full max-w-(screen-2xl) mx-auto">
      {/* HEADER PORTAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CRM &bull; PROMO & SALES</p>
          <h1 className="text-3xl font-playfair font-black text-[#262626]">Promo & Sales Curated Portal</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsEventLive(!isEventLive)}
            className={`border px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all duration-300 cursor-pointer shadow-xs ${
              isEventLive 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isEventLive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
            Status Event: {isEventLive ? "Live" : "Paused"}
          </button>

          <button 
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer text-white ${
              isFormOpen ? "bg-gray-700 shadow-gray-700/20" : "bg-[#4F5C18] shadow-[#4F5C18]/20 hover:bg-[#3d4713]"
            }`}
          >
            {isFormOpen ? (
              <>
                <FiX size={16} /> Tutup Form
              </>
            ) : (
              <>
                <FiPlus size={16} /> Tambah Promo
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. ANALYTICS METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#F3F3F3] shadow-xs flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <FiTag size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Item Aktif</p>
            <h3 className="text-xl font-bold text-[#262626] mt-0.5">{totalItems} Produk</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F3F3F3] shadow-xs flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiPercent size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rata-Rata Diskon</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{averageDiscount}% Potongan</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F3F3F3] shadow-xs flex items-center gap-5">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Katalog Diskon Besar</p>
            <h3 className="text-xl font-bold text-purple-600 mt-0.5">{bigDiscountCount} Item (&gt;=30%)</h3>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC REGISTRATION FORM */}
      {isFormOpen && (
        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-md mb-8 animate-in slide-in-from-top duration-300">
          <div className="border-b border-[#F3F3F3] pb-4 mb-6">
            <h4 className="font-playfair font-bold text-lg text-[#262626]">Registrasi Kampanye Kosmetik Baru</h4>
            <p className="text-xs text-gray-400 mt-1">
              *Masukkan MSRP Awal dan Harga Diskon, sistem otomatis mengkalkulasi persentase label potongan.*
            </p>
          </div>

          <form onSubmit={handleSaveCatalog} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nama Koleksi Produk</label>
              <input 
                ref={titleInputRef}
                type="text"
                placeholder="Contoh: Velvet Lip Matte"
                value={newProduct.title}
                onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-xs font-medium focus:bg-white focus:border-gray-300 transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">MSRP Awal (Harga Coret)</label>
              <input 
                type="number"
                placeholder="Contoh: 180000"
                value={newProduct.originalPrice}
                onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-xs font-medium focus:bg-white focus:border-gray-300 transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Harga Diskon Efektif</label>
              <input 
                type="number"
                placeholder="Contoh: 126000"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({...newProduct, discountPrice: e.target.value})}
                className="bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-xs font-medium focus:bg-white focus:border-gray-300 transition-all outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Label Diskon Otomatis</label>
              <div className="bg-gray-100/70 text-gray-500 font-mono font-bold text-xs rounded-xl py-2.5 px-4 h-[40px] flex items-center">
                {calculatedDiscountPercent() > 0 ? `${calculatedDiscountPercent()}%` : "0% Off"}
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tautan Aset Gambar Utama</label>
              <input 
                type="text"
                placeholder="Masukkan URL Gambar..."
                value={newProduct.img}
                onChange={(e) => setNewProduct({...newProduct, img: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-xs font-medium focus:bg-white focus:border-gray-300 transition-all outline-none"
              />
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full bg-[#4F5C18] hover:bg-[#3d4713] text-white py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <FiSave size={14} /> Simpan Katalog
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. CAMPAIGN BANNER (FLASH SALE COUNTDOWN) */}
      <div className="bg-[#4F5C18] text-white p-6 md:p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-xl shadow-[#4F5C18]/10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-black/5 rounded-full translate-x-12 -translate-y-12"></div>
        <div>
          <span className={`border px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase flex items-center gap-1.5 w-fit mb-3 transition-colors ${
            isEventLive ? "bg-white/10 text-white border-white/20" : "bg-rose-500/20 text-rose-200 border-rose-500/30"
          }`}>
            {isEventLive ? <FiPlay size={8} /> : <FiPause size={8} />} Live Marketing System
          </span>
          <h4 className="text-xl font-playfair font-bold tracking-tight mb-1">
            Etalase Kampanye <span className="italic font-normal text-white/90">Flash Sale</span>
          </h4>
          <p className="text-xs text-white/70 font-light max-w-xl">
            {isEventLive 
              ? "Status modul hitung mundur saat ini sedang memancarkan data secara realtime ke etalase konsumen Lumière." 
              : "Sistem transmisi dihentikan sementara. Sistem hitung mundur etalase konsumen dibekukan."
            }
          </p>
        </div>

        {/* TIMER DISPLAY */}
        <div className="bg-black/10 border border-white/10 backdrop-blur-md px-6 py-4 rounded-xl flex flex-col items-center min-w-[190px]">
          <span className="text-[9px] text-white/60 font-bold tracking-widest uppercase mb-1.5 flex items-center gap-1">
            <FiClock size={12} /> Sisa Waktu Event
          </span>
          <div className="font-mono text-xl font-black tracking-widest flex items-center gap-1.5">
            <span>{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className={`${isEventLive ? "animate-pulse" : ""} text-white/40`}>:</span>
            <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className={`${isEventLive ? "animate-pulse" : ""} text-white/40`}>:</span>
            <span className={isEventLive ? "text-rose-300" : "text-gray-300"}>{String(timeLeft.seconds).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      {/* 4. SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-[#F3F3F3] shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Cari nama koleksi kosmetik promo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-transparent rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium placeholder-gray-400 focus:bg-white focus:border-gray-200 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">Filter Besaran:</span>
          <select 
            value={discountFilter}
            onChange={(e) => setDiscountFilter(e.target.value)}
            className="bg-gray-50 border border-[#F3F3F3] rounded-xl px-4 py-2 text-xs font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100/50 transition-colors"
          >
            <option>Semua Polongan Harga</option>
            <option>Diskon Besar (&gt;=30%)</option>
            <option>Diskon Menengah (20%-29%)</option>
            <option>Diskon Kecil (&lt;20%)</option>
          </select>
        </div>
      </div>

      {/* 5. PRODUCT DISPLAY GRID LIST */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-[#F3F3F3] p-4 shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
              <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50 aspect-square">
                <img 
                  src={product.img} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-rose-500 text-white font-mono text-[9px] font-bold px-2.5 py-0.5 rounded shadow-xs">
                  {product.discountPercent}% OFF
                </span>
              </div>

              <div className="text-center px-1 pb-1">
                <h4 className="font-playfair font-bold text-[13px] text-gray-800 tracking-tight mb-2 truncate">
                  {product.title}
                </h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[11px] text-gray-300 line-through font-medium">
                    {formatIDR(product.originalPrice)}
                  </span>
                  <span className="text-xs text-[#4F5C18] font-bold">
                    {formatIDR(product.discountPrice)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <FiTag size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-xs text-gray-400 italic">Tidak ada produk promosi kosmetik yang cocok dengan kriteria filter.</p>
        </div>
      )}
    </div>
  );
};

export default PromoSales;