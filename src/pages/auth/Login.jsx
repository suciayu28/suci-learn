
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineDownloading } from "react-icons/md";
import { GiTerror } from "react-icons/gi";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"; 

// Mengimpor authAPI dan profileAPI dari Supabase client yang sudah benar
import { authAPI, supabase } from "../../services/supabaseClient"; 

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [dataForm, setDataForm] = useState({ email: "", password: "" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Mengambil data dari tabel 'login' berdasarkan email dan password
            const { data: user, error } = await supabase
                .from('login')
                .select('*')
                .eq('email', dataForm.email)
                .eq('password', dataForm.password)
                .maybeSingle();

            if (error) throw error;
            if (!user) throw new Error("Atelier Identity atau Secret Key salah!");

            const rawRole = user.role || "Customer";
            const fullName = user.name || user.email.split("@")[0];

            // Memastikan penulisan kapitalisasi role
            const userRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

            // Menyimpan data sesi yang relevan ke localStorage
            const sessionData = {
                email: user.email,
                name: fullName,
                role: userRole 
            };
            localStorage.setItem("userLoggedIn", JSON.stringify(sessionData));

            // Redirect berdasarkan role dari profil
            if (userRole === "Admin") {
                navigate("/admin");
            } else {
                // Semua role selain Admin (Customer, Guest, dll) diarahkan ke halaman order member
                navigate("/order-member", { state: { authSuccess: true } });
            }
            
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message || "Atelier Identity atau Secret Key salah!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F9F9F9] font-poppins text-[#262626] antialiased">
            {/* SISI KIRI: BANNER BRANDING */}
            <div className="hidden lg:flex lg:col-span-5 bg-[#171717] p-12 flex-col justify-between relative overflow-hidden text-white border-r border-[#262626]">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#4F5C18_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#4F5C18] rounded-full flex items-center justify-center font-['Playfair_Display'] italic text-sm text-white font-bold">-L-</div>
                    <div>
                        <span className="font-['Playfair_Display'] text-lg italic tracking-wider block">Lumière Atelier</span>
                        <span className="text-[8px] text-gray-400 tracking-[0.3em] uppercase block font-bold -mt-1">Luxury CRM System</span>
                    </div>
                </div>
                <div className="relative z-10 my-auto max-w-sm space-y-4">
                    <div className="inline-block bg-[#4F5C18]/20 border border-[#4F5C18]/40 text-[#F2F7D6] text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">Secure Authentication</div>
                    <h1 className="text-4xl font-['Playfair_Display'] italic font-medium leading-tight">Selamat Datang Kembali di Portal Admin Atelier.</h1>
                </div>
                <div className="relative z-10 text-[10px] text-gray-500 font-mono tracking-widest uppercase border-t border-[#262626] pt-4">© 2026 Lumière Atelier Inc.</div>
            </div>

            {/* SISI KANAN: FORM */}
            <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-[#F3F3F3] p-8 md:p-10 shadow-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-['Playfair_Display'] italic font-medium text-[#262626]">Welcome Back 👋</h2>
                        <p className="text-[#4F5C18] text-[9px] uppercase tracking-[0.3em] mt-2 font-black">Lumière Atelier Access</p>
                    </div>

                    {error && (
                        <div className="bg-[#BC2F32]/5 border border-[#BC2F32]/10 mb-6 p-4 rounded-2xl flex items-center">
                            <GiTerror className="text-[#BC2F32] me-3 text-xl flex-shrink-0" />
                            <span className="text-[10px] font-black text-[#BC2F32] uppercase tracking-wider">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 block">Atelier Identity</label>
                            <div className="relative mt-1.5">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                                <input type="email" name="email" required className="w-full pl-11 pr-4 py-4 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm" placeholder="customer@lumiere.com" onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Secret Key</label>
                                <Link to="/forgot" className="text-[9px] font-bold text-[#4F5C18] hover:underline transition-colors">Forgot Password?</Link>
                            </div>
                            <div className="relative mt-1.5">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                                <input type={showPassword ? "text" : "password"} name="password" required className="w-full pl-11 pr-12 py-4 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 focus:bg-white focus:ring-2 focus:ring-[#4F5C18]/20 outline-none text-sm" placeholder="********" onChange={handleChange} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4F5C18]">{showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#262626] hover:bg-[#4F5C18] text-white font-black py-4 rounded-full text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 mt-2 disabled:bg-gray-400">
                            {loading ? <MdOutlineDownloading className="animate-spin text-lg" /> : "Login to Dashboard"}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-[#F3F3F3] pt-5">
                        <p className="text-[11px] text-gray-400 font-medium">New Member? <Link to="/register" className="text-[#4F5C18] font-black hover:underline tracking-widest ml-1 uppercase">Create Account</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}