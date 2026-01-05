import React, { useState } from 'react';
import { Habit } from '../types';
import { saveHabit, deleteHabit } from '../services/storage';
import { Plus, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HabitManagerProps {
  habits: Habit[];
  onUpdate: () => void;
}

export const HabitManager: React.FC<HabitManagerProps> = ({ habits, onUpdate }) => {
  const { t } = useSettings();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setEditingId(null);
    setIsAdding(false);
    setSaving(false);
  };

  const handleEdit = (habit: Habit) => {
    setTitle(habit.title);
    setCategory(habit.category);
    setEditingId(habit.id);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    
    try {
        await saveHabit({
          id: editingId || undefined,
          title: title.trim(),
          category: category.trim() || 'General',
        });
    
        onUpdate();
        resetForm();
    } catch (e) {
        console.error(e);
        setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('delete_habit_confirm'))) {
        await deleteHabit(id);
        onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{t('your_habits')}</h2>
        {!isAdding && (
            <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
            >
            <Plus size={18} />
            <span>{t('add_new')}</span>
            </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900 shadow-lg animate-in fade-in slide-in-from-top-4 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{editingId ? t('edit_habit') : t('new_habit')}</h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{t('habit_name')}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Morning Run"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">{t('category')}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Health"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-zinc-500 dark:text-zinc-400 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="animate-spin" size={16} />}
                {editingId ? t('save_changes') : t('create_habit')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all"
          >
            <div>
              <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">{habit.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 inline-block px-2 py-0.5 rounded-full mt-1">
                {habit.category}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(habit)}
                className="p-2 text-zinc-400 hover:accent-text dark:text-zinc-500 dark:hover:accent-text hover:accent-soft dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDelete(habit.id)}
                className="p-2 text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {habits.length === 0 && !isAdding && (
            <p className="text-center text-zinc-400 dark:text-zinc-600 py-8 text-sm">{t('no_habits_list')}</p>
        )}
      </div>
    </div>
  );
};