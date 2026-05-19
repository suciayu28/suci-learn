import React from 'react';
import { FiZap } from 'react-icons/fi';

const HeroBanner = ({ title, description }) => (
  <header className="p-16 bg-gradient-to-br from-[#F2F7D6] to-[#E2E9B8] rounded-[4rem] text-center shadow-sm relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
    <div className="flex items-center justify-center gap-4 mb-6 relative z-10">
      <span className="w-10 h-[1px] bg-[#4F5C18]"></span>
      <FiZap className="text-[#4F5C18]" />
      <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#4F5C18]">Design System v2.0</p>
      <span className="w-10 h-[1px] bg-[#4F5C18]"></span>
    </div>
    <h1 className="text-7xl font-['Playfair_Display'] italic font-medium mb-6 relative z-10">{title}</h1>
    <p className="text-sm text-[#4F5C18]/70 max-w-lg mx-auto leading-relaxed relative z-10">
      {description}
    </p>
  </header>
);

export default HeroBanner;