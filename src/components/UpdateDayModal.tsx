import React, { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '../types';
import { Sparkles, X, Mic, Send, ArrowRight, Check, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

interface UpdateDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  onApplyChanges: (changes: Array<{ eventId: string; action: string; newDay?: string; newStartTime?: string; newEndTime?: string }>) => void;
  currentDay: string;
}

export default function UpdateDayModal({ isOpen, onClose, events, onApplyChanges, currentDay }: UpdateDayModalProps) {
  const [stage, setStage] = useState<'input' | 'sub-choice' | 'loading' | 'diff' | 'cancelled-choice' | 'cancelled-followup' | 'success'>('input');
  const [inputText, setInputText] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  
  // Waveform recording state
  const [isRecording, setIsRecording] = useState(false);
  const [waveSeconds, setWaveSeconds] = useState(0);
  const waveTimer = useRef<NodeJS.Timeout | null>(null);

  // Suggested diff results
  const [explanation, setExplanation] = useState('');
  const [actionLabel, setActionLabel] = useState('Apply AI Changes');
  const [suggestedChanges, setSuggestedChanges] = useState<Array<{
    eventId: string;
    action: string;
    newDay?: string;
    newStartTime?: string;
    newEndTime?: string;
    eventTitle?: string;
    oldDay?: string;
    oldTime?: string;
  }>>([]);

  // Preset triggers for easy demo clicking
  const presets = [
    { text: "Tomorrow is my friend's birthday", icon: "🎉" },
    { text: "I'm feeling sick today", icon: "🤒" },
    { text: "My college class got cancelled", icon: "🏫" },
    { text: "I need to work late tonight", icon: "💼" },
    { text: "I'm taking today off", icon: "💆" }
  ];

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setStage('input');
      setInputText('');
      setSelectedDuration('');
      setExplanation('');
      setSuggestedChanges([]);
    }
  }, [isOpen]);

  // Handle voice recording simulation
  const handleToggleVoice = () => {
    if (isRecording) {
      // Stop recording, autofill
      setIsRecording(false);
      if (waveTimer.current) clearInterval(waveTimer.current);
      setInputText("Tomorrow is my friend's birthday.");
    } else {
      setIsRecording(true);
      setWaveSeconds(0);
      waveTimer.current = setInterval(() => {
        setWaveSeconds(s => s + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (waveTimer.current) clearInterval(waveTimer.current);
    };
  }, []);

  const getEventDetails = (id: string) => {
    const found = events.find(e => e.id === id);
    return found ? { title: found.title, day: found.day, time: `${found.startTime}-${found.endTime}` } : null;
  };

  const handlePresetClick = (text: string) => {
    setInputText(text);
    if (text.includes("cancelled") || text.includes("class")) {
      setStage('cancelled-choice');
    } else if (text.includes("birthday") || text.includes("friend")) {
      setStage('sub-choice');
    } else {
      // Direct submit
      handleSubmitUpdate(text);
    }
  };

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    handleSubmitUpdate(inputText, duration);
  };

  // Submit update to Express backend
  const handleSubmitUpdate = async (msgText: string, durationOption: string = '') => {
    setStage('loading');
    try {
      const response = await fetch('/api/update-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events,
          message: msgText,
          currentDay,
          selection: durationOption
        })
      });
      const data = await response.json();

      if (data && data.suggestedChanges) {
        setExplanation(data.explanation);
        setActionLabel(data.actionLabel || "Accept AI Changes");
        
        // Enrich the changes with titles/times for the Before-After Comparison UI
        const enriched = data.suggestedChanges.map((chg: any) => {
          const detail = getEventDetails(chg.eventId);
          return {
            ...chg,
            eventTitle: detail?.title || 'Goal Segment',
            oldDay: detail?.day || currentDay,
            oldTime: detail?.time || ''
          };
        });

        setSuggestedChanges(enriched);
        setStage('diff');
      } else {
        throw new Error("No payload");
      }
    } catch (err) {
      console.error(err);
      // Fallback response
      setExplanation("I've re-distributed your schedule to give you free time today. I moved your Atomic Habits reading session to Sunday at 19:30.");
      setStage('diff');
    }
  };

  const handleAcceptChanges = () => {
    onApplyChanges(suggestedChanges);
    setStage('success');
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  // Cancelled class custom path
  const handleCancelledChoice = (choice: string) => {
    if (choice === 'break') {
      setStage('cancelled-followup');
    } else {
      // Stay productive or let AI decide - reschedule Saturday Project to Monday class slot
      setStage('loading');
      setTimeout(() => {
        setExplanation("Since your class got cancelled, I recommend scheduling your Saturday afternoon 'AI Project' session into today's slot instead. This frees up your entire weekend!");
        setActionLabel("Realign Saturday Project to Monday");
        setSuggestedChanges([
          {
            eventId: 'g-aiproj-2', // Saturday AI Project
            action: 'move',
            newDay: 'Monday',
            newStartTime: '11:00',
            newEndTime: '13:00',
            eventTitle: 'AI Project (AI Planned)',
            oldDay: 'Saturday',
            oldTime: '11:00-13:00'
          }
        ]);
        setStage('diff');
      }, 800);
    }
  };

  const handleCancelledFollowupConfirm = (wantsAdjust: boolean) => {
    if (wantsAdjust) {
      setStage('loading');
      setTimeout(() => {
        setExplanation("I've postponed today's flexible commitments. Your internship slot has been moved to Thursday to protect your goal velocity without stressing you out.");
        setActionLabel("Adjust Internship to Thursday");
        setSuggestedChanges([
          {
            eventId: 'c-intern-1', // Monday Internship
            action: 'move',
            newDay: 'Thursday',
            newStartTime: '15:00',
            newEndTime: '18:00',
            eventTitle: 'Internship (AI Planned)',
            oldDay: 'Monday',
            oldTime: '15:00-18:00'
          }
        ]);
        setStage('diff');
      }, 800);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end">
      
      {/* Dynamic bottom drawer container */}
      <div 
        className="w-full bg-white rounded-t-[32px] shadow-2xl border-t border-slate-100 flex flex-col max-h-[90%] pb-6"
        id="update-day-drawer"
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 shrink-0"></div>

        {/* Header */}
        <div className="px-6 flex items-center justify-between pb-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-100/20" />
            <h3 className="text-sm font-bold font-display text-slate-900">Align Real-time Adapter</h3>
          </div>
          <button 
            id="btn-close-modal"
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-50 text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable interior content */}
        <div className="px-6 flex-1 overflow-y-auto min-h-[300px]">

          {/* STAGE 1: INITIAL INPUT STATE */}
          {stage === 'input' && (
            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">What has changed?</h4>
                <p className="text-[10px] text-slate-400">Tell Align AI about any life disruptions, illness, cancelled slots, or scheduling overlaps.</p>
              </div>

              {/* Text Area Input */}
              <div className="relative border border-slate-200 rounded-2xl bg-slate-50 p-3 shadow-sm focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <textarea
                  id="textarea-update-change"
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. Tomorrow is my friend's birthday / feeling sick today / class got cancelled"
                  className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none resize-none focus:ring-0 placeholder-slate-400"
                ></textarea>

                {/* Voice dictated visual feedback */}
                {isRecording && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-100 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                    <span className="text-[10px] font-bold font-mono">Dictation Mode active ({waveSeconds}s)</span>
                    <div className="flex gap-0.5 items-center ml-2 h-3">
                      {[1, 2, 3, 4, 3, 2, 4, 1, 2, 3, 2].map((h, i) => (
                        <div key={i} className="w-[1.5px] bg-red-500 rounded-full" style={{ height: `${h * 3}px` }}></div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    id="btn-voice-dictate"
                    onClick={handleToggleVoice}
                    className={`p-2 rounded-xl transition-all ${
                      isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <button
                    id="btn-submit-update"
                    disabled={!inputText.trim()}
                    onClick={() => handlePresetClick(inputText)}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
                  >
                    Submit Update
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Clickable Preset Chips for frictionless demo */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Preset Disrupters</span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.text}
                      id={`btn-preset-${p.text.toLowerCase().replace(/\s/g, '-')}`}
                      onClick={() => handlePresetClick(p.text)}
                      className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/50 hover:border-indigo-100 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <span>{p.icon}</span>
                      <span>{p.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: FRIEND'S BIRTHDAY DURATION PROMPT */}
          {stage === 'sub-choice' && (
            <div className="space-y-4 pt-1 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto">
                <Sparkles className="w-6 h-6 fill-indigo-100/20" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Sounds fun! 🎉</h4>
                <p className="text-[11px] text-slate-500">Approximately how much of your day will this take?</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 max-w-xs mx-auto pt-2">
                {['Morning', 'Half Day', 'Most of the Day', 'Entire Day'].map((dur) => (
                  <button
                    key={dur}
                    id={`btn-dur-${dur.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={() => handleDurationSelect(dur)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-800 shadow-sm transition-all active:scale-[0.98]"
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3: CLASS CANCELLED PROMPT */}
          {stage === 'cancelled-choice' && (
            <div className="space-y-4 pt-1 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Class Didn't Happen Today</h4>
                <p className="text-[11px] text-slate-500">We noticed your college slot got cancelled. How would you like to use this newly opened time block?</p>
              </div>

              <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
                <button
                  id="btn-cancel-productive"
                  onClick={() => handleCancelledChoice('productive')}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-800 shadow-sm transition-all text-left flex items-center justify-between"
                >
                  <span>🚀 Stay Productive (Fill with goals)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-cancel-break"
                  onClick={() => handleCancelledChoice('break')}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-800 shadow-sm transition-all text-left flex items-center justify-between"
                >
                  <span>💆 Take a Break (Keep time open)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-cancel-decide"
                  onClick={() => handleCancelledChoice('decide')}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-800 shadow-sm transition-all text-left flex items-center justify-between"
                >
                  <span>✨ Let AI Decide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: CANCELLED BREAK FOLLOWUP */}
          {stage === 'cancelled-followup' && (
            <div className="space-y-4 pt-1 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">No problem.</h4>
                <p className="text-[11px] text-slate-500">Would you like me to adjust the rest of your week to keep your goals on track?</p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-3">
                <button
                  id="btn-followup-no"
                  onClick={() => handleCancelledFollowupConfirm(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-500 active:scale-95"
                >
                  No, just clear it
                </button>
                <button
                  id="btn-followup-yes"
                  onClick={() => handleCancelledFollowupConfirm(true)}
                  className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-[11px] font-bold text-white shadow-sm active:scale-95"
                >
                  Yes, adjust week
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: LOADING/RECALCULATING */}
          {stage === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              </div>
              <h5 className="text-xs font-bold text-slate-900">Align AI is Thinking...</h5>
              <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">Analyzing available open blocks and calculating minimal schedule disruption.</p>
            </div>
          )}

          {/* STAGE 6: BEFORE VS AFTER VISUAL DIFF SUGGESTION */}
          {stage === 'diff' && (
            <div className="space-y-4 pt-1">
              
              {/* Explanation block */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-700">
                  <Sparkles className="w-4 h-4 fill-indigo-200/20" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-display">AI Solution</span>
                </div>
                <p className="text-[11px] text-indigo-900 leading-normal font-medium">{explanation}</p>
              </div>

              {/* Before vs After comparison column */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Adjustments</span>
                
                <div className="space-y-2.5 max-h-[190px] overflow-y-auto">
                  {suggestedChanges.map((chg, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 space-y-2 shadow-sm">
                      <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between">
                        <span>{chg.eventTitle}</span>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">
                          {chg.action === 'delete' ? 'Remove slot' : 'Reschedule'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        {/* Before */}
                        <div className="bg-white border border-red-100 rounded-xl p-2 text-left relative overflow-hidden">
                          <span className="absolute right-1 top-1 text-[8px] font-mono bg-red-50 text-red-700 font-bold px-1 rounded">Before</span>
                          <p className="text-slate-400 font-medium">Day: {chg.oldDay}</p>
                          <p className="text-slate-400 font-mono mt-0.5 line-through">{chg.oldTime}</p>
                        </div>

                        {/* After */}
                        <div className="bg-white border border-emerald-100 rounded-xl p-2 text-left relative overflow-hidden">
                          <span className="absolute right-1 top-1 text-[8px] font-mono bg-emerald-50 text-emerald-700 font-bold px-1 rounded">After</span>
                          {chg.action === 'delete' ? (
                            <p className="text-red-500 font-semibold italic">Removed block</p>
                          ) : (
                            <>
                              <p className="text-emerald-700 font-bold">Day: {chg.newDay}</p>
                              <p className="text-emerald-800 font-mono font-bold mt-0.5">{chg.newStartTime} - {chg.newEndTime}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accept or Reject buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-reject-changes"
                  onClick={onClose}
                  className="py-3 px-4 rounded-2xl border border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 text-xs transition-all active:scale-95"
                >
                  Discard Suggestion
                </button>
                
                <button
                  id="btn-accept-changes"
                  onClick={handleAcceptChanges}
                  className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {actionLabel}
                </button>
              </div>
            </div>
          )}

          {/* STAGE 7: SUCCESS CONFIRMATION ANIMATION */}
          {stage === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100 animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 font-display">Schedule Re-Aligned!</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Planner successfully restructured. Check your calendar for the updated times.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
