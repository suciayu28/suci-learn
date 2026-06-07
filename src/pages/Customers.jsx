import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { 
  FaUserPlus, 
  FaGem, 
  FaMedal, 
  FaAward, 
  FaSearch, 
  FaFilter, 
  FaChevronLeft, 
  FaChevronRight, 
  FaEye, 
  FaTimes, 
  FaSave, 
  FaEdit,
  FaTrash
} from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCRMData, saveCRMData } from "../lib/crmData";

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filters
  const [filterTier, setFilterTier] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Active Customer for editing
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    gender: "Perempuan",
    dob: "",
    city: "Jakarta",
    loyalty: "Bronze",
    status: "Active",
    referralCode: "",
    source: "Website",
    promoActive: false
  });

  // Focus Refs
  const searchInputRef = useRef(null);
  const addNameInputRef = useRef(null);
  const editNameInputRef = useRef(null);

  // Load data from DB
  useEffect(() => {
    const db = getCRMData();
    setCustomers(db.customers);
  }, []);

  // Auto-focus search input on page load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Auto-focus form input name when Add modal opens
  useEffect(() => {
    if (isAddModalOpen && addNameInputRef.current) {
      setTimeout(() => addNameInputRef.current.focus(), 150);
    }
  }, [isAddModalOpen]);

  // Auto-focus form input name when Edit modal opens
  useEffect(() => {
    if (isEditModalOpen && editNameInputRef.current) {
      setTimeout(() => editNameInputRef.current.focus(), 150);
    }
  }, [isEditModalOpen]);

  const itemsPerPage = 8;

  // Filter logic
  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cust.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.username.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTier = filterTier === "All" || cust.loyalty === filterTier;
    const matchesGender = filterGender === "All" || cust.gender === filterGender;
    const matchesStatus = filterStatus === "All" || cust.status === filterStatus;
    const matchesSource = filterSource === "All" || cust.source === filterSource;
    
    return matchesSearch && matchesTier && matchesGender && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setFilterTier("All");
    setFilterGender("All");
    setFilterStatus("All");
    setFilterSource("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Create auto-referral code based on name
  const generateReferral = (name, index) => {
    const cleanName = name.trim().replace(/\s+/g, "").substring(0, 3).toUpperCase();
    return `CREATOR-${cleanName}${100 + index}`;
  };

  // Handle Add Customer Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = `CUST-${(customers.length + 1).toString().padStart(3, '0')}`;
    const referralCode = formData.referralCode || generateReferral(formData.name, customers.length + 1);
    
    const newCust = {
      ...formData,
      id: newId,
      referralCode,
      joinDate: new Date().toLocaleDateString("id-ID"),
      totalTransactions: 0,
      itemsCount: 0,
      paymentMethod: "Virtual Account",
      lastTransactionDate: new Date().toLocaleDateString("id-ID"),
      feedback: null
    };

    const updatedList = [newCust, ...customers];
    setCustomers(updatedList);
    
    const db = getCRMData();
    db.customers = updatedList;
    saveCRMData(db);

    setIsAddModalOpen(false);
    resetForm();
    alert(`Success! Customer ${newCust.name} has been added.`);
  };

  // Open Edit Modal & Populate Form
  const openEditModal = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      username: cust.username,
      email: cust.email,
      phone: cust.phone,
      gender: cust.gender,
      dob: cust.dob || "",
      city: cust.city,
      loyalty: cust.loyalty,
      status: cust.status,
      referralCode: cust.referralCode,
      source: cust.source,
      promoActive: cust.promoActive
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Customer Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    const updatedList = customers.map(c => {
      if (c.id === editingCustomer.id) {
        return {
          ...c,
          ...formData
        };
      }
      return c;
    });

    setCustomers(updatedList);
    
    const db = getCRMData();
    db.customers = updatedList;
    saveCRMData(db);

    setIsEditModalOpen(false);
    resetForm();
    alert(`Success! Customer ${editingCustomer.name} updated.`);
  };

  // Handle Delete Customer
  const handleDeleteCustomer = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer ${name}?`)) {
      const updatedList = customers.filter(c => c.id !== id);
      setCustomers(updatedList);

      const db = getCRMData();
      db.customers = updatedList;
      saveCRMData(db);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      phone: "",
      gender: "Perempuan",
      dob: "",
      city: "Jakarta",
      loyalty: "Bronze",
      status: "Active",
      referralCode: "",
      source: "Website",
      promoActive: false
    });
    setEditingCustomer(null);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins relative">
      
      {/* 1. MODAL ADD CUSTOMER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">Add New Customer</h3>
              <button onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                <input 
                  ref={addNameInputRef}
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="e.g. Amanda Putri"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Username / Nickname</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="e.g. amanda12"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="0812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Gender</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Date of Birth</label>
                <input 
                  required
                  type="date"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">City / Province</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="e.g. Jakarta"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Membership Level</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.loyalty}
                  onChange={(e) => setFormData({...formData, loyalty: e.target.value})}
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">User Source</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Membership Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Referral / Creator Code (Optional)</label>
                <input 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="Leave blank to auto-generate"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3 mt-8">
                <input 
                  type="checkbox"
                  id="promoActiveAdd"
                  className="w-5 h-5 rounded border-gray-300 text-[#4F5C18] focus:ring-[#4F5C18]/20"
                  checked={formData.promoActive}
                  onChange={(e) => setFormData({...formData, promoActive: e.target.checked})}
                />
                <label htmlFor="promoActiveAdd" className="text-xs font-bold text-[#262626] uppercase tracking-wide cursor-pointer">
                  Promo Active status
                </label>
              </div>

              <div className="md:col-span-2 mt-4">
                <button type="submit" className="w-full bg-[#4F5C18] text-white py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <FaSave /> Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL EDIT CUSTOMER */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">Edit Customer - {editingCustomer?.id}</h3>
              <button onClick={() => { setIsEditModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                <input 
                  ref={editNameInputRef}
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Username</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Gender</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Date of Birth</label>
                <input 
                  required
                  type="date"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">City / Province</label>
                <input 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Membership Level</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.loyalty}
                  onChange={(e) => setFormData({...formData, loyalty: e.target.value})}
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">User Source</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Membership Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Referral / Creator Code</label>
                <input 
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3 mt-8">
                <input 
                  type="checkbox"
                  id="promoActiveEdit"
                  className="w-5 h-5 rounded border-gray-300 text-[#4F5C18] focus:ring-[#4F5C18]/20"
                  checked={formData.promoActive}
                  onChange={(e) => setFormData({...formData, promoActive: e.target.checked})}
                />
                <label htmlFor="promoActiveEdit" className="text-xs font-bold text-[#262626] uppercase tracking-wide cursor-pointer">
                  Promo Active status
                </label>
              </div>

              <div className="md:col-span-2 mt-4">
                <button type="submit" className="w-full bg-[#262626] text-white py-4.5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <PageHeader title="Customer CRM Directory" breadcrumb={["Management", "Customers"]}>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2"
        >
          <FaUserPlus size={14} /> Add Customer
        </button>
      </PageHeader>

      {/* FILTERS & SEARCH ROW */}
      <div className="flex flex-col gap-4 mb-6">
        
        {/* Search */}
        <div className="relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40 z-10" />
          <Input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search customer by name, username or ID..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-6 py-7 bg-[#F3F3F3] border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>

        {/* Filter Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          
          {/* Tier */}
          <div className="flex flex-col">
            <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Membership Tier</label>
            <select 
              value={filterTier}
              onChange={(e) => { setFilterTier(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-3 bg-white border border-[#F3F3F3] rounded-xl text-[#262626] text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Gender</label>
            <select 
              value={filterGender}
              onChange={(e) => { setFilterGender(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-3 bg-white border border-[#F3F3F3] rounded-xl text-[#262626] text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
            >
              <option value="All">All Genders</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Laki-laki">Laki-laki</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">Member Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-3 bg-white border border-[#F3F3F3] rounded-xl text-[#262626] text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Source */}
          <div className="flex flex-col">
            <label className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-1.5 ml-1">User Source</label>
            <select 
              value={filterSource}
              onChange={(e) => { setFilterSource(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-3 bg-white border border-[#F3F3F3] rounded-xl text-[#262626] text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
            >
              <option value="All">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end col-span-2 md:col-span-1">
            <button 
              onClick={resetFilters}
              className="w-full py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-bold text-[10px] uppercase tracking-widest border border-red-100 flex items-center justify-center gap-1.5"
            >
              <FaTimes /> Clear Filters
            </button>
          </div>

        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F3F3F3]/50">
            <TableRow className="border-[#F3F3F3]">
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Customer ID</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Profile Details</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Gender / DOB</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Acquisition</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Tier</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Status</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#F3F3F3]/30 border-[#F3F3F3] transition-all">
                  <TableCell className="p-5">
                    <span className="text-[10px] font-bold font-mono text-[#4F5C18] bg-[#4F5C18]/5 px-3 py-1 rounded-lg border border-[#4F5C18]/10">
                      {item.id}
                    </span>
                  </TableCell>
                  <TableCell className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-[#4F5C18]/10">
                        <AvatarFallback className="bg-[#4F5C18] text-white text-xs font-bold">
                          {item.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-[#262626] leading-none mb-1">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">@{item.username} • {item.email}</p>
                        <p className="text-[9px] text-[#4F5C18] font-bold tracking-tight mt-0.5">{item.phone} • {item.city}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-center">
                    <p className="text-xs font-bold text-gray-700 leading-none">{item.gender}</p>
                    <p className="text-[9px] text-gray-400 mt-1 font-mono">{item.dob}</p>
                  </TableCell>
                  <TableCell className="p-5 text-center">
                    <span className="text-[9px] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                      {item.source}
                    </span>
                    <p className="text-[9px] text-gray-400 mt-1">Ref: {item.referralCode || "-"}</p>
                  </TableCell>
                  <TableCell className="p-5 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.loyalty === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      item.loyalty === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {item.loyalty === 'Gold' ? <FaGem size={8}/> : item.loyalty === 'Silver' ? <FaMedal size={8}/> : <FaAward size={8}/>}
                      {item.loyalty}
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/customers/${item.id}`)}
                        title="View Detailed Transactions"
                        className="p-2.5 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all shadow-sm"
                      >
                        <FaEye size={12} />
                      </button>
                      <button 
                        onClick={() => openEditModal(item)}
                        title="Edit Customer"
                        className="p-2.5 bg-white border border-[#F3F3F3] text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(item.id, item.name)}
                        title="Delete Customer"
                        className="p-2.5 bg-white border border-[#F3F3F3] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="p-10 text-center text-gray-400 italic">
                  No customer matched the search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-[#F3F3F3] flex items-center justify-between bg-[#F3F3F3]/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {currentCustomers.length} of {filteredCustomers.length} Customers | Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all cursor-pointer"
            >
              <FaChevronLeft size={12} />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all cursor-pointer"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Customers;