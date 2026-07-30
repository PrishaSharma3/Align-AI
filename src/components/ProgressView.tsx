import React from 'react';
import { Goal } from '../types';
import { Trophy, Award, TrendingUp, Sparkles, BookOpen, Dumbbell, Code, Flame, ArrowRight } from 'lucide-react';

interface ProgressViewProps {
  goals: Goal[];
}

export default function ProgressView({ goals }: ProgressViewProps) {
  // Let's create visual mock stats matching the exact specification:
  // Reading: 2 / 3
  // Gym: 3 / 3
  // AI Project: 4 / 5 Hours
  const mockWeeklyStats = [
    {
      id: 'stat-1',
      name: 'Read Atomic Habits',
      completed: 2,
      total: 3,
      unit: 'sessions',
      color: 'bg-indigo-600',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      tag: 'On Track'
    },
    {
      id: 'stat-2',
      name: 'Gym Workout',
      completed: 3,
      total: 3,
      unit: 'workouts',
      color: 'bg-emerald-500',
      icon: <Dumbbell className="w-4 h-4 text-emerald-600" />,
      tag: 'Completed!'
    },
    {
      id: 'stat-3',
      name: 'Build AI Project',
      completed: 4,
      total: 5,
      unit: 'hours',
      color: 'bg-amber-500',
      icon: <Code className="w-4 h-4 text-amber-600" />,
      tag: '90% done'
    }
  ];

  const achievements = [
    {
      id: 'ach-1',
      title: 'Optimal Alignment',
      desc: 'Accepted 3 AI suggestions and successfully realigned week.',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'ach-2',
      title: 'Habit Catalyst',
      desc: 'Completed all gym workout sessions 2 weeks in a row.',
      icon: <Flame className="w-4 h-4 text-orange-500" />
    },
    {
      id: 'ach-3',
      title: 'Time Architect',
      desc: 'Spent less than 3 minutes planning your entire weekly schedule.',
      icon: <Trophy className="w-4 h-4 text-indigo-500" />
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 shrink-0">
        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Analytics Dashboard</span>
        <h3 className="text-2xl font-bold font-display text-slate-950 mt-1">
          Your Progress
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        
        {/* Weekly Completion Summary */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Weekly Goal Completion</p>
          
          <div className="space-y-3">
            {mockWeeklyStats.map((stat) => {
              const progress = Math.round((stat.completed / stat.total) * 100);
              return (
                <div key={stat.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                        {stat.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">{stat.name}</h4>
                        <span className="text-[9px] text-slate-400 font-mono tracking-tight capitalize">
                          Streak Metric: {stat.completed} / {stat.total} {stat.unit}
                        </span>
                      </div>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      stat.completed === stat.total 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-indigo-50 text-indigo-700'
                    }`}>
                      {stat.tag}
                    </span>
                  </div>

                  {/* Elegant micro-progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${stat.color}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-bold font-mono text-slate-400">
                      <span>{progress}%</span>
                      <span>Target: {stat.total} {stat.unit}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlocked Achievements Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Aesthetic Achievements</p>
            <span className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5 cursor-pointer">
              All badges <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="space-y-2">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {ach.icon}
                </div>
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-bold text-slate-900">{ach.title}</h5>
                  <p className="text-[9px] text-slate-400 leading-normal">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive AI Analytics Insight Card */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 shadow-sm flex gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-emerald-900 font-display">Weekly AI Velocity Insight</h5>
            <p className="text-[10px] text-emerald-700 leading-normal">
              You saved approximately <strong>22 minutes</strong> this week by letting Align automatically restructure around your dentist appointment and social birthdays. Goal completion velocity is up 12% compared to last week.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
