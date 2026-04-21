import PageHeader from "../components/PageHeader"; 
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      {/* Tambahkan PageHeader agar konsisten dengan halaman lain */}
      <PageHeader />

      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h1 className="text-9xl font-bold text-green-500">404</h1>
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mt-2">
          Maaf, halaman yang Anda cari tidak tersedia.
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