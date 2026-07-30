import React, { useState } from 'react';
import PhoneContainer from './components/PhoneContainer';
import Onboarding from './components/Onboarding';
import PlannerView from './components/PlannerView';
import TodayView from './components/TodayView';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import UpdateDayModal from './components/UpdateDayModal';
import { CalendarEvent, Goal, Commitment, ScreenId } from './types';
import { INITIAL_AI_SCHEDULE } from './data';
import { Calendar, CheckSquare, BarChart3, User, Sparkles, Bell, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'planner' | 'today' | 'progress' | 'profile'>('planner');
  
  // Master state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Modal control
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<boolean>(true);

  // Complete onboarding
  const handleOnboardingComplete = (data: {
    gcalEvents: CalendarEvent[];
    commitments: Commitment[];
    goals: Goal[];
  }) => {
    // Merge GCal events, commitments, and goals into a combined planned schedule.
    // For prototype fidelity, we'll initialize the planner with the beautifully optimized INITIAL_AI_SCHEDULE
    // which schedules their goals (Reading, Gym, AI Project) and Internship around their College calendar.
    setEvents(INITIAL_AI_SCHEDULE);
    setCommitments(data.commitments);
    setGoals(data.goals);
    setOnboardingDone(true);
    setActiveTab('planner');
    // Keep notification active to trigger flow 2 after onboarding completes!
    setActiveNotification(true);
  };

  // Mark an activity completed
  const handleCompleteEvent = (id: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return { ...evt, completed: true };
      }
      return evt;
    }));

    // Update session counts in Goals state
    const completedEvt = events.find(e => e.id === id);
    if (completedEvt && completedEvt.type === 'goal') {
      const goalName = completedEvt.title.replace(' (AI Planned)', '');
      setGoals(prev => prev.map(g => {
        if (g.name.toLowerCase().includes(goalName.toLowerCase()) || goalName.toLowerCase().includes(g.name.toLowerCase())) {
          return { ...g, completedSessions: Math.min(g.totalSessions, g.completedSessions + 1) };
        }
        return g;
      }));
    }
  };

  // Skip event for today
  const handleSkipEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  // Quick Reschedule button
  const handleRescheduleEvent = (event: CalendarEvent) => {
    setIsUpdateModalOpen(true);
  };

  // Apply Changes suggested by the AI Modal
  const handleApplyChanges = (changes: Array<{ eventId: string; action: string; newDay?: string; newStartTime?: string; newEndTime?: string }>) => {
    setEvents(prev => {
      let updated = [...prev];
      changes.forEach(chg => {
        if (chg.action === 'delete') {
          updated = updated.filter(e => e.id !== chg.eventId);
        } else if (chg.action === 'move') {
          updated = updated.map(e => {
            if (e.id === chg.eventId) {
              return {
                ...e,
                day: (chg.newDay || e.day) as any,
                startTime: chg.newStartTime || e.startTime,
                endTime: chg.newEndTime || e.endTime,
                title: e.title.includes('(AI Planned)') ? e.title : `${e.title} (AI Planned)`,
                completed: false // Reset completion if shifted
              };
            }
            return e;
          });
        }
      });
      return updated;
    });

    // Close the class notification if they applied that adjustment
    if (changes.some(c => c.eventId === 'gcal-1' || c.eventId === 'g-aiproj-2')) {
      setActiveNotification(false);
    }
  };

  // Handle clicking the Notification toast
  const handleNotificationClick = () => {
    setIsUpdateModalOpen(true);
    // Let's delay modal action inside UpdateDayModal to focus on cancelled class
  };

  return (
    <PhoneContainer>
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#F8FAFC]">
        
        {/* Render onboarding or main screen */}
        {!onboardingDone ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            
            {/* Top Interactive Class Cancelled Banner Notification */}
            {activeNotification && (
              <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mt-3 bg-indigo-50 border border-indigo-100 rounded-2xl p-3 shadow-md z-30 relative cursor-pointer hover:bg-indigo-100/70 transition-all"
                onClick={handleNotificationClick}
              >
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 animate-bounce">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Adaptive Update</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveNotification(false);
                        }} 
                        className="p-0.5 hover:bg-indigo-200 rounded-full"
                      >
                        <X className="w-3 h-3 text-indigo-400" />
                      </button>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800">College class didn't happen today.</p>
                    <p className="text-[9px] text-slate-500 leading-normal">Tap to re-align this free block to keep your goals on track.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View Switching */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  {activeTab === 'planner' && (
                    <PlannerView 
                      events={events} 
                      goals={goals} 
                      commitments={commitments}
                      onSelectEvent={handleRescheduleEvent}
                    />
                  )}
                  {activeTab === 'today' && (
                    <TodayView 
                      events={events} 
                      goals={goals}
                      onCompleteEvent={handleCompleteEvent}
                      onSkipEvent={handleSkipEvent}
                      onRescheduleEvent={handleRescheduleEvent}
                    />
                  )}
                  {activeTab === 'progress' && (
                    <ProgressView goals={goals} />
                  )}
                  {activeTab === 'profile' && (
                    <ProfileView goals={goals} commitments={commitments} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Signatures Update My Day FAB on every main screen */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-40 pointer-events-none">
              <button
                id="btn-update-my-day-fab"
                onClick={() => setIsUpdateModalOpen(true)}
                className="pointer-events-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-full shadow-lg shadow-slate-950/20 hover:shadow-xl transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-4.5 h-4.5 text-indigo-400 fill-indigo-400/20" />
                <span className="text-xs">Update My Day</span>
              </button>
            </div>

            {/* Bottom Tab Bar navigation */}
            <div className="h-[64px] border-t border-slate-100 bg-white/90 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
              <button
                id="tab-planner"
                onClick={() => setActiveTab('planner')}
                className={`flex flex-col items-center gap-1 flex-1 transition-colors py-1 ${
                  activeTab === 'planner' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Calendar className="w-5 h-5 stroke-[2]" />
                <span className="text-[9px] font-bold">Planner</span>
              </button>

              <button
                id="tab-today"
                onClick={() => setActiveTab('today')}
                className={`flex flex-col items-center gap-1 flex-1 transition-colors py-1 ${
                  activeTab === 'today' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <CheckSquare className="w-5 h-5 stroke-[2]" />
                <span className="text-[9px] font-bold">Today</span>
              </button>

              {/* Spacing spacer for FAB visual clarity */}
              <div className="w-16 flex justify-center h-full"></div>

              <button
                id="tab-progress"
                onClick={() => setActiveTab('progress')}
                className={`flex flex-col items-center gap-1 flex-1 transition-colors py-1 ${
                  activeTab === 'progress' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <BarChart3 className="w-5 h-5 stroke-[2]" />
                <span className="text-[9px] font-bold">Progress</span>
              </button>

              <button
                id="tab-profile"
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 flex-1 transition-colors py-1 ${
                  activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <User className="w-5 h-5 stroke-[2]" />
                <span className="text-[9px] font-bold">Profile</span>
              </button>
            </div>

            {/* Full-screen Adaptation bottom-sheet modal */}
            <UpdateDayModal
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              events={events}
              onApplyChanges={handleApplyChanges}
              currentDay={activeTab === 'today' ? 'Monday' : 'Monday'}
            />

          </div>
        )}

      </div>
    </PhoneContainer>
  );
}
