import React, { useState } from "react";
import {
  FiStar, FiPercent, FiBox, FiArrowRight,
  FiHeart, FiTag, FiSend, FiShoppingBag,
} from "react-icons/fi";

// IMPORT KOMPONEN
import LumiereButton from "../components/basic/LumiereButton";
import LumiereBadge from "../components/basic/LumiereBadge";
import LumiereAvatar from "../components/basic/LumiereAvatar";
import LumiereIcon from "../components/basic/LumiereIcon";
import LumiereInput from "../components/form/LumiereInput";
import AtelierProductCard from "../components/data-display/AtelierProductCard";
import HeroBanner from "../components/section/HeroBanner";
import ContentSection from "../components/section/ContentSection";
import Footer from "../components/layout/Footer";
import LumiereAlert from "../components/feedback/LumiereAlert";

const LumiereShowcase = () => {
  const [subscribed, setSubscribed] = useState(false);

  const products = [
    {
      title: "Velvet Lipstick",
      price: "Rp 350.000",
      tag: "Makeup",
      img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Glow Cushion",
      price: "Rp 525.000",
      tag: "Cushion",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Rose Serum",
      price: "Rp 850.000",
      tag: "Skincare",
      img: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=600",
    },
    {
      title: "Silk Blush",
      price: "Rp 420.000",
      tag: "Blush",
      img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="bg-[#F3F3F3] min-h-screen font-['Poppins'] text-[#262626] overflow-x-hidden selection:bg-[#4F5C18] selection:text-white">
      
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-10 pb-20 px-6">
        <HeroBanner
          title="Seni Memancarkan Pesona"
          description="Eksplorasi koleksi kosmetik premium kami yang dirancang dengan teknologi molekuler terbaru untuk kecantikan alami Anda."
        />

        {/* Floating Badges dengan Layout yang Lebih Rapi */}
        <div className="mt-12 flex justify-center items-center gap-6 flex-wrap">
          <div className="bg-[#4F5C18] px-10 py-4 rounded-full flex items-center gap-4 shadow-xl shadow-[#4F5C18]/20 transition-transform hover:scale-105 cursor-default">
            <FiPercent className="text-white text-lg" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              LUMIERE30 — DISKON 30%
            </span>
          </div>
          <div className="bg-white px-10 py-4 rounded-full border border-gray-200 flex items-center gap-4 shadow-sm hover:border-[#4F5C18]/30 transition-colors">
            <LumiereIcon icon={FiTag} size="sm" className="text-[#4F5C18]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Gratis Ongkir Min. Rp 500rb
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-40 pb-32">
        
        {/* --- 2. CATEGORY NAVIGATION --- */}
        <section className="text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-[#4F5C18]/10 text-[#4F5C18] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Koleksi Pilihan
          </span>
          <div className="flex flex-wrap justify-center gap-5">
            {["Perawatan Kulit", "Tata Rias", "Parfum", "Alat Kecantikan"].map(
              (cat) => (
                <button
                  key={cat}
                  className="group relative px-12 py-5 rounded-2xl bg-white border border-transparent shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
                >
                  <span className="relative z-10 text-xs font-bold text-gray-400 group-hover:text-white transition-colors duration-300">
                    {cat}
                  </span>
                  <div className="absolute inset-0 bg-[#4F5C18] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                </button>
              ),
            )}
          </div>
        </section>

        {/* --- 3. PRODUCT GRID --- */}
        <ContentSection
          title="Esensi Ikonik"
          subtitle="Temukan Produk Terlaris Kami"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((item, index) => (
              <div key={index} className="hover:-translate-y-2 transition-transform duration-500">
                <AtelierProductCard
                  title={item.title}
                  price={item.price}
                  tag={item.tag}
                  img={item.img}
                />
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <LumiereButton
              variant="outline"
              icon={FiArrowRight}
              className="px-16 py-7 border-[#4F5C18] text-[#4F5C18] font-bold tracking-widest hover:bg-[#4F5C18] hover:text-white transition-all rounded-full"
            >
              Lihat Katalog Lengkap
            </LumiereButton>
          </div>
        </ContentSection>

        {/* --- 4. TESTIMONIAL (DARK MODE LUXURY) --- */}
        <section className="bg-[#262626] rounded-[5rem] p-12 md:p-24 text-white relative overflow-hidden shadow-3xl shadow-black/20">
          <div className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12">
            <FiHeart size={500} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="flex gap-2 text-[#4F5C18]">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill="currentColor" size={20} />
                ))}
              </div>
              <h2 className="text-4xl md:text-6xl font-['Playfair_Display'] italic leading-[1.2]">
                "Kualitas yang melampaui ekspektasi. Kulitku terasa lebih kenyal dalam 7 hari."
              </h2>
              <div className="flex items-center gap-6 pt-10 border-t border-white/5 w-fit">
                <LumiereAvatar name="Monica" size="lg" className="border-2 border-[#4F5C18]" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4F5C18]">
                    Monica G.
                  </p>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">
                    Verified Buyer • 2 Jam yang lalu
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-[#4F5C18]/20 blur-[120px] rounded-full animate-pulse"></div>
              <img
                src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Product Showcase"
                className="relative z-10 w-full h-[500px] object-cover rounded-[4rem] shadow-2xl border border-white/10 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-8 -left-8 z-20 bg-[#262626] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#4F5C18]">
                  Tested Clinically
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                  Atelier Lab Approved
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. CALL TO ACTION & INFO --- */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Newsletter Form */}
          <div className="lg:col-span-3 bg-[#F4F3FF] p-16 rounded-[4rem] space-y-10 border border-white shadow-inner flex flex-col justify-center">
            <div className="space-y-4">
              <LumiereBadge type="default" className="bg-[#4F5C18] text-white px-6 py-2">Exclusive Club</LumiereBadge>
              <h3 className="text-5xl font-['Playfair_Display'] italic text-[#262626]">
                Gabung di Atelier
              </h3>
              <p className="text-base text-gray-500 max-w-md leading-relaxed">
                Dapatkan akses flash sale dan tips eksklusif langsung ke email Anda.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <LumiereInput 
                placeholder="Alamat email Anda" 
                className="flex-grow bg-white/60 border-none h-16 rounded-2xl px-8 focus:bg-white transition-all shadow-sm"
              />
              <LumiereButton 
                variant="primary" 
                className="h-16 px-10 bg-[#4F5C18] hover:bg-[#3a4412] rounded-2xl shadow-lg shadow-[#4F5C18]/30" 
                icon={FiSend}
              >
                {subscribed ? "Tersambung!" : "Daftar"}
              </LumiereButton>
            </form>
            {subscribed && (
              <LumiereAlert message="Silahkan cek inbox Anda sekarang." />
            )}
          </div>

          {/* Contact/Location Card */}
          <div className="lg:col-span-2 bg-white p-16 rounded-[4rem] flex flex-col items-center justify-center text-center space-y-10 shadow-sm border border-gray-100">
            <div className="relative">
               <div className="absolute inset-0 bg-[#4F5C18]/10 blur-2xl rounded-full"></div>
               <div className="relative w-24 h-24 bg-[#F3F3F3] rounded-full flex items-center justify-center border border-white shadow-inner">
                 <FiBox size={38} className="text-[#4F5C18]" />
               </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-[#262626]">
                Lumière Store
              </h3>
              <p className="text-sm text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                Pondok Indah Mall 3, Jakarta Selatan.
              </p>
            </div>
            <div className="flex gap-8">
              {['IG', 'TK', 'YT'].map(s => (
                <span key={s} className="text-[11px] font-black text-gray-300 cursor-pointer hover:text-[#4F5C18] transition-colors tracking-widest">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LumiereShowcase;