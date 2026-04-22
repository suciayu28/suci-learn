import PageHeader from "../components/PageHeader"; 
import { Link } from "react-router-dom";


const NotFound = ({ code, title, description, image }) => {
  return (
    <div>
      {/* PageHeader menerima title dan breadcrumb agar konsisten */}
      <PageHeader title={`Error ${code || "404"}`} breadcrumb={`Error / ${code || "404"}`} />

      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        
        {/* --- TAMBAHKAN BAGIAN GAMBAR DI SINI --- */}
        {image && (
          <img 
            src={image} 
            alt={`Error ${code}`} 
            className="w-64 h-auto mb-6 object-contain" 
          />
        )}
        {/* ---------------------------------------- */}

        {/* Menggunakan prop code, jika kosong default ke 404 */}
        <h1 className="text-9xl font-bold text-green-500">
          {code || "404"}
        </h1>

        {/* Menggunakan prop title */}
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          {title || "Oops! Halaman Tidak Ditemukan"}
        </h2>

        {/* Menggunakan prop description */}
        <p className="text-gray-500 mt-2">
          {description || "Maaf, halaman yang Anda cari tidak tersedia."}
        </p>
        
        <Link 
          to="/" 
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-lg shadow-green-100"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;