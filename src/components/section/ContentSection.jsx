import React from 'react';

/**
 * ContentSection Component
 * Sesuai CP Pertemuan 10: Section Component untuk membungkus konten besar.
 * @param {string} title - Judul utama section
 * @param {string} subtitle - Sub-judul kecil di atas/bawah
 * @param {boolean} dark - Mode gelap (true) atau terang (false)
 */
const ContentSection = ({ title, subtitle, children, dark = false }) => {
  return (
    <section 
      className={`
        py-20 px-8 md:px-16 rounded-[4rem] transition-all duration-700
        ${dark ? 'bg-[#262626] text-white' : 'bg-white border border-gray-50 shadow-sm'}
      `}
    >
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        {subtitle && (
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${dark ? 'text-[#D9E67E]' : 'text-[#4F5C18]'}`}>
            {subtitle}
          </p>
        )}
        
        <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] italic font-medium tracking-tight">
          {title}
        </h2>
        
        {/* Divider khas Lumiere */}
        <div className={`w-16 h-[1px] mx-auto ${dark ? 'bg-white/20' : 'bg-black/10'}`}></div>
      </div>

      {/* Konten (Bisa berisi Grid Produk, Form, atau Text) */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default ContentSection;