import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        /* Latar belakang menggunakan kombinasi Grey dan Purple lembut */
        <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3] font-['Poppins']">
            
            {/* Card utama dengan anatomi organik (sudut bulat 3rem) */}
            <div className="bg-white p-14 rounded-[3.5rem] shadow-2xl shadow-[#4F5C18]/5 w-full max-w-lg border border-white mx-4 relative overflow-hidden">
                
                {/* Dekorasi Organik di pojok (opsional untuk kesan Skinly) */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F2F7D6] rounded-full blur-3xl opacity-50"></div>
                
                {/* Logo & Branding: Primary Olive (#4F5C18) & Playfair */}
                <div className="flex flex-col items-center justify-center mb-12 relative z-10">
                    <div className="w-20 h-20 bg-[#4F5C18] rounded-[2rem] flex items-center justify-center mb-6 shadow-lg shadow-[#4F5C18]/20 rotate-3">
                        <span className="text-white text-3xl font-['Playfair_Display'] italic">-L-</span>
                    </div>
                    <h1 className="text-4xl font-['Playfair_Display'] italic font-medium text-[#262626]">
                        Lumière<span className="text-[#4F5C18]">Cosmetcs</span>
                    </h1>
                    <p className="text-[10px] text-[#4F5C18] uppercase tracking-[0.5em] mt-3 font-black opacity-80">Luxury Makeup Atelier</p>
                </div>

                {/* Form area */}
                <div className="space-y-4 relative z-10">
                    <Outlet/>
                </div>

                {/* Footer Hak Cipta - Tipografi Minimalis */}
                <p className="text-center text-[9px] text-gray-400 mt-12 leading-relaxed uppercase tracking-[0.3em] font-bold">
                    © 2026 Lumière Management System.<br/>
                    All rights reserved.
                </p>
            </div>
        </div>
    )
}