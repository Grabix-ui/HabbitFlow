import React, { useMemo, useState } from 'react';
import { Habit, DailyLog, ChartDataPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Award, CalendarCheck } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface StatisticsProps {
  habits: Habit[];
  logs: DailyLog[];
}

const RANGES = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
];

export const Statistics: React.FC<StatisticsProps> = ({ habits, logs }) => {
  const { t, language } = useSettings();
  const [selectedRange, setSelectedRange] = useState(14);

  const data = useMemo(() => {
    const result: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = selectedRange - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const log = logs.find(l => l.date === dateStr);
      const completedCount = log ? log.completedHabits.length : 0;
      
      const rate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

      result.push({
        date: d.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { day: '2-digit', month: 'short' }),
        completionRate: rate,
        totalCompleted: completedCount
      });
    }
    return result;
  }, [habits, logs, selectedRange, language]);

  const stats = useMemo(() => {
    if (!logs.length) return { totalCompleted: 0, bestStreak: 0 };
    
    const totalCompleted = logs.reduce((acc, curr) => acc + curr.completedHabits.length, 0);
    return { totalCompleted };
  }, [logs]);

  if (habits.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-400 dark:text-zinc-500">
            <p>{t('add_habits_for_stats')}</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{t('performance')}</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
                <TrendingUp size={20} />
            </div>
            <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{data[data.length - 1]?.completionRate || 0}%</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{t('todays_rate')}</span>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
                <Award size={20} />
            </div>
            <span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{stats.totalCompleted}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{t('total_checkins')}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[400px] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                <CalendarCheck size={18} className="text-indigo-500 dark:text-indigo-400"/>
                {t('history')}
            </h3>
            
            {/* Range Selector */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg overflow-x-auto scrollbar-hide">
                {RANGES.map((range) => (
                    <button
                        key={range.label}
                        onClick={() => setSelectedRange(range.days)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                            selectedRange === range.days 
                            ? 'bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                    >
                        {t('range_' + range.label) || range.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-zinc-800" />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#a1a1aa', fontSize: 10}} 
                    dy={10}
                    padding={{ left: 16, right: 16 }}
                    interval={selectedRange <= 7 ? 0 : 'preserveStartEnd'} 
                    minTickGap={20}
                />
                <YAxis 
                    hide 
                    domain={[0, 100]}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="completionRate" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRate)" 
                    activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};