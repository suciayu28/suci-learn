import React from 'react';

const Footer = () => (
  <footer className="py-12 border-t border-gray-100 mt-20">
    <div className="text-center space-y-4">
      <p className="text-[10px] font-black uppercase tracking-[1em] opacity-30">
        Lumière Cosmetics  © 2026
      </p>
      <div className="flex justify-center gap-8 text-[9px] font-bold text-[#4F5C18]/50 uppercase tracking-widest">
        <a href="#" className="hover:text-[#4F5C18]">Privacy</a>
        <a href="#" className="hover:text-[#4F5C18]">Terms</a>
        <a href="#" className="hover:text-[#4F5C18]">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;