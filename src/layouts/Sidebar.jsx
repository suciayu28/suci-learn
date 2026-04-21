import { FaHome, FaClipboardList, FaFileAlt, FaExclamationTriangle, FaLock, FaUserSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // Menggunakan text-green-600 sebagai pengganti 'text-hijau' agar standar Tailwind terbaca
  const menuClass = ({ isActive }) =>
    `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all duration-200 ${
      isActive
        ? "text-green-600 bg-green-100 font-extrabold"
        : "text-gray-600 hover:text-green-600 hover:bg-green-100 hover:font-extrabold"
    }`;

  return (
    <div className="w-64 bg-white min-h-screen shadow p-4">

      {/* LOGO */}
      <div className="mb-6 px-4">
        <h1 className="text-3xl font-bold">
          Sedap<span className="text-green-500">.</span>
        </h1>
        <p className="text-gray-400 text-sm">Modern Admin Dashboard</p>
      </div>

      {/* MENU */}
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className={menuClass}>
              <FaHome size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/orders" className={menuClass}>
              <FaClipboardList size={20} />
              <span>Order List</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/customers" className={menuClass}>
              <FaFileAlt size={20} />
              <span>Customer List</span>
            </NavLink>
          </li>

          {/* TAMBAHAN MENU ERROR UNTUK LATIHAN */}
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase">
            Error Pages
          </div>

          <li>
            <NavLink to="/400" className={menuClass}>
              <FaExclamationTriangle size={20} />
              <span>Error 400</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/401" className={menuClass}>
              <FaUserSlash size={20} />
              <span>Error 401</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/403" className={menuClass}>
              <FaLock size={20} />
              <span>Error 403</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* CARD */}
      <div className="mt-10 bg-green-500 text-white p-6 rounded-2xl mx-2">
        <p className="text-sm mb-4 leading-relaxed">
          Please organize your menus through button below!
        </p>
        <button className="bg-white text-green-500 w-full py-2 rounded-xl font-bold shadow-md active:scale-95 transition-transform">
          + Add Menu
        </button>
      </div>

    </div>
  );
};

export default Sidebar;