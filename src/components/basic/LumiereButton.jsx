import React from 'react';

/**
 * LumiereButton Component
 * Sesuai CP Pertemuan 10: Atomic Component (Unit terkecil yang reusable).
 * @param {string} variant - Pilihan gaya: 'primary', 'lime', atau 'outline'
 * @param {ReactElement} icon - Icon dari react-icons (optional)
 */
const LumiereButton = ({ children, variant = 'primary', icon: Icon, className = "", ...props }) => {
  // Definisi gaya berdasarkan variant untuk menjaga konsistensi brand Lumière
  const variants = {
    primary: "bg-[#262626] text-white hover:bg-[#4F5C18]",
    lime: "bg-[#D9E67E] text-[#262626] hover:bg-white border border-[#D9E67E] hover:border-[#262626]",
    outline: "bg-transparent border-2 border-[#4F5C18] text-[#4F5C18] hover:bg-[#4F5C18] hover:text-white"
  };

  const baseStyle = "px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-sm hover:shadow-xl active:scale-95";

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {/* Jika ada icon yang dikirim lewat props, tampilkan di sini */}
      {Icon && <Icon size={14} className="transition-transform group-hover:translate-x-1" />}
    </button>
  );
};

export default LumiereButton;