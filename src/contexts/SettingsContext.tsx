import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, Language, AccentColor } from '../types';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const translations = {
  en: {
    // Nav & General
    app_name: "HabitFlow",
    nav_today: "Today",
    nav_habits: "Habits",
    nav_gym: "Gym",
    nav_stats: "Stats",
    loading: "Loading HabitFlow...",
    settings: "Settings",
    close: "Close",
    
    // Auth
    auth_login_title: "Welcome Back",
    auth_register_title: "Create Account",
    auth_email: "Email Address",
    auth_password: "Password",
    auth_btn_login: "Sign In",
    auth_btn_register: "Sign Up",
    auth_switch_to_register: "Don't have an account? Sign up",
    auth_switch_to_login: "Already have an account? Sign in",
    auth_or: "OR",
    auth_google: "Continue with Google",
    auth_guest: "Continue as Guest",
    logout: "Log Out",

    // Settings
    theme_label: "Appearance",
    theme_light: "Light",
    theme_dark: "Dark",
    theme_system: "System",
    lang_label: "Language",
    lang_en: "English",
    lang_pl: "Polish",
    accent_label: "Theme Color",
    color_indigo: "Indigo",
    color_emerald: "Emerald",
    color_rose: "Rose",
    color_amber: "Amber",
    color_sky: "Sky",
    color_violet: "Violet",
    
    // Dashboard
    daily_goals: "Daily Goals",
    todays_workout: "Today's Workout",
    insight_btn: "Get AI Assistant Insight",
    insight_loading: "Analyzing your habits...",
    no_habits_dash: "No habits yet. Go to the Habits tab to add one!",
    edit: "Edit",
    log: "Log",
    sets_reps: "sets • reps",
    workout_complete: "All exercises completed! Great job.",
    
    // Habits
    your_habits: "Your Habits",
    add_new: "Add New",
    new_habit: "New Habit",
    edit_habit: "Edit Habit",
    habit_name: "Habit Name",
    category: "Category (Optional)",
    cancel: "Cancel",
    save_changes: "Save Changes",
    create_habit: "Create Habit",
    delete_habit_confirm: "Are you sure you want to delete this habit? All history will be kept but it will be removed from your list.",
    no_habits_list: "You haven't added any habits yet.",
    
    // Gym
    workout_tab: "Workout",
    body_stats_tab: "Body Stats",
    log_workout: "Log Workout",
    edit_routine: "Edit Routine",
    edit_plan: "Edit Plan",
    done_editing: "Done Editing",
    add_exercise_to: "Add to",
    exercise_name: "Exercise Name",
    day: "Day",
    target_sets: "Target Sets",
    target_reps: "Target Reps",
    save_to_plan: "Save to Plan",
    no_workout_planned: "No workout planned for",
    personal_best: "Personal Best",
    last_session: "Last Session",
    viewing_history: "Viewing History",
    view_progress: "View Progress History",
    add_set: "Add Set",
    set: "Set",
    weight_kg: "kg",
    reps: "Reps",
    view_readonly: "Viewing past data (Read-only)",
    update_plan: "Update Plan",
    delete_exercise_confirm: "Delete this exercise from your plan? History will remain.",
    
    // Measurements
    body_measurements: "Body Measurements",
    date: "Date",
    weight: "Weight (kg)",
    biceps: "Biceps (cm)",
    chest: "Chest (cm)",
    waist: "Waist (cm)",
    thigh: "Thigh (cm)",
    calves: "Calves (cm)",
    save_measurements: "Save Measurements",
    update_measurements: "Update Measurements",
    progress_chart: "Progress Chart",
    
    // Stats
    performance: "Performance",
    todays_rate: "Today's Rate",
    total_checkins: "Total Check-ins",
    history: "History",
    add_habits_for_stats: "Add habits to see statistics.",
    
    // Days Short
    short_Mon: "Mon",
    short_Tue: "Tue",
    short_Wed: "Wed",
    short_Thu: "Thu",
    short_Fri: "Fri",
    short_Sat: "Sat",
    short_Sun: "Sun",

    // Ranges
    range_7D: "7D",
    range_14D: "14D",
    range_1M: "1M",
    range_3M: "3M",
    range_6M: "6M",
    range_1Y: "1Y",
    range_ALL: "ALL"
  },
  pl: {
    // Nav & General
    app_name: "HabitFlow",
    nav_today: "Dziś",
    nav_habits: "Nawyki",
    nav_gym: "Siłownia",
    nav_stats: "Statystyki",
    loading: "Ładowanie HabitFlow...",
    settings: "Ustawienia",
    close: "Zamknij",

    // Auth
    auth_login_title: "Witaj Ponownie",
    auth_register_title: "Utwórz Konto",
    auth_email: "Adres Email",
    auth_password: "Hasło",
    auth_btn_login: "Zaloguj się",
    auth_btn_register: "Zarejestruj się",
    auth_switch_to_register: "Nie masz konta? Zarejestruj się",
    auth_switch_to_login: "Masz już konto? Zaloguj się",
    auth_or: "LUB",
    auth_google: "Kontynuuj z Google",
    auth_guest: "Wejdź jako Gość",
    logout: "Wyloguj się",
    
    // Settings
    theme_label: "Wygląd",
    theme_light: "Jasny",
    theme_dark: "Ciemny",
    theme_system: "Systemowy",
    lang_label: "Język",
    lang_en: "Angielski",
    lang_pl: "Polski",
    accent_label: "Kolor Motywu",
    color_indigo: "Domyślny (Indygo)",
    color_emerald: "Szmaragdowy",
    color_rose: "Różany",
    color_amber: "Bursztynowy",
    color_sky: "Błękitny",
    color_violet: "Fioletowy",
    
    // Dashboard
    daily_goals: "Dzisiejsze Cele",
    todays_workout: "Dzisiejszy Trening",
    insight_btn: "Uzyskaj poradę AI",
    insight_loading: "Analizuję Twoje nawyki...",
    no_habits_dash: "Brak nawyków. Przejdź do zakładki Nawyki, aby dodać pierwszy!",
    edit: "Edytuj",
    log: "Zapisz",
    sets_reps: "serie • powt",
    workout_complete: "Wszystkie ćwiczenia wykonane! Dobra robota.",
    
    // Habits
    your_habits: "Twoje Nawyki",
    add_new: "Dodaj",
    new_habit: "Nowy Nawyk",
    edit_habit: "Edytuj Nawyk",
    habit_name: "Nazwa Nawyku",
    category: "Kategoria (Opcjonalne)",
    cancel: "Anuluj",
    save_changes: "Zapisz Zmiany",
    create_habit: "Utwórz Nawyk",
    delete_habit_confirm: "Czy na pewno chcesz usunąć ten nawyk? Historia zostanie zachowana, ale zniknie z listy.",
    no_habits_list: "Nie dodałeś jeszcze żadnych nawyków.",
    
    // Gym
    workout_tab: "Trening",
    body_stats_tab: "Pomiary Ciała",
    log_workout: "Zapisz Trening",
    edit_routine: "Edytuj Plan",
    edit_plan: "Zmień Plan",
    done_editing: "Zakończ Edycję",
    add_exercise_to: "Dodaj do",
    exercise_name: "Nazwa Ćwiczenia",
    day: "Dzień",
    target_sets: "Cele Serii",
    target_reps: "Cele Powtórzeń",
    save_to_plan: "Zapisz do Planu",
    no_workout_planned: "Brak planu na",
    personal_best: "Rekord Życiowy",
    last_session: "Ostatni Trening",
    viewing_history: "Podgląd Historii",
    view_progress: "Zobacz Wykres Progresu",
    add_set: "Dodaj Serię",
    set: "Seria",
    weight_kg: "kg",
    reps: "Powt",
    view_readonly: "Przeglądasz historię (Tylko do odczytu)",
    update_plan: "Aktualizuj Plan",
    delete_exercise_confirm: "Usunąć ćwiczenie z planu? Historia pozostanie.",
    
    // Measurements
    body_measurements: "Pomiary Ciała",
    date: "Data",
    weight: "Waga (kg)",
    biceps: "Biceps (cm)",
    chest: "Klatka (cm)",
    waist: "Talia (cm)",
    thigh: "Udo (cm)",
    calves: "Łydki (cm)",
    save_measurements: "Zapisz Pomiary",
    update_measurements: "Aktualizuj Pomiary",
    progress_chart: "Wykres Postępów",
    
    // Stats
    performance: "Wydajność",
    todays_rate: "Dzisiejszy Wynik",
    total_checkins: "Wszystkie Wykonania",
    history: "Historia",
    add_habits_for_stats: "Dodaj nawyki, aby zobaczyć statystyki.",

    // Days Short
    short_Mon: "Pn",
    short_Tue: "Wt",
    short_Wed: "Śr",
    short_Thu: "Cz",
    short_Fri: "Pt",
    short_Sat: "So",
    short_Sun: "Nd",

    // Ranges
    range_7D: "7D",
    range_14D: "14D",
    range_1M: "1M",
    range_3M: "3M",
    range_6M: "6M",
    range_1Y: "1R",
    range_ALL: "MAX"
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('habitflow_theme') as Theme) || 'system';
  });
  
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('habitflow_lang') as Language) || 'en';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('habitflow_accent') as AccentColor) || 'indigo';
  });
useEffect(() => {
  localStorage.setItem('habitflow_theme', theme);

  const root = document.documentElement;
  const body = document.body;
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = () => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && mq.matches);

    root.classList.toggle('dark', isDark);
    body.classList.toggle('dark', isDark);
  };

  apply();

  // gdy theme = system i user zmieni motyw w systemie, apka ma reagowac
  const handler = () => {
    if (theme === 'system') apply();
  };

  if (mq.addEventListener) mq.addEventListener('change', handler);
  else mq.addListener(handler); // starsze Safari

  return () => {
    if (mq.removeEventListener) mq.removeEventListener('change', handler);
    else mq.removeListener(handler);
  };
}, [theme]);

  useEffect(() => {
    localStorage.setItem('habitflow_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('habitflow_accent', accentColor);
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-emerald', 'theme-rose', 'theme-amber', 'theme-sky', 'theme-violet');
    
    // Add new theme class (if not indigo, which is default)
    if (accentColor !== 'indigo') {
        root.classList.add(`theme-${accentColor}`);
    }
  }, [accentColor]);

  const t = (key: string): string => {
    const dict = translations[language] as Record<string, string>;
    return dict[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage, accentColor, setAccentColor, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};