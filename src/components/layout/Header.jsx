import { useState } from "react";
import { FiSearch, FiCalendar, FiDownload, FiPlus, FiBell, FiX, FiArrowRight } from "react-icons/fi";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center justify-between py-4 pl-24 relative font-['Poppins']">
      {/* BRANDING SECTION */}
      <div>
        {/* Playfair Display untuk judul brand */}
        <h1 className="text-3xl font-['Playfair_Display'] italic font-semibold text-[#262626] tracking-tight">
          Lumière Cosmetics
        </h1>
        {/* Poppins Bold untuk sub-label sistem dengan warna Primary Olive */}
        <p className="text-[10px] text-[#4F5C18] font-bold uppercase tracking-[0.4em] mt-1">
          Lumière Management System
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* SEARCH BAR WRAPPER */}
        <div className="relative">
          <div className={`hidden md:flex items-center gap-3 bg-white border ${showSearch ? 'border-[#4F5C18] ring-1 ring-[#4F5C18]' : 'border-[#F3F3F3]'} px-5 py-2.5 rounded-2xl shadow-sm transition-all duration-300`}>
            <FiSearch className={showSearch ? "text-[#4F5C18]" : "text-gray-300"} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="bg-transparent outline-none text-[12px] font-medium w-48 text-[#262626] placeholder:text-gray-300" 
            />
          </div>

          {/* --- POP-UP SEARCH RESULTS (Anatomy: Rounded 3rem) --- */}
          {showSearch && (
            <div className="absolute top-16 right-0 w-[350px] bg-white border border-[#F3F3F3] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-6 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-6 px-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Quick Results</span>
                <FiX className="text-gray-300 cursor-pointer hover:text-[#262626] transition-colors" onClick={() => setShowSearch(false)} />
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "Matte Lipstick Rose", cat: "Inventory" },
                  { name: "Order #8842", cat: "Sales" },
                  { name: "Glow Serum v2", cat: "Stock" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-[#F4F3FF] rounded-[1.5rem] cursor-pointer transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#F2F7D6] rounded-xl flex items-center justify-center text-[#4F5C18] group-hover:bg-[#4F5C18] group-hover:text-white transition-all">
                        <FiSearch size={14} />
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#262626] tracking-tight">{item.name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.cat}</p>
                      </div>
                    </div>
                    <FiArrowRight className="text-gray-200 group-hover:text-[#4F5C18] transition-all" size={16} />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-5 border-t border-[#F3F3F3] text-center">
                <button className="text-[10px] font-bold uppercase tracking-widest text-[#4F5C18] hover:tracking-[0.4em] transition-all">
                  View All Results
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS (Anatomy: Capsule & Squircle) */}
        <div className="flex items-center gap-3 border-l border-[#F3F3F3] pl-6">
          <button title="Calendar" className="p-2.5 text-gray-400 hover:text-[#4F5C18] transition-colors">
            <FiCalendar size={20} />
          </button>
          
          {/* Export Button (Grey/Outline) */}
          <button className="bg-white border border-[#F3F3F3] text-[#262626] px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#F3F3F3] transition-all shadow-sm">
            <FiDownload size={15} /> Export
          </button>

          {/* Add Product Button (Primary Olive / Black Contrast) */}
          <button className="bg-[#262626] text-white px-5 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#4F5C18] transition-all shadow-lg shadow-black/5">
            <FiPlus size={15} /> Add Product
          </button>

          {/* Notification with Purple Accent Dot */}
          <div className="relative ml-2 cursor-pointer group">
            <FiBell size={22} className="text-gray-400 group-hover:text-[#262626] transition-colors" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#4F5C18] rounded-full border-2 border-white"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;