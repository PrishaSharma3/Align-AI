import React, { useState } from 'react';
import { CalendarEvent, Goal } from '../types';
import { COLORS } from '../data';
import { Check, X, Calendar, RefreshCw, Sparkles, BookOpen, Dumbbell, Code, Play } from 'lucide-react';

interface TodayViewProps {
  events: CalendarEvent[];
  goals: Goal[];
  onCompleteEvent: (id: string) => void;
  onSkipEvent: (id: string) => void;
  onRescheduleEvent: (event: CalendarEvent) => void;
}

export default function TodayView({ events, goals, onCompleteEvent, onSkipEvent, onRescheduleEvent }: TodayViewProps) {
  // We'll set "Today" as Monday to let users interact with the exact spec example:
  // College, Internship, and Reading
  const [todayDay, setTodayDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');

  const todayEvents = events.filter(e => e.day === todayDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Calculate day completion progress
  const goalsAndFlexComm = todayEvents.filter(e => e.type === 'goal' || e.type === 'commitment');
  const completedCount = goalsAndFlexComm.filter(e => e.completed).length;
  const totalCount = goalsAndFlexComm.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  const getIconForEvent = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('gym') || t.includes('workout')) return <Dumbbell className="w-4 h-4 text-emerald-600" />;
    if (t.includes('read') || t.includes('atomic')) return <BookOpen className="w-4 h-4 text-emerald-600" />;
    if (t.includes('project') || t.includes('ai')) return <Code className="w-4 h-4 text-emerald-600" />;
    return <Sparkles className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 shrink-0">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Today's Focus</span>
        <div className="flex items-center justify-between mt-1">
          <h3 className="text-2xl font-bold font-display text-slate-950">
            {todayDay === 'Monday' ? 'Monday, July 7' : 'Tuesday, July 8'}
          </h3>
          <select 
            value={todayDay}
            onChange={(e: any) => setTodayDay(e.target.value)}
            className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl outline-none border-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="Monday">Monday (Active Demo)</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        
        {/* Dynamic Daily Progress Ring Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 font-display">Daily Habit Velocity</h4>
            <p className="text-[10px] text-slate-400 font-medium">
              {completedCount} of {totalCount} non-calendar sessions completed
            </p>
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg w-fit">
              <Sparkles className="w-3 h-3 text-indigo-600 fill-indigo-200/20" />
              <span className="text-[9px] font-bold text-indigo-700">On Track For Weekly Streak</span>
            </div>
          </div>

          {/* Simple Radial Circle Progress bar */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="#F1F5F9" strokeWidth="4.5" fill="transparent" />
              <circle cx="28" cy="28" r="23" stroke="#4F46E5" strokeWidth="4.5" fill="transparent"
                strokeDasharray={144.5}
                strokeDashoffset={144.5 - (144.5 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-slate-800">{progressPercent}%</span>
          </div>
        </div>

        {/* Priorities list */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Today's Schedule</p>
          
          {todayEvents.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
              Your schedule is completely clear for today.
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((evt) => {
                const style = COLORS[evt.type] || COLORS.gcal;
                const isActionable = evt.type === 'goal' || (evt.type === 'commitment' && evt.flex);
                
                return (
                  <div 
                    key={evt.id} 
                    className={`bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                      evt.completed ? 'opacity-80 border-slate-200' : ''
                    }`}
                  >
                    {/* Color Left Indicator strip */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${style.indicator}`}></div>

                    <div className="flex items-start justify-between gap-2.5">
                      <div className="space-y-1 pl-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                            {evt.startTime} - {evt.endTime}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${style.bg}`}>
                            {evt.type === 'gcal' ? 'Calendar' : evt.type === 'commitment' ? 'Commitment' : 'AI Goal'}
                          </span>
                        </div>

                        <h5 className={`text-xs font-bold text-slate-900 flex items-center gap-1.5 ${evt.completed ? 'line-through text-slate-400' : ''}`}>
                          {evt.type === 'goal' && getIconForEvent(evt.title)}
                          {evt.title}
                        </h5>
                        
                        {evt.description && (
                          <p className="text-[10px] text-slate-400 leading-normal">{evt.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Interactive Action Buttons for Goals and Commitments */}
                    {isActionable && !evt.completed && (
                      <div className="flex items-center justify-end gap-2 mt-3.5 pt-3 border-t border-slate-50">
                        <button
                          id={`btn-skip-${evt.id}`}
                          onClick={() => onSkipEvent(evt.id)}
                          className="flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-[10px] font-semibold text-slate-500 transition-all active:scale-95"
                        >
                          <X className="w-3 h-3 text-slate-400" />
                          Skip
                        </button>
                        <button
                          id={`btn-resched-${evt.id}`}
                          onClick={() => onRescheduleEvent(evt)}
                          className="flex items-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-[10px] font-semibold text-slate-500 transition-all active:scale-95"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-400" />
                          Reschedule
                        </button>
                        <button
                          id={`btn-complete-${evt.id}`}
                          onClick={() => onCompleteEvent(evt.id)}
                          className="flex items-center gap-1 py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold text-white shadow-sm shadow-emerald-100 transition-all active:scale-95"
                        >
                          <Check className="w-3 h-3" />
                          Complete
                        </button>
                      </div>
                    )}

                    {evt.completed && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold justify-end mt-2 pt-2 border-t border-slate-50">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Done for today! Streak maintained</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivational Prompt Card */}
        <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md shadow-indigo-100 relative overflow-hidden">
          {/* Decorative glowing circles inside the banner */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl"></div>

          <div className="relative z-10 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-200 fill-indigo-200/10" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold font-display">Adaptable Thinking</h5>
              <p className="text-[10px] text-indigo-100 leading-normal">
                Life changes fast. Instead of manually editing calendars or feeling guilty, tap <strong>✨ Update My Day</strong> to tell Align AI any changes. We'll realign everything in under 5 seconds.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
