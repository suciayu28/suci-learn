import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div className="animate-fadeIn">
            {/* Header Section: Menggunakan tipografi Playfair Display Italic */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-['Playfair_Display'] italic font-medium text-[#262626]">
                    Create Account
                </h2>
                <p className="text-[#4F5C18] text-[9px] uppercase tracking-[0.3em] mt-2 font-black">
                    Join Lumière Atelier Community
                </p>
            </div>

            <form className="space-y-5">
                {/* Email Field - Anatomi: Rounded-2xl & Grey Background */}
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full mt-2 p-5 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-4 focus:ring-[#F2F7D6] outline-none transition-all text-sm placeholder:opacity-30"
                        placeholder="atelier@lumiere.com"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                        Create Password
                    </label>
                    <input
                        type="password"
                        className="w-full mt-2 p-5 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-4 focus:ring-[#F2F7D6] outline-none transition-all text-sm"
                        placeholder="********"
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-8">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                        Confirm Secret Key
                    </label>
                    <input
                        type="password"
                        className="w-full mt-2 p-5 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-4 focus:ring-[#F2F7D6] outline-none transition-all text-sm"
                        placeholder="********"
                    />
                </div>

                {/* Button: Menggunakan Full Rounded Capsule & Black (#262626) */}
                <button
                    type="submit"
                    className="w-full bg-[#262626] hover:bg-[#4F5C18] text-white font-black py-5 px-4 
                        rounded-full shadow-xl shadow-[#262626]/10 transition-all transform active:scale-95
                        text-[10px] uppercase tracking-[0.4em]"
                >
                    Register Atelier
                </button>
            </form>

            {/* Navigasi Balik ke Login dengan aksen Primary Olive (#4F5C18) */}
            <div className="mt-10 text-center">
                <p className="text-[11px] text-gray-400 font-medium">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#4F5C18] font-black hover:underline tracking-widest ml-1 uppercase">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}