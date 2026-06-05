import Sidebar from "../components/layout/Sidebar"; 
import Header from "../components/layout/Header";   
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        /* 1. Ubah bg-[#FDF2F5] (pink) menjadi bg-[#F3F3F3] (Grey sesuai CP) */
        /* 2. Tambahkan font-['Poppins'] sebagai default text */
        <div id="app-container" className="bg-[#F3F3F3] min-h-screen flex font-['Poppins'] text-[#262626]">
            <Sidebar />

            {/* PERBAIKAN: Menambahkan pl-28 (padding left) pada main-content agar Header, Main, dan Footer tidak tertabrak/tertutup oleh Sidebar yang posisinya fixed */}
            <div id="main-content" className="flex-1 flex flex-col min-w-0 pl-28 pr-6 py-6">
                
                {/* Menghapus pembungkus p-6 sebelumnya agar margin-left terpusat dari parent dan layouting konsisten */}
                <Header />

                {/* 3. Main Container: Gunakan bg-white dengan border Grey (#F3F3F3) halus */}
                {/* Anatomy: Tetap menggunakan rounded-[2.5rem] sesuai referensi Skinly */}
                {/* Catatan: ml-24 diubah ke ml-0 karena space kiri sudah dihandle oleh pl-28 di atas */}
                <main className="mt-6 bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#F3F3F3] min-h-[calc(100vh-140px)]">
                    <Outlet />
                </main>

                {/* 4. Footer: Ubah text-rose-300 menjadi warna Black (#262626) dengan opasitas rendah */}
                {/* Catatan: ml-24 diubah ke ml-0 agar text-center berfungsi tepat di tengah konten */}
                <footer className="mt-8 text-center text-[#262626]/40 text-[10px] tracking-widest uppercase font-bold">
                    &copy; 2026 Lumière Management System — Luxury Atelier
                </footer>
            </div>
        </div>
    );
}