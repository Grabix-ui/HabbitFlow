import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Mail, Lock, CheckCircle2, ArrowRight, UserCircle, Loader2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, guestLogin, loading } = useAuth();
  const { t } = useSettings();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if(!email || !password) {
        setError("Please fill in all fields");
        return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-black transition-colors duration-500">
      <div className="w-full max-w-md">
        
        {/* Header / Logo */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 accent-soft rounded-2xl mx-auto flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(79,70,229,0.6)] dark:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] mb-6 transform transition-transform hover:scale-105">
                <span className="text-3xl font-bold text-white">H</span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {isLogin ? t('auth_login_title') : t('auth_register_title')}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
                {t('app_name')} - Track habits, gym & life.
            </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8 transition-colors">
            
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-zinc-500 dark:text-zinc-500 tracking-wider ml-1">
                        {t('auth_email')}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-zinc-500 dark:text-zinc-500 tracking-wider ml-1">
                        {t('auth_password')}
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            {isLogin ? t('auth_btn_login') : t('auth_btn_register')}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase">
                        {t('auth_or')}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <button className="w-full py-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {t('auth_google')}
                </button>
                <button 
                    onClick={guestLogin}
                    className="w-full py-3 bg-zinc-100 dark:bg-zinc-800/50 border border-transparent rounded-xl text-zinc-600 dark:text-zinc-400 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                    <UserCircle size={20} />
                    {t('auth_guest')}
                </button>
            </div>

            <div className="mt-8 text-center">
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                    }}
                    className="text-sm font-medium accent-text dark:accent-text hover:underline"
                >
                    {isLogin ? t('auth_switch_to_register') : t('auth_switch_to_login')}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};