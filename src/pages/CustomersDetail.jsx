import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { FaChevronLeft, FaHistory, FaPhoneAlt, FaEnvelope, FaGem, FaMedal, FaAward } from "react-icons/fa";

const CustomersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Logika pengambilan data (Simulasi JSON)
  const custIndex = parseInt(id?.replace('C', '')) - 1;
  const names = ["Budi Santoso", "Siti Aminah", "Andi Wijaya", "Dewi Lestari", "Eko Prasetyo", "Hana Pertiwi"];
  
  // Perbaikan: Gunakan default value untuk mencegah error charAt
  const currentName = names[custIndex % 6] || "Guest Member";
  const currentTier = ["Bronze", "Silver", "Gold"][custIndex % 3] || "Bronze";
  const currentPhone = `081234567${(custIndex >= 0 ? custIndex : 0).toString().padStart(2, '0')}`;
  const currentEmail = `user${(custIndex >= 0 ? custIndex : 0) + 1}@mail.com`;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 pb-10 px-4 font-poppins text-[#262626]">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#4F5C18] font-bold text-[10px] uppercase tracking-widest mb-6 hover:underline transition-all"
      >
        <FaChevronLeft /> Back to Directory
      </button>

      <PageHeader title="Member Profile" breadcrumb={["Customers", "Detailed Profile"]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-10 border border-[#F3F3F3] shadow-sm text-center">
            {/* Circle Avatar dengan inisial aman */}
            <div className="w-24 h-24 bg-[#4F5C18] text-white flex items-center justify-center rounded-[2rem] mx-auto mb-6 text-4xl font-playfair font-bold shadow-xl shadow-[#4F5C18]/20">
              {currentName.charAt(0)}
            </div>
            <h2 className="text-2xl font-playfair font-bold text-[#262626] mb-1">{currentName}</h2>
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border mt-2 mb-6 ${
              currentTier === 'Gold' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
              currentTier === 'Silver' ? 'bg-slate-50 text-slate-500 border-slate-100' : 
              'bg-[#4F5C18]/10 text-[#4F5C18] border-[#4F5C18]/10'
            }`}>
              {currentTier === 'Gold' ? <FaGem /> : currentTier === 'Silver' ? <FaMedal /> : <FaAward />}
              {currentTier} Status
            </div>
            
            <div className="space-y-4 pt-6 border-t border-[#F3F3F3]">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaPhoneAlt size={12} /></div>
                <p className="text-sm font-bold text-[#262626]">{currentPhone}</p>
              </div>
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-[#F3F3F3] rounded-xl text-[#4F5C18]"><FaEnvelope size={12} /></div>
                <p className="text-sm font-bold text-[#262626]">{currentEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F3F3F3] shadow-sm">
            <h3 className="font-playfair font-bold text-[#262626] text-xl mb-6 flex items-center gap-3">
              <FaHistory className="text-[#4F5C18]" /> Purchase History
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-[#F3F3F3]/30 rounded-2xl border border-[#F3F3F3]/50">
                  <div>
                    <p className="font-bold text-[#262626] text-sm">Order #ORD-10{i+10}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">May 10, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#4F5C18] text-sm">Rp 450.000</p>
                    <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Success</p>
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