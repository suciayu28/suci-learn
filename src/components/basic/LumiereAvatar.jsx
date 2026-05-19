import React from 'react';

const LumiereAvatar = ({ name = "Admin", size = "md", className = "" }) => {
  // Pengaturan ukuran avatar agar konsisten
  const sizes = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-14 h-14 text-lg"
  };

  // Mengambil inisial huruf pertama
  const initial = name.charAt(0).toUpperCase();

  return (
    <div 
      className={`
        ${sizes[size]} 
        rounded-full 
        bg-[#D9E67E] 
        flex 
        items-center 
        justify-center 
        font-bold 
        text-[#4F5C18] 
        border-2 
        border-white 
        shadow-sm
        flex-shrink-0
        ${className}
      `}
      title={name}
    >
      {initial}
    </div>
  );
};

export default LumiereAvatar;