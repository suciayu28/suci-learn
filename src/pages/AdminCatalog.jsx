import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiSearch,
  FiDollarSign,
  FiLink,
  FiShoppingCart,
  FiCheck,
  FiMinus,
  FiLoader
} from "react-icons/fi";
import { supabase } from "../services/supabaseClient";
import defaultProducts from "../data/productsData.json"; 

const DEFAULT_IMG = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600";

// Fallback gambar per kategori supaya produk selalu punya gambar
const CATEGORY_IMGS = {
  "Tata Rias":        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
  "Perawatan Kulit":  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
  "Parfum":           "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600",
  "Alat Kecantikan":  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
};

const getFallbackImg = (tag) => CATEGORY_IMGS[tag] || DEFAULT_IMG;

const AdminCatalog = () => {
  const [currentRole, setCurrentRole] = useState("Customer"); 
  const [cart, setCart] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    tag: "Tata Rias",
    img_url: ""
  });

  const titleInputRef = useRef(null);

  // ── FETCH PRODUCTS FROM SUPABASE ──────────────────────────────────
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Normalise columns: Supabase uses img_url, UI uses img
        const normalised = data.map(p => ({
          ...p,
          img: p.img_url || DEFAULT_IMG,
          price: typeof p.price === 'number'
            ? `Rp ${p.price.toLocaleString('id-ID')}`
            : p.price
        }));
        setProducts(normalised);
      } else {
        // Seed default products into Supabase on first load
        const seeds = defaultProducts.map(p => ({
          title: p.title,
          price: Number(p.price.replace('Rp ', '').replace(/\./g, '')),
          tag: p.tag,
          img_url: p.img,
          is_active: true,
          stock_quantity: 50
        }));
        const { data: inserted, error: seedErr } = await supabase
          .from('products').insert(seeds).select();
        if (!seedErr && inserted) {
          const normalised = inserted.map(p => ({
            ...p,
            img: p.img_url || DEFAULT_IMG,
            price: `Rp ${p.price.toLocaleString('id-ID')}`
          }));
          setProducts(normalised);
        }
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      // fallback to local
      setProducts(defaultProducts.map(p => ({ ...p, img: p.img })));
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("userLoggedIn");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role) setCurrentRole(userData.role);
    }
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCart(JSON.parse(savedCart));

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isDialogOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 150);
    }
  }, [isDialogOpen]);

  const categories = ["Semua", "Tata Rias", "Perawatan Kulit", "Parfum", "Alat Kecantikan"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.tag || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || p.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ── ADMIN: OPEN DIALOGS ───────────────────────────────────────────
  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({ title: "", price: "", tag: "Tata Rias", img_url: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    // Price is stored as formatted string, extract raw number
    const rawPrice = typeof product.price === 'string'
      ? product.price.replace("Rp ", "").replace(/\./g, "")
      : String(product.price || "");
    setFormData({
      title: product.title,
      price: rawPrice,
      tag: product.tag,
      img_url: product.img_url || product.img || ""
    });
    setIsDialogOpen(true);
  };

  // ── ADMIN: SAVE (INSERT/UPDATE) TO SUPABASE ───────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const numericPrice = Number(formData.price) || 0;
    const imgUrl = formData.img_url.trim() || DEFAULT_IMG;

    try {
      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update({ title: formData.title, price: numericPrice, tag: formData.tag, img_url: imgUrl })
          .eq('id', editingProduct.id)
          .select();
        if (error) throw error;
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
          ...p, title: formData.title,
          price: `Rp ${numericPrice.toLocaleString('id-ID')}`,
          tag: formData.tag, img: imgUrl, img_url: imgUrl
        } : p));
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([{ title: formData.title, price: numericPrice, tag: formData.tag, img_url: imgUrl, is_active: true, stock_quantity: 50 }])
          .select();
        if (error) throw error;
        if (data && data[0]) {
          setProducts(prev => [{
            ...data[0],
            img: data[0].img_url || DEFAULT_IMG,
            price: `Rp ${data[0].price.toLocaleString('id-ID')}`
          }, ...prev]);
        }
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // ── ADMIN: DELETE FROM SUPABASE ───────────────────────────────────
  const handleDeleteProduct = async (id, title) => {
    if (!confirm(`Hapus produk "${title}" dari katalog?`)) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", price: "", tag: "Tata Rias", img_url: "" });
    setEditingProduct(null);
  };

  // ── CUSTOMER/GUEST: CART LOGIC ────────────────────────────────────
  const handleAddToCart = (product) => {
    let updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
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
      const numPrice = typeof item.price === 'string'
        ? Number(item.price.replace("Rp ", "").replace(/\./g, "")) || 0
        : Number(item.price) || 0;
      return sum + (numPrice * item.quantity);
    }, 0);
    return `Rp ${totalRaw.toLocaleString("id-ID")}`;
  };

  const handleFinalCheckout = () => {
    alert(`🎉 Checkout Berhasil!\nTotal Tagihan: ${calculateTotal()}\nPesanan Anda telah dicatat ke sistem Atelier CRM.`);
    setCart([]);
    localStorage.removeItem("cartItems");
    setIsCartOpen(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins text-[#262626] relative">
      <PageHeader 
        title={currentRole === "Admin" ? "Atelier Catalog Management" : "Atelier Luxury Collections"} 
        breadcrumb={["CRM", "Catalog"]}
      >
        {currentRole === "Admin" && (
          <button 
            onClick={openAddDialog}
            className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FiPlus size={14} /> Add New Product
          </button>
        )}
      </PageHeader>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-8">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
          <input 
            type="text" 
            placeholder="Search catalog by name or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-6 py-4 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === "Semua" ? "All Categories" : cat}</option>
          ))}
        </select>
      </div>

      {/* LOADING STATE */}
      {loadingProducts ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <FiLoader className="w-10 h-10 text-[#4F5C18] animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#4F5C18]">Loading Catalog...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-[3rem] border border-[#F3F3F3] shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col justify-between">
              <div>
                <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-6 bg-gray-50">
                  <img 
                    src={product.img_url || product.img || getFallbackImg(product.tag)} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => { 
                      // Fallback ke gambar sesuai kategori
                      const fallback = getFallbackImg(product.tag);
                      if (e.target.src !== fallback) {
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#4F5C18] text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">{product.tag}</span>
                  </div>
                </div>
                <div className="space-y-1 px-2 mb-6 text-center">
                  <h4 className="text-xl font-['Playfair_Display'] italic font-bold text-[#262626] line-clamp-1">{product.title}</h4>
                  <p className="text-[#4F5C18] font-bold text-xs tracking-tighter">{product.price}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-50">
                {currentRole === "Admin" ? (
                  <>
                    <button onClick={() => openEditDialog(product)} className="flex-1 py-3 bg-[#F3F3F3] hover:bg-[#4F5C18] hover:text-white text-gray-500 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer"><FiEdit size={12} /> Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id, product.title)} className="py-3 px-4 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all flex items-center justify-center cursor-pointer"><FiTrash2 size={13} /></button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-3.5 bg-[#4F5C18] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer"
                  >
                    <FiShoppingCart size={13} /> Add To Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-[#F3F3F3] text-gray-400 italic">
          {currentRole === "Admin" ? "Belum ada produk. Klik \"Add New Product\" untuk menambahkan." : "No catalog items match criteria."}
        </div>
      )}

      {/* FLOATING CART BUTTON */}
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

      {/* MODAL: FORM INPUT/EDIT ADMIN */}
      {isDialogOpen && currentRole === "Admin" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">{editingProduct ? "Edit Atelier Product" : "Add Product to Catalog"}</h3>
              <button onClick={() => { setIsDialogOpen(false); resetForm(); }} className="text-gray-400 hover:text-red-500 cursor-pointer"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Title</label>
                <input ref={titleInputRef} required className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl outline-none text-sm" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category Tag</label>
                <select className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl outline-none text-sm" value={formData.tag} onChange={(e) => setFormData({...formData, tag: e.target.value})}>
                  <option value="Tata Rias">Tata Rias</option>
                  <option value="Perawatan Kulit">Perawatan Kulit</option>
                  <option value="Parfum">Parfum</option>
                  <option value="Alat Kecantikan">Alat Kecantikan</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Price (Angka saja)</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="number" className="w-full pl-12 pr-5 py-3.5 bg-[#F3F3F3] rounded-2xl outline-none text-sm" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Image URL <span className="normal-case font-normal">(opsional)</span></label>
                <p className="text-[9px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl mb-2">
                  ⚠️ Harus URL gambar langsung (akhiran .jpg/.png/.webp). Contoh dari Google: klik kanan gambar → "Salin alamat gambar"
                </p>
                <div className="relative">
                  <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-3.5 bg-[#F3F3F3] rounded-2xl outline-none text-sm" 
                    placeholder="https://images.unsplash.com/photo-xxx..." 
                    value={formData.img_url} 
                    onChange={(e) => setFormData({...formData, img_url: e.target.value})} 
                  />
                </div>
                {/* Preview image */}
                {formData.img_url ? (
                  <div className="mt-3 relative">
                    <img 
                      src={formData.img_url} 
                      alt="preview" 
                      className="h-24 w-full object-cover rounded-2xl" 
                      onError={(e) => { 
                        e.target.style.display='none'; 
                        e.target.nextSibling.style.display='flex';
                      }} 
                    />
                    <div className="hidden h-24 w-full bg-amber-50 rounded-2xl items-center justify-center text-[10px] text-amber-600 font-bold">
                      ❌ URL tidak valid — gambar tidak bisa dimuat
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-[9px] text-slate-400">Kosongkan untuk pakai gambar otomatis sesuai kategori.</p>
                )}
              </div>

              <button type="submit" disabled={isSaving} className="w-full bg-[#4F5C18] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />} {isSaving ? "Menyimpan..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KERANJANG CUSTOMER/GUEST */}
      {isCartOpen && currentRole !== "Admin" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="font-['Playfair_Display'] italic font-bold text-2xl text-[#262626] flex items-center gap-2">
                  <FiShoppingCart className="text-[#4F5C18]" /> Shopping Cart Details
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <FiX size={22} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[40vh] space-y-4 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-[#F3F3F3] p-4 rounded-2xl">
                    <img src={item.img || item.img_url || DEFAULT_IMG} alt={item.title} className="w-16 h-16 object-cover rounded-xl" onError={(e) => { e.target.src = DEFAULT_IMG; }} />
                    <div className="flex-grow">
                      <h5 className="font-bold text-sm text-[#262626] line-clamp-1">{item.title}</h5>
                      <span className="text-[10px] bg-white text-[#4F5C18] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block">{item.tag}</span>
                      <p className="text-xs font-semibold text-[#4F5C18] mt-1">{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-[#4F5C18] cursor-pointer"><FiMinus size={12} /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-[#4F5C18] cursor-pointer"><FiPlus size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex justify-between items-center mb-6 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total Est. Payment</span>
                <span className="text-xl font-bold text-[#4F5C18]">{calculateTotal()}</span>
              </div>
              <button 
                onClick={handleFinalCheckout}
                className="w-full bg-[#4F5C18] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:bg-[#262626] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiCheck size={16} /> Confirm Order & Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;