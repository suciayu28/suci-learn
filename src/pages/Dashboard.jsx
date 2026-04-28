import { FiArrowUpRight, FiHeart, FiShoppingBag, FiStar, FiZap } from "react-icons/fi";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const Dashboard = () => {
  const chartData = [
    { n: 'Mon', v: 3100 }, { n: 'Tue', v: 4200 }, { n: 'Wed', v: 3800 }, 
    { n: 'Thu', v: 5100 }, { n: 'Fri', v: 4800 }, { n: 'Sat', v: 6200 }, { n: 'Sun', v: 5800 }
  ];

  // PINDAHKAN VARIABEL KE SINI (Di luar return)
  const products = [
  { 
    name: "Creamy Matte Lipstick", 
    price: "$24.00", 
    sales: "1.2k sold", 
    // Kotak warna Rose Pink (FFE4E1) dengan teks produk
    img: "https://dummyimage.com/200x200/FFE4E1/FF4D94.png&text=Lipstick" 
  },
  { 
    name: "Organic Face Serum", 
    price: "$48.00", 
    sales: "840 sold", 
    img: "https://dummyimage.com/200x200/FFE4E1/FF4D94.png&text=Serum" 
  },
  { 
    name: "Lash Extension Mascara", 
    price: "$19.00", 
    sales: "2.1k sold", 
    // Link Mascara yang tadi error gue ganti pake placeholder pasti
    img: "https://dummyimage.com/200x200/FFE4E1/FF4D94.png&text=Mascara" 
  },
];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* KATEGORI PENJUALAN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Daily Revenue", val: "$4,250", icon: <FiZap />, color: "bg-amber-50 text-amber-600" },
          { label: "Beauty Members", val: "2,410", icon: <FiHeart />, color: "bg-rose-50 text-rose-600" },
          { label: "Orders Shipped", val: "184", icon: <FiShoppingBag />, color: "bg-gray-50 text-black" },
          { label: "Store Rating", val: "4.9/5", icon: <FiStar />, color: "bg-emerald-50 text-emerald-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-4 hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{item.label}</p>
              <h3 className="text-2xl font-serif italic font-semibold tracking-tight">{item.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ANALYTICS & FEATURED */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Revenue Stream</h4>
              <p className="text-xs font-serif italic text-gray-500">Beauty products sales growth</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="makeupGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB7185" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FB7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="v" stroke="#000" strokeWidth={3} fill="url(#makeupGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#111] rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full">
            <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Seasonal Pick</span>
            <h2 className="text-4xl font-serif italic font-medium leading-[1.1] mb-6">Silk Finish <br/> Foundation</h2>
            <button className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-2 hover:text-rose-400 transition-all">
              Update Inventory <FiArrowUpRight />
            </button>
          </div>
          <div className="absolute right-[-15%] bottom-[-5%] w-3/4 h-3/4 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfad450216?w=500')] bg-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-1000"></div>
        </div>
      </div>

      {/* BEST SELLER INVENTORY */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Best Seller Inventory</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((prod, i) => (
            <div key={i} className="flex items-center gap-5 group cursor-pointer">
              <div className="relative">
                {/* Hapus class grayscale agar placeholder pink-nya terlihat jelas */}
                <img src={prod.img} alt={prod.name} className="w-20 h-20 rounded-3xl object-cover transition-all duration-500 group-hover:scale-110 shadow-sm" />
                <div className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-black px-2 py-1 rounded-full">{i + 1}</div>
              </div>
              <div>
                <h5 className="text-[11px] font-black uppercase tracking-tight text-gray-800 mb-1">{prod.name}</h5>
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-serif italic text-rose-500">{prod.price}</span>
                  <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">{prod.sales}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;