import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getBridge, type ThemePreference, type ThemeState } from '@/bridge';

interface ThemeContextValue extends ThemeState {
  setPreference(preference: ThemePreference): void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'mudanzify:theme';
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

/** Browser-only fallback when the UI runs outside Electron. */
function resolveLocally(preference: ThemePreference): ThemeState {
  const resolved = preference === 'system' ? (darkQuery().matches ? 'dark' : 'light') : preference;
  return { preference, resolved };
}

function readLocalPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const bridge = getBridge();
  const [state, setState] = useState<ThemeState>(() => resolveLocally(readLocalPreference()));

  // The backend owns the preference when available (persisted + native theme).
  useEffect(() => {
    if (bridge) {
      void bridge.theme.get().then(setState);
      return bridge.theme.onChange(setState);
    }
    const query = darkQuery();
    const onSystemChange = () => setState((current) => resolveLocally(current.preference));
    query.addEventListener('change', onSystemChange);
    return () => query.removeEventListener('change', onSystemChange);
  }, [bridge]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.resolved === 'dark');
  }, [state.resolved]);

  const setPreference = useCallback(
    (preference: ThemePreference) => {
      if (bridge) {
        void bridge.theme.set(preference).then(setState);
        return;
      }
      localStorage.setItem(STORAGE_KEY, preference);
      setState(resolveLocally(preference));
    },
    [bridge],
  );

  const value = useMemo(() => ({ ...state, setPreference }), [state, setPreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
