import { NavLink } from "react-router-dom";
import { 
  HiOutlineSquares2X2, 
  HiOutlineShoppingBag, 
  HiOutlineUsers, 
  HiOutlineSparkles, // Ikon baru untuk Showcase agar lebih estetik
  HiOutlineArrowLeftOnRectangle 
} from "react-icons/hi2";

const Sidebar = () => {
  const activeStyle = "bg-black text-white shadow-2xl shadow-black/20 scale-110";
  const baseStyle = "w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 hover:bg-gray-100 text-gray-400 hover:text-black";

  return (
    <div className="fixed left-6 top-6 bottom-6 w-20 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] flex flex-col items-center py-10 z-50 shadow-sm">
      <div className="mb-12 font-serif italic font-black text-2xl tracking-tighter text-black">L.</div>
      
      <nav className="flex flex-col gap-6 flex-1">
        <NavLink to="/" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}>
          <HiOutlineSquares2X2 size={20} />
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}>
          <HiOutlineShoppingBag size={20} />
        </NavLink>

        <NavLink to="/customers" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}>
          <HiOutlineUsers size={20} />
        </NavLink>

        {/* Link ke Showcase Modul 10 (Tetap menggunakan path /atelier-lab agar tidak perlu rubah App.jsx lagi) */}
        <NavLink to="/atelier-lab" className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}>
          <HiOutlineSparkles size={20} />
        </NavLink>
      </nav>

      <button className="text-gray-300 hover:text-rose-500 transition-colors mt-auto">
        <HiOutlineArrowLeftOnRectangle size={22} />
      </button>
    </div>
  );
};

export default Sidebar;