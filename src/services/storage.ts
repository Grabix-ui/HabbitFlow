import { Habit, DailyLog, Exercise, WorkoutLog, BodyMeasurement } from '../types';
import { db, auth } from './firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where 
} from "firebase/firestore";

// Helper to get current user ID
const getUserId = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return user.uid;
};

// --- Habits CRUD ---

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const userId = getUserId();
    const querySnapshot = await getDocs(collection(db, "users", userId, "habits"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Habit));
  } catch (e) {
    console.error("Error loading habits", e);
    return [];
  }
};

export const saveHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'active'> & { id?: string }): Promise<void> => {
  const userId = getUserId();
  
  if (habit.id) {
    // Update
    const habitRef = doc(db, "users", userId, "habits", habit.id);
    await updateDoc(habitRef, {
        title: habit.title,
        category: habit.category
    });
  } else {
    // Create
    await addDoc(collection(db, "users", userId, "habits"), {
      title: habit.title,
      category: habit.category,
      createdAt: new Date().toISOString(),
      active: true,
    });
  }
};

export const deleteHabit = async (id: string) => {
  const userId = getUserId();
  await deleteDoc(doc(db, "users", userId, "habits", id));
};

// --- Logs/Check-ins ---

export const getLogs = async (): Promise<DailyLog[]> => {
  try {
    const userId = getUserId();
    const querySnapshot = await getDocs(collection(db, "users", userId, "logs"));
    return querySnapshot.docs.map(doc => ({ ...doc.data() } as DailyLog));
  } catch (e) {
    console.error("Error loading logs", e);
    return [];
  }
};

export const toggleHabitForDate = async (habitId: string, date: string): Promise<void> => {
  const userId = getUserId();
  const logsRef = collection(db, "users", userId, "logs");
  const q = query(logsRef, where("date", "==", date));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // Log exists for this date, update it
    const logDoc = querySnapshot.docs[0];
    const logData = logDoc.data() as DailyLog;
    const isCompleted = logData.completedHabits.includes(habitId);
    
    let newCompleted;
    if (isCompleted) {
      newCompleted = logData.completedHabits.filter(id => id !== habitId);
    } else {
      newCompleted = [...logData.completedHabits, habitId];
    }

    await updateDoc(doc(db, "users", userId, "logs", logDoc.id), {
      completedHabits: newCompleted
    });
  } else {
    // Create new log for date
    await addDoc(logsRef, {
      date,
      completedHabits: [habitId]
    });
  }
};

// --- Gym / Exercises ---

export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const userId = getUserId();
    const querySnapshot = await getDocs(collection(db, "users", userId, "exercises"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exercise));
  } catch (e) {
    return [];
  }
};

export const saveExercise = async (exercise: Omit<Exercise, 'id'> & { id?: string }) => {
  const userId = getUserId();
  if (exercise.id) {
     const ref = doc(db, "users", userId, "exercises", exercise.id);
     await updateDoc(ref, { ...exercise });
  } else {
     await addDoc(collection(db, "users", userId, "exercises"), exercise);
  }
};

export const deleteExercise = async (id: string) => {
    const userId = getUserId();
    await deleteDoc(doc(db, "users", userId, "exercises", id));
};

// --- Gym / Workouts ---

export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  try {
    const userId = getUserId();
    const querySnapshot = await getDocs(collection(db, "users", userId, "workoutLogs"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorkoutLog));
  } catch (e) {
    return [];
  }
};

export const saveWorkoutLog = async (log: Omit<WorkoutLog, 'id'> & { id?: string }) => {
  const userId = getUserId();
  
  // Find if log exists for this exercise and date, or use ID
  if (log.id) {
    const ref = doc(db, "users", userId, "workoutLogs", log.id);
    await updateDoc(ref, { ...log });
  } else {
    // Check if one already exists to prevent duplicates (optional but good)
    const q = query(collection(db, "users", userId, "workoutLogs"), where("date", "==", log.date), where("exerciseId", "==", log.exerciseId));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
        const existing = snap.docs[0];
        await updateDoc(doc(db, "users", userId, "workoutLogs", existing.id), { ...log });
    } else {
        await addDoc(collection(db, "users", userId, "workoutLogs"), log);
    }
  }
};

// --- Body Measurements ---

export const getMeasurements = async (): Promise<BodyMeasurement[]> => {
  try {
    const userId = getUserId();
    const querySnapshot = await getDocs(collection(db, "users", userId, "measurements"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BodyMeasurement));
  } catch (e) {
    return [];
  }
};

export const saveMeasurement = async (measurement: Omit<BodyMeasurement, 'id'> & { id?: string }) => {
    const userId = getUserId();
    
    // Check for existing measurement on this date
    const q = query(collection(db, "users", userId, "measurements"), where("date", "==", measurement.date));
    const snap = await getDocs(q);

    if (!snap.empty) {
        // Merge
        const existingDoc = snap.docs[0];
        await updateDoc(doc(db, "users", userId, "measurements", existingDoc.id), { ...measurement });
    } else {
        await addDoc(collection(db, "users", userId, "measurements"), measurement);
    }
};