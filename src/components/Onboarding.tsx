import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Check, Plus, Trash2, ArrowRight, Sparkles, BookOpen, Code, Trophy, Dumbbell } from 'lucide-react';
import { CalendarEvent, Commitment, Goal } from '../types';
import { INITIAL_GCAL_EVENTS, SUGGESTED_COMMITMENTS, SUGGESTED_GOALS } from '../data';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (data: {
    gcalEvents: CalendarEvent[];
    commitments: Commitment[];
    goals: Goal[];
  }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  
  // State for GCal Connect
  const [gcalSelected, setGcalSelected] = useState<boolean>(true);
  const [importedGcalEvents, setImportedGcalEvents] = useState<CalendarEvent[]>(INITIAL_GCAL_EVENTS);

  // State for Commitments
  const [commitments, setCommitments] = useState<Commitment[]>([
    {
      id: 'comm-init-1',
      name: 'Internship',
      type: 'flexible',
      requiredHours: 3
    }
  ]);
  const [newCommName, setNewCommName] = useState('');
  const [newCommType, setNewCommType] = useState<'fixed' | 'flexible'>('flexible');
  const [newCommDay, setNewCommDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [newCommStart, setNewCommStart] = useState('15:00');
  const [newCommEnd, setNewCommEnd] = useState('18:00');
  const [newCommHours, setNewCommHours] = useState<number>(3);

  // State for Goals
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'goal-init-1',
      name: 'Read Atomic Habits',
      targetDate: '',
      sessionsPerWeek: 3,
      durationPerSession: 1,
      completedSessions: 0,
      totalSessions: 3
    },
    {
      id: 'goal-init-2',
      name: 'Build AI Project',
      targetDate: '',
      sessionsPerWeek: 2,
      durationPerSession: 2,
      completedSessions: 0,
      totalSessions: 2
    },
    {
      id: 'goal-init-3',
      name: 'Gym Workout',
      targetDate: '',
      sessionsPerWeek: 3,
      durationPerSession: 1.5,
      completedSessions: 0,
      totalSessions: 3
    }
  ]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');
  const [newGoalSessions, setNewGoalSessions] = useState<number>(3);
  const [newGoalDuration, setNewGoalDuration] = useState<number>(1);

  // Loading animation messages
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const loadingMessages = [
    "Reading your calendar...",
    "Understanding your commitments...",
    "Finding available time...",
    "Building your weekly schedule..."
  ];

  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setLoadingMsgIdx((prev) => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Completed, proceed to main experience
            setTimeout(() => {
              onComplete({
                gcalEvents: gcalSelected ? importedGcalEvents : [],
                commitments,
                goals: goals.map(g => ({
                  ...g,
                  // Estimate target date if blank
                  estimatedDate: g.targetDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                }))
              });
            }, 1000);
            return prev;
          }
        });
      }, 1100);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Handlers for Commitments
  const handleAddCommitment = () => {
    if (!newCommName.trim()) return;
    const item: Commitment = {
      id: `comm-custom-${Date.now()}`,
      name: newCommName,
      type: newCommType,
      ...(newCommType === 'fixed' 
        ? { day: newCommDay, startTime: newCommStart, endTime: newCommEnd }
        : { requiredHours: newCommHours }
      )
    };
    setCommitments([...commitments, item]);
    setNewCommName('');
  };

  const handleRemoveCommitment = (id: string) => {
    setCommitments(commitments.filter(c => c.id !== id));
  };

  // Handlers for Goals
  const handleAddGoal = () => {
    if (!newGoalName.trim()) return;
    const item: Goal = {
      id: `goal-custom-${Date.now()}`,
      name: newGoalName,
      targetDate: newGoalTargetDate,
      sessionsPerWeek: newGoalSessions,
      durationPerSession: newGoalDuration,
      completedSessions: 0,
      totalSessions: newGoalSessions
    };
    setGoals([...goals, item]);
    setNewGoalName('');
    setNewGoalTargetDate('');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleTogglePresetCommitment = (name: string, isFixed: boolean) => {
    const existing = commitments.find(c => c.name === name);
    if (existing) {
      setCommitments(commitments.filter(c => c.name !== name));
    } else {
      setCommitments([...commitments, {
        id: `comm-preset-${Date.now()}`,
        name,
        type: isFixed ? 'fixed' : 'flexible',
        ...(isFixed 
          ? { day: 'Monday', startTime: '17:00', endTime: '19:00' }
          : { requiredHours: 2 }
        )
      }]);
    }
  };

  const handleTogglePresetGoal = (name: string) => {
    const existing = goals.find(g => g.name === name);
    if (existing) {
      setGoals(goals.filter(g => g.name !== name));
    } else {
      setGoals([...goals, {
        id: `goal-preset-${Date.now()}`,
        name,
        targetDate: '',
        sessionsPerWeek: 3,
        durationPerSession: 1,
        completedSessions: 0,
        totalSessions: 3
      }]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC]">
      {/* Step Progress Dots (Except splash & loading) */}
      {step > 1 && step < 5 && (
        <div className="flex items-center justify-center gap-1.5 py-4 shrink-0">
          {[2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Screen contents */}
      <div className="flex-1 px-6 flex flex-col overflow-y-auto pb-6">
        
        {/* SCREEN 1: SPLASH SCREEN */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-between py-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Pulsing beautiful logo */}
              <div className="w-20 h-20 bg-indigo-600 rounded-[28px] shadow-lg shadow-indigo-200 flex items-center justify-center relative mb-6">
                <div className="absolute inset-0 bg-indigo-500 rounded-[28px] animate-ping opacity-10"></div>
                <Sparkles className="w-10 h-10 text-white fill-indigo-200/20" />
              </div>
              
              <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 mb-2">
                Align AI
              </h2>
              
              <p className="text-indigo-600 font-medium text-sm px-4 py-1 bg-indigo-50 rounded-full mb-4">
                Adaptive Weekly Planner
              </p>
              
              <p className="text-slate-500 text-sm max-w-xs mt-2 font-medium leading-relaxed">
                "Plans that adapt as life changes."
              </p>
            </div>

            <div className="w-full space-y-3">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Zero Manual Scheduling</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Simply import commitments and goals. The AI does everything else.</p>
                  </div>
                </div>
              </div>

              <button
                id="btn-splash-start"
                onClick={() => setStep(2)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-6 rounded-2xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: CONNECT GOOGLE CALENDAR */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between py-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Step 1 of 3</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-950 leading-tight">
                Connect Calendar
              </h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                Sync existing commitments from Google Calendar so Align AI knows when you are busy.
              </p>

              {/* Mock Connect Action */}
              <div className="mt-5 border border-slate-200 bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">G</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">Google Calendar</h4>
                      <p className="text-[10px] text-slate-500">prisha.sharma@alumni.ipl.university</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      id="toggle-gcal"
                      type="checkbox" 
                      checked={gcalSelected} 
                      onChange={(e) => setGcalSelected(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {gcalSelected && (
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-2">Imported Events ({importedGcalEvents.length})</p>
                    {importedGcalEvents.map((evt) => (
                      <div key={evt.id} className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/50 text-blue-800">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="text-xs font-semibold">{evt.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-blue-600 bg-white/70 px-2 py-0.5 rounded-md">
                          {evt.day} {evt.startTime}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              id="btn-gcal-continue"
              onClick={() => setStep(3)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 mt-6 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCREEN 3: RECURRING COMMITMENTS */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Step 2 of 3</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-950 leading-tight">
                Recurring Commitments
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                "Not everything exists on your calendar." Add off-calendar routines below.
              </p>

              {/* Pre-populated Clickable Internship Demo Item */}
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Commitments</p>
                {commitments.length === 0 ? (
                  <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400">
                    No off-calendar commitments added.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                    {commitments.map((comm) => (
                      <div key={comm.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900">{comm.name}</h4>
                          <p className="text-[10px] text-slate-500 capitalize">
                            {comm.type === 'fixed' 
                              ? `Fixed • ${comm.day}s (${comm.startTime}-${comm.endTime})` 
                              : `Flexible • ${comm.requiredHours} hours/day`
                            }
                          </p>
                        </div>
                        <button 
                          onClick={() => handleRemoveCommitment(comm.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Commitment Card */}
              <div className="mt-4 border border-slate-200 bg-white rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Add Custom Commitment</span>
                
                <div className="mt-2 space-y-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Commitment Name</label>
                    <input 
                      id="input-comm-name"
                      type="text" 
                      placeholder="e.g. Internship, Family Business" 
                      value={newCommName}
                      onChange={(e) => setNewCommName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="btn-comm-type-fixed"
                      type="button"
                      onClick={() => setNewCommType('fixed')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        newCommType === 'fixed' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Fixed Time
                    </button>
                    <button
                      id="btn-comm-type-flexible"
                      type="button"
                      onClick={() => setNewCommType('flexible')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        newCommType === 'flexible' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Flexible (AI plans)
                    </button>
                  </div>

                  {newCommType === 'fixed' ? (
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <div>
                        <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">Day</label>
                        <select 
                          value={newCommDay} 
                          onChange={(e: any) => setNewCommDay(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-1 text-[10px] focus:outline-none focus:border-indigo-500 bg-white"
                        >
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">Start</label>
                        <input 
                          type="text" 
                          value={newCommStart}
                          onChange={(e) => setNewCommStart(e.target.value)}
                          placeholder="15:00"
                          className="w-full border border-slate-200 rounded-lg p-1 text-[10px] focus:outline-none focus:border-indigo-500 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">End</label>
                        <input 
                          type="text" 
                          value={newCommEnd}
                          onChange={(e) => setNewCommEnd(e.target.value)}
                          placeholder="18:00"
                          className="w-full border border-slate-200 rounded-lg p-1 text-[10px] focus:outline-none focus:border-indigo-500 text-center"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-slate-500">Required Hours / Day</label>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => setNewCommHours(Math.max(1, newCommHours - 1))}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold w-8 text-center">{newCommHours} hrs</span>
                        <button 
                          onClick={() => setNewCommHours(Math.min(12, newCommHours + 1))}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    id="btn-add-comm"
                    onClick={handleAddCommitment}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add commitment
                  </button>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="mt-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quick Examples</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'Family Business', isFixed: false },
                    { name: 'Sports Practice', isFixed: true },
                    { name: 'Volunteer Work', isFixed: false },
                    { name: 'Daily Commute', isFixed: true }
                  ].map((preset) => {
                    const isAdded = commitments.some(c => c.name === preset.name);
                    return (
                      <button
                        key={preset.name}
                        onClick={() => handleTogglePresetCommitment(preset.name, preset.isFixed)}
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                          isAdded 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              id="btn-commitments-continue"
              onClick={() => setStep(4)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* SCREEN 4: GOALS */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between py-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Trophy className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Step 3 of 3</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-950 leading-tight">
                What would you like to achieve?
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Align AI blocks off realistic times for your goals. No target date? We'll estimate.
              </p>

              {/* Active Goals list */}
              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Goals</p>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                  {goals.map((g) => (
                    <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-6 rounded bg-emerald-500"></div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900">{g.name}</h4>
                          <p className="text-[9px] text-slate-500">
                            {g.sessionsPerWeek} sessions/week • {g.durationPerSession}h per session
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveGoal(g.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Custom Goal Card */}
              <div className="mt-4 border border-slate-200 bg-white rounded-2xl p-4 shadow-sm">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Add Custom Goal</span>
                
                <div className="mt-2 space-y-2.5">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">Goal Name</label>
                    <input 
                      id="input-goal-name"
                      type="text" 
                      placeholder="e.g. Learn Guitar, Lose Weight" 
                      value={newGoalName}
                      onChange={(e) => setNewGoalName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-semibold text-slate-400 block mb-1">Sessions / Week</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={7}
                        value={newGoalSessions}
                        onChange={(e) => setNewGoalSessions(parseInt(e.target.value) || 1)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1 text-xs focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-semibold text-slate-400 block mb-1">Session Duration (h)</label>
                      <input 
                        type="number" 
                        step={0.5}
                        min={0.5} 
                        max={6}
                        value={newGoalDuration}
                        onChange={(e) => setNewGoalDuration(parseFloat(e.target.value) || 1)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1 text-xs focus:outline-none focus:border-indigo-500 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">Target Completion Date (Optional)</label>
                    <input 
                      type="date" 
                      value={newGoalTargetDate}
                      onChange={(e) => setNewGoalTargetDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-1 text-xs focus:outline-none focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <button
                    id="btn-add-goal"
                    onClick={handleAddGoal}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add goal
                  </button>
                </div>
              </div>

              {/* Preset Goals Grid */}
              <div className="mt-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Quick Examples</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Learn Guitar',
                    'Lose Weight',
                    'Placement Preparation'
                  ].map((gName) => {
                    const isAdded = goals.some(g => g.name === gName);
                    return (
                      <button
                        key={gName}
                        onClick={() => handleTogglePresetGoal(gName)}
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                          isAdded 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold' 
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {gName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              id="btn-goals-continue"
              onClick={() => setStep(5)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 mt-4 active:scale-[0.98]"
            >
              Generate AI Weekly Schedule
              <Sparkles className="w-4 h-4 fill-white/20" />
            </button>
          </div>
        )}

        {/* SCREEN 5: AI PLANNING LOADING SCREEN */}
        {step === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            {/* Spinning/pulsing gorgeous AI Orb */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center p-0.5 shadow-lg relative mb-12">
              <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-xl animate-pulse"></div>
              
              {/* Inner core rotating elements */}
              <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center border-4 border-slate-950 p-4 overflow-hidden relative">
                <div className="absolute top-0 w-full h-full bg-gradient-to-b from-indigo-500/20 to-transparent animate-spin duration-[4000ms]"></div>
                <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse-slow z-10" />
              </div>
            </div>

            {/* Transitioning message logs (No technical/terminal larping) */}
            <div className="text-center space-y-3 px-4">
              <h3 className="text-xl font-bold font-display text-slate-900 transition-all duration-300">
                Building Your Perfect Plan
              </h3>
              
              <div className="h-6 flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-sm transition-opacity duration-300 animate-fade-in">
                  {loadingMessages[loadingMsgIdx]}
                </span>
              </div>
              
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed pt-2">
                Align AI is calculating optimal time segments to fit your habits seamlessly.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
