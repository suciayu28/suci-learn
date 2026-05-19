import React from "react";
import { FiArrowUpRight, FiStar, FiShoppingBag, FiZap, FiMail, FiInstagram, FiTwitter } from "react-icons/fi";

const Dashboard = () => {
  const featuredProducts = [
    { name: "Botanical Serum", price: "Rp 650.000", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600" },
    {
      name: "Glow Cushion",
      price: "Rp 525.000",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    },
    { name: "Hydrating Mist", price: "Rp 280.000", img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600" }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-24 font-['Poppins'] text-[#262626] bg-[#F3F3F3]">
      
      {/* 1. HERO SECTION: Cerita Brand */}
      <div className="relative grid grid-cols-12 gap-0 bg-gradient-to-br from-[#F4F3FF] to-[#E8E1DA] rounded-[4rem] overflow-hidden border border-white shadow-2xl">
        <div className="col-span-12 lg:col-span-7 p-12 lg:p-20 z-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-[#4F5C18]"></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#4F5C18]">Seni Kecantikan Organik</p>
          </div>
          
          <h1 className="text-7xl lg:text-9xl font-['Playfair_Display'] italic font-medium leading-[0.85] text-[#262626]">
            Pancarkan <br /> 
            <span className="ml-16 relative">
              Pesona Alami
              <span className="absolute bottom-2 left-0 w-full h-3 bg-[#4F5C18]/10 -z-10"></span>
            </span> 
            <br /> Setiap Hari
          </h1>
          
          <div className="mt-12 flex items-center gap-10">
            <button className="group flex items-center gap-4 bg-[#262626] text-white px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#4F5C18] transition-all duration-500 shadow-2xl">
              Lihat Koleksi 
              <div className="bg-[#4F5C18] text-white p-1.5 rounded-full group-hover:rotate-45 transition-transform duration-500">
                <FiArrowUpRight size={16}/>
              </div>
            </button>
            <span className="text-[11px] font-bold text-[#4F5C18] border-b-2 border-[#4F5C18] pb-1 cursor-pointer hover:tracking-[0.2em] transition-all">
              CERITA KAMI
            </span>
          </div>
        </div>

        <div className="hidden lg:flex col-span-5 relative items-center justify-center p-12 overflow-hidden">
          <div className="absolute w-[120%] h-[120%] bg-white/30 rounded-full blur-[80px]"></div>
          <img 
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600" 
            className="relative z-10 w-full h-[550px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-1000"
            alt="Produk Utama Lumiere"
          />
        </div>
      </div>

      {/* 2. KURASI PRODUK: Katalog Mingguan */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Pilihan Editor */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4F5C18]">Dikurasi Untukmu</p>
              <h3 className="text-4xl font-['Playfair_Display'] italic font-medium">Esensi Mingguan</h3>
            </div>
            <p className="text-[11px] font-bold border-b border-[#262626] cursor-pointer hover:text-[#4F5C18] transition-colors">LIHAT SEMUA</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((prod, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-[#F3F3F3] rounded-[2.5rem] overflow-hidden mb-5 border border-transparent group-hover:border-[#4F5C18]/20 transition-all shadow-sm">
                  <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={prod.name} />
                </div>
                <h4 className="font-['Playfair_Display'] italic font-bold text-lg text-[#262626]">{prod.name}</h4>
                <p className="text-sm text-[#4F5C18] font-bold tracking-widest mt-1">{prod.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter: Gabung Atelier */}
        <div className="col-span-12 lg:col-span-4 bg-[#262626] rounded-[3.5rem] p-12 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#4F5C18] rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-lg shadow-[#4F5C18]/20">
              <FiMail className="text-white text-2xl" />
            </div>
            <h4 className="text-5xl font-['Playfair_Display'] italic font-medium leading-tight mb-6">
              Gabung di <br/> <span className="text-[#4F5C18]">Atelier</span>
            </h4>
            <p className="text-sm text-gray-400 mb-10 leading-relaxed">Dapatkan akses eksklusif untuk peluncuran produk botani dan tips kecantikan premium.</p>
            
            <form className="space-y-4">
              <input 
                type="email" 
                placeholder="Alamat email Anda" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-[#4F5C18] focus:bg-white/10 transition-all text-sm"
              />
              <button className="w-full bg-[#4F5C18] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#262626] transition-all duration-300 shadow-lg shadow-[#4F5C18]/20">
                BERLANGGANAN SEKARANG
              </button>
            </form>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#4F5C18] rounded-full blur-[100px] opacity-10"></div>
        </div>
      </div>

      {/* 3. MARQUEE SECTION: Kepercayaan Visual */}
      <div className="bg-[#262626] py-12 rounded-[4rem] overflow-hidden flex border border-white/5 shadow-2xl relative">
        <div className="flex gap-24 animate-marquee items-center whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-12 text-white font-['Playfair_Display'] italic text-2xl tracking-wide">
              <span>99% Bahan Alami</span>
              <FiZap className="text-[#4F5C18]" />
              <span>Gratis Ongkir di Atas Rp 500rb</span>
              <FiShoppingBag className="text-[#4F5C18]" />
              <span>Teruji Secara Dermatologis</span>
              <div className="w-2 h-2 bg-[#4F5C18] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOOTER: Sosial & Info */}
      <footer className="pt-20 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-10 pb-10">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-['Playfair_Display'] italic font-bold text-[#262626]">Lumière</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-3">© 2026 Luxury Atelier Paris • Jakarta</p>
        </div>
        <div className="flex gap-10">
          <FiInstagram size={22} className="hover:text-[#4F5C18] cursor-pointer transition-all opacity-60 hover:opacity-100" />
          <FiTwitter size={22} className="hover:text-[#4F5C18] cursor-pointer transition-all opacity-60 hover:opacity-100" />
        </div>
        <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
          <span className="hover:text-[#4F5C18] cursor-pointer transition-colors">Pengiriman</span>
          <span className="hover:text-[#4F5C18] cursor-pointer transition-colors">Privasi</span>
          <span className="hover:text-[#4F5C18] cursor-pointer transition-colors">Syarat & Ketentuan</span>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;