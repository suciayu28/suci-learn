import { useState } from "react";
import { FiSearch, FiCalendar, FiDownload, FiPlus, FiBell, FiX, FiArrowRight } from "react-icons/fi";

const Header = () => {
  // State untuk mengontrol pop-up pencarian
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center justify-between py-4 pl-24 relative">
      <div>
        <h1 className="text-2xl font-serif italic font-semibold text-gray-900 tracking-tight">Lumière Cosmetics</h1>
        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[0.3em]">Lumière Management System</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar Wrapper */}
        <div className="relative">
          <div className={`hidden md:flex items-center gap-3 bg-white border ${showSearch ? 'border-black ring-1 ring-black' : 'border-gray-100'} px-4 py-2 rounded-2xl shadow-sm transition-all duration-300`}>
            <FiSearch className={showSearch ? "text-black" : "text-gray-400"} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              onFocus={() => setShowSearch(true)}
              // onBlur pakai delay supaya klik di item pop-up tidak langsung tertutup
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="bg-transparent outline-none text-[11px] font-medium w-40" 
            />
          </div>

          {/* --- POP-UP SEARCH RESULTS --- */}
          {showSearch && (
            <div className="absolute top-14 right-0 w-[320px] bg-white border border-gray-100 shadow-2xl rounded-[2rem] p-5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-5 px-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">Quick Results</span>
                <FiX className="text-gray-300 cursor-pointer hover:text-black" onClick={() => setShowSearch(false)} />
              </div>
              
              <div className="space-y-3">
                {/* Dummy Data Pop-up */}
                {[
                  { name: "Matte Lipstick Rose", cat: "Inventory" },
                  { name: "Order #8842", cat: "Sales" },
                  { name: "Glow Serum v2", cat: "Stock" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:bg-black group-hover:text-white transition-colors">
                        <FiSearch size={12} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-700 tracking-tight">{item.name}</p>
                        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{item.cat}</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-gray-200 group-hover:text-black transition-colors" size={14} />
                  </div>
                ))}
              </div>
              
              <div className="mt-5 pt-4 border-t border-gray-50 text-center">
                <button className="text-[9px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-600">View All Results</button>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Tetap Dipertahankan sesuai request kamu */}
        <div className="flex items-center gap-2 border-l border-gray-100 pl-4">
          <button title="Calendar" className="p-2.5 text-gray-400 hover:text-black transition-colors">
            <FiCalendar size={18} />
          </button>
          <button className="bg-white border border-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
            <FiDownload size={14} /> Export
          </button>
          <button className="bg-black text-white px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-black/10">
            <FiPlus size={14} /> Add Product
          </button>
          <div className="relative ml-2">
            <FiBell size={20} className="text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;