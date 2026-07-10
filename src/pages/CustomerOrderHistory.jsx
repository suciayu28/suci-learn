import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiArrowLeft, FiShoppingBag, FiLoader } from "react-icons/fi";
import { supabase } from "../services/supabaseClient";

const CustomerOrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Cek status login
    const session = localStorage.getItem("userLoggedIn");
    if (!session) {
      navigate("/login");
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      setUserEmail(parsedSession.email);
      fetchCustomerOrders(parsedSession.email, parsedSession.name);
    } catch (err) {
      console.error("Gagal membaca sesi", err);
      navigate("/login");
    }
  }, [navigate]);

  const fetchCustomerOrders = async (email, name) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_name.eq.${name}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedOrders = (data || []).map(order => ({
        id: order.id,
        order_id: order.order_id || `ORD-${order.id.toString().substring(0,6).toUpperCase()}`,
        order_date: new Date(order.created_at).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'long', year: 'numeric'
        }),
        status: getStatusText(order.tracking_status),
        total_amount: `Rp ${order.total_price ? order.total_price.toLocaleString('id-ID') : 0}`,
        raw_status: order.tracking_status || 1,
        items: [] // Jika punya tabel detail pesanan, bisa di-fetch di sini
      }));

      setOrders(formattedOrders);
      if (formattedOrders.length > 0) {
        setSelectedOrder(formattedOrders[0]);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 1: return "Diproses";
      case 2: return "Dikemas";
      case 3: return "Dikirim";
      case 4: return "Selesai";
      default: return "Menunggu";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center">
        <FiLoader className="w-12 h-12 text-[#4F5C18] animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Memuat Riwayat Pesanan...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F3F3] min-h-screen font-poppins text-[#262626] pb-20">
      {/* Header Eksklusif */}
      <header className="bg-white border-b border-gray-100 pt-16 pb-10 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F5C18] mb-2 block">
              Atelier Member Area
            </span>
            <h1 className="text-4xl font-serif font-black italic">Riwayat Pesanan Anda</h1>
          </div>
          <button 
            onClick={() => navigate("/order-member")} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#4F5C18] transition-colors bg-transparent border-none cursor-pointer"
          >
            <FiArrowLeft /> Kembali ke Belanja
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: Order List */}
          <div className="lg:col-span-2 space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-300">
                <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">Belum Ada Pesanan</h3>
                <p className="text-sm text-gray-500 mb-6">Anda belum pernah melakukan pemesanan di Lumière Cosmetics.</p>
                <button 
                  onClick={() => navigate("/order-member")}
                  className="bg-[#4F5C18] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#3a4412] transition-colors border-none cursor-pointer"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white p-8 rounded-[2.5rem] shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                    selectedOrder?.id === order.id ? "border-[#4F5C18]" : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F3F3F3] rounded-2xl flex items-center justify-center text-[#4F5C18]">
                        <FiPackage size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-left">Order ID</p>
                        <p className="font-bold text-left">{order.order_id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.raw_status >= 4 ? "bg-emerald-50 text-emerald-600" : 
                      order.raw_status >= 2 ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 text-left">Tanggal</p>
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <FiClock size={12} /> {order.order_date}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 text-left">Total</p>
                        <p className="text-sm font-bold text-[#4F5C18] text-left">{order.total_amount}</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group bg-transparent border-none cursor-pointer text-[#262626] hover:text-[#4F5C18]">
                      Detail <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-[#262626] text-white p-10 rounded-[3rem] sticky top-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F5C18]/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <h3 className="text-xl font-serif italic mb-8 border-b border-white/10 pb-4 text-left">Rincian Pesanan</h3>
                
                <div className="space-y-6">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div className="text-left">
                          <p className="text-xs font-bold">{item.product_name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Qty: {item.qty}</p>
                        </div>
                        <p className="text-xs font-medium">{item.subtotal}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-left">
                      <p className="text-xs text-gray-400 italic">Pesanan ini telah dicatat dalam sistem.</p>
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-sm font-bold uppercase tracking-widest">Grand Total</span>
                    <span className="text-lg font-bold text-[#4F5C18]">{selectedOrder.total_amount}</span>
                  </div>
                </div>

                {selectedOrder.raw_status < 4 && (
                  <button 
                    onClick={() => navigate("/order-member")}
                    className="w-full mt-10 py-4 bg-[#4F5C18] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#3a4412] transition-all cursor-pointer border-none text-white"
                  >
                    Lacak Pengiriman
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-300 rounded-[3rem] flex flex-col items-center justify-center p-10 text-center opacity-60">
                <FiPackage size={40} className="mb-4 text-gray-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Pilih pesanan untuk melihat detail</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default CustomerOrderHistory;
