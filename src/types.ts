
export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface Habit {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  active: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedHabits: string[]; // Array of Habit IDs
}

export interface Exercise {
  id: string;
  name: string;
  day: DayOfWeek;
  targetSets: number;
  targetReps: string; // e.g. "8-12"
}

export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutLog {
  id: string;
  date: string; // YYYY-MM-DD
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface BodyMeasurement {
  id: string;
  date: string; // YYYY-MM-DD
  weight?: number;
  biceps?: number;
  chest?: number;
  waist?: number;
  thigh?: number;
  calves?: number;
}

export type ViewState = 'dashboard' | 'habits' | 'stats' | 'gym';

export interface ChartDataPoint {
  date: string;
  completionRate: number;
  totalCompleted: number;
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'pl';
export type AccentColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet';