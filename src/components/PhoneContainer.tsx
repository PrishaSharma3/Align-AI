import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
}

export default function PhoneContainer({ children }: PhoneContainerProps) {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center py-8 px-4 overflow-auto font-sans relative">
      {/* Ambient glowing blobs in background for professional designer presentation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col items-center">
        {/* Decorative branding info above the chassis */}
        <div className="text-center mb-6">
          <h1 className="text-white text-2xl font-bold font-display tracking-tight flex items-center justify-center gap-2">
            ✨ Align AI
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            AI-Powered Adaptive Weekly Planner Prototype • Mobile Only Context
          </p>
        </div>

        {/* Dynamic device chassis */}
        <div 
          className="relative w-[390px] h-[844px] bg-[#F8FAFC] text-slate-800 shadow-2xl rounded-[48px] border-[12px] border-slate-900 overflow-hidden flex flex-col"
          style={{ contentVisibility: 'auto' }}
          id="phone-frame"
        >
          {/* iOS Dynamic Island / Sensor Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-[30px] bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
            {/* Tiny camera lens reflection */}
            <div className="w-2.5 h-2.5 bg-slate-850 rounded-full absolute right-6 border border-slate-800"></div>
          </div>

          {/* iOS Status Bar */}
          <div className="h-[44px] px-6 pt-3 flex items-center justify-between text-xs font-semibold select-none z-40 bg-transparent text-slate-900">
            {/* Live Clock */}
            <span className="font-sans text-[13px] tracking-tight">{time}</span>
            
            {/* Hardware Status Indicators */}
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
          </div>

          {/* Core App View Container */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-[#F8FAFC]">
            {children}
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="h-[24px] w-full flex items-center justify-center bg-transparent z-40 pointer-events-none select-none shrink-0">
            <div className="w-[120px] h-[4.5px] bg-slate-800/40 rounded-full"></div>
          </div>
        </div>

        {/* Key instructions / hints below */}
        <div className="mt-4 text-slate-400 text-[11px] text-center max-w-[350px] leading-relaxed">
          💡 Swipe/Click through the onboarding flow to generate your AI planner. Use <span className="text-white font-semibold">✨ Update My Day</span> to simulate real life changes in real-time.
        </div>
      </div>
    </div>
  );
}
