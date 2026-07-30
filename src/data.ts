import { CalendarEvent, Goal, Commitment } from './types';

// Standard colors for different block types
export const COLORS = {
  gcal: {
    bg: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    border: 'border-blue-400',
    indicator: 'bg-blue-500',
    hex: '#3B82F6',
  },
  commitment: {
    bg: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
    border: 'border-amber-400',
    indicator: 'bg-amber-500',
    hex: '#F59E0B',
  },
  goal: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
    border: 'border-emerald-400',
    indicator: 'bg-emerald-500',
    hex: '#10B981',
  }
};

export const INITIAL_GCAL_EVENTS: CalendarEvent[] = [
  {
    id: 'gcal-1',
    title: 'College Lectures',
    day: 'Monday',
    startTime: '10:00',
    endTime: '14:00',
    type: 'gcal',
    flex: false,
    description: 'Computer Science Department Core Lectures'
  },
  {
    id: 'gcal-2',
    title: 'College Lectures',
    day: 'Tuesday',
    startTime: '10:00',
    endTime: '14:00',
    type: 'gcal',
    flex: false,
    description: 'Computer Science Department Core Lectures'
  },
  {
    id: 'gcal-3',
    title: 'College Lectures',
    day: 'Wednesday',
    startTime: '10:00',
    endTime: '14:00',
    type: 'gcal',
    flex: false,
    description: 'Computer Science Department Core Lectures'
  },
  {
    id: 'gcal-4',
    title: 'Dentist Appointment',
    day: 'Wednesday',
    startTime: '15:30',
    endTime: '16:30',
    type: 'gcal',
    flex: false,
    description: 'Routine checkup and cleaning'
  },
  {
    id: 'gcal-5',
    title: 'Team Sync Meeting',
    day: 'Thursday',
    startTime: '11:00',
    endTime: '12:00',
    type: 'gcal',
    flex: false,
    description: 'Weekly alignment with design sprint team'
  }
];

export const SUGGESTED_COMMITMENTS: Commitment[] = [
  {
    id: 's-comm-1',
    name: 'Internship',
    type: 'flexible',
    requiredHours: 3
  },
  {
    id: 's-comm-2',
    name: 'Family Business Help',
    type: 'flexible',
    requiredHours: 2
  },
  {
    id: 's-comm-3',
    name: 'Daily Commute',
    type: 'fixed',
    day: 'Monday',
    startTime: '08:30',
    endTime: '09:30'
  },
  {
    id: 's-comm-4',
    name: 'Sports Practice',
    type: 'fixed',
    day: 'Thursday',
    startTime: '17:00',
    endTime: '19:00'
  },
  {
    id: 's-comm-5',
    name: 'Volunteer Work',
    type: 'flexible',
    requiredHours: 4
  }
];

export const SUGGESTED_GOALS: Goal[] = [
  {
    id: 's-goal-1',
    name: 'Read Atomic Habits',
    targetDate: '',
    sessionsPerWeek: 3,
    durationPerSession: 1, // 1 hour
    completedSessions: 1,
    totalSessions: 3,
    color: 'emerald'
  },
  {
    id: 's-goal-2',
    name: 'Build AI Project',
    targetDate: '',
    sessionsPerWeek: 2,
    durationPerSession: 2, // 2 hours
    completedSessions: 0,
    totalSessions: 2,
    color: 'emerald'
  },
  {
    id: 's-goal-3',
    name: 'Gym Workout',
    targetDate: '',
    sessionsPerWeek: 3,
    durationPerSession: 1.5, // 1.5 hours
    completedSessions: 2,
    totalSessions: 3,
    color: 'emerald'
  },
  {
    id: 's-goal-4',
    name: 'Learn Guitar',
    targetDate: '',
    sessionsPerWeek: 4,
    durationPerSession: 0.5,
    completedSessions: 1,
    totalSessions: 4
  },
  {
    id: 's-goal-5',
    name: 'Placement Preparation',
    targetDate: '',
    sessionsPerWeek: 5,
    durationPerSession: 2,
    completedSessions: 2,
    totalSessions: 5
  }
];

// Initial AI-created schedule once goals are processed
export const INITIAL_AI_SCHEDULE: CalendarEvent[] = [
  // GCal events
  ...INITIAL_GCAL_EVENTS,

  // Commitment: Internship (Flexible: 3h/day AI decided Monday & Tuesday)
  {
    id: 'c-intern-1',
    title: 'Internship (AI Planned)',
    day: 'Monday',
    startTime: '15:00',
    endTime: '18:00',
    type: 'commitment',
    flex: true,
    requiredHours: 3,
    description: 'Software development internship work segment (Flexible)'
  },
  {
    id: 'c-intern-2',
    title: 'Internship (AI Planned)',
    day: 'Tuesday',
    startTime: '15:00',
    endTime: '18:00',
    type: 'commitment',
    flex: true,
    requiredHours: 3,
    description: 'Software development internship work segment (Flexible)'
  },

  // AI Goals:
  // Gym: Tuesday, Friday, Sunday
  {
    id: 'g-gym-1',
    title: 'Gym Workout (AI Planned)',
    day: 'Tuesday',
    startTime: '19:00',
    endTime: '20:30',
    type: 'goal',
    flex: true,
    description: 'Cardio & Strength training'
  },
  {
    id: 'g-gym-2',
    title: 'Gym Workout (AI Planned)',
    day: 'Friday',
    startTime: '10:00',
    endTime: '11:30',
    type: 'goal',
    flex: true,
    description: 'Cardio & Strength training',
    completed: true
  },
  {
    id: 'g-gym-3',
    title: 'Gym Workout (AI Planned)',
    day: 'Sunday',
    startTime: '09:00',
    endTime: '10:30',
    type: 'goal',
    flex: true,
    description: 'Cardio & Strength training',
    completed: true
  },

  // Reading: Monday, Thursday, Sunday
  {
    id: 'g-read-1',
    title: 'Read Atomic Habits (AI Planned)',
    day: 'Monday',
    startTime: '20:30',
    endTime: '21:30',
    type: 'goal',
    flex: true,
    description: 'Reading session - Focus on system habits'
  },
  {
    id: 'g-read-2',
    title: 'Read Atomic Habits (AI Planned)',
    day: 'Thursday',
    startTime: '19:00',
    endTime: '20:00',
    type: 'goal',
    flex: true,
    description: 'Reading session - Focus on system habits'
  },
  {
    id: 'g-read-3',
    title: 'Read Atomic Habits (AI Planned)',
    day: 'Sunday',
    startTime: '19:30',
    endTime: '20:30',
    type: 'goal',
    flex: true,
    description: 'Reading session - Focus on system habits',
    completed: true
  },

  // AI Project: Wednesday, Saturday
  {
    id: 'g-aiproj-1',
    title: 'AI Project (AI Planned)',
    day: 'Wednesday',
    startTime: '14:30',
    endTime: '16:30',
    type: 'goal',
    flex: true,
    description: 'Work on building an AI agent'
  },
  {
    id: 'g-aiproj-2',
    title: 'AI Project (AI Planned)',
    day: 'Saturday',
    startTime: '11:00',
    endTime: '13:00',
    type: 'goal',
    flex: true,
    description: 'Work on building an AI agent'
  }
];
