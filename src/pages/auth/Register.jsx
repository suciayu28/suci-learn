import { Link } from "react-router-dom"; // Tambahkan ini buat navigasi ke Login

export default function Register() {
    return (
        <div className="animate-fadeIn">
            {/* Judul yang lebih aesthetic */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-black text-gray-800">
                    Create Account ✨
                </h2>
                <p className="text-rose-300 text-[10px] uppercase tracking-[0.2em] mt-1 font-black">
                    Join GlowGrace Community
                </p>
            </div>

            <form className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="w-full mt-2 p-4 border border-pink-50 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password Field */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full mt-2 p-4 border border-pink-50 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm"
                        placeholder="********"
                    />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="w-full mt-2 p-4 border border-pink-50 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm"
                        placeholder="********"
                    />
                </div>

                {/* Button Pink Mewah */}
                <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 px-4 
                        rounded-2xl shadow-xl shadow-rose-100 transition-all transform active:scale-95
                        text-[10px] uppercase tracking-[0.2em]"
                >
                    Register Now
                </button>
            </form>

            {/* Tambahan: Balik ke Login */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    Already have an account?{" "}
                    <Link to="/login" className="text-rose-500 font-black hover:underline">
                        LOGIN
                    </Link>
                </p>
            </div>
        </div>
    )
}