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

function App() {
  return (
    <>
      <div id="app-container" className="bg-gray-100 min-h-screen flex">
        <div id="layout-wrapper" className="flex flex-row flex-1">
          <Sidebar />
          <div id="main-content" className="flex-1 p-4">
            <Header />

            <Routes>
              {/* Rute lainnya (Dashboard, Orders, Customers, dll) */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/customers" element={<Customers />} />

              {/* Rute Error yang sudah ada */}
              <Route
                path="/400"
                element={
                  <ErrorPage
                    code="400"
                    title="Oops! Halaman Tidak Ditemukan"
                    description="Halaman yang Anda cari tidak dapat ditemukan. Mungkin alamatnya salah atau sudah dihapus."
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
                  />
                }
              />

              {/* FINAL: Rute 404 - Halaman Tidak Ditemukan */}
              <Route
                path="*"
                element={
                  <ErrorPage
                    code="404"
                    title="Page Not Found"
                    description="Ups! Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan."
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