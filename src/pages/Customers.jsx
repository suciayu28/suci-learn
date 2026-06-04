import { useState, useEffect, useRef } from "react"; // 1. Ditambahkan useEffect dan useRef di sini
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaUserPlus, FaGem, FaMedal, FaAward, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEye, FaTimes, FaSave } from "react-icons/fa";

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

const Customers = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  
  // State Baru untuk Modal Add Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", loyalty: "Bronze" });

  // 2. Inisialisasi useRef untuk elemen input pencarian
  const searchInputRef = useRef(null);

  // 3. Implementasi useEffect untuk auto-focus saat halaman diakses
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []); // Dependency array kosong agar hanya berjalan 1 kali saat mount

  const itemsPerPage = 8;

  // 1. Data Pelanggan (Gunakan Let agar bisa diupdate sementara jika perlu)
  const customerData = Array.from({ length: 800 }, (_, i) => {
    const names = ["Amanda Putri", "Syafira Bella", "Clara Wijaya", "Nadia Safira", "Rania Azzahra", "Jessica Tan", "Dewi Sartika", "Manda Rose", "Bella Hadid", "Selena Gomez", "Kylie Jenner", "Kimberly"];
    return {
      id: `CUST-${(i + 1).toString().padStart(3, '0')}`,
      name: names[i % names.length],
      email: `customer${i + 1}@makeupstore.com`,
      phone: `0812-9988-${(i + 100).toString()}`,
      loyalty: ["Gold", "Silver", "Bronze"][i % 3]
    };
  });

  // 2. Logic Search & Filter
  const filteredCustomers = customerData.filter(cust => {
    const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase()) || cust.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "All" || cust.loyalty === filterTier;
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Fungsi Handle Simpan Member Baru
  const handleAddMember = (e) => {
    e.preventDefault();
    alert(`Success! Member ${newMember.name} has been registered.`);
    setIsModalOpen(false);
    NewMember({ name: "", email: "", loyalty: "Bronze" });
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins relative">
      
      {/* MODAL ADD MEMBER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">New Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                <input 
                  required
                  className="w-full px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="e.g. Gigi Hadid"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm"
                  placeholder="name@email.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Initial Tier</label>
                <select 
                  className="w-full px-5 py-4 bg-[#F3F3F3] rounded-2xl border-none focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm appearance-none"
                  value={newMember.loyalty}
                  onChange={(e) => setNewMember({...newMember, loyalty: e.target.value})}
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#4F5C18] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4">
                <FaSave /> Register Member
              </button>
            </form>
          </div>
        </div>
      )}

      <PageHeader title="Member Directory" breadcrumb={["Management", "Customers"]}>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2"
        >
          <FaUserPlus size={14} /> Add New Member
        </button>
      </PageHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40 z-10" />
          {/* 4. Ditambahkan properti ref={searchInputRef} pada komponen Input di bawah ini */}
          <Input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search member name or ID..." 
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
            className="w-full pl-12 pr-6 py-7 bg-[#F3F3F3] border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={filterTier}
            onChange={(e) => {setFilterTier(e.target.value); setCurrentPage(1);}}
            className="px-6 py-4 bg-white border border-[#F3F3F3] rounded-2xl text-[#4F5C18] text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
          >
            <option value="All">All Tiers</option>
            <option value="Gold">Gold Only</option>
            <option value="Silver">Silver Only</option>
            <option value="Bronze">Bronze Only</option>
          </select>
          
          {filterTier !== "All" && (
            <button onClick={() => setFilterTier("All")} className="p-4 bg-red-50 text-red-500 rounded-2xl transition-all hover:bg-red-100">
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F3F3F3]/50">
            <TableRow className="border-[#F3F3F3]">
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Member ID</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Member Profile</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Tier Status</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Action</TableHead>
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
                        <p className="text-[10px] text-gray-400 font-medium">{item.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.loyalty === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      item.loyalty === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                      'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {item.loyalty === 'Gold' ? <FaGem /> : item.loyalty === 'Silver' ? <FaMedal /> : <FaAward />}
                      {item.loyalty}
                    </div>
                  </TableCell>
                  <TableCell className="p-5 text-center">
                    <button 
                      onClick={() => navigate(`/customers/${item.id}`)}
                      className="p-3 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all shadow-sm"
                    >
                      <FaEye size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={4} className="p-10 text-center text-gray-400">No members found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-6 border-t border-[#F3F3F3] flex items-center justify-between bg-[#F3F3F3]/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {currentCustomers.length} of {filteredCustomers.length} Members | Page {currentPage}
          </p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all"><FaChevronLeft size={12} /></button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all"><FaChevronRight size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;