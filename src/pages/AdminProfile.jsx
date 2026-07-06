import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiSave, FiCheck } from "react-icons/fi";
import { supabase } from "../lib/supabase";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    name: "Lumière Admin",
    email: "admin@lumiere.com",
    phone: "",
    avatar: null,
    role: "Utama Manager"
  });
  const [editForm, setEditForm] = useState({ ...adminData });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadAdminData = () => {
      const user = localStorage.getItem("userLoggedIn");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setAdminData({
            name: parsed.name || parsed.username || "Lumière Admin",
            email: parsed.email || "admin@lumiere.com",
            phone: parsed.phone || "",
            avatar: parsed.avatar || null,
            role: parsed.role || "Utama Manager"
          });
          setEditForm({
            name: parsed.name || parsed.username || "Lumière Admin",
            email: parsed.email || "admin@lumiere.com",
            phone: parsed.phone || "",
            avatar: parsed.avatar || null,
            role: parsed.role || "Utama Manager"
          });
        } catch (e) {
          console.error("Failed to load admin data:", e);
        }
      }
    };
    loadAdminData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      const existingSession = localStorage.getItem("userLoggedIn");
      let updatedSession = { ...editForm };
      if (existingSession) {
        try {
          updatedSession = { ...JSON.parse(existingSession), ...editForm };
        } catch (e) {}
      }
      localStorage.setItem("userLoggedIn", JSON.stringify(updatedSession));
      setAdminData({ ...editForm });

      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-3xl mx-auto text-left animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black font-serif text-[#262626] mb-2">Profil Admin</h2>
        <p className="text-sm text-gray-500">Kelola informasi akun dan preferensi Anda.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3F3F3] p-8 shadow-sm">
        {successMessage && (
          <div className="mb-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-4 flex items-center gap-2 text-sm font-bold">
            <FiCheck size={16} />
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-[#F3F3F3]">
          <div className="relative">
            {adminData.avatar ? (
              <img
                src={adminData.avatar}
                alt={adminData.name}
                className="w-24 h-24 rounded-full object-cover shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div className={`w-24 h-24 bg-[#4F5C18] text-white font-bold text-2xl rounded-full flex items-center justify-center shadow-md ${adminData.avatar ? "hidden" : "flex"}`}>
              {getInitials(adminData.name)}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#262626]">{adminData.name}</h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <FiMail size={14} />
              {adminData.email}
            </p>
            <p className="text-xs font-bold text-[#4F5C18] uppercase tracking-widest mt-2">{adminData.role}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
              <FiUser size={12} />
              Nama Lengkap
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#4F5C18]/10 focus:border-[#4F5C18]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
              <FiMail size={12} />
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#4F5C18]/10 focus:border-[#4F5C18]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
              <FiPhone size={12} />
              Nomor Telepon
            </label>
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="Masukkan nomor telepon Anda"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#4F5C18]/10 focus:border-[#4F5C18]"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto bg-[#4F5C18] hover:bg-[#3d4713] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <FiSave size={14} />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
