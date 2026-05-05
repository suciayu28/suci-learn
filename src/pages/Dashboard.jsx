import { FiArrowUpRight, FiHeart, FiShoppingBag, FiStar, FiZap, FiPlus, FiChevronRight } from "react-icons/fi";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const Dashboard = () => {
  const chartData = [{ n: 'M', v: 3100 }, { n: 'T', v: 4200 }, { n: 'W', v: 3800 }, { n: 'T', v: 5100 }, { n: 'F', v: 4800 }, { n: 'S', v: 6200 }, { n: 'S', v: 5800 }];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-12 font-['Poppins'] text-[#262626] bg-[#F3F3F3]">
      
      {/* ============================================================
          COMPONENT 1: HERO SECTION (EDITORIAL LAYOUT)
          ============================================================ */}
      <div className="relative grid grid-cols-12 gap-0 bg-[#F2F7D6] rounded-[4rem] overflow-hidden border border-white/50 shadow-sm">
        
        {/* SUB-COMPONENT: Typography & Branding Area */}
        <div className="col-span-12 lg:col-span-7 p-16 z-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[1.5px] bg-[#4F5C18]"></span>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#4F5C18]">Lumière Cosmetics</p>
          </div>
          <h1 className="text-8xl font-['Playfair_Display'] italic font-medium leading-[0.95] text-[#262626] -ml-1">
            Glow <br /> <span className="ml-16">Naturally</span> <br /> Every Day
          </h1>
          
          {/* SUB-COMPONENT: Call to Action (CTA) Pill Buttons */}
          <div className="mt-10 flex items-center gap-8">
            <button className="flex items-center gap-4 bg-[#262626] text-white px-10 py-5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#4F5C18] transition-all group">
              Manage Products <div className="bg-[#4F5C18] p-1 rounded-sm group-hover:rotate-45 transition-transform"><FiArrowUpRight /></div>
            </button>
            <div className="text-[11px] font-bold text-[#4F5C18] border-b border-[#4F5C18] cursor-pointer hover:tracking-widest transition-all">EXPLORE TRENDS</div>
          </div>
        </div>

        {/* SUB-COMPONENT: Visual Floating Composition */}
        <div className="hidden lg:flex col-span-5 relative bg-[#D9E67E]/30 items-center justify-center p-12">
          {/* Decorative Organic Shape */}
          <div className="absolute w-[80%] h-[120%] bg-[#D9E67E] rounded-full -rotate-12 translate-x-10 translate-y-10 shadow-inner"></div>
          
          {/* Main Product Image */}
          <img 
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600" 
            alt="Hero Product" 
            className="relative z-10 w-full h-[550px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
          />

          {/* SUB-COMPONENT: Floating Badge (Skinly Style) */}
          <div className="absolute top-24 right-12 bg-[#262626] text-white w-28 h-28 rounded-full flex flex-col items-center justify-center border-8 border-[#F2F7D6] z-20 shadow-xl scale-110">
            <span className="text-xl font-['Playfair_Display'] italic font-bold">5.5k</span>
            <span className="text-[8px] uppercase font-black tracking-tighter opacity-70">Sold Out</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          COMPONENT 2: GRID LAYOUT (BENTO BOXES)
          ============================================================ */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* COMPONENT 2A: LARGE ANALYTICS CARD (CLEAN WHITE) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[3.5rem] p-12 border border-white shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-16">
            <div className="space-y-2">
              <h3 className="text-4xl font-['Playfair_Display'] italic font-medium">Market Analytics</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#4F5C18] font-black">Sales Performance & Growth</p>
            </div>
            
            {/* SUB-COMPONENT: Secondary Metrics Badge */}
            <div className="bg-[#F4F3FF] p-6 rounded-[2rem] border border-white text-center min-w-[140px]">
              <p className="text-[9px] font-bold text-[#4F5C18] uppercase tracking-widest mb-1">Success Rate</p>
              <span className="text-2xl font-['Playfair_Display'] italic font-bold text-[#262626]">99.8%</span>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="h-[280px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="primaryFade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F5C18" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4F5C18" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#4F5C18" strokeWidth={5} fill="url(#primaryFade)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COMPONENT 2B: DARK FEATURED CARD (HIGH CONTRAST BLACK) */}
        <div className="col-span-12 lg:col-span-4 bg-[#262626] rounded-[3.5rem] p-12 text-white relative overflow-hidden flex flex-col shadow-2xl">
          <div className="relative z-10 flex flex-col h-full">
            <FiStar className="text-[#D9E67E] text-5xl mb-8 opacity-80" />
            <span className="text-[#4F5C18] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Trending Now</span>
            <h4 className="text-5xl font-['Playfair_Display'] italic font-medium leading-[1.1] mb-10">Matte Silk <br/> Blush</h4>
            
            <div className="mt-auto space-y-6">
              {/* SUB-COMPONENT: Testimonial/User Badge */}
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-12 h-12 rounded-full border-2 border-[#D9E67E] p-1 overflow-hidden">
                  <img src="https://i.pravatar.cc/100?img=32" className="w-full h-full rounded-full object-cover" alt="User"/>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider">Top Reviewer</p>
                  <p className="text-[9px] opacity-50 font-['Playfair_Display'] italic italic">"Best formula I've ever used"</p>
                </div>
              </div>
              
              {/* SUB-COMPONENT: Ghost White Pill Button */}
              <button className="w-full bg-white text-[#262626] py-5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#D9E67E] transition-all">
                RESTOCK ITEM <FiPlus />
              </button>
            </div>
          </div>
          {/* Decorative Background Blur */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#4F5C18] rounded-full blur-[100px] opacity-30"></div>
        </div>
      </div>

      {/* ============================================================
          COMPONENT 3: MARQUEE SLIDER (DYNAMIC ACCENT)
          ============================================================ */}
      <div className="bg-[#4F5C18] py-8 rounded-full overflow-hidden flex whitespace-nowrap border-[6px] border-white shadow-2xl scale-[1.02]">
        <div className="flex gap-24 animate-marquee items-center">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-12 text-white font-['Playfair_Display'] italic text-2xl tracking-tight">
              <span>99% Natural Ingredients</span>
              <div className="w-3 h-3 bg-[#D9E67E] rotate-45"></div>
              <span>Transform Your Routine Today</span>
              <div className="w-3 h-3 bg-[#D9E67E] rotate-45"></div>
              <span>Beauty Glow Luxury Atelier</span>
              <div className="w-3 h-3 bg-[#D9E67E] rotate-45"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;