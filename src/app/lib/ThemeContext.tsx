import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { LanguageCode, translate, TranslationKey } from './i18n';

export type DisplayMode = 'ooxii' | 'light';

export interface ThemeTokens {
  bg: string;
  card: string;
  cardActive: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  input: string;
  inputBorder: string;
  headerBg: string;
  overlay: string;
  navPillBg: string;
  navPillActiveText: string;
  progressTrack: string;
}

const TOKENS: ThemeTokens = {
  bg: 'bg-[var(--bg)]',
  card: 'bg-[var(--card)]',
  cardActive: 'bg-[var(--card-active)]',
  cardBorder: 'border-[var(--card-border)]',
  text: 'text-[var(--text)]',
  textMuted: 'text-[var(--text-muted)]',
  input: 'bg-[var(--input)]',
  inputBorder: 'border-[var(--input-border)]',
  headerBg: 'bg-[var(--header-bg)]',
  overlay: 'bg-[var(--overlay)]',
  navPillBg: 'bg-[var(--nav-pill-bg)]',
  navPillActiveText: 'text-[var(--nav-pill-active-text)]',
  progressTrack: 'bg-[var(--progress-track)]',
};

interface Ctx {
  mode: DisplayMode;
  language: LanguageCode;
  tokens: ThemeTokens;
  t: (key: TranslationKey) => string;
  setMode: (m: DisplayMode) => void;
  setLanguage: (l: LanguageCode) => void;
}

const ThemeCtx = createContext<Ctx>({
  mode: 'ooxii',
  language: 'en',
  tokens: TOKENS,
  t: (k) => k,
  setMode: () => {},
  setLanguage: () => {},
});

import { useData } from '../../data/DataProvider';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { accountRepo, isInitialized } = useData();
  const [mode, setModeState] = useState<DisplayMode>('ooxii');
  const [language, setLanguageState] = useState<LanguageCode>('en');
  
  const t = useMemo(() => (key: TranslationKey) => translate(language, key), [language]);

  // Load preferences from SQLite on init
  React.useEffect(() => {
    if (!isInitialized || !accountRepo) return;
    accountRepo.getPreference('selected_theme').then((savedTheme) => {
      if (savedTheme) {
        let m: DisplayMode = savedTheme === 'light' ? 'light' : 'ooxii';
        setModeState(m);
        document.documentElement.setAttribute('data-theme', m);
      }
    });
    accountRepo.getPreference('selected_language').then((savedLang) => {
      if (savedLang) {
        setLanguageState(savedLang as LanguageCode);
      }
    });
  }, [isInitialized, accountRepo]);
  
  const setMode = (m: DisplayMode) => {
    setModeState(m);
    document.documentElement.setAttribute('data-theme', m);
    if (accountRepo) {
      accountRepo.setPreference('selected_theme', m);
    }
  };

  const setLanguage = (l: LanguageCode) => {
    setLanguageState(l);
    if (accountRepo) {
      accountRepo.setPreference('selected_language', l);
    }
  };

  return (
    <ThemeCtx.Provider value={{ mode, language, tokens: TOKENS, t, setMode, setLanguage }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
