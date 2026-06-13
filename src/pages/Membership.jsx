import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { 
  FaGem, 
  FaMedal, 
  FaAward, 
  FaCrown, 
  FaEdit, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTimes, 
  FaSave,
  FaSearch,
  FaChevronLeft,   
  FaChevronRight,
  FaLock           // Icon proteksi halaman untuk Customer biasa
} from "react-icons/fa";
import { getCRMData, saveCRMData } from "../lib/crmData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LOYALTY_TIERS, MEMBERSHIP_STATUSES } from "@/data/membershipData";

const Membership = () => {
  // ─── AMBIL ROLE ASLI BERDASARKAN REGISTER AWAL ─────────────────────────
  // Default diset ke "Customer" demi keamanan agar database tidak bocor
  const [currentRole, setCurrentRole] = useState("Customer"); 

  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formTier, setFormTier] = useState("Bronze");
  const [formStatus, setFormStatus] = useState("Active");
  const [formReferral, setFormReferral] = useState("");

  const tierSelectRef = useRef(null);

  useEffect(() => {
    // 1. Ambil data CRM kustomer untuk Admin
    const db = getCRMData();
    setCustomers(db.customers || []);

    // 2. CEK DATA AKUN LOGIN DARI LOCALSTORAGE
    // Menyesuaikan dengan variabel session login kelompok kamu
    const savedUser = localStorage.getItem("userLoggedIn"); 
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Jika di data register disimpan properti role (nilainya "Admin" atau "Customer")
      if (userData.role) {
        setCurrentRole(userData.role);
      }
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTier]);

  useEffect(() => {
    if (isDialogOpen && tierSelectRef.current) {
      setTimeout(() => tierSelectRef.current.focus(), 150);
    }
  }, [isDialogOpen]);

  const goldCount = customers.filter(c => c.loyalty === "Gold").length;
  const silverCount = customers.filter(c => c.loyalty === "Silver").length;
  const bronzeCount = customers.filter(c => c.loyalty === "Bronze").length;
  const activeCount = customers.filter(c => c.status === "Active").length;

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === "All" || c.loyalty === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const openUpgradeDialog = (cust) => {
    setSelectedCustomer(cust);
    setFormTier(cust.loyalty);
    setFormStatus(cust.status);
    setFormReferral(cust.referralCode || "");
    setIsDialogOpen(true);
  };

  const handleUpgradeSubmit = (e) => {
    e.preventDefault();
    
    const updatedList = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          loyalty: formTier,
          status: formStatus,
          referralCode: formReferral
        };
      }
      return c;
    });

    setCustomers(updatedList);

    const db = getCRMData();
    db.customers = updatedList;
    saveCRMData(db);

    setIsDialogOpen(false);
    setSelectedCustomer(null);
    alert(`Success! Updated membership status for ${selectedCustomer.name}.`);
  };

  const autoGenerateReferralCode = () => {
    if (selectedCustomer) {
      const initials = selectedCustomer.name.replace(/\s+/g, "").substring(0, 3).toUpperCase();
      const code = `CREATOR-${initials}${Math.floor(100 + Math.random() * 900)}`;
      setFormReferral(code);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins text-[#262626]">
      
      <PageHeader 
        title={currentRole === "Admin" ? "Membership Management" : "Access Denied"} 
        breadcrumb={["CRM", "Membership"]} 
      />

      {/* CONDITIONAL RENDERING BLOCK */}
      {currentRole === "Admin" ? (
        <>
          {/* 1. MEMBERSHIP METRIC CARDS (Hanya Render Jika Admin) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 mb-8 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><FaCheckCircle size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Members</p>
                <h3 className="text-2xl font-bold text-[#262626] mt-0.5">{activeCount} / {customers.length}</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
              <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><FaCrown size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gold Tier</p>
                <h3 className="text-2xl font-bold text-[#262626] mt-0.5">{goldCount} Members</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
              <div className="p-4 bg-slate-100 text-slate-500 rounded-2xl"><FaMedal size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Silver Tier</p>
                <h3 className="text-2xl font-bold text-[#262626] mt-0.5">{silverCount} Members</h3>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><FaAward size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bronze Tier</p>
                <h3 className="text-2xl font-bold text-[#262626] mt-0.5">{bronzeCount} Members</h3>
              </div>
            </div>
          </div>

          {/* 2. SEARCH AND FILTER ROW (Hanya Render Jika Admin) */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-in fade-in duration-300">
            <div className="relative flex-1">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
              <input 
                type="text" 
                placeholder="Search member name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium transition-all"
              />
            </div>

            <div className="flex gap-2">
              <select 
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="px-6 py-4 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
              >
                <option value="All">All Tiers</option>
                {LOYALTY_TIERS.map((tier) => (
                  <option key={tier.value} value={tier.value}>{tier.value}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. MEMBERS TABLE (Hanya Render Jika Admin) */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <Table>
              <TableHeader className="bg-[#F3F3F3]/50">
                <TableRow className="border-[#F3F3F3]">
                  <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Member ID</TableHead>
                  <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Name / Account</TableHead>
                  <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Referral Code</TableHead>
                  <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Tier Level</TableHead>
                  <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Status</TableHead>
                  <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Tier Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((item) => (
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
                            {item.name ? item.name.charAt(0) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-[#262626] leading-none mb-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{item.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-5 text-center font-mono text-xs font-bold text-[#4F5C18]">
                      {item.referralCode || <span className="text-gray-300 italic text-[10px]">None</span>}
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
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        item.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}>
                        {item.status === "Active" ? <FaCheckCircle size={8} /> : <FaTimesCircle size={8} />}
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="p-5 text-center">
                      <button 
                        onClick={() => openUpgradeDialog(item)}
                        className="p-3 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 mx-auto cursor-pointer"
                      >
                        <FaEdit size={12} /> <span className="text-[10px] font-bold uppercase tracking-widest">Update status</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINATION PANEL */}
            <div className="p-6 border-t border-[#F3F3F3] flex justify-between items-center bg-[#F3F3F3]/20">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Showing page {currentPage} of {totalPages} ({filteredCustomers.length} total members)
              </p>
              
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-10 h-10 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl flex items-center justify-center hover:bg-[#4F5C18] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#4F5C18] transition-all shadow-sm cursor-pointer"
                >
                  <FaChevronLeft size={12} />
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-10 h-10 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl flex items-center justify-center hover:bg-[#4F5C18] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#4F5C18] transition-all shadow-sm cursor-pointer"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ─── INTERFACE BLOCKED JIKA REGISTER SEBAGAI CUSTOMER BIASA ─── */
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] p-12 text-center max-w-xl mx-auto mt-10 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
            <FaLock size={22} />
          </div>
          <h4 className="text-lg font-bold text-[#262626] mb-2">Akses Ditolak (Halaman Khusus Admin)</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto mb-6">
            Maaf, akun Anda terdaftar sebagai **Customer**. Halaman pengelolaan basis data CRM ini dilindungi hak privasi tingkat tinggi dan hanya dapat diakses oleh Administrator.
          </p>
          <div className="p-4 bg-[#F3F3F3] rounded-2xl text-[10px] font-mono text-left space-y-1 text-gray-500">
            <p>• Sesi Akun: Terdeteksi Pelanggan Umum / Customer</p>
            <p>• Status Otoritas: Restricted (Akses Render Data Ditutup)</p>
          </div>
        </div>
      )}

      {/* 4. UPGRADE & EDIT MEMBERSHIP DIALOG (Diproteksi Hanya untuk Admin) */}
      {isDialogOpen && selectedCustomer && currentRole === "Admin" && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">Update Membership</h3>
              <button onClick={() => { setIsDialogOpen(false); setSelectedCustomer(null); }} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpgradeSubmit} className="space-y-6">
              <div>
                <p className="text-sm font-bold text-[#262626] mb-1">{selectedCustomer.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">{selectedCustomer.id} • {selectedCustomer.email}</p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Loyalty Level</label>
                <select 
                  ref={tierSelectRef}
                  required
                  className="w-full px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm cursor-pointer"
                  value={formTier}
                  onChange={(e) => setFormTier(e.target.value)}
                >
                  {LOYALTY_TIERS.map((tier) => (
                    <option key={tier.value} value={tier.value}>{tier.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Membership status</label>
                <select 
                  required
                  className="w-full px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm cursor-pointer"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                >
                  {MEMBERSHIP_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Referral / Creator Code</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-grow px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm font-mono text-[#4F5C18]"
                    value={formReferral}
                    placeholder="CREATOR-XXXX"
                    onChange={(e) => setFormReferral(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={autoGenerateReferralCode}
                    className="px-4 bg-[#F3F3F3] hover:bg-gray-200 text-xs font-bold uppercase rounded-2xl border border-gray-300 transition-colors cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#4F5C18] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
                <FaSave /> Save Membership Settings
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Membership;