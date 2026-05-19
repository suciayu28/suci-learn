import React from 'react';

const LumiereIcon = ({ icon: Icon, size = "md", className = "" }) => {
  // Mapping ukuran agar seragam di semua komponen
  const sizes = {
    xs: "text-[12px]",
    sm: "text-[16px]",
    md: "text-[20px]", // Ukuran standar
    lg: "text-[24px]",
    xl: "text-[32px]"
  };

  if (!Icon) return null;

  return (
    <div className={`flex items-center justify-center text-[#4F5C18] ${sizes[size]} ${className}`}>
      <Icon />
    </div>
  );
};

export default LumiereIcon;