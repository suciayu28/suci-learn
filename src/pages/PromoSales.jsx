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
  FiClock,
  FiShoppingCart,
  FiCheck,
  FiMinus,
  FiEdit,
  FiTrash2,
  FiImage
} from "react-icons/fi"; 

// --- IMPORT DATA YANG SUDAH DIPISAHKAN ---
import { initialPromoProducts, defaultNewProductState } from "../data/promoData";

const PromoSales = () => {
  // ─── PROTEKSI ROLE & CART STATE ───────────────────────────────────────
  const [currentRole, setCurrentRole] = useState("Customer"); 
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); 

  // --- STATE FOR EVENT STATUS & TIMER ---
  const [isEventLive, setIsEventLive] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 9, seconds: 16 });

  // --- STATE FOR MODAL FORM VISIBILITY (ADMIN) ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Menampung produk yang sedang diedit

  // --- STATE FOR NEW/EDIT PRODUCT FORM ---
  const [newProduct, setNewProduct] = useState(defaultNewProductState);

  const titleInputRef = useRef(null);

  // --- STATE DATA PRODUK ---
  const [promoProducts, setPromoProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountFilter, setDiscountFilter] = useState("Semua Polongan Harga");

  // ─── EFFECT: LIFECYCLE DATA MANAGEMENT ───────────────────────────────
  useEffect(() => {
    // 1. Cek Role Sesi Login
    const savedUser = localStorage.getItem("userLoggedIn");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role) setCurrentRole(userData.role);
    }

    // 2. Ambil Data Keranjang Global
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCart(JSON.parse(savedCart));

    // 3. Ambil Data Produk Promo Berbasis LocalStorage / Initial Data
    const savedPromoProducts = localStorage.getItem("promoProductsItems");
    if (savedPromoProducts) {
      setPromoProducts(JSON.parse(savedPromoProducts));
    } else {
      setPromoProducts(initialPromoProducts);
      localStorage.setItem("promoProductsItems", JSON.stringify(initialPromoProducts));
    }

    // 4. Timer Countdown
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

  // Kalkulasi persentase diskon otomatis untuk form
  const calculatedDiscountPercent = () => {
    const original = parseFloat(newProduct.originalPrice);
    const discount = parseFloat(newProduct.discountPrice);
    if (original && discount && original > discount) {
      return Math.round(((original - discount) / original) * 100);
    }
    return 0;
  };

  // ─── LOGIKA ACTIONS ADMIN (CRUD PROMO) ───────────────────────────────
  const openAddPromoModal = () => {
    setEditingProduct(null);
    setNewProduct(defaultNewProductState);
    setIsFormOpen(true);
  };

  const openEditPromoModal = (product) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      originalPrice: product.originalPrice.toString(),
      discountPrice: product.discountPrice.toString(),
      img: product.img
    });
    setIsFormOpen(true);
  };

  const handleSaveCatalog = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.originalPrice || !newProduct.discountPrice) {
      alert("Mohon lengkapi nama produk dan harga terlebih dahulu.");
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80";
    let updatedPromoProducts;

    if (editingProduct) {
      // PROSES EDIT
      updatedPromoProducts = promoProducts.map((p) => p.id === editingProduct.id ? {
        ...p,
        title: newProduct.title,
        originalPrice: parseInt(newProduct.originalPrice),
        discountPrice: parseInt(newProduct.discountPrice),
        discountPercent: calculatedDiscountPercent(),
        img: newProduct.img.trim() !== "" ? newProduct.img : defaultImg
      } : p);
    } else {
      // PROSES TAMBAH BARU
      const createdProduct = {
        id: Date.now(),
        title: newProduct.title,
        originalPrice: parseInt(newProduct.originalPrice),
        discountPrice: parseInt(newProduct.discountPrice),
        discountPercent: calculatedDiscountPercent(),
        img: newProduct.img.trim() !== "" ? newProduct.img : defaultImg
      };
      updatedPromoProducts = [createdProduct, ...promoProducts];
    }

    setPromoProducts(updatedPromoProducts);
    localStorage.setItem("promoProductsItems", JSON.stringify(updatedPromoProducts));
    setNewProduct(defaultNewProductState); 
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  const handleDeletePromo = (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus promo untuk produk "${title}"?`)) {
      const updatedPromoProducts = promoProducts.filter((p) => p.id !== id);
      setPromoProducts(updatedPromoProducts);
      localStorage.setItem("promoProductsItems", JSON.stringify(updatedPromoProducts));
    }
  };

  // ─── LOGIKA ACTIONS CUSTOMER (ADD TO CART & MANAGE) ───────────────────
  const handleAddToCart = (product) => {
    let updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => item.id === product.id);
    const formattedPromoPrice = `Rp ${product.discountPrice.toLocaleString("id-ID")}`;

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        id: product.id,
        title: product.title,
        price: formattedPromoPrice, 
        tag: "Koleksi Promo",
        img: product.img,
        quantity: 1
      });
    }

    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    alert(`"${product.title}" (Harga Promo) dimasukkan ke keranjang.`);
  };

  const updateQuantity = (id, amount) => {
    let updatedCart = cart.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + amount;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean);

    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    const totalRaw = cart.reduce((sum, item) => {
      const numPrice = Number(item.price.replace("Rp ", "").replace(/\./g, "")) || 0;
      return sum + (numPrice * item.quantity);
    }, 0);
    return `Rp ${totalRaw.toLocaleString("id-ID")}`;
  };

  const handleFinalCheckout = () => {
    alert(`🎉 Checkout Promo Berhasil!\nTotal Pembayaran: ${calculateTotal()}\nPesanan Anda segera diproses oleh Atelier System.`);
    setCart([]);
    localStorage.removeItem("cartItems");
    setIsCartOpen(false);
  };

  // ─── METRICS CALCULATION ─────────────────────────────────────────────
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
    <div className="animate-in fade-in duration-500 pb-12 px-8 pt-6 font-poppins text-[#262626] w-full max-w-(screen-2xl) mx-auto relative">
      {/* HEADER PORTAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CRM &bull; PROMO & SALES</p>
          <h1 className="text-3xl font-playfair font-black text-[#262626]">
            {currentRole === "Admin" ? "Promo & Sales Curated Portal" : "Atelier Exclusive Offers"}
          </h1>
        </div>
        
        {/* ACTION HEADER BUTTONS: Hanya untuk Admin */}
        {currentRole === "Admin" && (
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => setIsEventLive(!isEventLive)}
              className={`border px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all duration-300 cursor-pointer shadow-xs ${
                isEventLive ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isEventLive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
              Status Event: {isEventLive ? "Live" : "Paused"}
            </button>

            <button 
              type="button"
              onClick={openAddPromoModal}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#4F5C18] shadow-md shadow-[#4F5C18]/20 hover:bg-[#3d4713] text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <FiPlus size={16} /> Tambah Promo
            </button>
          </div>
        )}
      </div>

      {/* 1. ANALYTICS METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#F3F3F3] shadow-xs flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><FiTag size={20} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Item Aktif</p>
            <h3 className="text-xl font-bold text-[#262626] mt-0.5">{totalItems} Produk</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F3F3F3] shadow-xs flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><FiPercent size={20} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Rata-Rata Diskon</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{averageDiscount}% Potongan</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#F3F3F3] shadow-xs flex items-center gap-5">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><FiTrendingUp size={20} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Katalog Diskon Besar</p>
            <h3 className="text-xl font-bold text-purple-600 mt-0.5">{bigDiscountCount} Item (&gt;=30%)</h3>
          </div>
        </div>
      </div>

      {/* 2. MODAL FORM: DYNAMIC INPUT/EDIT UNTUK ADMIN */}
      {isFormOpen && currentRole === "Admin" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-[#F3F3F3] pb-4">
              <div>
                <h3 className="font-playfair font-bold text-2xl text-[#262626]">
                  {editingProduct ? "Edit Promo Campaign" : "Registrasi Kampanye Promo"}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">*Sistem otomatis mengkalkulasi persentase potongan harga.*</p>
              </div>
              <button onClick={() => { setIsFormOpen(false); setEditingProduct(null); }} className="text-gray-400 hover:text-red-500 cursor-pointer"><FiX size={22} /></button>
            </div>

            <form onSubmit={handleSaveCatalog} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nama Koleksi Produk</label>
                <input ref={titleInputRef} required type="text" placeholder="Contoh: Velvet Lip Matte" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:bg-white outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Harga Awal (Coret)</label>
                  <input required type="number" placeholder="Contoh: 180000" value={newProduct.originalPrice} onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:bg-white outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Harga Diskon Efektif</label>
                  <input required type="number" placeholder="Contoh: 126000" value={newProduct.discountPrice} onChange={(e) => setNewProduct({...newProduct, discountPrice: e.target.value})} className="bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium focus:bg-white outline-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Label Hasil Potongan Otomatis</label>
                <div className="bg-gray-100/80 text-[#4F5C18] font-mono font-black text-xs rounded-xl py-3 px-4 flex items-center">
                  {calculatedDiscountPercent() > 0 ? `Diskon Terkalkulasi: ${calculatedDiscountPercent()}% OFF` : "0% Off (Harga awal harus lebih besar dari diskon)"}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tautan Gambar Utama</label>
                <div className="relative">
                  <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Masukkan URL Gambar..." value={newProduct.img} onChange={(e) => setNewProduct({...newProduct, img: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-11 pr-4 text-xs font-medium focus:bg-white outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#4F5C18] hover:bg-[#3d4713] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-4">
                <FiSave size={14} /> {editingProduct ? "Update Data Promo" : "Simpan Ke Etalase"}
              </button>
            </form>
          </div>
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
              <div>
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
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-[11px] text-gray-300 line-through font-medium">
                      {formatIDR(product.originalPrice)}
                    </span>
                    <span className="text-xs text-[#4F5C18] font-bold">
                      {formatIDR(product.discountPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS BERDASARKAN ROLE */}
              {currentRole === "Admin" ? (
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  <button 
                    type="button" 
                    onClick={() => openEditPromoModal(product)} 
                    className="flex-1 py-2 bg-gray-50 hover:bg-[#4F5C18] hover:text-white text-gray-500 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FiEdit size={11} /> Edit
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeletePromo(product.id, product.title)} 
                    className="py-2 px-3 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all flex items-center justify-center cursor-pointer"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-2.5 bg-[#4F5C18] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-[#262626] cursor-pointer"
                >
                  <FiShoppingCart size={12} /> Add Promo Item
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-16 text-center">
          <FiTag size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-xs text-gray-400 italic">Tidak ada produk promosi kosmetik yang cocok dengan kriteria filter.</p>
        </div>
      )}

      {/* FLOATING CART BUTTON (Khusus Customer/Guest) */}
      {currentRole !== "Admin" && cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#262626] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 hover:bg-[#4F5C18] transition-all cursor-pointer animate-pulse"
        >
          <FiShoppingCart className="text-base text-[#F2F7D6]" />
          <span className="text-[10px] font-black tracking-widest uppercase">
            View Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </span>
        </button>
      )}

      {/* MODAL DETAIL KERANJANG & CHECKOUT UNTUK CUSTOMER/GUEST */}
      {isCartOpen && currentRole !== "Admin" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="font-['Playfair_Display'] italic font-bold text-xl text-[#262626] flex items-center gap-2">
                  <FiShoppingCart className="text-[#4F5C18]" /> Promo Cart Overview
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 cursor-pointer"><FiX size={20} /></button>
              </div>

              {/* LIST DETAIL ITEM DI KERANJANG */}
              <div className="overflow-y-auto max-h-[38vh] space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-[#F3F3F3] p-3 rounded-xl">
                    <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-grow">
                      <h5 className="font-bold text-xs text-[#262626] line-clamp-1">{item.title}</h5>
                      <span className="text-[9px] bg-white text-[#4F5C18] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm mt-0.5 inline-block">{item.tag}</span>
                      <p className="text-[11px] font-bold text-[#4F5C18] mt-0.5">{item.price}</p>
                    </div>
                    {/* QUANTITY CONTROLLER */}
                    <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-[#4F5C18] cursor-pointer"><FiMinus size={10} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-[#4F5C18] cursor-pointer"><FiPlus size={10} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RINGKASAN TOTAL & TOMBOL SUBMIT */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Est. Payment</span>
                <span className="text-lg font-bold text-[#4F5C18]">{calculateTotal()}</span>
              </div>
              <button 
                onClick={handleFinalCheckout}
                className="w-full bg-[#4F5C18] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:bg-[#262626] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiCheck size={14} /> Secure Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoSales;