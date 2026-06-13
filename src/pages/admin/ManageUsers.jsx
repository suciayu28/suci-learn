import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import untuk navigasi balik
import axios from "axios"; 
import { FiTrash2, FiUser, FiShield, FiRefreshCw, FiAlertCircle, FiLock } from "react-icons/fi";

const API_URL = "https://kxhxoltfjedlzqtljkfs.supabase.co/rest/v1/login";
const API_KEY = "sb_publishable_AbEQ5p5obbAPGWaFtaJ-7Q_wYqPROX_";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export default function ManageUsers() {
    const navigate = useNavigate();
    
    // ─── STATE PROTEKSI ROLE ADMIN ──────────────────────────────────────
    const [currentRole, setCurrentRole] = useState(null);
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState(null);

    // === 1. AMBIL DATA USER (READ VIA AXIOS) ===
    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(API_URL, { headers });
            setUsers(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengambil data dari REST API Supabase.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Pengecekan otentikasi role saat halaman pertama kali dimuat
        const savedUser = localStorage.getItem("userLoggedIn");
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            // Sesuaikan lowercase/uppercase dengan data login Anda ("admin" / "Admin")
            setCurrentRole(userData.role?.toLowerCase() || "customer");
        } else {
            setCurrentRole("guest");
        }

        fetchUsers();
    }, []);

    // === 2. HAPUS DATA USER (DELETE VIA AXIOS = SINKRON KE SUPABASE) ===
    const handleDelete = async (id, email) => {
        const konfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus user dengan email [ ${email} ] secara permanen dari Supabase?`);
        if (!konfirmasi) return;

        setDeleteId(id);
        setError("");

        try {
            await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
            setUsers(users.filter((user) => user.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus data dari Supabase.");
        } finally {
            setDeleteId(null);
        }
    };

    // ─── 1. LOADING STATE PROSES VERIFIKASI AKSES ────────────────────────
    if (currentRole === null) {
        return (
            <div className="flex items-center justify-center min-h-[75vh]">
                <div className="w-8 h-8 border-4 border-[#4F5C18] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ─── 2. BLOKADE TOTAL JIKA USER BUKAN ADMIN ─────────────────────────
    if (currentRole !== "admin") {
        return (
            <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[70vh] px-4 font-poppins text-center text-[#262626]">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100 shadow-sm animate-bounce">
                    <FiLock size={32} />
                </div>
                <h3 className="font-['Playfair_Display'] italic text-3xl mb-2 tracking-tight">Access Denied</h3>
                <p className="text-sm text-gray-500 max-w-md mb-8 leading-relaxed">
                    Maaf, halaman **Identity Directory** ini bersifat rahasia dan dikunci khusus untuk level otoritas **Admin**.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3.5 bg-[#262626] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    // ─── 3. TAMPILAN HALAMAN UTAMA (HANYA AKAN MERENDER JIKA ADMIN) ─────
    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto font-poppins text-[#262626]">
            
            {/* Header Menu */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-[#F3F3F3] pb-6">
                <div>
                    <h2 className="text-3xl font-['Playfair_Display'] italic font-medium">
                        Atelier Identity Directory
                    </h2>
                    <p className="text-[#4F5C18] text-[9px] uppercase tracking-[0.3em] mt-1 font-black">
                        Axios & Supabase REST API Sync
                    </p>
                </div>
                <button 
                    onClick={fetchUsers}
                    disabled={loading}
                    className="px-5 py-3 border border-[#F3F3F3] bg-white hover:bg-gray-50 rounded-full text-[10px] uppercase tracking-widest font-black flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                    <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} /> Refresh Registry
                </button>
            </div>

            {/* Notifikasi Error */}
            {error && (
                <div className="bg-[#BC2F32]/5 border border-[#BC2F32]/10 mb-6 p-4 rounded-2xl flex items-center text-[#BC2F32]">
                    <FiAlertCircle className="me-3 text-xl flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{error}</span>
                </div>
            )}

            {/* Tabel Utama Data User */}
            <div className="bg-white rounded-[2rem] border border-[#F3F3F3] shadow-sm overflow-hidden">
                {loading && users.length === 0 ? (
                    <div className="p-20 text-center text-sm font-medium text-gray-400">
                        <FiRefreshCw className="animate-spin text-2xl mx-auto mb-3 text-[#4F5C18]" />
                        Mengambil data akun dari REST API Supabase...
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-20 text-center text-sm font-medium text-gray-400">
                        Belum ada user yang terdaftar di tabel database.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F9F9F9] border-b border-[#F3F3F3] text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    <th className="p-6 pl-8">ID</th>
                                    <th className="p-6">Name</th>
                                    <th className="p-6">Identity (Email)</th>
                                    <th className="p-6">Role Authority</th>
                                    <th className="p-6 text-center pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F3F3] text-sm">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6 pl-8 font-mono text-xs text-gray-400">
                                            #{user.id}
                                        </td>
                                        <td className="p-6 font-semibold tracking-tight">
                                            {user.name || "N/A"}
                                        </td>
                                        <td className="p-6 text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black ${
                                                user.role?.toLowerCase() === "admin" 
                                                    ? "bg-[#262626] text-white" 
                                                    : "bg-[#F2F7D6] text-[#4F5C18]"
                                            }`}>
                                                {user.role?.toLowerCase() === "admin" ? <FiShield size={10} /> : <FiUser size={10} />}
                                                {user.role || "customer"}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center pr-8">
                                            <button
                                                onClick={() => handleDelete(user.id, user.email)}
                                                disabled={deleteId === user.id}
                                                className="inline-flex items-center justify-center p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer disabled:opacity-50"
                                            >
                                                {deleteId === user.id ? (
                                                    <FiRefreshCw className="animate-spin text-sm" />
                                                ) : (
                                                    <FiTrash2 className="text-sm" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}