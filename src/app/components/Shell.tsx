import React, { ReactNode, useState, createContext, useContext, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Flag, Wifi, Battery, Signal, Home as HomeIcon, Settings as SettingsIcon } from 'lucide-react';
import { RabbitMascot } from './RabbitMascot';
import { ScreenId } from '../lib/theme';
import { useTheme } from '../lib/ThemeContext';
import { SettingsModal } from './SettingsModal';

interface NavCtx {
  onNav: (s: ScreenId) => void;
  hasInProgressTest?: boolean;
}

export const ShellNavContext = createContext<NavCtx>({ onNav: () => {} });

export function ShellNavProvider({ children, onNav, hasInProgressTest }: NavCtx & { children: ReactNode }) {
  return (
    <ShellNavContext.Provider value={{ onNav, hasInProgressTest }}>{children}</ShellNavContext.Provider>
  );
}

interface ShellProps {
  children: ReactNode;
  progress?: number;
  showProgress?: boolean;
  onHome?: () => void;
  isAdvancing?: boolean;
}

export function Shell({ children, progress = 0, showProgress = true, onHome, isAdvancing = false }: ShellProps) {
  const { tokens, mode } = useTheme();
  const { onNav } = useContext(ShellNavContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const lastProgress = useRef(Number(sessionStorage.getItem('lastProgress') || 0));
  useEffect(() => {
    sessionStorage.setItem('lastProgress', String(progress));
  }, [progress]);

  const goHome = () => (onHome ? onHome() : onNav('home'));

  const isLight = mode === 'traditional_light';
  const statusText = isLight ? 'text-gray-600' : 'text-gray-300';

  const [time, setTime] = useState(() => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${tokens.bg} ${tokens.text} flex flex-col font-sans items-center overflow-x-hidden`}>
      <div className="w-full max-w-[430px] relative min-h-screen flex flex-col shadow-2xl bg-inherit">
        <div className={`flex justify-between items-center px-6 py-3 text-xs font-medium ${statusText}`}>
          <span>{time}</span>
          <div className="flex items-center gap-2">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-between z-20 gap-2">
          <div className={`font-bold text-xl tracking-wide ${tokens.text}`}>OOXii</div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={goHome}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${tokens.navPillBg} ${tokens.text} border-[#A984FF]/30 hover:border-[#A984FF]`}
            >
              <HomeIcon size={13} />
              Home
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${tokens.navPillBg} ${tokens.text} border-[#A984FF]/30 hover:border-[#A984FF]`}
            >
              <SettingsIcon size={13} />
              Settings
            </button>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border ${tokens.navPillBg} border-[#3A3059]`}>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>
          </div>
        </div>

        {showProgress && (
          <div className={`sticky top-0 z-30 pt-4 pb-6 px-6 bg-gradient-to-b ${
            mode === 'ooxii_purple' ? 'from-[#2A0730] via-[#2A0730]' :
            mode === 'traditional_light' ? 'from-[#F5F5F7] via-[#F5F5F7]' :
            'from-[#111214] via-[#111214]'} to-transparent`}>
            <div className="flex justify-between items-end mb-2 pr-8">
              <span className={`text-xs ${tokens.textMuted} font-semibold uppercase tracking-wider`}>Overall Progress</span>
              <span className="text-[#A984FF] font-bold text-sm">{progress}%</span>
            </div>
            <div className="relative w-[calc(100%-32px)] mt-2">
              <div className={`relative w-full h-3 rounded-full ${tokens.progressTrack} border border-white/5 overflow-hidden`}>
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#A984FF] shadow-[0_0_12px_rgba(0,209,193,0.4)]"
                  initial={{ width: `${lastProgress.current}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                />
              </div>
              <motion.div
                className="absolute top-1/2 z-20"
                initial={{ left: `${Math.max(3, lastProgress.current)}%` }}
                animate={{ left: `${Math.max(3, progress)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                  className={`bg-[#2A0730] rounded-full shadow-[0_0_10px_rgba(0,209,193,0.6)] border border-[#A984FF] flex items-center justify-center w-6 h-6`}
                >
                  <RabbitMascot size={14} />
                </motion.div>
              </motion.div>
              <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 opacity-50">
                <Flag size={16} className={progress >= 100 ? 'text-[#A984FF] fill-[#A984FF]' : ''} />
              </div>
            </div>
          </div>
        )}

        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: isAdvancing ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>

        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}

export function BottomBar({
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Back',
  nextDisabled = false,
  hideBack = false,
  hideNext = false,
}: {
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  hideNext?: boolean;
}) {
  const { mode } = useTheme();
  const grad =
    mode === 'ooxii_purple'
      ? 'from-[#2A0730] via-[#2A0730] to-[#2A0730]/0'
      : mode === 'traditional_light'
      ? 'from-[#F5F5F7] via-[#F5F5F7] to-[#F5F5F7]/0'
      : 'from-[#111214] via-[#111214] to-[#111214]/0';
  const backCls = mode === 'traditional_light'
    ? 'border-[#D0D2DE] text-[#1A1B3A] hover:bg-black/5'
    : 'border-white/20 text-white hover:bg-white/5';
  return (
    <div className={`fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t ${grad} z-40 flex justify-center pointer-events-none`}>
      <div className="w-full max-w-[430px] flex gap-3 pointer-events-auto">
        {!hideBack && (
          <button
            onClick={onBack}
            className={`flex-1 max-w-[110px] h-14 rounded-2xl border font-medium flex items-center justify-center gap-2 active:scale-95 transition-all ${backCls}`}
          >
            {backLabel}
          </button>
        )}
        {!hideNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`flex-[2] h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
              nextDisabled
                ? 'bg-[#3A3059] text-[#6A608A] cursor-not-allowed'
                : 'bg-[#A984FF] text-[#2A0730] hover:brightness-110 shadow-[#A984FF]/20'
            }`}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
