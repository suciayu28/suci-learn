import { NavLink, useNavigate } from "react-router-dom";
import { 
  HiOutlineSquares2X2, 
  HiOutlineShoppingBag, 
  HiOutlineUsers, 
  HiOutlineSparkles, 
  HiOutlineArrowLeftOnRectangle,
  HiOutlineIdentification,
  HiOutlineChatBubbleLeftRight,
  HiOutlineMegaphone,
  HiOutlineTag,
  HiOutlineReceiptPercent,
  HiOutlineUserGroup // Ditambahkan untuk ikon Manage Users
} from "react-icons/hi2";

const Sidebar = () => {
  const navigate = useNavigate();
  const activeStyle = "bg-[#4F5C18] text-white shadow-lg shadow-[#4F5C18]/15 translate-x-1 font-bold";
  const baseStyle = "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 text-gray-400 hover:text-black hover:bg-gray-100/80 w-full font-bold";

  return (
    <div className="fixed left-6 top-6 bottom-6 w-64 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] flex flex-col py-8 px-6 z-50 shadow-sm font-poppins">
      
      {/* Brand Logo & Name */}
      <div className="mb-10 flex items-center gap-3.5 px-2">
        <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-serif italic font-black text-xl shadow-md shadow-black/10">
          L.
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-black text-lg tracking-tight text-black leading-none">Lumière</span>
          <span className="text-[9px] font-black tracking-widest text-[#4F5C18] uppercase mt-1">CRM Portal</span>
        </div>
      </div>
      
      {/* Navigation Menu with labels */}
      <nav className="flex flex-col gap-2 flex-1 w-full overflow-y-auto pr-1 scrollbar-thin">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineSquares2X2 size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/admin/customers" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineUsers size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Customers</span>
        </NavLink>

        <NavLink 
          to="/admin/membership" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineIdentification size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Membership</span>
        </NavLink>

        {/* --- MENU BARU: MANAGE USERS --- */}
        <NavLink 
          to="/admin/notes" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineUserGroup size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Manage Users</span>
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineShoppingBag size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Transactions</span>
        </NavLink>

        <NavLink 
          to="/admin/feedback" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineChatBubbleLeftRight size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Feedback</span>
        </NavLink>

        <NavLink 
          to="/admin/marketing" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineMegaphone size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Marketing</span>
        </NavLink>

        {/* --- MENU: PROMO & SALES --- */}
        <NavLink 
          to="/admin/promo" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineReceiptPercent size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Promo & Sales</span>
        </NavLink>

        {/* New Catalog Manager page */}
        <NavLink 
          to="/admin/catalog" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineTag size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Catalog</span>
        </NavLink>

        {/* Link ke Showcase (User Page) */}
        <NavLink 
          to="/" 
          className={({ isActive }) => `${baseStyle} ${isActive ? activeStyle : ""}`}
        >
          <HiOutlineSparkles size={20} className="shrink-0" />
          <span className="text-[10px] uppercase tracking-widest">Storefront</span>
        </NavLink>
      </nav>

      {/* Logout Action */}
      <button 
        onClick={() => {
          localStorage.removeItem("admin_session");
          navigate("/");
        }}
        className="flex items-center gap-4 px-5 py-3.5 rounded-2xl w-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all mt-auto border border-transparent cursor-pointer shrink-0"
      >
        <HiOutlineArrowLeftOnRectangle size={20} className="shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;