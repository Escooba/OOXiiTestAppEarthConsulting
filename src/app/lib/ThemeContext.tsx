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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DisplayMode>('ooxii');
  const [language, setLanguage] = useState<LanguageCode>('en');
  
  const t = useMemo(() => (key: TranslationKey) => translate(language, key), [language]);
  
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ThemeCtx.Provider value={{ mode, language, tokens: TOKENS, t, setMode, setLanguage }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
