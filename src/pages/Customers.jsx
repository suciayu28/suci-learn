import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaUserPlus, FaGem, FaMedal, FaAward, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";

const Customers = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const customerData = Array.from({ length: 30 }, (_, i) => ({
    id: `C${(i + 1).toString().padStart(3, '0')}`,
    name: ["Budi Santoso", "Siti Aminah", "Andi Wijaya", "Dewi Lestari", "Eko Prasetyo", "Hana Pertiwi"][i % 6],
    email: `user${i + 1}@mail.com`,
    phone: `081234567${i.toString().padStart(2, '0')}`,
    loyalty: ["Bronze", "Silver", "Gold"][i % 3]
  }));

  const totalPages = Math.ceil(customerData.length / itemsPerPage);
  const currentCustomers = customerData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins">
      <PageHeader title="Member Directory" breadcrumb={["Management", "Customers"]}>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2"
        >
          <FaUserPlus size={14} /> Add Member
        </button>
      </PageHeader>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
          <input 
            type="text" 
            placeholder="Search member name or ID..." 
            className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-[#F3F3F3] rounded-2xl text-[#4F5C18] hover:bg-[#F3F3F3] transition-all">
          <FaFilter />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F3F3F3]/50 border-b border-[#F3F3F3]">
                <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">ID</th>
                <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Member Profile</th>
                <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Tier Status</th>
                <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F3F3]">
              {currentCustomers.map((item) => (
                <tr key={item.id} className="hover:bg-[#F3F3F3]/30 transition-all group">
                  <td className="p-5">
                    <Link to={`/customers/${item.id}`}>
                      <span className="text-[10px] font-bold font-mono text-[#4F5C18] bg-[#4F5C18]/5 px-3 py-1 rounded-lg hover:bg-[#4F5C18] hover:text-white transition-all">
                        {item.id}
                      </span>
                    </Link>
                  </td>
                  <td className="p-5">
                    <Link to={`/customers/${item.id}`} className="flex items-center gap-4 group/profile">
                      <div className="w-10 h-10 rounded-xl bg-[#4F5C18] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#4F5C18]/20 group-hover/profile:scale-105 transition-transform">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#262626] leading-none mb-1 group-hover/profile:text-[#4F5C18] transition-colors">{item.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{item.phone}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="p-5 text-center">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.loyalty === 'Gold' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      item.loyalty === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                      'bg-[#4F5C18]/10 text-[#4F5C18] border-[#4F5C18]/10'
                    }`}>
                      {item.loyalty === 'Gold' ? <FaGem /> : item.loyalty === 'Silver' ? <FaMedal /> : <FaAward />}
                      {item.loyalty}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <button 
                      onClick={() => navigate(`/customers/${item.id}`)}
                      className="p-3 bg-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all"
                    >
                      <FaEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-[#F3F3F3] flex items-center justify-between bg-[#F3F3F3]/20">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all"><FaChevronLeft size={12} /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all"><FaChevronRight size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;