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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[400px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-3">Search</h2>

            <input
              type="text"
              placeholder="Type something..."
              className="border w-full px-3 py-2 rounded outline-none"
            />

            <button
              onClick={() => setOpen(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
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