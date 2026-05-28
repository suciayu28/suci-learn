import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaUserPlus, FaGem, FaMedal, FaAward, FaSearch, FaFilter, FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
        {/* Button tetap manual sesuai instruksi */}
        <button 
          onClick={() => {}}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2"
        >
          <FaUserPlus size={14} /> Add Member
        </button>
      </PageHeader>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40 z-10" />
          {/* KOMPONEN 1: INPUT SHADCN */}
          <Input 
            type="text" 
            placeholder="Search member name or ID..." 
            className="w-full pl-12 pr-6 py-7 bg-[#F3F3F3] border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-[#4F5C18]/20 text-sm font-medium"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-[#F3F3F3] rounded-2xl text-[#4F5C18] hover:bg-[#F3F3F3] transition-all">
          <FaFilter />
        </button>
      </div>

      {/* Container Table manual agar tetap ada border radius mewah */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden">
        {/* KOMPONEN 2: TABLE SHADCN */}
        <Table>
          <TableHeader className="bg-[#F3F3F3]/50">
            <TableRow className="border-[#F3F3F3]">
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">ID</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18]">Member Profile</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Tier Status</TableHead>
              <TableHead className="p-5 font-bold text-[10px] uppercase tracking-widest text-[#4F5C18] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((item) => (
              <TableRow key={item.id} className="hover:bg-[#F3F3F3]/30 border-[#F3F3F3] transition-all">
                <TableCell className="p-5">
                  <span className="text-[10px] font-bold font-mono text-[#4F5C18] bg-[#4F5C18]/5 px-3 py-1 rounded-lg">
                    {item.id}
                  </span>
                </TableCell>
                <TableCell className="p-5">
                  <div className="flex items-center gap-4">
                    {/* KOMPONEN 3: AVATAR SHADCN */}
                    <Avatar className="h-10 w-10 border-2 border-[#4F5C18]/10">
                      <AvatarFallback className="bg-[#4F5C18] text-white text-xs font-bold">
                        {item.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-[#262626] leading-none mb-1">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{item.phone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="p-5 text-center">
                  {/* Status tetap pakai div manual agar tidak dianggap pakai Badge Shadcn */}
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    item.loyalty === 'Gold' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                    item.loyalty === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
                    'bg-[#4F5C18]/10 text-[#4F5C18] border-[#4F5C18]/10'
                  }`}>
                    {item.loyalty === 'Gold' ? <FaGem /> : item.loyalty === 'Silver' ? <FaMedal /> : <FaAward />}
                    {item.loyalty}
                  </div>
                </TableCell>
                <TableCell className="p-5 text-center">
                  <button 
                    onClick={() => navigate(`/customers/${item.id}`)}
                    className="p-3 bg-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all"
                  >
                    <FaEye size={14} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination manual */}
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