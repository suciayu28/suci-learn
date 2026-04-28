import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header";   
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div id="app-container" className="bg-[#FDF2F5] min-h-screen flex font-sans">
            <Sidebar />

            <div id="main-content" className="flex-1 flex flex-col min-w-0">
                <div className="p-6">
                    <Header />

                    <main className="mt-6 ml-24 bg-white/80 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-sm border border-pink-100 min-h-[calc(100vh-200px)]">
                        <Outlet />
                    </main>

                    <footer className="mt-8 ml-24 text-center text-rose-300 text-[10px] tracking-widest uppercase font-bold">
                        &copy; 2026 Beauty Glow Management System — Luxury Atelier
                    </footer>
                </div>
            </div>
        </div>
    );
}