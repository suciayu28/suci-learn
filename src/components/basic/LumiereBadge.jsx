import React from 'react';

const LumiereBadge = ({ children, type = "default" }) => {
  const styles = {
    default: "bg-[#F2F7D6] text-[#4F5C18]",
    warning: "bg-orange-50 text-orange-600",
    danger: "bg-red-50 text-red-600",
    info: "bg-blue-50 text-blue-600"
  };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${styles[type]}`}>
      {children}
    </span>
  );
};

export default LumiereBadge;