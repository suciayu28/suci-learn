import { FaBell, FaEnvelope, FaCog } from "react-icons/fa";
import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow">
        
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search here..."
          onClick={() => setOpen(true)}
          className="border px-4 py-2 rounded-md w-1/3 outline-none"
        />

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          
          <div className="relative">
            <FaBell className="text-gray-500 text-xl" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1 rounded-full">
              50
            </span>
          </div>

          <FaEnvelope className="text-gray-500 text-xl" />
          <FaCog className="text-gray-500 text-xl" />

          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-semibold">
              Hello, Suci Dwimas Ayu
            </span>
          </div>
        </div>
      </div>

      {/* MODAL SEARCH */}
    
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30" 
          // backdrop-blur-md: memberikan efek blur pada konten di belakangnya
          // bg-white/30: memberikan lapisan putih transparan tipis agar blur lebih terlihat estetik
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-3xl w-[450px] shadow-2xl border border-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-5 text-gray-800">Search</h2>

            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Apa yang ingin kamu cari?"
                className="border border-gray-200 w-full px-5 py-3 rounded-2xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-lg"
              />
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-2xl w-full shadow-lg shadow-green-200 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;