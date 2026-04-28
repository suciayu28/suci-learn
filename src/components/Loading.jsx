export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-transparent">
      {/* Spinner dengan warna Rose/Pink khas produk kecantikan */}
      <div className="relative">
        {/* Lingkaran luar yang halus */}
        <div className="w-14 h-14 border-4 border-pink-100 rounded-full"></div>
        {/* Spinner utama yang berputar */}
        <div className="w-14 h-14 border-4 border-transparent border-t-rose-500 rounded-full animate-spin absolute top-0 left-0"></div>
      </div>

      {/* Teks loading dengan gaya font yang lebih elegan */}
      <div className="mt-6 text-center">
        <p className="text-rose-400 font-serif italic text-lg tracking-wide animate-pulse">
          Enhancing your beauty...
        </p>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mt-1">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}