import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSave, 
  FiX, 
  FiSearch,
  FiTag,
  FiDollarSign,
  FiLink,
  FiCheckCircle
} from "react-icons/fi";
import { getCRMData, saveCRMData } from "../lib/crmData";

const AdminCatalog = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    tag: "Tata Rias",
    img: ""
  });

  // Focus Refs
  const titleInputRef = useRef(null);

  // Fetch products on load
  useEffect(() => {
    const db = getCRMData();
    setProducts(db.products || []);
  }, []);

  // Auto-focus first form input when Dialog modal opens
  useEffect(() => {
    if (isDialogOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 150);
    }
  }, [isDialogOpen]);

  // Extract unique categories from products
  const categories = ["Semua", ...new Set(products.map((p) => p.tag))];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || p.tag === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Add/Edit modal launch
  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      price: "",
      tag: "Tata Rias",
      img: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.replace("Rp ", "").replace(/\./g, ""),
      tag: product.tag,
      img: product.img
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Format price to Indonesian Rupiah representation (e.g. "Rp 350.000")
    const numericPrice = Number(formData.price) || 0;
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;

    let updatedProducts;

    if (editingProduct) {
      // Edit mode
      updatedProducts = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title: formData.title,
            price: formattedPrice,
            tag: formData.tag,
            img: formData.img || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"
          };
        }
        return p;
      });
      alert(`Product "${formData.title}" updated successfully!`);
    } else {
      // Add mode
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        title: formData.title,
        price: formattedPrice,
        tag: formData.tag,
        img: formData.img || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600"
      };
      updatedProducts = [...products, newProduct];
      alert(`Product "${formData.title}" added to catalog successfully!`);
    }

    setProducts(updatedProducts);

    // Save to localStorage
    const db = getCRMData();
    db.products = updatedProducts;
    saveCRMData(db);

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${title}" dari katalog?`)) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);

      const db = getCRMData();
      db.products = updatedProducts;
      saveCRMData(db);
      alert(`Produk "${title}" berhasil dihapus.`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      tag: "Tata Rias",
      img: ""
    });
    setEditingProduct(null);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins text-[#262626]">
      <PageHeader title="Atelier Catalog Management" breadcrumb={["CRM", "Catalog"]}>
        <button 
          onClick={openAddDialog}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FiPlus size={14} /> Add New Product
        </button>
      </PageHeader>

      {/* 1. FILTER AND SEARCH SECTION */}
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

      {/* 2. CATALOG PRODUCT GRID */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white p-6 rounded-[3rem] border border-[#F3F3F3] shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-6 bg-gray-50">
                  <img 
                    src={product.img} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#4F5C18] text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {product.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/80 text-white text-[8px] font-mono px-2.5 py-1 rounded-lg">
                      ID: {product.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 px-2 mb-6 text-center">
                  <h4 className="text-xl font-['Playfair_Display'] italic font-bold text-[#262626] line-clamp-1">
                    {product.title}
                  </h4>
                  <p className="text-[#4F5C18] font-bold text-xs tracking-tighter">
                    {product.price}
                  </p>
                </div>
              </div>

              {/* Administrative Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => openEditDialog(product)}
                  className="flex-1 py-3 bg-[#F3F3F3] hover:bg-[#4F5C18] hover:text-white text-gray-500 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiEdit size={12} /> Edit
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id, product.title)}
                  className="py-3 px-4 bg-rose-50 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl transition-all flex items-center justify-center cursor-pointer"
                  title="Hapus Produk"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-[#F3F3F3] text-gray-400 italic">
          No catalog items matches the search criteria.
        </div>
      )}

      {/* 3. ADD / EDIT DIALOG MODAL */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">
                {editingProduct ? "Edit Atelier Product" : "Add Product to Catalog"}
              </h3>
              <button 
                onClick={() => { setIsDialogOpen(false); resetForm(); }} 
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Product Name / Title
                </label>
                <div className="relative">
                  <input 
                    ref={titleInputRef}
                    required
                    className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                    placeholder="e.g. Silk Foundation"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Category Tag
                </label>
                <select 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm cursor-pointer"
                  value={formData.tag}
                  onChange={(e) => setFormData({...formData, tag: e.target.value})}
                >
                  <option value="Tata Rias">Tata Rias</option>
                  <option value="Perawatan Kulit">Perawatan Kulit</option>
                  <option value="Parfum">Parfum</option>
                  <option value="Alat Kecantikan">Alat Kecantikan</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Price in Rupiah (Angka saja)
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    required
                    type="number"
                    className="w-full pl-12 pr-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                    placeholder="e.g. 450000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <FiLink className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="url"
                    className="w-full pl-12 pr-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.img}
                    onChange={(e) => setFormData({...formData, img: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#4F5C18] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <FiSave /> {editingProduct ? "Update Product" : "Publish to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;
