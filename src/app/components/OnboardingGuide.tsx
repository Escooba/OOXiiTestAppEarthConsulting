import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../lib/theme';
import { X, ArrowRight } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

interface OnboardingGuideProps {
  onNav: (screen: ScreenId) => void;
  onComplete: () => void;
}

interface StepConfig {
  step: number;
  title: string;
  subtitle?: string;
  icon: string;
  bannerGradient: string;
  bodyText: string;
  screenTarget: ScreenId;
  buttonText?: string;
}

export function OnboardingGuide({ onNav, onComplete }: OnboardingGuideProps) {
  const { t } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: StepConfig[] = [
    {
      step: 1,
      title: `${t('guide.step1.title')} 🐰`,
      icon: '🐰',
      bannerGradient: 'bg-gradient-to-r from-[#2DD4BF] to-[#0D9488]',
      bodyText: t('guide.step1.body'),
      screenTarget: 'home',
    },
    {
      step: 2,
      title: t('guide.step2.title'),
      subtitle: `› ${t('guide.step2.sub')}`,
      icon: '🏠',
      bannerGradient: 'bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]',
      bodyText: t('guide.step2.body'),
      screenTarget: 'home',
    },
    {
      step: 3,
      title: t('guide.step3.title'),
      subtitle: `› ${t('guide.step3.sub')}`,
      icon: '🐰',
      bannerGradient: 'bg-gradient-to-r from-[#A855F7] to-[#7E22CE]',
      bodyText: t('guide.step3.body'),
      screenTarget: 'tester-profile',
    },
    {
      step: 4,
      title: t('guide.step4.title'),
      subtitle: `› ${t('guide.step4.sub')}`,
      icon: '🌱',
      bannerGradient: 'bg-gradient-to-r from-[#22C55E] to-[#15803D]',
      bodyText: t('guide.step4.body'),
      screenTarget: 'community-garden',
    },
    {
      step: 5,
      title: t('guide.step5.title'),
      icon: '✨',
      bannerGradient: 'bg-gradient-to-r from-[#F97316] to-[#C2410C]',
      bodyText: t('guide.step5.body'),
      screenTarget: 'home',
      buttonText: `${t('guide.lets_go')} 🐰`,
    },
  ];

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      onNav(steps[nextIndex].screenTarget);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-[360px] bg-[#121B2B] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            {/* Header Banner */}
            <div className={`w-full p-5 pt-6 pb-6 ${currentStep.bannerGradient} relative overflow-hidden flex items-start justify-between`}>
              {/* Translucent background circle decorative detail */}
              <div className="w-36 h-36 rounded-full bg-white/10 absolute -top-10 -right-10 pointer-events-none" />

              <div className="flex items-center gap-3.5 z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {currentStep.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-white leading-tight drop-shadow-xs">
                    {currentStep.title}
                  </h3>
                  {currentStep.subtitle && (
                    <span className="text-xs text-white/95 font-medium mt-1">
                      {currentStep.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Close X button */}
              <button
                onClick={handleSkip}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all z-10 shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Card Body */}
            <div className="px-5 pt-5 pb-2">
              <div className="bg-[#1A2538]/70 border border-slate-800/80 rounded-2xl p-4 min-h-[92px] flex items-center">
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {currentStep.bodyText}
                </p>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="px-5 pt-3 pb-5 flex flex-col gap-4">
              {/* Dots + Counter */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {steps.map((s, idx) => (
                    <div
                      key={s.step}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentStepIndex
                          ? 'w-6 bg-[#2DD4BF]'
                          : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {t('guide.step_counter', { step: currentStep.step, total: steps.length })}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSkip}
                  className="flex-1 py-3 px-4 rounded-full border border-slate-700/80 hover:bg-slate-800/50 text-slate-300 text-sm font-semibold transition-all text-center"
                >
                  {t('guide.skip')}
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-3 px-4 rounded-full bg-[#2DD4BF] hover:bg-[#25B8A7] text-[#091522] text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#2DD4BF]/20"
                >
                  <span>{currentStep.buttonText || t('ui.next')}</span>
                  {!currentStep.buttonText && <ArrowRight size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
