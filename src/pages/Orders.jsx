import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { FaBoxOpen, FaShoppingBag, FaHistory, FaTimesCircle, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Orders = () => {
  const [showForm, setShowForm] = useState(false);
  
  // 1. LOGIKA PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  const orderData = Array.from({ length: 30 }, (_, i) => ({
    orderId: `ORD-${(i + 1).toString().padStart(3, '0')}`,
    customerName: ["Joko Anwar", "Indra Bruggman", "Gilang Dirga", "Hana Pertiwi"][i % 4],
    status: ["Pending", "Completed", "Cancelled"][i % 3],
    totalPrice: Math.floor(Math.random() * 500000) + 50000,
    date: `2026-04-${(i % 28) + 1}`
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orderData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orderData.length / itemsPerPage);

  return (
    <div className="animate-fadeIn pb-10 px-4">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="transform scale-90 origin-left">
          <PageHeader title="Product Sales" breadcrumb="Management / Orders" />
        </div>
        {/* Tombol ditaruh di sini agar tidak tertutup modal */}
        <button 
          type="button"
          className="relative z-10 whitespace-nowrap bg-rose-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-xl shadow-rose-200 transition-all transform active:scale-95 flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <FaShoppingBag size={14} /> Create Order
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-6 relative group">
        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-300 group-focus-within:text-rose-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search by Order ID..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-pink-50 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-rose-50 transition-all text-sm font-medium"
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-rose-50/30">
                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-rose-400">Ref. ID</th>
                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-rose-400">Customer</th>
                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-rose-400 text-center">Status</th>
                <th className="p-5 font-black text-[10px] uppercase tracking-widest text-rose-400 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/50">
              {currentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-rose-50/10 transition-all group">
                  <td className="p-5 text-[10px] font-mono font-bold text-rose-400">{order.orderId}</td>
                  <td className="p-5 text-sm font-serif font-black text-gray-800">{order.customerName}</td>
                  <td className="p-5 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase bg-rose-50 text-rose-600 border border-rose-100">
                       {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right font-black text-gray-700 text-sm">
                    Rp{order.totalPrice.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION NAVIGATION */}
        <div className="p-4 border-t border-rose-50 flex items-center justify-between bg-rose-50/5">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2.5 rounded-xl border border-rose-100 bg-white text-rose-400 disabled:opacity-30 hover:bg-rose-50"
            >
              <FaChevronLeft size={10} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2.5 rounded-xl border border-rose-100 bg-white text-rose-400 disabled:opacity-30 hover:bg-rose-50"
            >
              <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL - FIXED DI TENGAH */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-rose-900/20 backdrop-blur-md" 
            onClick={() => setShowForm(false)}
          ></div>
          <div className="relative bg-white p-8 rounded-[3rem] w-full max-w-md shadow-2xl animate-slideUp border border-white">
            <h2 className="text-2xl font-serif font-black text-gray-800 text-center mb-6">New Order</h2>
            <form className="space-y-4">
               <input type="text" className="w-full p-4 border border-pink-50 rounded-2xl bg-gray-50 text-sm" placeholder="Customer Name" />
               <div className="grid grid-cols-2 gap-3 mt-8">
                  <button type="button" onClick={() => setShowForm(false)} className="py-4 text-gray-400 font-black text-[10px] uppercase">Cancel</button>
                  <button type="button" className="py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-rose-200">Save Order</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;