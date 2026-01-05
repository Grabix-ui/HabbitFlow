
import React, { useState } from 'react';
import { saveConfig } from '../services/firebase';
import { Save, AlertTriangle, Code, Info, CheckCircle2, ArrowRight } from 'lucide-react';

interface FirebaseSetupProps {
    onComplete: () => void;
}

export const FirebaseSetup: React.FC<FirebaseSetupProps> = ({ onComplete }) => {
    const [json, setJson] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSave = () => {
        try {
            const input = json.trim();
            setError('');

            if (!input) {
                throw new Error("Proszę wklej kod z Firebase.");
            }

            // PANCERNY EKSTRAKTOR: Szukamy wzorców klucz: "wartość" niezależnie od formatowania
            const keys = [
                'apiKey', 'authDomain', 'projectId', 'storageBucket', 
                'messagingSenderId', 'appId', 'measurementId'
            ];
            
            const config: Record<string, string> = {};
            let foundCount = 0;

            keys.forEach(key => {
                // Szuka klucza, potem dwukropka, potem wartości w cudzysłowach (pojedynczych lub podwójnych)
                const regex = new RegExp(`${key}\\s*[:=]\\s*["']([^"']+)["']`, 'i');
                const match = input.match(regex);
                if (match && match[1]) {
                    config[key] = match[1];
                    if (key === 'apiKey' || key === 'projectId') foundCount++;
                }
            });

            if (!config.apiKey || !config.projectId) {
                throw new Error("Nie znaleziono kluczy 'apiKey' lub 'projectId'. Upewnij się, że kopiujesz cały blok 'firebaseConfig'.");
            }

            saveConfig(config);
            setIsSuccess(true);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Nie udało się odczytać kodu. Spróbuj skopiować go jeszcze raz.");
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-10 text-center space-y-6 border border-emerald-100 dark:border-emerald-900/30 animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Gotowe!</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">Konfiguracja została pomyślnie zapisana.</p>
                    </div>
                    <button 
                        onClick={() => onComplete()}
                        className="w-full py-4 accent-bg hover:accent-bg-hover text-white font-bold rounded-2xl shadow-lg accent-shadow dark:shadow-none transition-all flex items-center justify-center gap-2 group"
                    >
                        Uruchom Aplikację
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in duration-500">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-4">
                    <div className="w-12 h-12 accent-bg text-white rounded-2xl flex items-center justify-center shadow-lg accent-shadow dark:shadow-none">
                        <Code size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Połącz z Firebase</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Wklej kod firebaseConfig, aby aktywować bazę danych.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl flex gap-4">
                        <Info className="text-blue-600 shrink-0" size={20} />
                        <div className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                            <p className="font-bold mb-1">Jak to zrobić?</p>
                            <p>W konsoli Firebase (Ustawienia Projektu &rarr; Ogólne) znajdź sekcję "Twoje aplikacje" i skopiuj <strong>cały tekst</strong> widoczny w oknie kodu (nawet z komentarzami).</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <textarea 
                            value={json}
                            onChange={(e) => setJson(e.target.value)}
                            placeholder={`const firebaseConfig = {\n  apiKey: "...",\n  projectId: "...",\n  ...\n};`}
                            className="w-full h-56 bg-zinc-50 dark:bg-black border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 font-mono text-[12px] focus:border-accent-ring focus:ring-4 focus:accent-ring/10 outline-none transition-all resize-none shadow-inner"
                        />
                        {error && (
                            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in slide-in-from-left-2">
                                <AlertTriangle size={16} /> {error}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full py-4.5 accent-bg hover:accent-bg-hover text-white font-bold rounded-2xl shadow-xl accent-shadow dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Save size={20} />
                        Zapisz i kontynuuj
                    </button>
                    
                    <p className="text-[10px] text-center text-zinc-400 uppercase tracking-[0.2em] font-bold">
                        Działa z dowolnym formatowaniem tekstu
                    </p>
                </div>
            </div>
        </div>
    );
};
