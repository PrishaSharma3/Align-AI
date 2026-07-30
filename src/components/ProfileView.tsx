import React, { useState } from 'react';
import { Goal, Commitment } from '../types';
import { User, Calendar, Settings, Shield, Bell, Moon, Sun, Sparkles, Check, ChevronRight } from 'lucide-react';

interface ProfileViewProps {
  goals: Goal[];
  commitments: Commitment[];
}

export default function ProfileView({ goals, commitments }: ProfileViewProps) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [adaptiveSuggest, setAdaptiveSuggest] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 shrink-0">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Account Settings</span>
        <h3 className="text-2xl font-bold font-display text-slate-950 mt-1">
          Your Profile
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        
        {/* User Card */}
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            PS
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">Prisha Sharma</h4>
            <p className="text-[10px] text-slate-400 font-mono">prisha.sharma@alumni.ipl.university</p>
          </div>
        </div>

        {/* Integration Status Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connected Services</h5>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs">
                G
              </div>
              <div>
                <h6 className="text-[11px] font-bold text-slate-900">Google Calendar</h6>
                <p className="text-[9px] text-slate-400">Synced: 5 lectures & meetings imported</p>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
              Connected
            </span>
          </div>
        </div>

        {/* Active Configurations */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Architecture</h5>
          
          <div className="space-y-2">
            {/* Goals summary */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-900">Tracked Habits & Goals</span>
                <p className="text-[9px] text-slate-400">{goals.length} target goals configured</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
            </div>

            {/* Commitments summary */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-900">Recurring Commitments</span>
                <p className="text-[9px] text-slate-400">{commitments.length} off-calendar commitment routines</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
            </div>
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prototype Controls</h5>
          
          <div className="space-y-3.5">
            {/* Toggle 1: Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-800">Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-250 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
              </label>
            </div>

            {/* Toggle 2: Adaptive Suggest */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-800">Real-time Adaptation Suggestions</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={adaptiveSuggest} 
                  onChange={(e) => setAdaptiveSuggest(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-250 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
              </label>
            </div>

            {/* Toggle 3: Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {darkMode ? <Moon className="w-4 h-4 text-slate-400" /> : <Sun className="w-4 h-4 text-slate-400" />}
                <span className="text-[11px] font-semibold text-slate-800">Mock Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-250 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Brand footer */}
        <div className="text-center pt-2">
          <p className="text-[9px] font-mono text-slate-400">Align AI v1.0.0 Stable Build</p>
          <p className="text-[8px] text-slate-300 mt-0.5">Encrypted with Google Cloud Security Standards</p>
        </div>

      </div>
    </div>
  );
}
