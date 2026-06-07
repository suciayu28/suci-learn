import { MdOutlineDownloading } from "react-icons/md";
import { GiTerror } from "react-icons/gi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [dataForm, setDataForm] = useState({ email: "", password: "" })

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({ ...dataForm, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        axios.post("https://dummyjson.com/auth/login", {
            username: dataForm.email,
            password: dataForm.password,
        })
        .then(() => {
            localStorage.setItem("admin_session", "true");
            navigate("/admin");
        })
        .catch((err) => setError(err.response?.data?.message || "Akses Ditolak!"))
        .finally(() => setLoading(false));
    }

    return (
        <div className="animate-fadeIn">
            {/* Header Section: Menggunakan Playfair italic */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-['Playfair_Display'] italic font-medium text-[#262626]">
                    Welcome Back 👋
                </h2>
                <p className="text-[#4F5C18] text-[9px] uppercase tracking-[0.3em] mt-2 font-black">
                    Lumière Atelier Access
                </p>
            </div>

            {/* Error Message: Menggunakan kode Merah Marun (#BC2F32) */}
            {error && (
                <div className="bg-[#BC2F32]/5 border border-[#BC2F32]/10 mb-6 p-4 rounded-2xl flex items-center animate-shake">
                    <GiTerror className="text-[#BC2F32] me-3 text-xl" />
                    <span className="text-[10px] font-black text-[#BC2F32] uppercase tracking-wider">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anatomi: Rounded-2xl & Grey Border */}
                <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                        Atelier Identity
                    </label>
                    <input
                        type="text"
                        name="email"
                        required
                        className="w-full mt-2 p-5 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-4 focus:ring-[#F2F7D6] outline-none transition-all text-sm"
                        placeholder="Username"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center ml-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            Secret Key
                        </label>
                        <Link to="/forgot" className="text-[9px] font-black text-[#4F5C18] hover:tracking-widest transition-all uppercase">
                            Forgot Password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full mt-2 p-5 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-4 focus:ring-[#F2F7D6] outline-none transition-all text-sm"
                        placeholder="********"
                        onChange={handleChange}
                    />
                </div>

                {/* Anatomi: Full Rounded Capsule & Black */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#262626] hover:bg-[#4F5C18] text-white font-black py-5 px-4 
                        rounded-full shadow-xl shadow-[#262626]/10 transition-all transform active:scale-95
                        text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <MdOutlineDownloading className="animate-spin text-lg" />
                    ) : (
                        "Login to Dashboard"
                    )}
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-[11px] text-gray-400 font-medium">
                    New Member?{" "}
                    <Link to="/register" className="text-[#4F5C18] font-black hover:underline tracking-tighter ml-1 uppercase">
                        Create Atelier Account
                    </Link>
                </p>
            </div>
        </div>
    )
}