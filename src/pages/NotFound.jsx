import PageHeader from "../components/PageHeader"; 
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCompass } from "react-icons/fa";

const NotFound = ({ code, title, description, image }) => {
  return (
    <div className="animate-fadeIn min-h-screen">
      <PageHeader 
        title={`Status ${code || "404"}`} 
        breadcrumb={`System / Error ${code || "404"}`} 
      />

      <div className="relative flex flex-col items-center justify-center min-h-[65vh] text-center px-4 overflow-hidden">
        
        {/* BACKGROUND DECORATION - Lingkaran halus agar tidak terlalu kosong */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-50 rounded-full blur-[100px] -z-20 opacity-60"></div>

        {/* IMAGE SECTION */}
        {image ? (
          <div className="relative mb-6 animate-bounce-slow">
            <img 
              src={image} 
              alt={`Error ${code}`} 
              className="relative w-64 h-auto object-contain drop-shadow-[0_20px_50px_rgba(244,63,94,0.2)]" 
            />
          </div>
        ) : (
          <div className="mb-8 text-rose-200 opacity-50">
            <FaCompass size={80} className="animate-spin-slow" />
          </div>
        )}

        {/* TEXT CONTENT */}
        <div className="relative z-10">
          <h1 className="text-[10rem] font-serif font-black text-rose-100/40 leading-none select-none absolute left-1/2 -top-20 -translate-x-1/2 -z-10">
            {code || "404"}
          </h1>
          
          <h2 className="text-4xl font-serif font-black text-gray-800 tracking-tight mb-3">
            {title || "Mistake in the Mirror?"}
          </h2>
          
          <p className="text-rose-400 font-bold text-[11px] uppercase tracking-[0.3em] mb-4">
            Access Restricted or Not Found
          </p>
          
          <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed text-sm italic px-6">
            {description || "Sepertinya halaman yang kamu cari telah dihapus atau sedang dalam perawatan kecantikan rutin."}
          </p>
        </div>
        
        {/* BUTTON GROUP */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link 
            to="/" 
            className="group flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 transition-all shadow-2xl shadow-gray-200 active:scale-95"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Atelier
          </Link>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 transition-all active:scale-95"
          >
            Refresh Page
          </button>
        </div>

        {/* FOOTER DECORATION */}
        <div className="mt-16 opacity-30 flex items-center gap-4">
            <div className="h-[1px] w-12 bg-rose-300"></div>
            <span className="text-[9px] font-black text-rose-400 uppercase tracking-[0.5em]">GlowGrace Management</span>
            <div className="h-[1px] w-12 bg-rose-300"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;