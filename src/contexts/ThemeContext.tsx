"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Detectar preferência do sistema
  useEffect(() => {
    setMounted(true);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        setEffectiveTheme(isDark ? 'dark' : 'light');
      }
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Carregar tema salvo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme !== 'system') {
        setEffectiveTheme(savedTheme as 'light' | 'dark');
      }
    }
  }, []);

  // ✅ APLICAR TEMA AO DOCUMENTO (CRITICAL FIX)
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Remover classes anteriores
    root.classList.remove('light', 'dark');
    
    // Adicionar classe correta
    root.classList.add(effectiveTheme);
    
    console.log('🎨 Tema aplicado:', effectiveTheme);
  }, [effectiveTheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme !== 'system') {
      setEffectiveTheme(newTheme as 'light' | 'dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveTheme(isDark ? 'dark' : 'light');
    }
  };

  // Evitar flash de tema errado
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}