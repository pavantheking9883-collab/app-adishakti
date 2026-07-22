'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Search, MapPin, Battery, Wifi, PhoneCall, ShieldCheck, AlertTriangle, Radio, RefreshCw, Volume2 } from 'lucide-react';

export default function FamilyPortal() {
  const [phoneQuery, setPhoneQuery] = useState('+919876543210');
  const [userSafetyData, setUserSafetyData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/safety/events');
      const data = await res.json();
      if (data.success && data.events.length > 0) {
        // Find matching event for phone query or return first active event
        const match = data.events.find((e: any) => e.user?.phone === phoneQuery) || data.events[0];
        setUserSafetyData(match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateBrowserIvrCall = () => {
    if (!userSafetyData) return;
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) {
      alert("Browser Speech Synthesis is not supported.");
      return;
    }
    const victimName = userSafetyData.user?.name || "User";
    const loc = userSafetyData.lastAddress || "Rajahmundry";
    const battery = userSafetyData.lastBattery || 80;
    
    const msg = `Attention! Adishakti safety portal emergency notification. Your family member, ${victimName}, is in distress. Last tracked location is ${loc}. Device battery is ${battery} percent. Please act immediately.`;
    
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 0.9;
    utterance.volume = 1;
    synth.speak(utterance);
    alert(`📞 Outbound Call Triggered! Playing dynamic audio stream for: ${victimName}`);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-900/40 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-fuchsia-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400">
              ADISHAKTI — Mothers &amp; Family Member Safety Portal
            </h1>
            <p className="text-xs text-slate-400">Realtime Family Location Tracking &amp; Guardian Status</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live Position</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
        {/* Search Bar */}
        <div className="bg-slate-900 border border-purple-900/50 rounded-2xl p-5 space-y-3 shadow-xl">
          <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
            Enter Daughter's / Family Member's Phone Number
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              placeholder="e.g. +919876543210"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-fuchsia-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Locate Family Member</span>
            </button>
          </div>
        </div>

        {/* Live Safety Status Display */}
        {userSafetyData ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            {/* Top Bar with Name & Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center font-black text-xl text-white">
                    {userSafetyData.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{userSafetyData.user?.name}</h2>
                    <p className="text-xs font-mono text-fuchsia-400">{userSafetyData.user?.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                {userSafetyData.type === 'RED' ? (
                  <span className="px-4 py-2 rounded-full bg-red-950 border border-red-500 text-red-400 font-black text-xs flex items-center space-x-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                    <span>EMERGENCY RED ALERT ACTIVE</span>
                  </span>
                ) : userSafetyData.type === 'WARNING' ? (
                  <span className="px-4 py-2 rounded-full bg-amber-950 border border-amber-500 text-amber-400 font-bold text-xs flex items-center space-x-2">
                    <Radio className="w-4 h-4" />
                    <span>WARNING TRIGGER MONITORING ON</span>
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 font-bold text-xs flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ALL SAFE • NORMAL STATUS</span>
                  </span>
                )}
              </div>
            </div>

            {/* Live GPS Coordinates Card */}
            <div className="bg-slate-950 border border-purple-900/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-300 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-fuchsia-400" />
                  <span>Current GPS Tracking Location</span>
                </span>
                <span className="font-mono text-fuchsia-400">Lat: {userSafetyData.lastLat}, Lng: {userSafetyData.lastLng}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col items-center justify-center text-center space-y-1">
                <MapPin className="w-8 h-8 text-fuchsia-500 animate-bounce" />
                <p className="text-sm font-bold text-white">{userSafetyData.lastAddress}</p>
                <p className="text-xs text-slate-400">Rajahmundry, Andhra Pradesh</p>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Battery className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">Device Battery Level</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">{userSafetyData.lastBattery}%</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-300">Network Telemetry</span>
                </div>
                <span className="text-xs font-bold text-blue-400">{userSafetyData.lastNetworkStatus}</span>
              </div>
            </div>

            {/* Consented Audio Player */}
            {userSafetyData.audioFlag && (
              <div className="bg-purple-950/40 border border-purple-500/40 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>Live Consented Emergency Audio Feed</span>
                  </span>
                  <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded font-mono">
                    Opt-in Consent Verified
                  </span>
                </div>
                <audio controls className="w-full h-9 rounded bg-slate-900 mt-1">
                  <source src={userSafetyData.audioUrl} type="audio/mp3" />
                  Audio playback not supported.
                </audio>
              </div>
            )}

            {/* Direct Guardian Action Button */}
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={simulateBrowserIvrCall}
                className="py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-extrabold rounded-xl transition text-xs shadow-lg shadow-fuchsia-950 flex items-center justify-center space-x-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 Play IVR Call Speech (Free Demo)</span>
              </button>
              <a
                href={`tel:${userSafetyData.user?.phone}`}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-xl transition text-xs shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {userSafetyData.user?.name} Directly</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 p-8 rounded-2xl text-center text-slate-400 text-sm">
            Searching location...
          </div>
        )}
      </div>
    </div>
  );
}
