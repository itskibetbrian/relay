import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { db } from '../services/database';

export type AppThemeMode = 'light' | 'dark';

export interface AppThemePalette {
  mode: AppThemeMode;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  primarySoft: string;
  success: string;
  danger: string;
  header: string;
  tabGlass: string;
  tabBorder: string;
  tabInactive: string;
  tabInset: string;
  shadow: string;
}

const LIGHT_THEME: AppThemePalette = {
  mode: 'light',
  background: '#EDE9F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3FF',
  text: '#1E1B2E',
  textSecondary: '#6B7280',
  textMuted: '#7A7A85',
  border: '#DDD6FE',
  primary: '#7C3AED',
  primarySoft: '#EEE7FF',
  success: '#10B981',
  danger: '#EF4444',
  header: '#FFFFFF',
  tabGlass: 'rgba(68, 49, 103, 0.28)',
  tabBorder: 'rgba(255, 255, 255, 0.18)',
  tabInactive: '#322B45',
  tabInset: '#EDE9F6',
  shadow: '#140C24',
};

const DARK_THEME: AppThemePalette = {
  mode: 'dark',
  background: '#14131C',
  surface: '#1D1B29',
  surfaceAlt: '#262338',
  text: '#F8F7FF',
  textSecondary: '#B5B3C7',
  textMuted: '#CFCBE6',
  border: '#37314D',
  primary: '#8B5CF6',
  primarySoft: '#3C2A69',
  success: '#34D399',
  danger: '#FB7185',
  header: '#1A1824',
  tabGlass: 'rgba(20, 18, 32, 0.72)',
  tabBorder: 'rgba(255, 255, 255, 0.08)',
  tabInactive: 'rgba(255,255,255,0.85)',
  tabInset: '#14131C',
  shadow: '#05040A',
};

interface ThemeContextValue {
  theme: AppThemePalette;
  mode: AppThemeMode;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppThemeMode>('dark');

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const storedMode = await db.getPreference('theme_mode');
        if (isMounted && (storedMode === 'light' || storedMode === 'dark')) {
          setMode(storedMode);
        }
      } catch {
        // Ignore until the database is ready.
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextMode: AppThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
    try {
      await db.setPreference('theme_mode', nextMode);
    } catch {
      // Best-effort persistence only.
    }
  }, [mode]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme: mode === 'light' ? LIGHT_THEME : DARK_THEME,
    mode,
    toggleTheme,
  }), [mode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
