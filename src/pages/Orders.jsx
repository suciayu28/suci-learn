import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { 
  FaShoppingBag, 
  FaSearch, 
  FaChevronLeft, 
  FaChevronRight, 
  FaEye, 
  FaCrown, 
  FaTimes, 
  FaEllipsisV,
  FaCheck,
  FaBan,
  FaClock,
  FaLock
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCRMData, saveCRMData } from "../lib/crmData";

const Orders = () => {
  const navigate = useNavigate();
  
  // ─── STATE PROTEKSI ROLE ADMIN ──────────────────────────────────────
  const [currentRole, setCurrentRole] = useState(null);

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPayment, setFilterPayment] = useState("All");
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  const itemsPerPage = 8;
  const searchInputRef = useRef(null);

  // Load orders and verify user authentication role
  useEffect(() => {
    // 1. Cek validasi role dari localStorage
    const savedUser = localStorage.getItem("userLoggedIn");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentRole(userData.role || "Customer");
    } else {
      setCurrentRole("Guest");
    }

    // 2. Ambil data transaksi CRM
    const db = getCRMData();
    setOrders(db.orders || []);
  }, []);

  // Auto focus search input
  useEffect(() => {
    if (searchInputRef.current && currentRole === "Admin") {
      searchInputRef.current.focus();
    }
  }, [currentRole]);

  // Filter logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTier = filterTier === "All" || order.tier === filterTier;
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesPayment = filterPayment === "All" || order.paymentMethod === filterPayment;
    
    return matchesSearch && matchesTier && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setFilterTier("All");
    setFilterStatus("All");
    setFilterPayment("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleDownload = () => {
    alert(`Mengekspor ${filteredOrders.length} data transaksi filter (${filterStatus}/${filterTier}) ke file Excel...`);
  };

  // Change transaction status from dropdown action
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(o => {
      if (o.order_id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updatedOrders);

    // Save to localStorage
    const db = getCRMData();
    db.orders = updatedOrders;
    saveCRMData(db);

    setActiveDropdownId(null);
    alert(`Success! Order ${orderId} status changed to ${newStatus}.`);
  };

  // ─── 1. LOADING STATE CEK AUTHENTICATION ────────────────────────────
  if (currentRole === null) {
    return (
      <div className="flex items-center justify-center min-h-[75vh]">
        <div className="w-8 h-8 border-4 border-[#4F5C18] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ─── 2. BLOKADE KONTEN JIKA USER BUKAN ADMIN (CUSTOMER / GUEST) ──────
  if (currentRole !== "Admin") {
    return (
      <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[70vh] px-4 font-poppins text-center text-[#262626]">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-sm animate-bounce">
          <FaLock size={32} />
        </div>
        <h3 className="font-playfair font-black text-3xl mb-2 tracking-tight">Access Denied</h3>
        <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
          Maaf, halaman Manajemen Transaksi ini bersifat rahasia dan hanya dapat diakses oleh akun **Administrator**.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3.5 bg-[#262626] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md cursor-pointer"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // ─── 3. TAMPILAN UTUH HALAMAN TRANSAKSI (HANYA UNTUK ADMIN) ─────────
  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins relative">
      <PageHeader title="Transaction Management" breadcrumb={["CRM", "Transactions"]}>
        <button 
          onClick={handleDownload}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2"
        >
          <FaShoppingBag size={14} /> Download Transaction Report
        </button>
      </PageHeader>

      {/* SEARCH AND FILTERS */}
      <div className="mb-6 flex flex-col gap-4">
        
        {/* Search */}
        <div className="relative group">
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#4F5C18]/40" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search transactions by Order ID, Customer ID, or name..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-6 py-4 bg-[#F3F3F3] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#4F5C18]/20 text-sm font-medium transition-all"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <select 
            value={filterTier}
            onChange={(e) => { setFilterTier(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-white border border-[#F3F3F3] text-[#262626] rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
          >
            <option value="All">All Memberships</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-white border border-[#F3F3F3] text-[#262626] rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select 
            value={filterPayment}
            onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-white border border-[#F3F3F3] text-[#262626] rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-[#4F5C18]/20 cursor-pointer"
          >
            <option value="All">All Payments</option>
            <option value="Virtual Account">Virtual Account</option>
            <option value="Credit Card">Credit Card</option>
            <option value="GoPay">GoPay</option>
            <option value="ShopeePay">ShopeePay</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {/* Reset Filters */}
          <button 
            onClick={resetFilters}
            className="py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all font-bold text-[10px] uppercase tracking-widest border border-red-100 flex items-center justify-center gap-2"
          >
            <FaTimes /> Clear Filters
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#F3F3F3] overflow-visible mb-4">
        <Table>
          <TableHeader className="bg-[#F3F3F3]/50">
            <TableRow className="border-b border-[#F3F3F3]">
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18]">Order ID</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18]">Customer Profile</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Payment Info</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Membership</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-right">Total spent</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Status</TableHead>
              <TableHead className="p-6 font-bold text-[10px] uppercase tracking-[0.15em] text-[#4F5C18] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <TableRow key={order.order_id} className="hover:bg-[#F3F3F3]/30 transition-all border-[#F3F3F3] overflow-visible">
                  <TableCell className="p-6">
                    <span className="text-[11px] font-mono font-bold text-[#4F5C18] bg-[#4F5C18]/5 px-3 py-1 rounded-lg border border-[#4F5C18]/10">
                      {order.order_id}
                    </span>
                  </TableCell>
                  <TableCell className="p-6">
                    <p className="text-sm font-bold text-[#262626] font-playfair">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Date: {order.order_date}</p>
                  </TableCell>
                  <TableCell className="p-6 text-center">
                    <p className="text-xs font-bold text-gray-700">{order.paymentMethod}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-bold uppercase tracking-widest">{order.itemsCount} Items</p>
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
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                      order.status === "Pending" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="p-6 text-center relative">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/orders/${order.order_id}`)}
                        className="p-3 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#4F5C18] hover:text-white transition-all shadow-sm"
                        title="View Detailed Invoice"
                      >
                        <FaEye size={12} />
                      </button>

                      {/* Dropdown Menu Trigger */}
                      <div className="relative">
                        <button 
                          onClick={() => setActiveDropdownId(activeDropdownId === order.order_id ? null : order.order_id)}
                          className="p-3 bg-white border border-[#F3F3F3] text-gray-400 hover:text-[#262626] rounded-xl hover:bg-gray-100 transition-all shadow-sm"
                        >
                          <FaEllipsisV size={12} />
                        </button>

                        {activeDropdownId === order.order_id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-[#F3F3F3] shadow-xl rounded-2xl p-2 z-[99] animate-in fade-in slide-in-from-top-2 duration-250 text-left">
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 px-3 py-1.5 border-b border-gray-100">Update Status</p>
                            
                            <button 
                              onClick={() => updateOrderStatus(order.order_id, "Completed")}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                              <FaCheck size={10} /> Mark Completed
                            </button>
                            
                            <button 
                              onClick={() => updateOrderStatus(order.order_id, "Pending")}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            >
                              <FaClock size={10} /> Set Pending
                            </button>
                            
                            <button 
                              onClick={() => updateOrderStatus(order.order_id, "Cancelled")}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <FaBan size={10} /> Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="p-10 text-center text-gray-400 italic">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-[#F3F3F3] flex items-center justify-between bg-[#F3F3F3]/10">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Showing {currentOrders.length} of {filteredOrders.length} Records | Page {currentPage} of {totalPages || 1}
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