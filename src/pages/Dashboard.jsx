import React from "react";
import { FiArrowUpRight, FiStar, FiShoppingBag, FiZap, FiMail, FiInstagram, FiTwitter } from "react-icons/fi";

// --- IMPORT KOMPONEN SHADCN UI ---
// Jika masih error "Failed to resolve", pastikan folder components/ui/ memang ada di src
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    /* PERBAIKAN: Menggunakan w-full dan menghapus batasan max-width agar konten memenuhi layar */
    <div className="w-full space-y-16 font-['Poppins'] text-[#262626] bg-white min-h-screen overflow-x-hidden">
      
      {/* 1. HERO SECTION: Full Width & Immersive */}
      <div className="relative grid grid-cols-12 gap-0 bg-gradient-to-br from-[#F4F3FF] to-[#E8E1DA] overflow-hidden min-h-[600px] lg:h-screen">
        <div className="col-span-12 lg:col-span-7 p-8 md:p-16 lg:p-24 z-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-[#4F5C18]"></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-[#4F5C18]">Seni Kecantikan Organik</p>
          </div>
          
          {/* PERBAIKAN: Menggunakan clamp agar teks tidak jadi terlalu kecil saat layar sempit */}
          <h1 className="text-[clamp(2.5rem,8vw,110px)] font-['Playfair_Display'] italic font-medium leading-[0.9] text-[#262626] tracking-tighter">
            Pancarkan <br /> 
            <span className="lg:ml-16 relative inline-block">Pesona Alami</span> 
            <br /> Setiap Hari
          </h1>
          
          <div className="mt-14 flex flex-wrap items-center gap-10">
            <button className="group flex items-center gap-4 bg-[#262626] text-white px-10 py-5 md:px-12 md:py-6 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#4F5C18] transition-all duration-500 shadow-2xl border-none">
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

        {/* Gambar Hero - Full Cover */}
        <div className="hidden lg:block col-span-5 relative">
          <img 
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200" 
            className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-1000"
            alt="Produk Utama Lumiere"
          />
        </div>
      </div>

      {/* 2. PRODUCTS & NEWSLETTER SECTION */}
      {/* PERBAIKAN: Menggunakan padding yang fleksibel (px-6 sampai px-20) */}
      <div className="px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-12 gap-10">
          
          {/* Esensi Mingguan */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 shadow-sm border border-gray-50">
             <div className="flex justify-between items-end mb-12">
               <div>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4F5C18] mb-2">Pilihan Editor</p>
                 <h3 className="text-3xl md:text-4xl font-['Playfair_Display'] italic font-medium">Esensi Mingguan</h3>
               </div>
               <p className="text-[11px] font-bold border-b border-[#262626] pb-1 cursor-pointer hover:text-[#4F5C18] transition-colors">LIHAT SEMUA</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((prod, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[4/5] bg-[#F3F3F3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-6 shadow-sm transition-transform group-hover:-translate-y-2 duration-500">
                    <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={prod.name} />
                  </div>
                  <h4 className="font-['Playfair_Display'] italic font-bold text-xl text-[#262626]">{prod.name}</h4>
                  <p className="text-sm text-[#4F5C18] font-bold mt-2 tracking-widest">{prod.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="col-span-12 lg:col-span-4 bg-[#262626] rounded-[3rem] md:rounded-[4rem] p-10 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-4xl md:text-5xl font-['Playfair_Display'] italic font-medium leading-tight mb-8">
                Gabung di <br/> <span className="text-[#4F5C18]">Atelier</span>
              </h4>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input 
                  type="email" 
                  placeholder="Alamat email Anda" 
                  className="w-full bg-white/10 border-none rounded-2xl px-6 py-7 focus-visible:ring-[#4F5C18] text-sm text-white placeholder:text-gray-500"
                />
                <button className="w-full bg-[#4F5C18] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#262626] transition-all duration-300 border-none shadow-xl">
                  BERLANGGANAN SEKARANG
                </button>
              </form>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#4F5C18] rounded-full blur-[80px] opacity-20"></div>
          </div>
        </div>
      </div>

      {/* 3. MARQUEE SECTION: Luxury Ticker */}
      <div className="bg-[#262626] py-16 overflow-hidden flex relative border-y border-white/5">
        <div className="flex gap-24 animate-marquee items-center whitespace-nowrap">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-12 text-white font-['Playfair_Display'] italic text-2xl tracking-wide opacity-80">
              <span>99% Organic Ingredients</span>
              <FiZap className="text-[#4F5C18]" />
              <span>Free Delivery Over Rp 500k</span>
              <FiShoppingBag className="text-[#4F5C18]" />
              <span>Dermatologically Tested</span>
              <div className="w-2 h-2 bg-[#4F5C18] rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOOTER */}
      <div className="px-6 md:px-12 lg:px-20 space-y-12">
        <Separator className="bg-gray-200" />
        
        <footer className="flex flex-col md:flex-row justify-between items-center gap-12 pb-16">
          <div className="flex items-center gap-6">
            <Avatar className="h-14 w-14 md:h-16 md:w-16 ring-4 ring-[#4F5C18]/10">
              <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" />
              <AvatarFallback className="bg-[#4F5C18] text-white font-bold">LM</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] italic font-bold text-[#262626]">Lumière</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-2">© 2026 Luxury Atelier Paris • Jakarta</p>
            </div>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="flex gap-8">
              <FiInstagram size={24} className="hover:text-[#4F5C18] cursor-pointer opacity-40 hover:opacity-100 transition-all" />
              <FiTwitter size={24} className="hover:text-[#4F5C18] cursor-pointer opacity-40 hover:opacity-100 transition-all" />
            </div>
            <div className="hidden lg:flex gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="hover:text-[#4F5C18] cursor-pointer transition-colors">Privasi</span>
              <span className="hover:text-[#4F5C18] cursor-pointer transition-colors">Syarat</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;