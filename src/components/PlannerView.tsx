import React, { useState } from 'react';
import { CalendarEvent, Goal, Commitment } from '../types';
import { COLORS } from '../data';
import { Calendar, ChevronRight, Clock, Sparkles, AlertCircle, LayoutGrid, List } from 'lucide-react';

interface PlannerViewProps {
  events: CalendarEvent[];
  goals: Goal[];
  commitments: Commitment[];
  onSelectEvent?: (event: CalendarEvent) => void;
}

const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'> = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function PlannerView({ events, goals, commitments, onSelectEvent }: PlannerViewProps) {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week'); // Default to full week to show the entire planned calendar

  const getDayEvents = (day: string) => {
    return events.filter(e => e.day === day).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const getEventStyle = (type: 'gcal' | 'commitment' | 'goal') => {
    return COLORS[type] || COLORS.gcal;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-1.5">
            Weekly Planner
          </h3>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">WEEK OF JULY 7, 2026</p>
        </div>

        {/* AI Optimized Pill Badge */}
        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full animate-pulse-slow">
          <Sparkles className="w-3 h-3 fill-emerald-500/20" />
          <span className="text-[10px] font-bold tracking-tight">AI Balanced</span>
        </div>
      </div>

      {/* Sub-Header with layout switcher */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex gap-1 bg-slate-200 p-1 rounded-xl">
          <button
            id="btn-view-week"
            onClick={() => setViewMode('week')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              viewMode === 'week' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Full Week
          </button>
          <button
            id="btn-view-day"
            onClick={() => setViewMode('day')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              viewMode === 'day' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Timeline
          </button>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          {events.length} block sessions total
        </span>
      </div>

      {/* VIEW 1: FULL WEEK BENTO CARDS OVERVIEW (Screen 6 spec example) */}
      {viewMode === 'week' && (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {DAYS.map((day) => {
            const dayEvents = getDayEvents(day);
            return (
              <div 
                key={day} 
                onClick={() => {
                  setSelectedDay(day);
                  setViewMode('day');
                }}
                className="bg-white rounded-2xl border border-slate-100 p-3.5 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold font-display text-slate-900 flex items-center gap-1.5">
                    {day}
                    {day === 'Monday' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                  </h4>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>

                {dayEvents.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No scheduled activities. AI kept this day open.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {dayEvents.map((evt) => {
                      const style = getEventStyle(evt.type);
                      return (
                        <div 
                          key={evt.id}
                          className={`text-[10px] px-2.5 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 ${style.bg}`}
                          title={evt.description}
                        >
                          {/* Left dot color indicator */}
                          <span className={`w-1.5 h-1.5 rounded-full ${style.indicator}`}></span>
                          <span className="font-semibold truncate max-w-[120px]">{evt.title}</span>
                          <span className="text-[9px] font-mono opacity-85">{evt.startTime}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: DETAILED DAILY TIMELINE */}
      {viewMode === 'day' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Horizontal Day Selector strip */}
          <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0">
            {DAYS.map((day) => {
              const active = selectedDay === day;
              const hasEvents = getDayEvents(day).length > 0;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl min-w-[50px] transition-all shrink-0 ${
                    active 
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-100' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider font-medium opacity-80">{day.substring(0, 3)}</span>
                  <span className="text-xs font-bold">{day === 'Monday' ? '7' : day === 'Tuesday' ? '8' : day === 'Wednesday' ? '9' : day === 'Thursday' ? '10' : day === 'Friday' ? '11' : day === 'Saturday' ? '12' : '13'}</span>
                  {hasEvents && !active && <span className="w-1 h-1 rounded-full bg-slate-400"></span>}
                </button>
              );
            })}
          </div>

          {/* Timeline details */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{selectedDay}'s Schedule</h4>
            
            {getDayEvents(selectedDay).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-semibold text-slate-900">Entirely Free Day</h5>
                <p className="text-[10px] text-slate-400 max-w-[180px] mt-1">No commitments or goal sessions scheduled. Enjoy your day off!</p>
              </div>
            ) : (
              <div className="space-y-3 relative border-l border-slate-200 pl-4 ml-2">
                {getDayEvents(selectedDay).map((evt) => {
                  const style = getEventStyle(evt.type);
                  return (
                    <div 
                      key={evt.id} 
                      className={`relative bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all-custom cursor-pointer`}
                      onClick={() => onSelectEvent?.(evt)}
                    >
                      {/* Timeline point indicator */}
                      <span className={`absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white ring-2 ring-slate-100 ${style.indicator}`}></span>
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${style.bg}`}>
                              {evt.type === 'gcal' ? 'Google Calendar' : evt.type === 'commitment' ? 'Commitment' : 'AI Planned Goal'}
                            </span>
                            {evt.completed && (
                              <span className="text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                Completed
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 leading-tight">{evt.title}</h5>
                          {evt.description && (
                            <p className="text-[10px] text-slate-400 mt-1">{evt.description}</p>
                          )}
                        </div>
                        <span className="text-xs font-mono text-slate-500 font-medium shrink-0 bg-slate-50 px-2 py-1 rounded-lg">
                          {evt.startTime} - {evt.endTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Visual Key */}
      <div className="px-5 py-3 bg-white border-t border-slate-100 flex items-center justify-between shrink-0 text-[10px] text-slate-500 font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>Google Cal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Commitment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>AI Goals</span>
        </div>
      </div>
    </div>
  );
}
