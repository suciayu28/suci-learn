import React from 'react';
import LumiereLabel from './LumiereLabel';

const LumiereInput = ({ label, placeholder, type = "text", ...props }) => (
  <div className="flex flex-col gap-1 w-full text-left">
    {label && <LumiereLabel>{label}</LumiereLabel>}
    <input 
      type={type} 
      placeholder={placeholder}
      className="px-8 py-4 rounded-full bg-white border border-gray-100 outline-none focus:border-[#D9E67E] transition-all text-sm shadow-inner"
      {...props}
    />
  </div>
);

export default LumiereInput;