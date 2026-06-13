import React, { useState, useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { 
  FiPlus, 
  FiX, 
  FiSave, 
  FiTrendingUp, 
  FiDollarSign, 
  FiUsers, 
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiAlertTriangle // Icon tambahan untuk halaman Access Denied
} from "react-icons/fi";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Tooltip as ChartTooltip, //  Gunakan alias 'as' di sini
  Legend 
} from "recharts";
import { getCRMData, saveCRMData } from "../lib/crmData";
import { ACQUISITION_CHANNELS } from "@/data/marketingData.js";

const Marketing = () => {
  // ─── STATE PROTEKSI ROLE ─────────────────────────────────────────────
  const [currentRole, setCurrentRole] = useState(null); // null berarti sedang loading cek role
  
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New Campaign Form State
  const [formData, setFormData] = useState({
    name: "",
    source: "Instagram",
    status: "Active",
    budget: "",
    reach: "",
    conversions: ""
  });

  // Refs
  const nameInputRef = useRef(null);

  useEffect(() => {
    // 1. Ambil data user login untuk cek Role Admin
    const savedUser = localStorage.getItem("userLoggedIn");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentRole(userData.role || "Customer");
    } else {
      setCurrentRole("Guest");
    }

    // 2. Ambil data CRM
    const db = getCRMData();
    setCampaigns(db.campaigns || []);
    setCustomers(db.customers || []);
  }, []);

  // Auto-focus campaign name when form dialog opens
  useEffect(() => {
    if (isDialogOpen && nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 150);
    }
  }, [isDialogOpen]);

  // ─── PROTEKSI SCREEN: JIKA BUKAN ADMIN ───────────────────────────────
  if (currentRole !== null && currentRole !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center font-poppins animate-in fade-in duration-300">
        <div className="p-5 bg-rose-50 text-rose-600 rounded-full mb-4 animate-bounce">
          <FiAlertTriangle size={40} />
        </div>
        <h2 className="font-playfair font-black text-2xl text-[#262626] mb-2">
          Akses Terbatas
        </h2>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
          Maaf, halaman <span className="font-bold text-gray-600">Marketing & Engagement Portal</span> hanya dapat diakses oleh akun dengan otoritas <span className="text-rose-600 font-bold">Admin</span>.
        </p>
      </div>
    );
  }

  // JIKA SEDANG CEK ROLE (LOADING STATE)
  if (currentRole === null) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-[#4F5C18] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ─── CALCULATIONS & LOGIC MARKETING (DIJALANKAN JIKA LOLOS ADMIN) ───
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === "Active").length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  const sourceCounts = customers.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {});

  const sourceChartData = Object.keys(sourceCounts).map(source => ({
    name: source,
    value: sourceCounts[source]
  }));

  const COLORS = ["#4F5C18", "#8F9A5D", "#D4DBC0", "#262626"];

  const handleCampaignSubmit = (e) => {
    e.preventDefault();

    const newId = `CAMP-${(campaigns.length + 1).toString().padStart(3, '0')}`;
    const newCamp = {
      id: newId,
      name: formData.name,
      source: formData.source,
      status: formData.status,
      budget: Number(formData.budget) || 0,
      reach: Number(formData.reach) || 0,
      conversions: Number(formData.conversions) || 0,
      startDate: new Date().toISOString().split("T")[0]
    };

    const updatedCampaigns = [...campaigns, newCamp];
    setCampaigns(updatedCampaigns);

    const db = getCRMData();
    db.campaigns = updatedCampaigns;
    saveCRMData(db);

    setIsDialogOpen(false);
    resetForm();
    alert(`Success! Campaign ${newCamp.name} has been launched.`);
  };

  const toggleCampaignStatus = (id) => {
    const updatedCampaigns = campaigns.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === "Active" ? "Paused" : c.status === "Paused" ? "Completed" : "Active";
        return { ...c, status: nextStatus };
      }
      return c;
    });

    setCampaigns(updatedCampaigns);

    const db = getCRMData();
    db.campaigns = updatedCampaigns;
    saveCRMData(db);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      source: "Instagram",
      status: "Active",
      budget: "",
      reach: "",
      conversions: ""
    });
  };

  return (
    <div className="animate-in fade-in duration-500 pb-10 px-4 font-poppins text-[#262626]">
      <PageHeader title="Marketing & Engagement Portal" breadcrumb={["CRM", "Marketing"]}>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#4F5C18] text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-[#4F5C18]/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <FiPlus size={14} /> Create Campaign
        </button>
      </PageHeader>

      {/* 1. MARKETING METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><FiDollarSign size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Spend</p>
            <h3 className="text-2xl font-bold text-[#262626] mt-0.5">Rp {totalBudget.toLocaleString("id-ID")}</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><FiTrendingUp size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Campaign Conversions</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-0.5">{totalConversions} Orders</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><HiOutlineMegaphone size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-bold">Total Campaigns</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-0.5">{totalCampaigns} ({activeCampaigns} Active)</h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#F3F3F3] shadow-sm flex items-center gap-5">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><FiUsers size={24} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Reach</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-0.5">
              {(campaigns.reduce((sum, c) => sum + c.reach, 0) / 1000).toFixed(0)}k Users
            </h3>
          </div>
        </div>
      </div>

      {/* 2. TABS */}
      <div className="flex gap-2 border-b border-[#F3F3F3] pb-4 mb-6">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "campaigns" ? "bg-[#262626] text-white" : "bg-white text-gray-400 hover:text-[#262626]"
          }`}
        >
          Active Campaigns List
        </button>
        <button
          onClick={() => setActiveTab("acquisition")}
          className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
            activeTab === "acquisition" ? "bg-[#262626] text-white" : "bg-white text-gray-400 hover:text-[#262626]"
          }`}
        >
          Acquisition Channels Analytics
        </button>
      </div>

      {/* 3. TABS CONTENT */}
      {activeTab === "campaigns" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-white rounded-[2rem] p-6 border border-[#F3F3F3] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-lg font-mono">
                    {camp.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1 ${
                    camp.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                    camp.status === "Paused" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {camp.status === "Active" && <FiPlay size={8} />}
                    {camp.status === "Paused" && <FiPause size={8} />}
                    {camp.status === "Completed" && <FiCheckCircle size={8} />}
                    {camp.status}
                  </span>
                </div>

                <h4 className="font-playfair font-bold text-lg text-[#262626] mb-1">{camp.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Target: {camp.source}</p>

                <div className="space-y-3 pt-4 border-t border-[#F3F3F3]">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Budget Allocated:</span>
                    <span className="font-bold text-[#262626]">Rp {camp.budget.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Estimated Reach:</span>
                    <span className="font-bold text-[#262626]">{camp.reach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Conversions:</span>
                    <span className="font-bold text-emerald-600">{camp.conversions} orders</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => toggleCampaignStatus(camp.id)}
                  className="w-full py-2 bg-[#F3F3F3] text-gray-500 hover:bg-[#4F5C18] hover:text-white rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Change Campaign Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "acquisition" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F3F3F3] shadow-sm">
            <h4 className="font-playfair font-bold text-xl text-[#262626] mb-6">Acquisition Source Split</h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip contentStyle={{ fontFamily: "Poppins", fontSize: "11px", borderRadius: "12px" }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-[#F3F3F3] shadow-sm">
            <h4 className="font-playfair font-bold text-xl text-[#262626] mb-6">Source Breakdown</h4>
            <div className="space-y-4">
              {sourceChartData.map((data, index) => (
                <div key={data.name} className="flex items-center justify-between p-4 bg-[#F3F3F3]/40 rounded-2xl border border-[#F3F3F3]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs font-bold text-[#262626]">{data.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#4F5C18]">{data.value} Customers</span>
                    <span className="text-[10px] text-gray-400 block font-medium">
                      {customers.length > 0 ? ((data.value / customers.length) * 100).toFixed(1) : 0}% share
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CAMPAIGN DIALOG MODAL */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-playfair font-bold text-2xl text-[#262626]">Create Campaign</h3>
              <button onClick={() => { setIsDialogOpen(false); resetForm(); }} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCampaignSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Campaign Name</label>
                <input 
                  ref={nameInputRef}
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                  placeholder="e.g. Lip Glow TikTok challenge"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Acquisition Channel</label>
                <select 
                  required
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm cursor-pointer"
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                >
                  {ACQUISITION_CHANNELS.map((channel) => (
                    <option key={channel.value} value={channel.value}>
                      {channel.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Allocated Budget (IDR)</label>
                <input 
                  required
                  type="number"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                  placeholder="e.g. 15000000"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Estimated Reach</label>
                <input 
                  required
                  type="number"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                  placeholder="e.g. 50000"
                  value={formData.reach}
                  onChange={(e) => setFormData({...formData, reach: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Estimated Conversions (Sales)</label>
                <input 
                  required
                  type="number"
                  className="w-full px-5 py-3.5 bg-[#F3F3F3] rounded-2xl border-none outline-none text-sm focus:ring-2 focus:ring-[#4F5C18]/20"
                  placeholder="e.g. 1200"
                  value={formData.conversions}
                  onChange={(e) => setFormData({...formData, conversions: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full bg-[#4F5C18] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#4F5C18]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
                <FiSave /> Launch Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;