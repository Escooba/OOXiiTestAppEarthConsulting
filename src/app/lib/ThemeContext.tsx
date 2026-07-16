import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DisplayMode = 'ooxii_purple' | 'traditional_light' | 'traditional_dark';
export type Language =
  | 'English' | 'Tok Pisin' | 'Bislama' | 'French' | 'Spanish'
  | 'Portuguese' | 'Bahasa Indonesia' | 'Mongolian';

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

const PURPLE: ThemeTokens = {
  bg: 'bg-[#150F26]',
  card: 'bg-[#22193B]',
  cardActive: 'bg-[#2A2049]',
  cardBorder: 'border-white/5',
  text: 'text-white',
  textMuted: 'text-[#9B93BA]',
  input: 'bg-[#150F26]',
  inputBorder: 'border-white/10',
  headerBg: 'bg-[#150F26]',
  overlay: 'bg-[#150F26]/90',
  navPillBg: 'bg-[#22193B]',
  navPillActiveText: 'text-[#150F26]',
  progressTrack: 'bg-[#22193B]',
};
const LIGHT: ThemeTokens = {
  bg: 'bg-[#F5F5F7]',
  card: 'bg-white',
  cardActive: 'bg-white',
  cardBorder: 'border-[#E1E1E8]',
  text: 'text-[#1A1B3A]',
  textMuted: 'text-[#6A6F8A]',
  input: 'bg-white',
  inputBorder: 'border-[#D0D2DE]',
  headerBg: 'bg-white',
  overlay: 'bg-white/90',
  navPillBg: 'bg-[#EDEDF3]',
  navPillActiveText: 'text-white',
  progressTrack: 'bg-[#E1E1E8]',
};
const DARK: ThemeTokens = {
  bg: 'bg-[#111214]',
  card: 'bg-[#1D1E22]',
  cardActive: 'bg-[#26272C]',
  cardBorder: 'border-white/5',
  text: 'text-white',
  textMuted: 'text-[#9AA0A8]',
  input: 'bg-[#111214]',
  inputBorder: 'border-white/10',
  headerBg: 'bg-[#111214]',
  overlay: 'bg-black/80',
  navPillBg: 'bg-[#1D1E22]',
  navPillActiveText: 'text-[#111214]',
  progressTrack: 'bg-[#26272C]',
};

const TOKEN_MAP: Record<DisplayMode, ThemeTokens> = {
  ooxii_purple: PURPLE,
  traditional_light: LIGHT,
  traditional_dark: DARK,
};

interface Ctx {
  mode: DisplayMode;
  language: Language;
  tokens: ThemeTokens;
  setMode: (m: DisplayMode) => void;
  setLanguage: (l: Language) => void;
}

const ThemeCtx = createContext<Ctx>({
  mode: 'ooxii_purple',
  language: 'English',
  tokens: PURPLE,
  setMode: () => {},
  setLanguage: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DisplayMode>('ooxii_purple');
  const [language, setLanguage] = useState<Language>('English');
  return (
    <ThemeCtx.Provider value={{ mode, language, tokens: TOKEN_MAP[mode], setMode, setLanguage }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
