import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./assets/tailwind.css";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import { Routes, Route } from "react-router-dom";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
// Pastikan Anda meng-import ErrorPage yang sudah kita buat sebelumnya
import ErrorPage from "./pages/NotFound";

// --- IMPORT GAMBAR UNTUK ERROR PAGES ---
import img400 from "./assets/400.png";
import img401 from "./assets/401.png";
import img403 from "./assets/403.png";
import img404 from "./assets/404.png";

// ----------------------------------------

function App() {
  return (
    <>
      <div id="app-container" className="bg-gray-100 min-h-screen flex">
        <div id="layout-wrapper" className="flex flex-row flex-1">
          <Sidebar />
          <div id="main-content" className="flex-1 p-4">
            <Header />

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />

              {/* Rute Error dengan Gambar */}
              <Route
                path="/400"
                element={
                  <ErrorPage
                    code="400"
                    title="Oops! Halaman Tidak Ditemukan"
                    description="Halaman yang Anda cari tidak dapat ditemukan. Mungkin alamatnya salah atau sudah dihapus."
                    image={img400}
                  />
                }
              />
              <Route
                path="/401"
                element={
                  <ErrorPage
                    code="401"
                    title="Akses Tidak Sah"
                    description="Maaf, Anda harus masuk atau login terlebih dahulu untuk melihat halaman ini."
                    image={img401}
                  />
                }
              />
              <Route
                path="/403"
                element={
                  <ErrorPage
                    code="403"
                    title="Akses Ditolak"
                    description="Ups! Anda tidak memiliki izin untuk mengakses sumber daya ini."
                    image={img403}
                  />
                }
              />

              {/* Rute 404 (Tanpa Gambar sesuai permintaan) */}
              {/* UPDATE Rute 404 di sini */}
              <Route
                path="*"
                element={
                  <ErrorPage
                    code="404"
                    title="Page Not Found"
                    description="Ups! Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan."
                    image={img404} // Sekarang kirim props image juga
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
