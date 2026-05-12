export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent font-poppins">
      {/* Spinner dengan nuansa Luxury Green */}
      <div className="relative">
        {/* Lingkaran luar yang halus (Opacity rendah dari primary color) */}
        <div className="w-14 h-14 border-4 border-[#4F5C18]/10 rounded-full"></div>
        
        {/* Spinner utama yang berputar (Primary Green) */}
        <div className="w-14 h-14 border-4 border-transparent border-t-[#4F5C18] rounded-full animate-spin absolute top-0 left-0 shadow-sm"></div>
        
        {/* Aksen titik di tengah agar lebih unik */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#4F5C18]/40 rounded-full"></div>
      </div>

      {/* Teks loading dengan font Playfair Display & Poppins */}
      <div className="mt-8 text-center">
        <p className="text-[#4F5C18] font-playfair italic text-xl tracking-wide animate-pulse">
          Lumière is preparing for you...
        </p>
        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.4em] mt-2">
          Curating Excellence
        </p>
      </div>
    </div>
  );
}