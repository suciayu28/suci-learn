import React from 'react';
import LumiereLabel from './LumiereLabel';

const LumiereSelect = ({ label, options = [] }) => (
  <div className="flex flex-col w-full text-left">
    <LumiereLabel>{label}</LumiereLabel>
    <select className="px-8 py-4 rounded-full bg-white border border-gray-100 outline-none focus:border-[#D9E67E] transition-all text-sm shadow-inner appearance-none cursor-pointer">
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default LumiereSelect;