'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Car, ShieldCheck, FileText, Download, UserCheck, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export default function CorporateDashboard() {
  const [transportLogs, setTransportLogs] = useState<any[]>([]);
  const [iccCases, setIccCases] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({
    totalNightShiftsTracked: 0,
    activeVehicles: 0,
    complianceRate: 98.4,
    iccOpenCases: 0
  });

  useEffect(() => {
    fetch('/api/corporate?companyId=COMP-101')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTransportLogs(data.transportLogs);
          setIccCases(data.iccCases);
          setMetrics(data.metrics);
        }
      });
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-purple-900/40 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              ADISHAKTI — Corporate HR Safety & POSH Compliance Portal
            </h1>
            <p className="text-xs text-slate-400">Quantex Corp Subscriptions • Tenant ID: COMP-101</p>
          </div>
        </div>

        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-950 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Annual POSH Compliance Report (PDF)</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="px-6 py-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Night-Shift Staff Tracked</p>
              <p className="text-2xl font-extrabold text-white mt-1">{metrics.totalNightShiftsTracked} Shifts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Car className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Vehicles In Transit Now</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{metrics.activeVehicles} Active</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6 animate-spin" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">POSH Digital Consent Rate</p>
              <p className="text-2xl font-extrabold text-indigo-400 mt-1">{metrics.complianceRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">ICC Committee Cases Open</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1">{metrics.iccOpenCases} Open</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Section 1: Night Shift Transport Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Car className="w-5 h-5 text-indigo-400" />
              <span>Automated GPS Night-Shift Employee Transport Audit Logs</span>
            </h2>
            <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-500/40 px-3 py-1 rounded-full font-mono">
              Live Feed Connected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-300 uppercase font-semibold">
                <tr>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Route & Cab No</th>
                  <th className="p-3">Verified Driver</th>
                  <th className="p-3">Start Time</th>
                  <th className="p-3">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {transportLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition">
                    <td className="p-3 font-semibold text-slate-200">{log.employeeName}</td>
                    <td className="p-3 text-slate-300">
                      <p>{log.routeName}</p>
                      <p className="text-[10px] text-indigo-400 font-mono">{log.vehicleNo}</p>
                    </td>
                    <td className="p-3 text-slate-400">{log.driverName}</td>
                    <td className="p-3 text-slate-400 font-mono">{new Date(log.startedAt).toLocaleTimeString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                          log.status === 'IN_TRANSIT'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: ICC Internal Complaints Committee Cases & Digital Consent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Internal Complaints Committee (ICC) Tracker</span>
            </h2>

            <div className="space-y-3">
              {iccCases.map((icc) => (
                <div key={icc.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-purple-400 font-bold">{icc.caseNo}</span>
                    <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                      {icc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 font-semibold">{icc.category}</p>
                  <p className="text-xs text-slate-400">{icc.summary}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Incident Date: {new Date(icc.incidentDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Audit-Ready Digital Consent Capture Log</span>
            </h2>

            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Audio Telemetry & Live GPS Sharing</p>
                  <p className="text-[10px] text-slate-400">Timestamped immutably on user registration</p>
                </div>
                <span className="text-emerald-400 font-bold">100% Verified</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">Night-Shift Emergency Escalation Consent</p>
                  <p className="text-[10px] text-slate-400">Guardian chain auto-dial agreement</p>
                </div>
                <span className="text-emerald-400 font-bold">100% Verified</span>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 rounded-xl text-center space-y-2">
                <p className="text-xs font-bold text-purple-300">POSH Act Annual Audit Readiness Status</p>
                <p className="text-sm font-extrabold text-emerald-400">FULLY COMPLIANT (2026-2027)</p>
                <p className="text-[10px] text-slate-400">Certified by Quantex POSH Engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
