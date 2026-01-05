import React, { useMemo, useState } from 'react';
import { Habit, DailyLog, Exercise, WorkoutLog, DayOfWeek } from '../types';
import { Check, Flame, Calendar, Sparkles, Dumbbell, ChevronRight, CheckCircle2 } from 'lucide-react';
import { toggleHabitForDate } from '../services/storage';
import { getHabitInsights } from '../services/gemini';
import { useSettings } from '../contexts/SettingsContext';

interface DashboardProps {
  habits: Habit[];
  logs: DailyLog[];
  exercises: Exercise[];
  workoutLogs: WorkoutLog[];
  onNavigateToExercise: (id: string) => void;
  onUpdate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ habits, logs, exercises, workoutLogs, onNavigateToExercise, onUpdate }) => {
  const { t, language } = useSettings();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  
  const todayLog = useMemo(() => 
    logs.find(l => l.date === todayStr) || { date: todayStr, completedHabits: [] }
  , [logs, todayStr]);

  // Determine today's day of week for exercises
  const currentDayOfWeek = useMemo((): DayOfWeek => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[new Date().getDay()] as DayOfWeek;
  }, []);

  const todaysExercises = useMemo(() => {
      return exercises.filter(e => e.day === currentDayOfWeek);
  }, [exercises, currentDayOfWeek]);

  const handleToggle = async (habitId: string) => {
    if (toggling) return;
    setToggling(habitId);
    try {
        await toggleHabitForDate(habitId, todayStr);
        onUpdate();
    } finally {
        setToggling(null);
    }
  };

  const getStreak = (habitId: string) => {
    let streak = 0;
    let checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const log = logs.find(l => l.date === dateStr);
        if (log && log.completedHabits.includes(habitId)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    if (todayLog.completedHabits.includes(habitId)) {
        streak++;
    }
    return streak;
  };

  const handleGetInsight = async () => {
    if (habits.length === 0) {
        setInsight(t('no_habits_dash'));
        return;
    }
    setLoadingInsight(true);
    // Pass language to AI to get response in correct language
    const langPrompt = language === 'pl' ? "Odpowiedz w języku polskim." : "Respond in English.";
    const text = await getHabitInsights(habits, logs, langPrompt);
    setInsight(text || "No insights available.");
    setLoadingInsight(false);
  };

  const progress = habits.length > 0 
    ? Math.round((todayLog.completedHabits.length / habits.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">
                {new Date().toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric'})}
            </p>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-1">{t('daily_goals')}</h2>
          </div>
          <div className="text-right">
             <span className="text-3xl font-bold accent-text dark:text-indigo-400">{progress}%</span>
          </div>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* AI Insight Button/Card */}
      <div className="bg-indigo-50 dark:bg-zinc-900 rounded-xl p-4 border border-indigo-100 dark:border-zinc-800 dark:shadow-md dark:shadow-black/20 transition-colors">
         {!insight ? (
            <button 
                onClick={handleGetInsight}
                disabled={loadingInsight}
                className="w-full flex items-center justify-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-zinc-800 p-2 rounded-lg transition-colors"
            >
                <Sparkles size={18} className={loadingInsight ? "animate-spin" : ""} />
                {loadingInsight ? t('insight_loading') : t('insight_btn')}
            </button>
         ) : (
             <div className="animate-fade-in">
                 <div className="flex items-start gap-3">
                    <Sparkles size={20} className="accent-text dark:accent-text mt-1 shrink-0" />
                    <div>
                        <p className="text-indigo-900 dark:text-indigo-100 text-sm leading-relaxed">{insight}</p>
                        <button 
                            onClick={() => setInsight(null)}
                            className="text-xs text-indigo-500 dark:text-indigo-400 mt-2 hover:underline"
                        >
                            {t('close')}
                        </button>
                    </div>
                 </div>
             </div>
         )}
      </div>

      {/* Today's Workout Section */}
      {todaysExercises.length > 0 && (
          <div className="space-y-3">
              <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <Dumbbell size={20} className="accent-text dark:accent-text"/> 
                  {t('todays_workout')}
              </h3>
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors">
                  {todaysExercises.map((exercise, idx) => {
                      // Check if done today
                      const isDone = workoutLogs.some(l => l.date === todayStr && l.exerciseId === exercise.id && l.sets.length > 0);
                      
                      return (
                          <div 
                            key={exercise.id}
                            onClick={() => onNavigateToExercise(exercise.id)}
                            className={`p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${idx !== todaysExercises.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                          >
                             <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDone ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
                                     {isDone ? <CheckCircle2 size={16} /> : <Dumbbell size={16} />}
                                 </div>
                                 <div>
                                     <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{exercise.name}</p>
                                     <p className="text-xs text-zinc-500 dark:text-zinc-400">{exercise.targetSets} sets • {exercise.targetReps} reps</p>
                                 </div>
                             </div>
                             <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-xs font-bold gap-1">
                                 {isDone ? t('edit') : t('log')} <ChevronRight size={14} />
                             </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <Check size={20} className="text-indigo-600 dark:text-indigo-400"/> 
            {t('nav_habits')}
        </h3>
        {habits.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 border-dashed">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p>{t('no_habits_dash')}</p>
            </div>
        ) : (
            habits.map(habit => {
            const isCompleted = todayLog.completedHabits.includes(habit.id);
            const streak = getStreak(habit.id);
            const isProcessing = toggling === habit.id;

            return (
                <button
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                disabled={isProcessing}
                className={`w-full group relative overflow-hidden p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    isCompleted 
                    ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 shadow-sm' 
                    : 'bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md'
                }`}
                >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'
                    }`}>
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Check size={24} strokeWidth={3} className={`transition-transform duration-300 ${isCompleted ? 'scale-100' : 'scale-75 opacity-0'}`} />
                                {!isCompleted && <div className="absolute w-4 h-4 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />}
                            </>
                        )}
                    </div>
                    <div className="text-left">
                        <h3 className={`font-semibold text-lg transition-colors ${isCompleted ? 'text-emerald-900 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-200'}`}>
                            {habit.title}
                        </h3>
                        <p className={`text-xs ${isCompleted ? 'text-emerald-700 dark:text-emerald-500/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
                            {habit.category}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/50 dark:bg-zinc-800/50 rounded-full border border-transparent group-hover:border-zinc-100/50 dark:group-hover:border-zinc-700/50">
                    <Flame size={16} className={`${streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-zinc-300 dark:text-zinc-600'}`} />
                    <span className={`text-sm font-bold ${streak > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-300 dark:text-zinc-600'}`}>{streak}</span>
                </div>
                </button>
            );
            })
        )}
      </div>
    </div>
  );
};