import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header";   
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        /* 1. Ubah bg-[#FDF2F5] (pink) menjadi bg-[#F3F3F3] (Grey sesuai CP) */
        /* 2. Tambahkan font-['Poppins'] sebagai default text */
        <div id="app-container" className="bg-[#F3F3F3] min-h-screen flex font-['Poppins'] text-[#262626]">
            <Sidebar />

            <div id="main-content" className="flex-1 flex flex-col min-w-0">
                <div className="p-6">
                    <Header />

                    {/* 3. Main Container: Gunakan bg-white dengan border Grey (#F3F3F3) halus */}
                    {/* Anatomy: Tetap menggunakan rounded-[2.5rem] sesuai referensi Skinly */}
                    <main className="mt-6 ml-24 bg-white rounded-[2.5rem] p-8 shadow-sm border border-[#F3F3F3] min-h-[calc(100vh-200px)]">
                        <Outlet />
                    </main>

                    {/* 4. Footer: Ubah text-rose-300 menjadi warna Black (#262626) dengan opasitas rendah */}
                    <footer className="mt-8 ml-24 text-center text-[#262626]/40 text-[10px] tracking-widest uppercase font-bold">
                        &copy; 2026 Lumière Management System — Luxury Atelier
                    </footer>
                </div>
            </div>
        </div>
    );
}