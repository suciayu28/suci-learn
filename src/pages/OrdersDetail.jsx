import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaChevronLeft, FaPrint, FaDownload, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaBox, FaGem } from "react-icons/fa";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Logika pengambilan data customer sinkron dengan index ID
  const orderIndex = id?.includes('-') ? parseInt(id.split('-')[1]) - 1 : 0;
  const customers = ["Joko Anwar", "Indra Bruggman", "Gilang Dirga", "Hana Pertiwi", "Siti Aminah", "Budi Santoso"];
  const currentCustomer = customers[orderIndex % 6] || "Valued Customer";
  const orderStatus = ["Pending", "Completed", "Cancelled"][orderIndex % 3] || "Completed";

  // Mock Data Produk Makeup (Item List)
  const purchasedItems = [
    { id: 1, name: "Silk Satin Foundation", shade: "Warm Ivory (02)", price: 350000, qty: 1, category: "Face" },
    { id: 2, name: "Velvet Matte Lipstick", shade: "Midnight Rose", price: 185000, qty: 2, category: "Lips" },
    { id: 3, name: "Glow Radiance Palette", shade: "Celestial Gold", price: 425000, qty: 1, category: "Eyes" }
  ];

  const subtotal = purchasedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const grandTotal = subtotal + tax;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700 pb-10 px-4 font-poppins text-[#262626]">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4F5C18] font-black text-[10px] uppercase tracking-widest mb-6 hover:opacity-70 transition-all"
      >
        <FaChevronLeft size={10} /> Back to Sales Overview
      </button>

      <PageHeader title={`Invoice #${id}`} breadcrumb={["Orders", "Details"]}>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-[#F3F3F3] text-[#4F5C18] rounded-xl hover:bg-[#F3F3F3] transition-all">
            <FaPrint size={14} />
          </button>
          <button className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#4F5C18]/20 transition-all hover:opacity-90">
            <FaDownload size={14} /> PDF Invoice
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* LEFT: Item Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F3F3F3] shadow-sm">
            <h3 className="font-playfair font-bold text-[#262626] text-xl mb-6 flex items-center gap-3">
              <FaBox className="text-[#4F5C18]" size={18} /> Order Summary
            </h3>
            
            <div className="space-y-4">
              {purchasedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-5 bg-[#F3F3F3]/30 rounded-2xl border border-[#F3F3F3]/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4F5C18] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-[#4F5C18]/20">
                      {item.qty}x
                    </div>
                    <div>
                      <p className="font-bold text-[#262626] text-sm">{item.name}</p>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-[9px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-500 font-black uppercase tracking-tighter">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-[#4F5C18] font-medium italic">
                          Shade: {item.shade}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="font-black text-[#262626] text-sm">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>

            {/* Total Calculations */}
            <div className="mt-10 pt-6 border-t-2 border-dashed border-[#F3F3F3] space-y-3 text-right">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>PPN (11%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#F3F3F3]">
                <span className="font-playfair font-bold text-[#262626] text-2xl">Grand Total</span>
                <span className="font-poppins font-black text-[#4F5C18] text-3xl">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Status & Customer Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-[#4F5C18] rounded-[2.5rem] p-8 text-white shadow-xl shadow-[#4F5C18]/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Status</p>
              <h4 className="text-2xl font-playfair font-bold mb-6">{orderStatus}</h4>
              <div className="flex items-center gap-3 text-xs font-medium bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <FaCalendarAlt className="opacity-60" />
                <span>12 May 2026 - 10:30 AM</span>
              </div>
            </div>
            <FaGem className="absolute -right-4 -bottom-4 text-white opacity-10 text-9xl rotate-12" />
          </div>

          {/* Customer Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F3F3F3] shadow-sm">
            <h3 className="font-playfair font-bold text-[#262626] text-lg mb-6">Client Information</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[#F3F3F3] rounded-2xl text-[#4F5C18]"><FaUser size={16} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-bold text-[#262626]">{currentCustomer}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-4 bg-[#F3F3F3] rounded-2xl text-[#4F5C18]"><FaMapMarkerAlt size={16} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">
                    Jl. Senopati Raya No. 45, Kebayoran Baru, Jakarta Selatan, 12190
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;