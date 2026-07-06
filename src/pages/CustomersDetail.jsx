import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaChevronLeft, FaHistory, FaPhoneAlt, FaEnvelope, FaGem, FaMedal, FaAward, FaMapMarkerAlt } from "react-icons/fa";
import { supabase } from "../services/supabaseClient";

const CustomersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch customer profile
      const { data: custData, error: custErr } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (custErr) throw custErr;
      if (!custData) throw new Error("Customer not found");

      setCustomer(custData);

      // 2. Fetch customer orders
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      
      if (ordersErr) throw ordersErr;
      setOrders(ordersData || []);

    } catch (err) {
      console.error("Error fetching customer details:", err);
      setError(err.message || "Failed to load customer profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-[#4F5C18] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold mb-4">{error || "Customer data not found."}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-[#4F5C18] text-white rounded-xl">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-10 px-4 font-poppins text-[#262626]">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4F5C18] font-bold text-[10px] uppercase tracking-widest mb-6 hover:opacity-70 transition-all cursor-pointer"
      >
        <FaChevronLeft /> Back to Directory
      </button>

      <PageHeader title="Member Profile" breadcrumb={["Customers", "Detailed Profile"]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-10 border border-[#F3F3F3] shadow-sm text-center sticky top-24">
            <div className="w-24 h-24 bg-[#4F5C18] text-white flex items-center justify-center rounded-[2.5rem] mx-auto mb-6 text-4xl font-playfair font-bold shadow-xl shadow-[#4F5C18]/20">
              {customer.full_name?.charAt(0) || "U"}
            </div>
            <h2 className="text-2xl font-playfair font-bold text-[#262626] mb-1">{customer.full_name}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 font-mono truncate">{customer.id}</p>
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-8 ${
              customer.loyalty_tier === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              customer.loyalty_tier === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
              'bg-orange-50 text-orange-600 border-orange-100'
            }`}>
              {customer.loyalty_tier === 'Gold' ? <FaGem /> : customer.loyalty_tier === 'Silver' ? <FaMedal /> : <FaAward />}
              {customer.loyalty_tier} Membership
            </div>
            
            <div className="space-y-4 pt-6 border-t border-[#F3F3F3]">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaPhoneAlt size={12} /></div>
                <p className="text-sm font-bold text-[#262626]">{customer.phone || "-"}</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaEnvelope size={12} /></div>
                <p className="text-sm font-bold text-[#262626] truncate">{customer.email}</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaMapMarkerAlt size={12} /></div>
                <p className="text-xs font-medium text-gray-500">{customer.city || "Jakarta, Indonesia"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F3F3F3] shadow-sm">
            <h3 className="font-playfair font-bold text-[#262626] text-xl mb-6 flex items-center gap-3">
              <FaHistory className="text-[#4F5C18]" /> Purchase History
            </h3>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((item, idx) => (
                  <div key={item.id} className="flex justify-between items-center p-6 bg-[#F3F3F3]/30 rounded-2xl border border-[#F3F3F3]/50 hover:bg-[#F3F3F3]/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#F3F3F3] font-bold text-[#4F5C18] text-xs">#{idx + 1}</div>
                      <div>
                        <p className="font-bold text-[#262626] text-sm">{item.order_id}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.order_date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#4F5C18] text-sm">Rp {parseFloat(item.total_price || 0).toLocaleString('id-ID')}</p>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${
                        item.status === 'Completed' ? 'text-emerald-600' :
                        item.status === 'Cancelled' ? 'text-red-500' : 'text-amber-500'
                      }`}>{item.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  Belum ada riwayat transaksi untuk kustomer ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersDetail;