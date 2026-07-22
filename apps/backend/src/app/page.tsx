import Link from 'next/link';
import { Shield, Building2, Smartphone, Heart, ArrowRight, Activity, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-8">
      {/* Brand Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-purple-900/40 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-blue-500 p-0.5 shadow-xl shadow-purple-950">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-fuchsia-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400">
              ADISHAKTI — Multilingual Platform Portals
            </h1>
            <p className="text-xs text-slate-400">Quantex Intelligence Systems Pvt Ltd • Rajahmundry, AP</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-purple-950/60 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-full text-xs font-semibold">
          <Cpu className="w-4 h-4 text-fuchsia-400 animate-pulse" />
          <span>All 4 Stakeholder Portals Live</span>
        </div>
      </header>

      {/* Hero Body */}
      <main className="max-w-6xl mx-auto w-full py-12 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Safety Engine &amp; Multilingual Stakeholder Portals
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            "We don't sell fear — we sell everyday utility. Safety is the seatbelt, not the sales pitch."
          </p>
        </div>

        {/* 4 Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Portal 1: Women Consumer Web App */}
          <Link href="/user">
            <div className="group bg-slate-900 border border-purple-900/50 hover:border-fuchsia-500/80 rounded-2xl p-6 transition duration-300 shadow-2xl hover:shadow-fuchsia-950/30 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-400 transition">
                  Women User Web App
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Centerpiece "I AM SAFE" button, Warning Trigger (Yellow), Red SOS, AP Schemes, AI Interview &amp; SHG Market.
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-fuchsia-400 group-hover:translate-x-2 transition">
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </Link>

          {/* Portal 2: Mothers & Family Portal */}
          <Link href="/family">
            <div className="group bg-slate-900 border border-purple-900/50 hover:border-purple-500/80 rounded-2xl p-6 transition duration-300 shadow-2xl hover:shadow-purple-950/30 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition">
                  Mothers &amp; Family Portal
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Realtime daughter location tracking, battery level, network status, audio feeds, and direct emergency call.
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-purple-400 group-hover:translate-x-2 transition">
                <span>Track Family</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </Link>

          {/* Portal 3: Police Dashboard */}
          <Link href="/police">
            <div className="group bg-slate-900 border border-purple-900/50 hover:border-red-500/80 rounded-2xl p-6 transition duration-300 shadow-2xl hover:shadow-red-950/30 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition">
                  Police Control Room
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time WebSocket monitoring feed for Critical Red SOS and Warning events with GPS map coordinates.
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-red-400 group-hover:translate-x-2 transition">
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </Link>

          {/* Portal 4: Corporate Portal */}
          <Link href="/corporate">
            <div className="group bg-slate-900 border border-purple-900/50 hover:border-indigo-500/80 rounded-2xl p-6 transition duration-300 shadow-2xl hover:shadow-indigo-950/30 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                  B2B Corporate POSH Portal
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Night-shift employee transport GPS auto-log, digital consent capture, ICC tracking &amp; annual PDF export.
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-indigo-400 group-hover:translate-x-2 transition">
                <span>Open HR Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full border-t border-slate-900 pt-6 flex items-center justify-between text-xs text-slate-500">
        <p>© 2026 Quantex Intelligence Systems Pvt Ltd. All rights reserved.</p>
        <p>Rajahmundry, Andhra Pradesh, India</p>
      </footer>
    </div>
  );
}
