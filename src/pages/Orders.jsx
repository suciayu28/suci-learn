import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaShoppingBag, FaSearch, FaChevronLeft, FaChevronRight, FaEye, FaFilter, FaCrown, FaTimes } from "react-icons/fa";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("All"); // State untuk Filter
  const itemsPerPage = 8;

  // 1. Data Pelanggan Make Up Store (800 Baris)
  const orderData = Array.from({ length: 800 }, (_, i) => {
    const tiers = ["Gold", "Silver", "Bronze"];
    const tier = tiers[i % 3];
    const customerNames = [
      "Amanda Putri", "Syafira Bella", "Clara Wijaya", "Nadia Safira", 
      "Rania Azzahra", "Jessica Tan", "Dewi Sartika", "Manda Rose",
      "Bella Hadid", "Selena Gomez", "Kylie Jenner", "Kimberly"
    ];
    
    const totalPrice = tier === "Gold" ? (120 + (i % 150)) * 50000 : 
                      tier === "Silver" ? (50 + (i % 50)) * 50000 : (5 + (i % 25)) * 50000;

    return {
      id: `CUST-${(i + 1).toString().padStart(3, '0')}`,
      customerName: customerNames[i % customerNames.length],
      tier: tier,
      totalPrice: totalPrice,
      itemsCount: (i % 8) + 1,
      date: `${((i % 28) + 1).toString().padStart(2, '0')}/05/2026`,
    };
  });

  // 2. Logika Gabungan: Filter Membership + Search
  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "All" || order.tier === filterTier;
    
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // 3. Fungsi Download List
  const handleDownload = () => {
    alert(`Mengekspor ${filteredOrders.length} data pelanggan (${filterTier}) ke file Excel...`);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins">
      <PageHeader title="Customer Management" breadcrumb={["Store", "Customers"]}>
        <button 
          onClick={handleDownload}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2"
        >
          <FaShoppingBag size={14} /> Download Customer List
        </button>
      </PageHeader>

      {/* Search & Filter Section */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
          <input 
            type="text" 
            placeholder="Search customer name or ID..." 
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
            className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>

        {/* Dropdown Filter Membership */}
        <div className="flex gap-2">
          <div className="relative">
            <select 
              value={filterTier}
              onChange={(e) => {setFilterTier(e.target.value); setCurrentPage(1);}}
              className="appearance-none pl-12 pr-10 py-4 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer transition-all"
            >
              <option value="All">All Membership</option>
              <option value="Gold">Gold Only</option>
              <option value="Silver">Silver Only</option>
              <option value="Bronze">Bronze Only</option>
            </select>
            <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]" size={14} />
          </div>

          {/* Reset Filter Button (Muncul jika sedang filter) */}
          {filterTier !== "All" && (
            <button 
              onClick={() => {setFilterTier("All"); setSearchQuery("");}}
              className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all shadow-sm flex items-center gap-2"
              title="Clear Filter"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-hidden mb-4">
        <Table>
          <TableHeader className="bg-[#F3F3F3]/50">
            <TableRow className="border-b border-[#F3F3F3]">
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18]">Customer ID</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18]">Customer Name</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Qty Purchased</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Membership</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-right">Total Spent</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#F3F3F3]/30 transition-all border-[#F3F3F3]">
                  <TableCell className="p-6">
                    <span className="text-[11px] font-mono font-bold text-[#4F5C18] bg-[#4F5C18]/5 px-3 py-1 rounded-lg border border-[#4F5C18]/10">
                      {order.id}
                    </span>
                  </TableCell>
                  <TableCell className="p-6">
                    <p className="text-sm font-bold text-[#262626] font-playfair">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Active since {order.date}</p>
                  </TableCell>
                  <TableCell className="p-6 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {order.itemsCount} Items
                  </TableCell>
                  <TableCell className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 mx-auto w-fit ${
                      order.tier === "Gold" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      order.tier === "Silver" ? "bg-slate-100 text-slate-600 border border-slate-200" : "bg-orange-50 text-orange-700 border border-orange-100"
                    }`}>
                      {order.tier === "Gold" && <FaCrown size={8} />} {order.tier}
                    </span>
                  </TableCell>
                  <TableCell className="p-6 text-right font-bold text-[#262626] text-sm">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="p-6 text-center">
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="p-3 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all shadow-sm"
                    >
                      <FaEye size={14} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-10 text-center text-gray-400 italic text-sm">
                  No data found for "{searchQuery}" in {filterTier} membership.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-[#F3F3F3] flex items-center justify-between bg-[#F3F3F3]/10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {currentOrders.length} of {filteredOrders.length} Records | Page {currentPage}
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

export default Orders;