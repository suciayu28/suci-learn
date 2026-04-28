import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function Forgot() {
    return (
        <div className="animate-fadeIn">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-black text-gray-800">
                    Forgot Password?
                </h2>
                <p className="text-rose-300 text-[10px] uppercase tracking-[0.2em] mt-1 font-black">
                    No worries, we'll send a link
                </p>
            </div>

            <p className="text-[11px] text-gray-400 mb-8 text-center leading-relaxed px-4">
                Enter your email address and we'll send you a link to reset your
                password securely.
            </p>

            <form className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full mt-2 px-4 py-4 bg-gray-50 border border-pink-50 rounded-2xl shadow-sm
                            placeholder-gray-300 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm"
                        placeholder="you@example.com"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 px-4
                        rounded-2xl shadow-xl shadow-rose-100 transition-all transform active:scale-95
                        text-[10px] uppercase tracking-[0.2em]"
                >
                    Send Reset Link
                </button>
            </form>

            {/* Back to Login */}
            <div className="mt-8 text-center">
                <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 text-[10px] font-black text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-widest"
                >
                    <FaArrowLeft size={10} /> Back to Login
                </Link>
            </div>
        </div>
    )
}