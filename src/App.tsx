
import React, { useState, useEffect } from 'react';
import { ViewState, Habit, DailyLog, Exercise, WorkoutLog, BodyMeasurement } from './types';
import { getHabits, getLogs, getExercises, getWorkoutLogs, getMeasurements } from './services/storage';
import { isConfigured as checkIsConfigured } from './services/firebase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HabitManager } from './components/HabitManager';
import { Statistics } from './components/Statistics';
import { GymTracker } from './components/GymTracker';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { FirebaseSetup } from './components/FirebaseSetup';

const MainAppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  
  // Gym Data
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);

  // Navigation State
  const [targetExerciseId, setTargetExerciseId] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const refreshData = async () => {
    if (!user) return;
    try {
        const [h, l, e, w, m] = await Promise.all([
            getHabits(),
            getLogs(),
            getExercises(),
            getWorkoutLogs(),
            getMeasurements()
        ]);
        setHabits(h);
        setLogs(l);
        setExercises(e);
        setWorkoutLogs(w);
        setMeasurements(m);
    } catch (error) {
        console.error("Failed to refresh data", error);
    }
  };

  useEffect(() => {
    if (user) {
        refreshData().then(() => setDataLoading(false));
    } else {
        setDataLoading(false);
    }
  }, [user]);

  const handleViewChange = (view: ViewState) => {
    setActiveView(view);
    if (view !== 'gym') {
        setTargetExerciseId(null);
    }
  };

  const navigateToExercise = (exerciseId: string) => {
      setTargetExerciseId(exerciseId);
      setActiveView('gym');
  };

  if (authLoading || (user && dataLoading)) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-slate-400 dark:text-zinc-500">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p>Syncing...</p>
            </div>
        </div>
    );
  }

  if (!user) {
      return <AuthScreen />;
  }

  return (
    <Layout activeView={activeView} onChangeView={handleViewChange}>
      {activeView === 'dashboard' && (
        <Dashboard 
            habits={habits} 
            logs={logs} 
            exercises={exercises}
            workoutLogs={workoutLogs}
            onNavigateToExercise={navigateToExercise}
            onUpdate={refreshData} 
        />
      )}
      {activeView === 'habits' && (
        <HabitManager 
            habits={habits} 
            onUpdate={refreshData} 
        />
      )}
      {activeView === 'gym' && (
        <GymTracker
            exercises={exercises}
            workoutLogs={workoutLogs}
            measurements={measurements}
            initialExerciseId={targetExerciseId}
            onUpdate={refreshData}
        />
      )}
      {activeView === 'stats' && (
        <Statistics 
            habits={habits} 
            logs={logs} 
        />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  const [configured, setConfigured] = useState(checkIsConfigured());

  const handleConfigDone = () => {
      // Manual reload trigger to refresh Firebase singleton exports
      window.location.reload();
  };

  return (
    <SettingsProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;
