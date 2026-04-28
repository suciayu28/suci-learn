import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FaUserPlus, FaGem, FaMedal, FaAward, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Customers = () => {
  const [showForm, setShowForm] = useState(false);

  // 1. LOGIKA PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Hanya tampilkan 5 data per halaman

  const customerData = Array.from({ length: 30 }, (_, i) => ({
    id: `C${(i + 1).toString().padStart(3, '0')}`,
    name: ["Budi Santoso", "Siti Aminah", "Andi Wijaya", "Dewi Lestari", "Eko Prasetyo"][i % 5],
    email: `user${i + 1}@mail.com`,
    phone: `081234567${i.toString().padStart(2, '0')}`,
    loyalty: ["Bronze", "Silver", "Gold"][i % 3]
  }));

  // Hitung data untuk halaman aktif
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customerData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customerData.length / itemsPerPage);

  return (
    <div className="animate-fadeIn pb-6 px-2">
      {/* 1. HEADER - Sebaris & Tombol Aman Diklik */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="transform scale-90 origin-left">
          <PageHeader title="Beauty Members" breadcrumb="Management / Customers" />
        </div>
        <button 
          type="button"
          className="relative z-10 whitespace-nowrap bg-rose-500 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all transform active:scale-95 flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <FaUserPlus size={12} /> Add Member
        </button>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="flex gap-3 items-center mb-6">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search member name or ID..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-50 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-rose-50 focus:border-rose-200 transition-all text-xs font-medium"
          />
        </div>
        <button className="p-3 bg-white border border-pink-50 rounded-xl text-rose-400 hover:bg-rose-50 transition-colors shadow-sm">
          <FaFilter size={14} />
        </button>
      </div>

      {/* 3. TABLE CONTAINER DENGAN PAGINATION */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-pink-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/20">
                <th className="p-4 font-black text-[9px] uppercase tracking-[0.2em] text-rose-400 border-b border-rose-50">ID</th>
                <th className="p-4 font-black text-[9px] uppercase tracking-[0.2em] text-rose-400 border-b border-rose-50">Member Profile</th>
                <th className="p-4 font-black text-[9px] uppercase tracking-[0.2em] text-rose-400 border-b border-rose-50 text-center">Tier Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/50 text-gray-600">
              {currentCustomers.map((item) => (
                <tr key={item.id} className="hover:bg-rose-50/10 transition-all group">
                  <td className="p-4">
                    <span className="text-[9px] font-bold font-mono text-rose-400 bg-rose-50/50 px-2 py-1 rounded-lg">
                      {item.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-100 to-pink-50 flex items-center justify-center text-rose-500 font-bold text-[10px] shadow-inner">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-serif font-black text-gray-800 group-hover:text-rose-600 transition-colors leading-none">
                          {item.name}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold mt-1">{item.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                      item.loyalty === 'Gold' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      item.loyalty === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                      'bg-orange-50 text-orange-500 border-orange-100'
                    }`}>
                      {item.loyalty === 'Gold' ? <FaGem /> : item.loyalty === 'Silver' ? <FaMedal /> : <FaAward />}
                      {item.loyalty}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CONTROLS PAGINATION */}
        <div className="p-4 border-t border-rose-50 flex items-center justify-between bg-rose-50/5">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2.5 rounded-xl border border-rose-100 bg-white text-rose-400 disabled:opacity-30 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              <FaChevronLeft size={10} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2.5 rounded-xl border border-rose-100 bg-white text-rose-400 disabled:opacity-30 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL - FIXED DI TENGAH (Z-INDEX TERTINGGI) */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Layer Backdrop Gelap & Blur */}
          <div 
            className="absolute inset-0 bg-rose-900/20 backdrop-blur-md" 
            onClick={() => setShowForm(false)}
          ></div>
          
          {/* Konten Modal */}
          <div className="relative bg-white p-6 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-slideUp border border-white">
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-rose-500 shadow-inner">
                    <FaUserPlus size={20} />
                </div>
                <h2 className="text-xl font-serif font-black text-gray-800">New Guest</h2>
                <p className="text-rose-300 text-[9px] uppercase tracking-[0.2em] mt-1 font-black">Membership Registration</p>
            </div>
            
            <form className="space-y-3">
               <input type="text" className="w-full p-3.5 border border-pink-50 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-rose-50 outline-none transition-all text-xs" placeholder="Full Name" />
               <input type="email" className="w-full p-3.5 border border-pink-50 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-rose-50 outline-none transition-all text-xs" placeholder="Email Address" />
               
               <div className="grid grid-cols-2 gap-3 mt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="py-3 text-gray-400 font-black text-[9px] uppercase tracking-widest hover:text-rose-400 transition-colors">Cancel</button>
                  <button type="button" className="py-3 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-100 transition-all active:scale-95">Register</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;