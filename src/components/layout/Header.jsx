import { useState } from "react";
import { FiSearch, FiBell, FiChevronDown, FiX, FiArrowRight } from "react-icons/fi";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    // PY-5 & PX-10: Membuat tinggi total header jauh lebih tebal, luas, dan berwibawa
    <div className="flex items-center justify-between py-5 px-10 bg-white border-b border-gray-100 sticky top-0 z-50 font-['Poppins'] w-full">
      
      {/* SISI KIRI: SEARCH BAR KAPSUL (UKURAN BESAR) */}
      <div className="relative w-full max-w-lg"> {/* Diperlebar dari max-w-md ke max-w-lg */}
        <div 
          className={`flex items-center justify-between bg-gray-50/80 border ${
            showSearch ? 'border-[#4F5C18] bg-white ring-4 ring-[#4F5C18]/5' : 'border-gray-200'
          } pl-5 pr-3 py-3 rounded-full transition-all duration-200`} // PY-3: Membuat kapsul lebih gemuk & tinggi
        >
          <div className="flex items-center gap-3 w-full">
            <FiSearch className={showSearch ? "text-[#4F5C18]" : "text-gray-400"} size={19} /> {/* Ikon diperbesar */}
            <input 
              type="text" 
              placeholder="Cari produk, order, atau inventaris kosmetik..." 
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="bg-transparent outline-none text-[14px] font-medium w-full text-[#262626] placeholder:text-gray-400" // Teks naik ke 14px
            />
          </div>
          
          {/* Badge Pintasan Keyboard ⌘K (Lebih Tebal) */}
          <div className="bg-white border border-gray-200 text-gray-500 font-mono text-[12px] font-bold px-2.5 py-1 rounded-lg shadow-2xs select-none">
            ⌘K
          </div>
        </div>

        {/* --- POP-UP SEARCH RESULTS (Menyesuaikan Skala Besar) --- */}
        {showSearch && (
          <div className="absolute top-16 left-0 w-[450px] bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.08)] rounded-2xl p-6 z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Hasil Pencarian Cepat</span>
              <FiX className="text-gray-400 cursor-pointer hover:text-[#262626]" size={18} onClick={() => setShowSearch(false)} />
            </div>
            
            <div className="space-y-1.5">
              {[
                { name: "Matte Lipstick Rose", cat: "Inventory" },
                { name: "Order #8842", cat: "Sales" },
                { name: "Glow Serum v2", cat: "Stock" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all group">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-[#F2F7D6]/70 rounded-lg flex items-center justify-center text-[#4F5C18]">
                      <FiSearch size={15} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#262626]">{item.name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.cat}</p>
                    </div>
                  </div>
                  <FiArrowRight className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#4F5C18] transition-all" size={16} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SISI KANAN: NOTIFIKASI & PROFIL USER (UKURAN BESAR) */}
      <div className="flex items-center gap-6"> {/* Jarak antar item diperlebar */}
        
        {/* Tombol Notifikasi (Lebih Besar & Bulat Mantap) */}
        <div className="relative p-3 bg-white border border-gray-200 rounded-full shadow-xs text-gray-400 hover:text-gray-600 hover:shadow-sm cursor-pointer transition-all group">
          <FiBell size={22} /> {/* Ukuran ikon naik ke 22 */}
          {/* Dot Notifikasi Merah */}
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </div>

        {/* Garis Pembatas Vertikal Lebih Tinggi */}
        <div className="h-10 w-px bg-gray-200 mx-1"></div>

        {/* INFORMASI USER AVATAR */}
        <div className="flex items-center gap-4 cursor-pointer group select-none">
          {/* Avatar Diperbesar dari w-10 ke w-12 */}
          <div className="relative">
            <div className="w-12 h-12 bg-[#4F5C18] text-white font-bold text-base rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              LC
            </div>
            {/* Status Online Indicator (Lebih Kentara) */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></span>
          </div>

          {/* Teks Identitas Pengguna (Ukuran Font Dinaikkan) */}
          <div className="hidden sm:block text-left">
            <h4 className="text-[15px] font-bold text-gray-800 tracking-tight leading-tight group-hover:text-[#4F5C18] transition-colors">
              Lumière Admin
            </h4>
            <p className="text-[11px] text-gray-400 font-semibold tracking-wide leading-tight mt-1">
              Utama Manager
            </p>
          </div>

          {/* Chevron Arrow Down */}
          <FiChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors ml-1" size={18} />
        </div>

      </div>

    </div>
  );
};

export default Header;