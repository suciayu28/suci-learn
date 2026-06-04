import React, { useState, useEffect } from "react"; // Menambahkan useEffect ke dalam import
import { useNavigate } from "react-router-dom"; // Mengimport useNavigate untuk fungsi navigasi balik
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import LumiereBadge from "../components/basic/LumiereBadge";

const OrderHistory = () => {
  const navigate = useNavigate(); // Inisialisasi hook navigasi

  // --- DATA DUMMY (Sesuai struktur tabel kamu) ---
  const [orders] = useState([
    {
      order_id: "ORD-2024-001",
      order_date: "12 Mei 2024",
      status: "Selesai",
      total_amount: "Rp 1.225.000",
      items: [
        { product_name: "Velvet Lipstick", qty: 2, subtotal: "Rp 700.000" },
        { product_name: "Glow Cushion", qty: 1, subtotal: "Rp 525.000" }
      ]
    },
    {
      order_id: "ORD-2024-005",
      order_date: "15 Mei 2024",
      status: "Dikirim",
      total_amount: "Rp 850.000",
      items: [
        { product_name: "Rose Serum", qty: 1, subtotal: "Rp 850.000" }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- USE EFFECT ---
  // Secara otomatis memilih pesanan paling pertama saat halaman riwayat dimuat (UX enhancement)
  useEffect(() => {
    if (orders && orders.length > 0) {
      setSelectedOrder(orders[0]);
    }
  }, [orders]); // Dependensi dipasang ke array data orders

  return (
    <div className="bg-[#F3F3F3] min-h-screen font-poppins text-[#262626] pb-20">
      {/* Header Eksklusif */}
      <header className="bg-white border-b border-gray-100 pt-16 pb-10 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F5C18] mb-2 block">
              Atelier Member Area
            </span>
            <h1 className="text-4xl font-playfair italic">Riwayat Pesanan</h1>
          </div>
          {/* Menambahkan event handler onClick untuk mengaktifkan fungsi tombol kembali ke halaman root */}
          <button 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#4F5C18] transition-colors"
          >
            <FiArrowLeft /> Kembali ke Store
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: Order List (Tabel Orders) */}
          <div className="lg:col-span-2 space-y-6">
            {orders.map((order) => (
              <div 
                key={order.order_id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                  selectedOrder?.order_id === order.order_id ? "border-[#4F5C18]" : "border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F3F3F3] rounded-2xl flex items-center justify-center text-[#4F5C18]">
                      <FiPackage size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                      <p className="font-bold">{order.order_id}</p>
                    </div>
                  </div>
                  <LumiereBadge 
                    className={order.status === "Selesai" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}
                  >
                    {order.status}
                  </LumiereBadge>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Tanggal</p>
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <FiClock size={12} /> {order.order_date}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                      <p className="text-sm font-bold text-[#4F5C18]">{order.total_amount}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group">
                    Detail <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Details (Tabel Order_Details) */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-[#262626] text-white p-10 rounded-[3rem] sticky top-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F5C18]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <h3 className="text-xl font-playfair italic mb-8 border-b border-white/10 pb-4">Rincian Item</h3>
                
                <div className="space-y-6">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold">{item.product_name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                      </div>
                      <p className="text-xs font-medium">{item.subtotal}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <span>Subtotal</span>
                    <span>{selectedOrder.total_amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold italic font-playfair text-[#4F5C18]">Atelier Rewards</span>
                    <span className="text-xs text-[#4F5C18]">- Rp 0</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-sm font-bold uppercase tracking-widest">Grand Total</span>
                    <span className="text-lg font-bold text-[#4F5C18]">{selectedOrder.total_amount}</span>
                  </div>
                </div>

                <button className="w-full mt-10 py-4 bg-[#4F5C18] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#3a4412] transition-all">
                  Lacak Pengiriman
                </button>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center opacity-40">
                <FiPackage size={40} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Pilih pesanan untuk melihat detail</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default OrderHistory;