export type EventType = 'gcal' | 'commitment' | 'goal';

export interface CalendarEvent {
  id: string;
  title: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "16:00"
  type: EventType;
  flex: boolean;
  requiredHours?: number;
  color?: string;
  description?: string;
  completed?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetDate: string; // e.g. "2026-07-14"
  estimatedDate?: string;
  sessionsPerWeek: number;
  durationPerSession: number; // in hours or minutes
  completedSessions: number;
  totalSessions: number;
  color?: string;
}

export interface Commitment {
  id: string;
  name: string;
  type: 'fixed' | 'flexible';
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime?: string;
  endTime?: string;
  requiredHours?: number; // hours per day if flexible
}

export interface UpdateProposal {
  explanation: string;
  before: CalendarEvent[];
  after: CalendarEvent[];
  actionLabel?: string;
}

export type ScreenId = 
  | 'splash' 
  | 'gcal-connect' 
  | 'commitments' 
  | 'goals' 
  | 'loading' 
  | 'planner' 
  | 'today' 
  | 'progress' 
  | 'profile';
