
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineDownloading } from "react-icons/md";
import { GiTerror } from "react-icons/gi";
import { FiEye, FiEyeOff, FiUser, FiShield, FiMail, FiLock } from "react-icons/fi"; 

// Mengimpor Supabase client yang sudah benar
import { supabase } from "../../services/supabaseClient"; 

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [dataForm, setDataForm] = useState({ email: "", role: "customer", password: "", confirmPassword: "" });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({ ...dataForm, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (dataForm.password !== dataForm.confirmPassword) {
            setError("Confirm Secret Key tidak cocok!");
            setLoading(false);
            return;
        }

        console.log("🔄 Starting register process...", dataForm);

        try {
            // 1. Cek apakah email sudah ada
            console.log("📝 Checking if email exists...");
            const { data: existingUser, error: checkError } = await supabase
                .from('login')
                .select('id, email')
                .eq('email', dataForm.email)
                .maybeSingle();

            if (checkError) {
                console.error("❌ Check email error:", checkError);
                throw new Error(`Gagal cek email: ${checkError.message}`);
            }

            if (existingUser) {
                throw new Error("Email ini sudah terdaftar! Silakan gunakan email lain.");
            }

            // 2. Insert data user baru ke tabel 'login'
            console.log("📝 Inserting user data...");
            const { data: insertedUser, error: insertError } = await supabase
                .from('login')
                .insert([
                    { 
                        email: dataForm.email, 
                        password: dataForm.password, 
                        name: dataForm.email.split('@')[0], 
                        role: dataForm.role 
                    }
                ])
                .select(); // Tambahkan .select() untuk mendapatkan data yang diinsert

            if (insertError) {
                console.error("❌ Insert error:", insertError);
                throw new Error(`Gagal insert ke database: ${insertError.message} (Code: ${insertError.code})`);
            }

            console.log("✅ User inserted successfully:", insertedUser);

            setSuccess("Account Atelier Berhasil Dibuat! Silakan Login.");
            setTimeout(() => navigate("/login"), 2000);

        } catch (registerError) {
            console.error("❌ Register Error (full):", registerError);
            
            let errorMessage = registerError.message;
            
            if (registerError.code === 'PGRST301' || registerError.message?.includes('RLS')) {
                errorMessage = "Kebijakan keamanan Supabase memblokir. Buka /debug dan jalankan test!";
            } else if (registerError.message?.includes('duplicate')) {
                errorMessage = "Email ini sudah terdaftar!";
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F9F9F9] font-poppins text-[#262626] antialiased">
            {/* BANNER KIRI */}
            <div className="hidden lg:flex lg:col-span-5 bg-[#171717] p-12 flex-col justify-between text-white border-r border-[#262626]">
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#4F5C18] rounded-full flex items-center justify-center font-['Playfair_Display'] italic text-sm font-bold">-L-</div>
                    <span className="font-['Playfair_Display'] text-lg italic tracking-wider">Lumière Atelier</span>
                </div>
                <div className="my-auto max-w-sm space-y-4">
                    <h1 className="text-4xl font-['Playfair_Display'] italic">Tingkatkan <span className="text-[#4F5C18] not-italic font-black">Loyalitas</span> Pelanggan.</h1>
                </div>
            </div>

            {/* FORM KANAN */}
            <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-[#F3F3F3] p-8 shadow-sm">
                    <h2 className="text-2xl font-['Playfair_Display'] italic text-center text-[#262626]">Create Account</h2>
                    
                    {error && (
                        <div className="bg-[#BC2F32]/5 text-[#BC2F32] p-4 rounded-2xl text-[10px] font-black uppercase mt-4">
                            <div>{error}</div>
                            {error.includes('RLS') && (
                                <a href="/debug" className="underline text-xs font-normal mt-2 inline-block">
                                    → Buka Halaman Debug
                                </a>
                            )}
                        </div>
                    )}
                    {success && <div className="bg-emerald-500/5 text-emerald-600 p-4 rounded-2xl text-[10px] font-black uppercase mt-4">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</label>
                            <div className="relative mt-1.5">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="email" 
                                    name="email" 
                                    required 
                                    onChange={handleChange} 
                                    className="w-full pl-11 pr-4 py-4 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 text-sm"
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    placeholder="customer@lumiere.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Hak Akses / Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => setDataForm({ ...dataForm, role: "customer" })} className={`p-4 rounded-2xl border text-left flex items-center gap-3 ${dataForm.role === "customer" ? "border-[#4F5C18] bg-[#F2F7D6]/30 text-[#4F5C18]" : "border-[#F3F3F3]"}`}><FiUser /> Customer</button>
                                <button type="button" onClick={() => setDataForm({ ...dataForm, role: "admin" })} className={`p-4 rounded-2xl border text-left flex items-center gap-3 ${dataForm.role === "admin" ? "border-[#4F5C18] bg-[#F2F7D6]/30 text-[#4F5C18]" : "border-[#F3F3F3]"}`}><FiShield /> Admin</button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Password</label>
                            <div className="relative mt-1.5">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type={showPassword ? "text" : "password"} name="password" required onChange={handleChange} className="w-full pl-11 pr-12 py-4 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 text-sm" placeholder="********" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Confirm Secret Key</label>
                            <div className="relative mt-1.5">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required onChange={handleChange} className="w-full pl-11 pr-12 py-4 border border-[#F3F3F3] rounded-2xl bg-[#F3F3F3]/30 text-sm" placeholder="********" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#262626] text-white font-black py-4 rounded-full text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                            {loading ? <MdOutlineDownloading className="animate-spin" /> : "Register Atelier"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}