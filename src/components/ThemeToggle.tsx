"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { id: 'light', icon: Sun, label: 'Claro' },
    { id: 'dark', icon: Moon, label: 'Escuro' },
    { id: 'system', icon: Monitor, label: 'Auto' },
  ] as const;

  const currentTheme = themes.find(t => t.id === theme) || themes[2];
  const Icon = currentTheme.icon;

  return (
    <div className="relative">
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full shadow-lg hover:bg-white/30 transition-all flex items-center justify-center"
        title="Alterar tema"
      >
        <Icon className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown de Opções */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-12 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-2 min-w-[140px] z-50">
            {themes.map(({ id, icon: ThemeIcon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setTheme(id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${
                    theme === id
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <ThemeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
                {theme === id && (
                  <span className="ml-auto text-purple-600 dark:text-purple-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}