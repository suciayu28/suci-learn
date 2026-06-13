import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export default function Forgot() {
    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F9F9F9] font-poppins text-[#262626] antialiased">
            
            {/* === SISI KIRI: BANNER BRANDING LUXURY === */}
            <div className="hidden lg:flex lg:col-span-5 bg-[#171717] p-12 flex-col justify-between relative overflow-hidden text-white border-r border-[#262626]">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#4F5C18_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#4F5C18] rounded-full flex items-center justify-center font-['Playfair_Display'] italic text-sm text-white font-bold">
                        -L-
                    </div>
                    <div>
                        <span className="font-['Playfair_Display'] text-lg italic tracking-wider block">Lumière Atelier</span>
                        <span className="text-[8px] text-gray-400 tracking-[0.3em] uppercase block font-bold -mt-1">Luxury CRM System</span>
                    </div>
                </div>

                <div className="relative z-10 my-auto max-w-sm space-y-4">
                    <div className="inline-block bg-[#4F5C18]/20 border border-[#4F5C18]/40 text-[#F2F7D6] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                        Recovery System
                    </div>
                    <h1 className="text-4xl font-['Playfair_Display'] italic font-medium leading-tight">
                        Pulihkan Akses <span className="text-[#4F5C18] not-italic font-sans font-black">Secret Key</span> Anda dengan Aman.
                    </h1>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                        Sistem enkripsi kami akan mengirimkan tautan pemulihan resmi menuju alamat email korespondensi terdaftar demi menjaga kerahasiaan inventaris data.
                    </p>
                </div>

                <div className="relative z-10 text-[10px] text-gray-500 font-mono tracking-widest uppercase border-t border-[#262626] pt-4">
                    Security Protocol Level 4
                </div>
            </div>

            {/* === SISI KANAN: KARTU FORM RESET === */}
            <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-[#F3F3F3] p-8 md:p-10 shadow-sm relative">
                    
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-[#4F5C18] rounded-full mx-auto flex items-center justify-center text-white font-['Playfair_Display'] italic text-lg mb-4 lg:hidden shadow-sm">
                            -L-
                        </div>
                        <h2 className="text-2xl font-['Playfair_Display'] italic font-medium text-[#262626]">
                            Forgot Password?
                        </h2>
                        <p className="text-[#4F5C18] text-[9px] uppercase tracking-[0.3em] mt-2 font-black">
                            No worries, we'll send a link
                        </p>
                    </div>

                    <p className="text-[11px] text-gray-400 mb-6 text-center leading-relaxed px-4 font-medium">
                        Enter your email address and we'll send you a link to reset your password securely.
                    </p>

                    <form className="space-y-5">
                        <div>
                            <label htmlFor="email" className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 block">
                                Email Address
                            </label>
                            <div className="relative mt-1.5">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full pl-11 pr-4 py-4 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-2 focus:ring-[#4F5C18]/20 outline-none transition-all text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#262626] hover:bg-[#4F5C18] text-white font-black py-4 px-6 
                                rounded-full shadow-xl shadow-[#262626]/10 transition-all transform active:scale-95
                                text-[10px] uppercase tracking-[0.4em] flex items-center justify-center cursor-pointer mt-2"
                        >
                            Send Reset Link
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-[#F3F3F3] pt-5">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center gap-2 text-[10px] font-black text-[#4F5C18] hover:underline transition-colors uppercase tracking-widest"
                        >
                            <FaArrowLeft size={10} /> Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}