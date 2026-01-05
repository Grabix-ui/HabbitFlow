import React, { useState, useMemo, useEffect } from 'react';
import { Exercise, WorkoutLog, DayOfWeek, WorkoutSet, BodyMeasurement } from '../types';
import { saveExercise, deleteExercise, saveWorkoutLog, saveMeasurement } from '../services/storage';
import { Plus, Dumbbell, ChevronDown, ChevronUp, Trash2, Save, X, CalendarDays, CheckCircle2, Trophy, Activity, Ruler, LineChart, ChevronLeft, ChevronRight, RotateCcw, Settings, Edit3, ClipboardList, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { AreaChart, Area, LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';

interface ExerciseCardProps {
  exercise: Exercise;
  date: string;
  workoutLogs: WorkoutLog[];
  isExpanded: boolean;
  isEditingPlan: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  onUpdate: () => void;
  onShowStats: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  date, 
  workoutLogs, 
  isExpanded, 
  isEditingPlan, 
  onToggleExpand, 
  onDelete, 
  onUpdate, 
  onShowStats 
}) => {
  const { t } = useSettings();
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const currentLog = workoutLogs.find(l => l.exerciseId === exercise.id && l.date === date);
  const sets = currentLog?.sets || [];

  const history = useMemo(() => 
    workoutLogs
        .filter(l => l.exerciseId === exercise.id && l.sets.length > 0 && l.date < date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , [workoutLogs, exercise.id, date]);

  const lastLog = history[0];
  
  const personalBest = useMemo(() => {
    const allLogs = workoutLogs.filter(l => l.exerciseId === exercise.id);
    let max = 0;
    allLogs.forEach(l => l.sets.forEach(s => { if(s.weight > max) max = s.weight; }));
    return max;
  }, [workoutLogs, exercise.id]);

  const handleAddSet = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!weight || !reps) return;
      
      const newSet: WorkoutSet = { weight: parseFloat(weight), reps: parseFloat(reps) };
      const newSets = [...sets, newSet];
      
      await saveWorkoutLog({
          id: currentLog?.id,
          date,
          exerciseId: exercise.id,
          sets: newSets
      });
      
      onUpdate();
  };

  const handleRemoveSet = async (idx: number) => {
      const newSets = sets.filter((_, i) => i !== idx);
      await saveWorkoutLog({
          id: currentLog?.id,
          date,
          exerciseId: exercise.id,
          sets: newSets
      });
      onUpdate();
  };

  // If viewing future date, read-only
  const isFuture = new Date(date) > new Date();

  return (
    <div className={`bg-white dark:bg-zinc-900 rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-500 shadow-md' : 'border-zinc-200 dark:border-zinc-800'}`}>
        {/* Header */}
        <div 
            onClick={onToggleExpand}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${sets.length >= exercise.targetSets ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                    {sets.length >= exercise.targetSets ? <CheckCircle2 size={20} /> : <Dumbbell size={20} />}
                </div>
                <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-base">{exercise.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{exercise.targetSets} x {exercise.targetReps}</span>
                        {lastLog && (
                            <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
                                <RotateCcw size={10} /> {Math.max(...lastLog.sets.map(s => s.weight))}kg
                            </span>
                        )}
                        {personalBest > 0 && (
                            <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-medium">
                                <Trophy size={10} /> {personalBest}kg
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isEditingPlan && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                {!isEditingPlan && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onShowStats(); }}
                        className="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <Activity size={18} />
                    </button>
                )}
                <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-zinc-400`}>
                    <ChevronDown size={20} />
                </div>
            </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && !isEditingPlan && (
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 animate-in fade-in slide-in-from-top-2">
                {/* Previous Performance Hint */}
                {lastLog && (
                    <div className="mb-4 text-xs text-zinc-500 flex items-center gap-2 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-100 dark:border-zinc-700">
                        <ClipboardList size={14} className="text-indigo-500"/>
                        <span>{t('last_session')}: {lastLog.sets.map(s => `${s.weight}x${s.reps}`).join(', ')}</span>
                    </div>
                )}

                {/* Sets List */}
                <div className="space-y-2 mb-4">
                    {sets.map((set, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-100 dark:border-zinc-700 shadow-sm">
                            <span className="text-xs font-bold text-zinc-400 w-8">#{idx + 1}</span>
                            <div className="flex-1 flex justify-center gap-6 font-mono text-sm text-zinc-700 dark:text-zinc-200">
                                <span>{set.weight} <span className="text-xs text-zinc-400">{t('weight_kg')}</span></span>
                                <span>{set.reps} <span className="text-xs text-zinc-400">{t('reps')}</span></span>
                            </div>
                            <button 
                                onClick={() => handleRemoveSet(idx)}
                                className="text-zinc-400 hover:text-rose-500 p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    {sets.length === 0 && (
                        <div className="text-center py-4 text-xs text-zinc-400 italic">No sets logged yet.</div>
                    )}
                </div>

                {/* Add Set Form */}
                {!isFuture ? (
                    <form onSubmit={handleAddSet} className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">{t('weight_kg')}</label>
                            <input
                                type="number"
                                step="0.5"
                                value={weight}
                                onChange={e => setWeight(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-center font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] uppercase font-bold text-zinc-400 ml-1">{t('reps')}</label>
                            <input
                                type="number"
                                value={reps}
                                onChange={e => setReps(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-center font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!weight || !reps}
                            className="bg-indigo-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </form>
                ) : (
                    <p className="text-center text-xs text-amber-500 font-medium bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                        {t('view_readonly')}
                    </p>
                )}
            </div>
        )}
    </div>
  );
};

const ExerciseStatsModal: React.FC<{
  exercise: Exercise;
  workoutLogs: WorkoutLog[];
  onClose: () => void;
}> = ({ exercise, workoutLogs, onClose }) => {
    const { t, language } = useSettings();
    const data = useMemo(() => {
        return workoutLogs
            .filter(l => l.exerciseId === exercise.id && l.sets.length > 0)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(l => ({
                date: new Date(l.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short' }),
                maxWeight: Math.max(...l.sets.map(s => s.weight)),
                volume: l.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0)
            })).reverse();
    }, [workoutLogs, exercise.id, language]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900">
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-600" />
                        {exercise.name} {t('history')}
                    </h3>
                    <button onClick={onClose} className="p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto">
                    {data.length > 1 ? (
                        <div className="h-64 w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                                    <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip contentStyle={{borderRadius: '8px', fontSize: '12px'}} />
                                    <Area type="monotone" dataKey="maxWeight" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMax)" />
                                </AreaChart>
                            </ResponsiveContainer>
                            <p className="text-center text-xs text-zinc-400 mt-2">{t('progress_chart')} (Max Weight)</p>
                        </div>
                    ) : (
                        <div className="h-32 flex items-center justify-center text-zinc-400 text-sm italic border rounded-xl border-dashed mb-4">
                            Not enough data for chart
                        </div>
                    )}

                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-zinc-400 mb-2">{t('history')}</h4>
                        {workoutLogs
                            .filter(l => l.exerciseId === exercise.id && l.sets.length > 0)
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(log => (
                                <div key={log.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                            <CalendarDays size={16} className="text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                                                {new Date(log.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {log.sets.length} {t('set')}{log.sets.length > 1 ? 's' : ''} • Max {Math.max(...log.sets.map(s => s.weight))}kg
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

interface GymTrackerProps {
  exercises: Exercise[];
  workoutLogs: WorkoutLog[];
  measurements: BodyMeasurement[];
  onUpdate: () => void;
  initialExerciseId?: string | null;
}

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const GymTracker: React.FC<GymTrackerProps> = ({ exercises, workoutLogs, measurements, onUpdate, initialExerciseId }) => {
  const { t, language } = useSettings();
  const [activeTab, setActiveTab] = useState<'plan' | 'measurements'>('plan');
  
  // --- PLAN STATE ---
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const today = new Date().getDay();
    const map = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return map[today] as DayOfWeek;
  });
  const [weekOffset, setWeekOffset] = useState(0); 

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  
  // Handle auto-navigation/expansion
  useEffect(() => {
      if (initialExerciseId) {
          const targetExercise = exercises.find(e => e.id === initialExerciseId);
          if (targetExercise) {
              setActiveTab('plan');
              setSelectedDay(targetExercise.day);
              setExpandedId(targetExercise.id);
              setWeekOffset(0); // Ensure we are looking at the current week/today
          }
      }
  }, [initialExerciseId, exercises]);

  // Stats Modal State
  const [statsExercise, setStatsExercise] = useState<Exercise | null>(null);

  // Exercise Form State
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newTargetSets, setNewTargetSets] = useState('3');
  const [newTargetReps, setNewTargetReps] = useState('8-12');
  const [newExerciseDay, setNewExerciseDay] = useState<DayOfWeek>('Mon');

  // --- MEASUREMENTS STATE ---
  const [measurementDate, setMeasurementDate] = useState(new Date().toISOString().split('T')[0]);
  const [measWeekOffset, setMeasWeekOffset] = useState(0); // Independent offset for measurements tab
  const [bodyStats, setBodyStats] = useState<Partial<BodyMeasurement>>({});
  const [selectedMetric, setSelectedMetric] = useState<keyof BodyMeasurement>('weight');
  const [isSavingMeasurements, setIsSavingMeasurements] = useState(false);

  // Effect to load existing measurements when date changes
  useEffect(() => {
      const existing = measurements.find(m => m.date === measurementDate);
      if (existing) {
          // Destructure to remove ID and date from the form values, keep stats
          const { id, date, ...stats } = existing;
          setBodyStats(stats);
      } else {
          setBodyStats({});
      }
  }, [measurementDate, measurements]);

  const hasDataForSelectedDate = useMemo(() => {
      return measurements.some(m => m.date === measurementDate);
  }, [measurements, measurementDate]);

  // --- DATE HELPERS (Plan) ---
  const getMondayOfViewedWeek = () => {
      const d = new Date();
      const currentDay = d.getDay(); 
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      d.setDate(d.getDate() + distanceToMonday + (weekOffset * 7));
      return d;
  };

  const selectedDateStr = useMemo(() => {
      const monday = getMondayOfViewedWeek();
      const dayIndex = DAYS.indexOf(selectedDay); 
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + dayIndex);
      return targetDate.toISOString().split('T')[0];
  }, [selectedDay, weekOffset]);

  const weekRangeStr = useMemo(() => {
      const start = getMondayOfViewedWeek();
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const format = (d: Date) => d.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { month: 'short', day: 'numeric' });
      return `${format(start)} - ${format(end)}`;
  }, [weekOffset, language]);

  // --- DATE HELPERS (Measurements) ---
  const getMondayOfMeasWeek = () => {
      const d = new Date();
      const currentDay = d.getDay(); 
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      d.setDate(d.getDate() + distanceToMonday + (measWeekOffset * 7));
      return d;
  };

  const measWeekRangeStr = useMemo(() => {
      const start = getMondayOfMeasWeek();
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const format = (d: Date) => d.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { month: 'short', day: 'numeric' });
      return `${format(start)} - ${format(end)}`;
  }, [measWeekOffset, language]);

  const handleMeasDayClick = (dayIndex: number) => {
      const monday = getMondayOfMeasWeek();
      const targetDate = new Date(monday);
      targetDate.setDate(monday.getDate() + dayIndex);
      setMeasurementDate(targetDate.toISOString().split('T')[0]);
  };

  // --- Handlers ---

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim()) return;

    await saveExercise({
      name: newExerciseName.trim(),
      day: newExerciseDay,
      targetSets: parseInt(newTargetSets) || 3,
      targetReps: newTargetReps
    });
    
    setNewExerciseName('');
    setIsAddingExercise(false);
    onUpdate();
  };

  const handleDeleteExercise = async (id: string) => {
    if (window.confirm(t('delete_exercise_confirm'))) {
        await deleteExercise(id);
        onUpdate();
    }
  };

  const handleSaveMeasurement = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSavingMeasurements(true);
      
      await saveMeasurement({
          date: measurementDate,
          ...bodyStats
      });
      
      onUpdate();
      setTimeout(() => setIsSavingMeasurements(false), 2000);
  };

  const filteredExercises = exercises.filter(e => e.day === selectedDay);

  const measurementChartData = useMemo(() => {
      return measurements
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(m => ({
            date: new Date(m.date).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { month: 'short', day: 'numeric' }),
            value: m[selectedMetric] || 0
        }))
        .filter(d => d.value > 0);
  }, [measurements, selectedMetric, language]);

  return (
    <div className="space-y-6 relative">
      {/* Top Tabs */}
      <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-4 transition-colors">
          <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'plan' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
              <Dumbbell size={18} /> {t('workout_tab')}
          </button>
          <button 
            onClick={() => setActiveTab('measurements')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'measurements' 
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
            }`}
          >
              <Ruler size={18} /> {t('body_stats_tab')}
          </button>
      </div>

      {/* --- PLAN VIEW --- */}
      {activeTab === 'plan' && (
        <>
            <div className="flex flex-col gap-4">
                {/* Mode Toggle & Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                        {isEditingPlan ? t('edit_routine') : t('log_workout')}
                    </h2>
                    
                    <button
                        onClick={() => setIsEditingPlan(!isEditingPlan)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            isEditingPlan 
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-750'
                        }`}
                    >
                        {isEditingPlan ? <CheckCircle2 size={14}/> : <Settings size={14}/>}
                        {isEditingPlan ? t('done_editing') : t('edit_plan')}
                    </button>
                </div>

                {/* Week Navigation (Only visible in Log Mode) */}
                {!isEditingPlan && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-between shadow-sm">
                        <button 
                            onClick={() => setWeekOffset(prev => prev - 1)}
                            className="p-2 text-zinc-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{weekRangeStr}</span>
                            {weekOffset !== 0 && (
                                <button 
                                    onClick={() => setWeekOffset(0)}
                                    className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium flex items-center gap-1 mt-0.5 hover:underline"
                                >
                                    <RotateCcw size={10} /> {language === 'pl' ? 'Wróć' : 'Back'}
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={() => setWeekOffset(prev => prev + 1)}
                            className="p-2 text-zinc-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Day Selector */}
                <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto scrollbar-hide shadow-sm transition-colors">
                    {DAYS.map(day => {
                        const isSelected = selectedDay === day;
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`flex-1 min-w-[3rem] py-2 rounded-lg text-sm font-semibold transition-all ${
                                    isSelected 
                                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' 
                                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200'
                                }`}
                            >
                                {t('short_' + day)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Helper Text */}
            <div className="text-xs text-center text-zinc-400 dark:text-zinc-500 font-medium -mt-2">
                {isEditingPlan 
                    ? `${t('add_exercise_to')} ${t('short_' + selectedDay)}` 
                    : `${t('log_workout')}: ${new Date(selectedDateStr).toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`
                }
            </div>

            {/* Add Exercise Button & Form ... (unchanged logic) ... */}
            {isEditingPlan && !isAddingExercise && (
                <button
                    onClick={() => {
                        setNewExerciseDay(selectedDay);
                        setIsAddingExercise(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none text-sm"
                >
                    <Plus size={18} />
                    <span>{t('add_new')}</span>
                </button>
            )}

            {isAddingExercise && (
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{t('add_exercise_to')} {t('short_' + newExerciseDay)}</h3>
                        <button onClick={() => setIsAddingExercise(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleAddExercise} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t('exercise_name')}</label>
                                <input 
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    placeholder="e.g. Squats"
                                    value={newExerciseName}
                                    onChange={e => setNewExerciseName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t('day')}</label>
                                <select 
                                    value={newExerciseDay} 
                                    onChange={e => setNewExerciseDay(e.target.value as DayOfWeek)}
                                    className="w-full px-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {DAYS.map(d => <option key={d} value={d}>{t('short_' + d)}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t('target_sets')}</label>
                                <input 
                                    type="number"
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    value={newTargetSets}
                                    onChange={e => setNewTargetSets(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{t('target_reps')}</label>
                                <input 
                                    className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                    value={newTargetReps}
                                    onChange={e => setNewTargetReps(e.target.value)}
                                    placeholder="e.g. 8-12"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg">
                            {t('save_to_plan')}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {filteredExercises.length === 0 && !isAddingExercise && (
                    <div className="text-center py-10 text-zinc-400 dark:text-zinc-500">
                        <CalendarDays size={48} className="mx-auto mb-3 opacity-50" />
                        <p>{t('no_workout_planned')} {t('short_' + selectedDay)}.</p>
                    </div>
                )}

                {filteredExercises.map(exercise => (
                    <ExerciseCard 
                        key={exercise.id} 
                        exercise={exercise} 
                        date={selectedDateStr}
                        workoutLogs={workoutLogs}
                        isExpanded={expandedId === exercise.id}
                        isEditingPlan={isEditingPlan}
                        onToggleExpand={() => setExpandedId(expandedId === exercise.id ? null : exercise.id)}
                        onDelete={() => handleDeleteExercise(exercise.id)}
                        onUpdate={onUpdate}
                        onShowStats={() => setStatsExercise(exercise)}
                    />
                ))}
            </div>
        </>
      )}

      {/* --- MEASUREMENTS VIEW --- */}
      {activeTab === 'measurements' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{t('body_measurements')}</h2>
            
            {/* Entry Form */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-colors">
                
                {/* Custom Date Navigator (replacing standard date input) */}
                <div className="flex flex-col gap-3 mb-6">
                    {/* Week Range Nav */}
                    <div className="bg-zinc-900 dark:bg-black rounded-xl p-2 flex items-center justify-between shadow-sm text-white border border-zinc-800">
                        <button 
                            onClick={() => setMeasWeekOffset(prev => prev - 1)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-bold tracking-wide">{measWeekRangeStr}</span>
                             {measWeekOffset !== 0 && (
                                <button 
                                    onClick={() => {
                                        setMeasWeekOffset(0);
                                        setMeasurementDate(new Date().toISOString().split('T')[0]);
                                    }}
                                    className="text-[10px] text-indigo-400 font-medium flex items-center gap-1 mt-0.5 hover:underline"
                                >
                                    <RotateCcw size={10} /> {language === 'pl' ? 'Wróć' : 'Back'}
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={() => setMeasWeekOffset(prev => prev + 1)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Days Row */}
                    <div className="flex bg-zinc-900 dark:bg-black p-1 rounded-xl border border-zinc-800 overflow-x-auto scrollbar-hide">
                         {DAYS.map((day, idx) => {
                             // Calculate exact date for this button
                             const monday = getMondayOfMeasWeek();
                             const btnDate = new Date(monday);
                             btnDate.setDate(monday.getDate() + idx);
                             const btnDateStr = btnDate.toISOString().split('T')[0];
                             const isSelected = measurementDate === btnDateStr;

                             return (
                                <button
                                    key={day}
                                    onClick={() => handleMeasDayClick(idx)}
                                    className={`flex-1 min-w-[3rem] py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isSelected 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                    }`}
                                >
                                    {t('short_' + day)}
                                </button>
                             );
                         })}
                    </div>
                </div>

                <form onSubmit={handleSaveMeasurement} className="space-y-4">
                    {/* Date input is now visually handled by the navigator above, but logic remains same */}
                    
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { k: 'weight', l: t('weight') },
                            { k: 'biceps', l: t('biceps') },
                            { k: 'chest', l: t('chest') },
                            { k: 'waist', l: t('waist') },
                            { k: 'thigh', l: t('thigh') },
                            { k: 'calves', l: t('calves') }
                        ].map(field => (
                            <div key={field.k}>
                                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{field.l}</label>
                                <input 
                                    type="number" 
                                    step="0.1"
                                    placeholder="0"
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={bodyStats[field.k as keyof BodyMeasurement] || ''}
                                    onChange={e => setBodyStats({...bodyStats, [field.k]: parseFloat(e.target.value)})}
                                />
                            </div>
                        ))}
                    </div>
                    <button 
                        type="submit" 
                        className={`w-full py-2.5 rounded-lg font-bold text-white transition-all ${
                            isSavingMeasurements ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                        }`}
                    >
                         {isSavingMeasurements ? 'Saved!' : (hasDataForSelectedDate ? t('update_measurements') : t('save_measurements'))}
                    </button>
                </form>
            </div>

            {/* Chart Section */}
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                        <LineChart size={18} className="text-indigo-500"/>
                        {t('progress_chart')}
                    </h3>
                    <select 
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value as keyof BodyMeasurement)}
                        className="text-xs p-1 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 outline-none"
                    >
                        <option value="weight">{t('weight')}</option>
                        <option value="biceps">{t('biceps')}</option>
                        <option value="chest">{t('chest')}</option>
                        <option value="waist">{t('waist')}</option>
                        <option value="thigh">{t('thigh')}</option>
                        <option value="calves">{t('calves')}</option>
                    </select>
                </div>
                
                <div className="h-64 w-full">
                    {measurementChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ReLineChart data={measurementChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                                <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#6366f1" 
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            </ReLineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs italic">
                            No data for selected metric.
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Stats Modal */}
      {statsExercise && (
        <ExerciseStatsModal 
            exercise={statsExercise} 
            workoutLogs={workoutLogs} 
            onClose={() => setStatsExercise(null)} 
        />
      )}
    </div>
  );
};