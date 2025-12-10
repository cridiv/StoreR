"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Activity,
  TrendingUp,
  Search,
  ShoppingCart,
  BarChart2,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";
import AuthModal from "./AuthPage";


const LogoIcon = ({ className }: { className?: string }) => (
  <Layers className={className} />
);

export default function LandingPage() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [trendData] = useState([
    { name: "Jan", ebay: 4000, shopify: 2400, amazon: 1800 },
    { name: "Feb", ebay: 3000, shopify: 1398, amazon: 2800 },
    { name: "Mar", ebay: 5000, shopify: 4800, amazon: 3800 },
    { name: "Apr", ebay: 2780, shopify: 3908, amazon: 4800 },
    { name: "May", ebay: 7890, shopify: 4800, amazon: 3800 },
    { name: "Jun", ebay: 8390, shopify: 5800, amazon: 6800 },
  ]);

  const trendingProducts = [
    {
      name: "Smart LED Strips",
      platform: "Shopify",
      growth: "+245%",
      price: "$24.99",
    },
    {
      name: "Eco Water Bottle",
      platform: "eBay",
      growth: "+189%",
      price: "$18.50",
    },
    {
      name: "Ceramic Plant Pot",
      platform: "Amazon",
      growth: "+165%",
      price: "$32.99",
    },
    {
      name: "Wireless Earbuds",
      platform: "Shopify",
      growth: "+132%",
      price: "$79.99",
    },
  ];

  const [stats, setStats] = useState({
    products: 0,
    marketplaces: 0,
    trends: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        products: prev.products < 15000 ? prev.products + 500 : 15000,
        marketplaces: prev.marketplaces < 25 ? prev.marketplaces + 1 : 25,
        trends: prev.trends < 340 ? prev.trends + 10 : 340,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

const TrendChart: React.FC<{
  data: { name: string; ebay: number; shopify: number; amazon: number }[];
}> = React.memo(({ data }) => (
  <div className="relative w-full h-[300px]">
    <div className="flex h-full items-end gap-4 pb-8">
      {data.map((point, idx) => (
        <div key={idx} className="flex gap-1 h-full items-end flex-1">
          <div
            className="w-3 rounded-t transition-all duration-500"
            style={{ 
              height: `${point.ebay / 100}%`,
              background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)'
            }}
          />
          <div
            className="w-3 rounded-t bg-[#00c9ff] transition-all duration-500"
            style={{ height: `${point.shopify / 100}%` }}
          />
            <div
              className="w-3 rounded-t bg-[#f59e0b] transition-all duration-500"
              style={{ height: `${point.amazon / 100}%` }}
            />
        </div>
      ))}
    </div>
    <div className="flex justify-between pt-2 border-t border-white/10">
      {data.map((point, idx) => (
        <div key={idx} className="flex-1 text-center text-sm text-gray-400">
          {point.name}
        </div>
      ))}
    </div>
  </div>
));
TrendChart.displayName = "TrendChart";

const DonutChart: React.FC = React.memo(() => (
  <div className="flex flex-col items-center h-full">
    <div className="w-[200px] h-[200px] rounded-full relative my-8">
      <div
        className="absolute w-full h-full rounded-full border-[15px]"
        style={{
          clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
          transform: "rotate(0deg)",
          borderImage: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%) 1',
          borderStyle: 'solid'
        }}
      />
      <div
        className="absolute w-full h-full rounded-full border-[15px] border-[#00c9ff]"
        style={{
          clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
          transform: "rotate(120deg)",
        }}
      />
      <div
        className="absolute w-full h-full rounded-full border-[15px] border-[#f59e0b]"
        style={{
          clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
          transform: "rotate(240deg)",
        }}
      />
    </div>
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)' }} />
        eBay (45%)
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-3 h-3 rounded-full bg-[#00c9ff]" />
        Shopify (25%)
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
        Amazon (30%)
      </div>
    </div>
  </div>
));
DonutChart.displayName = "DonutChart";

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Orbitron:wght@800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-black/70 backdrop-blur sticky top-0 z-50 border-b border-white/10">
        <div className="flex items-center gap-0 font-bold text-xl">
          <div className="flex items-center relative mr-3">
            <div className="w-10 h-10 rounded-lg bg-black/20 backdrop-blur flex items-center justify-center transition-all relative border border-gray-600/30 hover:bg-black/30 hover:shadow-[0_0_15px_rgba(75,85,99,0.3)]">
              <LogoIcon className="text-white w-6 h-6" />
            </div>
          </div>
          <span
            className="font-[Orbitron] font-extrabold text-2xl tracking-tight text-white"
          >
            StoreRadar
          </span>
          <span className="px-3 py-1 bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#2D1B69] text-white border border-gray-600/30 rounded-full text-xs font-bold uppercase tracking-wider ml-2 hidden md:inline">
            BETA
          </span>
        </div>
        <div className="hidden md:flex gap-6">
          <a href="#features" className="text-white hover:text-gray-300 transition-colors">
            Features
          </a>
          <a href="#insights" className="text-white hover:text-gray-300 transition-colors">
            Insights
          </a>
          <a href="#pricing" className="text-white hover:text-gray-300 transition-colors">
            Pricing
          </a>
        </div>
        <button
          className="text-white font-bold px-6 py-3 rounded hover:translate-y-[-2px] transition-all"
          style={{ background: 'linear-gradient(90deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)' }}
          onClick={() => setShowAuth(true)}
        >
          Access
        </button>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </nav>

      {/* Hero Section */}
      <header className="relative px-8 py-24 text-center bg-gradient-to-br from-black to-[#111] overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="inline-block px-4 py-2 rounded-full border border-gray-600/30 text-white text-sm font-semibold mb-4 bg-gradient-to-r from-[#0F172A]/50 via-[#1E1B4B]/50 to-[#2D1B69]/50">
            MARKETPLACE INTELLIGENCE
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Never Miss a Trend Again
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            StoreRadar gives you real-time insights into the hottest products
            from eBay, Shopify, and other marketplaces.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* Free Trial Button */}
            <button
              className="text-white font-bold px-8 py-4 rounded-lg hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(75,85,99,0.4)] transition-all"
              style={{
                background: "linear-gradient(90deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)",
              }}
              onClick={() => setShowAuth(true)} // ✅ open modal on click
            >
              Start Free Trial
            </button>

            {/* Watch Demo Button */}
            <button className="bg-transparent text-white font-bold px-8 py-4 rounded-lg border border-gray-600/50 hover:bg-white/5 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Watch Demo
            </button>
          </div>
        </div>
      </header>
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Stats Section */}
      <section className="bg-gray-900/30 px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800/60 rounded-lg p-8 text-center hover:translate-y-[-5px] transition-transform">
            <ShoppingCart className="text-white w-10 h-10 mx-auto mb-4" />
            <h3 className="text-4xl font-extrabold mb-2">
              {stats.products.toLocaleString()}
            </h3>
            <p className="text-gray-400">Products Tracked</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 text-center hover:translate-y-[-5px] transition-transform">
            <Layers className="text-white w-10 h-10 mx-auto mb-4" />
            <h3 className="text-4xl font-extrabold mb-2">{stats.marketplaces}</h3>
            <p className="text-gray-400">Marketplaces</p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 text-center hover:translate-y-[-5px] transition-transform">
            <TrendingUp className="text-white w-10 h-10 mx-auto mb-4" />
            <h3 className="text-4xl font-extrabold mb-2">{stats.trends}</h3>
            <p className="text-gray-400">Trends Identified</p>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="px-8 py-16 max-w-6xl mx-auto" id="insights">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">
            Real-Time Market <span className="text-white">Insights</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track product trends across platforms
          </p>
        </div>

        <div className="bg-gray-800/60 rounded-lg p-8 mb-8">
          <h3 className="text-2xl mb-6">Monthly Product Trend Analysis</h3>
          <TrendChart data={trendData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/60 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl">Top Trending Products</h3>
              <span className="flex items-center gap-1 text-sm text-white">
                <Clock size={16} /> Live Data
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-2 text-gray-400 font-semibold">
                      Product
                    </th>
                    <th className="text-left py-3 px-2 text-gray-400 font-semibold">
                      Platform
                    </th>
                    <th className="text-left py-3 px-2 text-gray-400 font-semibold">
                      Growth
                    </th>
                    <th className="text-left py-3 px-2 text-gray-400 font-semibold">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trendingProducts.map((product, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-4 px-2">{product.name}</td>
                      <td className="py-4 px-2">{product.platform}</td>
                      <td className="py-4 px-2 text-white font-semibold">
                        {product.growth}
                      </td>
                      <td className="py-4 px-2">{product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-6">
            <h3 className="text-xl mb-6">Market Distribution</h3>
            <DonutChart />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900/30 px-8 py-16" id="features">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4">
            Powerful <span className="text-white">Features</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to identify opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800/60 rounded-lg p-8 hover:translate-y-[-5px] transition-transform">
            <Search className="text-white w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Market Discovery</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Identify emerging product trends
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 hover:translate-y-[-5px] transition-transform">
            <BarChart2 className="text-white w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Data Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Comprehensive data analysis
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 hover:translate-y-[-5px] transition-transform">
            <AlertCircle className="text-white w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Smart Alerts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get notified about trends
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 hover:translate-y-[-5px] transition-transform">
            <Activity className="text-white w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Competitor Tracking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Monitor competitors
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 hover:translate-y-[-5px] transition-transform">
            <TrendingUp className="text-white w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Trend Forecasting</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered predictions
            </p>
          </div>
          <div className="bg-gray-800/60 rounded-lg p-8 hover:translate-y-[-5px] transition-transform">
            <Users className="text-white w-8 h-8 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Multi-User Access</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Collaborate with your team
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-16">
        <div className="border border-gray-600/30 rounded-lg p-16 text-center max-w-6xl mx-auto relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)' }}>
          <h2 className="text-4xl font-extrabold mb-4 text-white">
            Ready to Discover the Next Big Thing?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of successful retailers
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-4">
            <button
              className="bg-white text-black font-bold px-8 py-4 rounded-lg hover:translate-y-[-2px] hover:shadow-[0_4px_20px_rgba(255,255,255,0.4)] transition-all"
              onClick={() => router.push("/access")}
            >
              14-Day Trial
            </button>
            <button className="bg-transparent text-white font-bold px-8 py-4 rounded-lg border border-white/50 hover:bg-white/10 hover:translate-y-[-2px] transition-all">
              Demo
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 px-8 pt-12 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto mb-8">
          <div className="flex items-center gap-2 font-bold text-xl mb-6 md:mb-0">
            <Layers className="text-white" />
            <span>StoreRadar</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-center md:text-left">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm pt-6 border-t border-white/10 max-w-6xl mx-auto">
          © {new Date().getFullYear()} StoreRadar. All rights reserved.
        </div>
      </footer>
    </div>
  );
}