import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    return (
        /* Mengubah bg-gray-100 menjadi gradasi pink lembut khas produk kecantikan */
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-100">
            
            {/* Card utama dengan shadow yang lebih halus (soft shadow) */}
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-[2rem] shadow-2xl shadow-rose-200/50 w-full max-w-md border border-white">
                
                {/* Bagian Logo: Dari "Sedap" menjadi Nama Toko Make Up kamu */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-rose-200">
                        {/* Icon sederhana pengganti logo (bisa diganti icon lipstick/mirror) */}
                        <span className="text-white text-2xl font-serif">G</span>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800 tracking-tight">
                        Glow<span className="text-rose-500">Grace</span>
                        <span className="text-rose-300">.</span>
                    </h1>
                    <p className="text-xs text-rose-400 uppercase tracking-[0.2em] mt-1">Cosmetic Store</p>
                </div>

                {/* Tempat munculnya form Login/Register */}
                <Outlet/>

                {/* Footer Hak Cipta yang disesuaikan */}
                <p className="text-center text-[10px] text-gray-400 mt-8 leading-relaxed uppercase tracking-widest">
                    © 2026 GLOW & GRACE BEAUTY SECTOR.<br/>
                    All beauty rights reserved.
                </p>
            </div>
        </div>
    )
}