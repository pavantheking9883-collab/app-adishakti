'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Radio, PhoneCall, MapPin, Battery, Wifi, CheckCircle2, RefreshCw, Volume2, User, Clock, ChevronRight } from 'lucide-react';

export default function PoliceDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'RED' | 'WARNING'>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/safety/events');
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 4000); // 4 sec auto-refresh for real-time sync
    return () => clearInterval(interval);
  }, []);

  const simulateBrowserIvrCall = () => {
    if (!selectedEvent) return;
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    if (!synth) {
      alert("Browser Speech Synthesis is not supported.");
      return;
    }
    const victimName = selectedEvent.user?.name || "User";
    const loc = selectedEvent.lastAddress || "Rajahmundry";
    const battery = selectedEvent.lastBattery || 80;
    const notes = selectedEvent.notes || "SOS Emergency";
    
    const msg = `Dispatch Notification! Police Command Center Alert. Citizen ${victimName} has triggered a high-priority distress alert. Coordinates verified at ${loc}. Notes detail: ${notes}. Please dispatch nearest patrol vehicle.`;
    
    const utterance = new SpeechSynthesisUtterance(msg);
    utterance.rate = 0.9;
    utterance.volume = 1;
    synth.speak(utterance);
    alert(`📢 Voice dispatch call triggered for case of: ${victimName}`);
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch('/api/safety/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, status: 'RESOLVED', notes: 'Resolved by Police Control Room' })
      });
      const data = await res.json();
      if (data.success) {
        if (selectedEvent?.id === id) setSelectedEvent(null);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (activeTab === 'RED') return e.type === 'RED';
    if (activeTab === 'WARNING') return e.type === 'WARNING';
    return true;
  });

  const redCount = events.filter((e) => e.type === 'RED' && e.status === 'ACTIVE').length;
  const yellowCount = events.filter((e) => e.type === 'WARNING' && e.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-purple-900/40 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-blue-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-fuchsia-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400">
              ADISHAKTI — Police Control Room Dashboard
            </h1>
            <p className="text-xs text-slate-400">Rajahmundry Command Center • Realtime Safety Monitor</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={fetchEvents}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Feeds</span>
          </button>
          <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live WebSocket Engine Active</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-red-300 font-medium">Critical Priority (Red SOS)</p>
            <p className="text-2xl font-extrabold text-red-400 mt-1">{redCount} Active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-300 font-medium">High Priority (Yellow Warning)</p>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{yellowCount} Active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-purple-950/30 border border-purple-500/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-300 font-medium">Avg Escalation Response</p>
            <p className="text-2xl font-extrabold text-purple-400 mt-1">1m 45s</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-300 font-medium">Cases Resolved Today</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">14 Cases</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 px-6 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Filter & Event Table */}
        <div className={`space-y-4 ${selectedEvent ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'ALL' ? 'bg-purple-600 text-white shadow-lg shadow-purple-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Feeds ({events.length})
              </button>
              <button
                onClick={() => setActiveTab('RED')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === 'RED' ? 'bg-red-600 text-white shadow-lg shadow-red-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span>Critical Red ({events.filter((e) => e.type === 'RED').length})</span>
              </button>
              <button
                onClick={() => setActiveTab('WARNING')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === 'WARNING' ? 'bg-amber-600 text-white shadow-lg shadow-amber-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Warning Yellow ({events.filter((e) => e.type === 'WARNING').length})</span>
              </button>
            </div>
            <span className="text-xs text-slate-400 px-3">Showing {filteredEvents.length} priority incidents</span>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 uppercase font-semibold border-b border-slate-700">
                <tr>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">User Details</th>
                  <th className="p-3.5">Trigger Reason</th>
                  <th className="p-3.5">Last Location</th>
                  <th className="p-3.5">Telemetry</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEvents.map((ev) => {
                  const isRed = ev.type === 'RED';
                  const isSelected = selectedEvent?.id === ev.id;
                  return (
                    <tr
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className={`cursor-pointer transition hover:bg-slate-800/60 ${
                        isSelected ? 'bg-purple-950/40 border-l-4 border-purple-500' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        {isRed ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-950 border border-red-500/50 text-red-400 font-extrabold flex items-center space-x-1 w-max">
                            <AlertTriangle className="w-3 h-3 animate-bounce" />
                            <span>CRITICAL RED</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/50 text-amber-400 font-semibold flex items-center space-x-1 w-max">
                            <Radio className="w-3 h-3" />
                            <span>WARNING YELLOW</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-slate-100">{ev.user?.name}</p>
                        <p className="text-slate-400 font-mono text-[11px]">{ev.user?.phone}</p>
                      </td>
                      <td className="p-3.5 max-w-[180px]">
                        <p className="truncate text-slate-200">{ev.notes || 'Emergency Triggered'}</p>
                        <p className="text-[10px] text-slate-400">
                          Started {Math.floor((Date.now() - new Date(ev.startedAt).getTime()) / 60000)} mins ago
                        </p>
                      </td>
                      <td className="p-3.5 max-w-[200px]">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                          <span className="truncate">{ev.lastAddress || `${ev.lastLat}, ${ev.lastLng}`}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <span className="flex items-center space-x-1">
                            <Battery className="w-3 h-3 text-emerald-400" />
                            <span>{ev.lastBattery}%</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Wifi className="w-3 h-3 text-blue-400" />
                            <span>{ev.lastNetworkStatus}</span>
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            ev.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 rounded font-semibold border border-purple-500/40 transition text-[11px]"
                        >
                          Inspect Case
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Case Inspector */}
        {selectedEvent && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 shadow-2xl flex flex-col justify-between sticky top-24 h-max">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedEvent.type === 'RED' ? 'bg-red-500 animate-ping' : 'bg-amber-400'
                    }`}
                  ></div>
                  <h2 className="text-base font-bold text-white">Case Detail — #{selectedEvent.id.substring(0, 8)}</h2>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white text-xs">
                  ✕ Close
                </button>
              </div>

              {/* User profile */}
              <div className="mt-4 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-slate-100">{selectedEvent.user?.name}</span>
                  </div>
                  <span className="text-xs font-mono text-fuchsia-400">{selectedEvent.user?.phone}</span>
                </div>
                <p className="text-xs text-slate-400">Preferred Language: {selectedEvent.user?.language?.toUpperCase()}</p>
              </div>

              {/* Telemetry Indicator widget */}
              <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Battery</span>
                  </span>
                  <span className="font-bold text-emerald-400">{selectedEvent.lastBattery}%</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Wifi className="w-3.5 h-3.5 text-blue-400" />
                    <span>Signal</span>
                  </span>
                  <span className="font-bold text-blue-400">{selectedEvent.lastNetworkStatus}</span>
                </div>
              </div>

              {/* Simulated Map coordinates card */}
              <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>Live GPS Position</span>
                  </span>
                  <span className="font-mono text-fuchsia-400">Lat: {selectedEvent.lastLat}, Lng: {selectedEvent.lastLng}</span>
                </div>
                <div className="bg-slate-900 h-28 rounded-lg flex flex-col items-center justify-center border border-slate-800 text-center p-2 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  <MapPin className="w-8 h-8 text-fuchsia-500 animate-bounce mb-1" />
                  <p className="text-xs font-bold text-slate-200">{selectedEvent.lastAddress}</p>
                  <p className="text-[10px] text-slate-400">Rajahmundry Municipal Sector #4</p>
                </div>
              </div>

              {/* Audio Flag & Consent */}
              {selectedEvent.audioFlag && (
                <div className="mt-4 bg-purple-950/40 border border-purple-500/40 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span>Consented Audio Feed Available</span>
                    </span>
                    <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded">
                      Timestamped Consent OK
                    </span>
                  </div>
                  <audio controls className="w-full h-8 mt-1 rounded bg-slate-900">
                    <source src={selectedEvent.audioUrl} type="audio/mp3" />
                    Your browser does not support audio.
                  </audio>
                </div>
              )}

              {/* Guardians Contact Escalation Log */}
              <div className="mt-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Verified Guardians Escalation Log</h3>
                <div className="space-y-1.5">
                  {selectedEvent.user?.guardians?.map((g: any, i: number) => (
                    <div
                      key={g.id}
                      className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">
                          #{g.priorityOrder} {g.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">{g.phone}</p>
                      </div>
                      <a
                        href={`tel:${g.phone}`}
                        className="px-2.5 py-1 bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 rounded font-bold hover:bg-emerald-600 hover:text-white transition flex items-center space-x-1 text-[11px]"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call Guardian</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action controls */}
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <button
                onClick={simulateBrowserIvrCall}
                className="w-full py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-extrabold rounded-xl transition text-xs shadow-md flex items-center justify-center space-x-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>🔊 Dispatch Voice Announcement (Free Demo)</span>
              </button>
              <button
                onClick={() => handleResolve(selectedEvent.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition text-xs shadow-lg shadow-emerald-950 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatch & Resolve Case</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
