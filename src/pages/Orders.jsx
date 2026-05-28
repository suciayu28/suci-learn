import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaShoppingBag, FaSearch, FaChevronLeft, FaChevronRight, FaEye, FaFilter } from "react-icons/fa";

// --- IMPORT KOMPONEN SHADCN UI ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Orders = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const orderData = Array.from({ length: 30 }, (_, i) => {
    const makeupPrices = [350000, 1250000, 89000, 540000, 215000, 750000];
    const itemCounts = [1, 4, 1, 3, 2, 5];
    return {
      id: `ORD-${(i + 1).toString().padStart(3, '0')}`,
      customerName: ["Joko Anwar", "Indra Bruggman", "Gilang Dirga", "Hana Pertiwi", "Siti Aminah", "Budi Santoso"][i % 6],
      status: ["Pending", "Completed", "Cancelled"][i % 3],
      totalPrice: makeupPrices[i % 6],
      itemsCount: itemCounts[i % 6],
      date: `2026-05-${((i % 28) + 1).toString().padStart(2, '0')}`,
    };
  });

  const totalPages = Math.ceil(orderData.length / itemsPerPage);
  const currentOrders = orderData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins">
      <PageHeader title="Sales Transactions" breadcrumb={["Management", "Orders"]}>
        <button className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2">
          <FaShoppingBag size={14} /> New Transaction
        </button>
      </PageHeader>

      {/* Search & Filter */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>
        <button className="p-4 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl hover:bg-[#F3F3F3] transition-all">
          <FaFilter size={16} />
        </button>
      </div>

      {/* --- IMPLEMENTASI TABLE SHADCN UI --- */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden mb-4">
        <Table>
          <TableHeader className="bg-[#F3F3F3]/50">
            <TableRow className="border-b border-[#F3F3F3]">
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18]">Ref. ID</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18]">Customer & Date</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Qty</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Status</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-right">Total</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id} className="hover:bg-[#F3F3F3]/30 transition-all border-[#F3F3F3]">
                <TableCell className="p-6">
                  <span className="text-[11px] font-mono font-bold text-[#4F5C18] bg-[#4F5C18]/5 px-3 py-1 rounded-lg border border-[#4F5C18]/10">
                    {order.id}
                  </span>
                </TableCell>
                <TableCell className="p-6">
                  <p className="text-sm font-bold text-[#262626] font-playfair">{order.customerName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{order.date} May</p>
                </TableCell>
                <TableCell className="p-6 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {order.itemsCount} Items
                </TableCell>
                <TableCell className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    order.status === "Completed" ? "bg-[#4F5C18]/10 text-[#4F5C18]" :
                    order.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="p-6 text-right font-bold text-[#262626] text-sm">
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="p-6 text-center">
                  <button 
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="p-3 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all"
                  >
                    <FaEye size={14} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-[#F3F3F3] flex items-center justify-between bg-[#F3F3F3]/10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all"
            >
              <FaChevronLeft size={12} />
            </button>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="p-3 rounded-xl border border-[#F3F3F3] bg-white text-[#4F5C18] disabled:opacity-30 hover:bg-[#F3F3F3] transition-all"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;