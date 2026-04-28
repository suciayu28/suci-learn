import { MdOutlineDownloading } from "react-icons/md";
import { GiTerror } from "react-icons/gi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    })

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({
            ...dataForm,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("") // Reset error jadi string kosong

        axios
            .post("https://dummyjson.com/auth/login", { // Update endpoint dummyjson terbaru
                username: dataForm.email,
                password: dataForm.password,
            })
            .then((response) => {
                navigate("/");
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Email atau Password salah!");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="animate-fadeIn">
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-black text-gray-800">
                    Welcome Back 👋
                </h2>
                <p className="text-rose-300 text-[10px] uppercase tracking-[0.2em] mt-1 font-black">
                    Atelier GlowGrace Access
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-rose-50 border border-rose-100 mb-5 p-4 rounded-2xl flex items-center animate-shake">
                    <GiTerror className="text-rose-600 me-3 text-xl" />
                    <span className="text-[11px] font-black text-rose-600 uppercase tracking-tight">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Email / Username
                    </label>
                    <input
                        type="text"
                        name="email"
                        required
                        className="w-full mt-2 p-4 border border-pink-50 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm"
                        placeholder="emilys"
                        onChange={handleChange}
                    />
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Password
                        </label>
                        <Link to="/forgot" className="text-[9px] font-black text-rose-400 hover:text-rose-600 tracking-tighter">
                            FORGOT PASSWORD?
                        </Link>
                    </div>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full mt-2 p-4 border border-pink-50 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm"
                        placeholder="********"
                        onChange={handleChange}
                    />
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 px-4 
                        rounded-2xl shadow-xl shadow-rose-100 transition-all transform active:scale-95
                        text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <MdOutlineDownloading className="animate-spin text-lg" />
                            Processing...
                        </>
                    ) : (
                        "Login to Dashboard"
                    )}
                </button>
            </form>

            {/* Footer Nav */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-rose-500 font-black hover:underline tracking-tighter">
                        CREATE ONE
                    </Link>
                </p>
            </div>
        </div>
    )
}