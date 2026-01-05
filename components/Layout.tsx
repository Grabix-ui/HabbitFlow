import React, { useState } from 'react';
import { ViewState, AccentColor } from '../types';
import { LayoutDashboard, ListTodo, BarChart2, Dumbbell, Settings, Moon, Sun, Smartphone, X, Globe, Palette, Check, LogOut } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const COLORS: { id: AccentColor; color: string }[] = [
    { id: 'indigo', color: '#6366f1' }, // Default
    { id: 'emerald', color: '#059669' },
    { id: 'sky', color: '#0284c7' },
    { id: 'violet', color: '#7c3aed' },
    { id: 'rose', color: '#e11d48' },
    { id: 'amber', color: '#d97706' },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onChangeView }) => {
  const { theme, setTheme, language, setLanguage, accentColor, setAccentColor, t } = useSettings();
  const { logout, user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
      logout();
      setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-indigo-200 dark:shadow-none shadow-lg transition-colors">
              H
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">{t('app_name')}</h1>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        {children}
      </main>

      <nav className="sticky bottom-0 bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 pb-safe pt-2 px-6 transition-colors duration-300">
        <div className="max-w-md mx-auto flex justify-between items-center h-16">
          <button
            onClick={() => onChangeView('dashboard')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeView === 'dashboard' ? 'text-indigo-600 bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <LayoutDashboard size={24} strokeWidth={activeView === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('nav_today')}</span>
          </button>
          
          <button
            onClick={() => onChangeView('habits')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeView === 'habits' ? 'text-indigo-600 bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <ListTodo size={24} strokeWidth={activeView === 'habits' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('nav_habits')}</span>
          </button>

          <button
            onClick={() => onChangeView('gym')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeView === 'gym' ? 'text-indigo-600 bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <Dumbbell size={24} strokeWidth={activeView === 'gym' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('nav_gym')}</span>
          </button>

          <button
            onClick={() => onChangeView('stats')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeView === 'stats' ? 'text-indigo-600 bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <BarChart2 size={24} strokeWidth={activeView === 'stats' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{t('nav_stats')}</span>
          </button>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
             <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
               <h2 className="font-bold text-lg text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                 <Settings size={20} className="text-zinc-500" />
                 {t('settings')}
               </h2>
               <button onClick={() => setShowSettings(false)} className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                 <X size={20} />
               </button>
             </div>
             
             <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
               
               {/* Account Info */}
               <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-3 flex items-center gap-3 border border-indigo-100 dark:border-indigo-900/30">
                   <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-bold">
                       {user?.email?.[0].toUpperCase() || 'U'}
                   </div>
                   <div className="overflow-hidden">
                       <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold">Logged in as</p>
                       <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">{user?.email}</p>
                   </div>
               </div>

               {/* Accent Color Selector */}
               <div className="space-y-3">
                   <label className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider block">{t('accent_label')}</label>
                   <div className="grid grid-cols-3 gap-3">
                       {COLORS.map((c) => (
                           <button
                            key={c.id}
                            onClick={() => setAccentColor(c.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                accentColor === c.id
                                ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 ring-1 ring-zinc-300 dark:ring-zinc-500'
                                : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                            }`}
                           >
                               <div 
                                style={{ backgroundColor: c.color }}
                                className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                               >
                                   {accentColor === c.id && <Check size={16} className="text-white" />}
                               </div>
                               <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{t('color_' + c.id)}</span>
                           </button>
                       ))}
                   </div>
               </div>

               <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

               {/* Theme Selector */}
               <div className="space-y-3">
                 <label className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider block">{t('theme_label')}</label>
                 <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        theme === 'light' 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-zinc-800 dark:border-indigo-500 dark:text-indigo-400' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Sun size={20} />
                      <span className="text-xs font-medium">{t('theme_light')}</span>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        theme === 'dark' 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-zinc-800 dark:border-indigo-500 dark:text-indigo-400' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Moon size={20} />
                      <span className="text-xs font-medium">{t('theme_dark')}</span>
                    </button>
                    <button 
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        theme === 'system' 
                           ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-zinc-800 dark:border-indigo-500 dark:text-indigo-400' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <Smartphone size={20} />
                      <span className="text-xs font-medium">{t('theme_system')}</span>
                    </button>
                 </div>
               </div>

               {/* Language Selector */}
               <div className="space-y-3">
                 <label className="text-xs font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider block">{t('lang_label')}</label>
                 <div className="grid grid-cols-2 gap-2">
                   <button 
                      onClick={() => setLanguage('en')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        language === 'en' 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-zinc-800 dark:border-indigo-500 dark:text-indigo-400' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-sm font-medium">{t('lang_en')}</span>
                   </button>
                   <button 
                      onClick={() => setLanguage('pl')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                        language === 'pl' 
                           ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-zinc-800 dark:border-indigo-500 dark:text-indigo-400' 
                          : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-black dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <span className="text-lg">🇵🇱</span>
                      <span className="text-sm font-medium">{t('lang_pl')}</span>
                   </button>
                 </div>
               </div>

               <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
               
               {/* Logout Button */}
               <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-rose-600 dark:text-rose-500 font-medium rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors flex items-center justify-center gap-2"
               >
                   <LogOut size={18} />
                   {t('logout')}
               </button>

             </div>

             <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
                >
                  {t('close')}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};