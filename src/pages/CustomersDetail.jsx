import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaChevronLeft, FaHistory, FaPhoneAlt, FaEnvelope, FaGem, FaMedal, FaAward, FaMapMarkerAlt } from "react-icons/fa";

const CustomersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Logic pengambilan data sinkron dengan ID Customer Store
  const custIndex = id?.includes('-') ? parseInt(id.split('-')[1]) - 1 : 0;
  
  const names = ["Amanda Putri", "Syafira Bella", "Clara Wijaya", "Nadia Safira", "Rania Azzahra", "Jessica Tan", "Dewi Sartika", "Manda Rose", "Bella Hadid", "Selena Gomez", "Kylie Jenner", "Kimberly"];
  
  const currentName = names[custIndex % names.length] || "Guest Member";
  const currentTier = ["Gold", "Silver", "Bronze"][custIndex % 3] || "Bronze";
  const currentPhone = `0812-9988-${(custIndex + 100)}`;
  const currentEmail = `customer${custIndex + 1}@makeupstore.com`;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-10 px-4 font-poppins text-[#262626]">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4F5C18] font-bold text-[10px] uppercase tracking-widest mb-6 hover:opacity-70 transition-all"
      >
        <FaChevronLeft /> Back to Directory
      </button>

      <PageHeader title="Member Profile" breadcrumb={["Customers", "Detailed Profile"]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-10 border border-[#F3F3F3] shadow-sm text-center sticky top-24">
            <div className="w-24 h-24 bg-[#4F5C18] text-white flex items-center justify-center rounded-[2.5rem] mx-auto mb-6 text-4xl font-playfair font-bold shadow-xl shadow-[#4F5C18]/20">
              {currentName.charAt(0)}
            </div>
            <h2 className="text-2xl font-playfair font-bold text-[#262626] mb-1">{currentName}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{id}</p>
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-8 ${
              currentTier === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
              currentTier === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
              'bg-orange-50 text-orange-600 border-orange-100'
            }`}>
              {currentTier === 'Gold' ? <FaGem /> : currentTier === 'Silver' ? <FaMedal /> : <FaAward />}
              {currentTier} Membership
            </div>
            
            <div className="space-y-4 pt-6 border-t border-[#F3F3F3]">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaPhoneAlt size={12} /></div>
                <p className="text-sm font-bold text-[#262626]">{currentPhone}</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaEnvelope size={12} /></div>
                <p className="text-sm font-bold text-[#262626] truncate">{currentEmail}</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaMapMarkerAlt size={12} /></div>
                <p className="text-xs font-medium text-gray-500">Jakarta, Indonesia</p>
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
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-[#F3F3F3]/30 rounded-2xl border border-[#F3F3F3]/50 hover:bg-[#F3F3F3]/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#F3F3F3] font-bold text-[#4F5C18] text-xs">#{i+1}</div>
                    <div>
                      <p className="font-bold text-[#262626] text-sm">Order #ORD-88{custIndex}{i}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">24 May 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#4F5C18] text-sm">Rp {(450000 + (i * 50000)).toLocaleString('id-ID')}</p>
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Delivered</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersDetail;