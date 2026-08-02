import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId } from '../lib/theme';
import { X, ArrowRight, UserPlus, User, Sprout, Sparkles, ChevronRight } from 'lucide-react';
import { RabbitMascot } from './RabbitMascot';
import { useTheme } from '../lib/ThemeContext';

interface OnboardingGuideProps {
  onNav: (screen: ScreenId) => void;
  onComplete: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface StepConfig {
  step: number;
  tourTarget: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  bannerGradient: string;
  bodyText: string;
  screenTarget: ScreenId;
  buttonText?: string;
}

export function OnboardingGuide({ onNav, onComplete }: OnboardingGuideProps) {
  const { t } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const steps: StepConfig[] = [
    {
      step: 1,
      tourTarget: 'welcome-hero',
      title: t('guide.step1.title'),
      subtitle: t('guide.step1.sub'),
      icon: <RabbitMascot size={26} />,
      bannerGradient: 'from-[#A984FF] to-[#0FB5A8]',
      bodyText: t('guide.step1.body'),
      screenTarget: 'home',
    },
    {
      step: 2,
      tourTarget: 'new-client',
      title: t('guide.step2.title'),
      subtitle: t('guide.step2.sub'),
      icon: <UserPlus size={22} className="text-white" />,
      bannerGradient: 'from-[#3B82F6] to-[#1D4ED8]',
      bodyText: t('guide.step2.body'),
      screenTarget: 'home',
    },
    {
      step: 3,
      tourTarget: 'profile-card',
      title: t('guide.step3.title'),
      subtitle: t('guide.step3.sub'),
      icon: <User size={22} className="text-white" />,
      bannerGradient: 'from-[#A855F7] to-[#7E22CE]',
      bodyText: t('guide.step3.body'),
      screenTarget: 'tester-profile',
    },
    {
      step: 4,
      tourTarget: 'garden-viewport',
      title: t('guide.step4.title'),
      subtitle: t('guide.step4.sub'),
      icon: <Sprout size={22} className="text-white" />,
      bannerGradient: 'from-[#22C55E] to-[#15803D]',
      bodyText: t('guide.step4.body'),
      screenTarget: 'community-garden',
    },
    {
      step: 5,
      tourTarget: 'welcome-hero',
      title: t('guide.step5.title'),
      subtitle: t('guide.step5.sub'),
      icon: <Sparkles size={22} className="text-white" />,
      bannerGradient: 'from-[#F97316] to-[#C2410C]',
      bodyText: t('guide.step5.body'),
      screenTarget: 'home',
      buttonText: t('guide.lets_go'),
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Navigate to target screen when step changes
  useEffect(() => {
    if (currentStep.screenTarget) {
      onNav(currentStep.screenTarget);
    }
  }, [currentStepIndex, currentStep.screenTarget, onNav]);

  // Measures active target element location on DOM
  const updateTargetRect = useCallback(() => {
    if (!currentStep.tourTarget) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(`[data-tour="${currentStep.tourTarget}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [currentStep.tourTarget]);

  useEffect(() => {
    updateTargetRect();
    const handleResize = () => updateTargetRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    const interval = setInterval(updateTargetRect, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
      clearInterval(interval);
    };
  }, [updateTargetRect, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
    } else {
      onNav('home');
      onComplete();
    }
  };

  const handleSkip = () => {
    onNav('home');
    onComplete();
  };

  // Determine top vs bottom positioning for the speech bubble card
  // If target center is in lower half of viewport, place card near top; otherwise place near bottom
  const targetCenterY = targetRect ? targetRect.top + targetRect.height / 2 : window.innerHeight / 2;
  const isTargetInLowerHalf = targetCenterY > window.innerHeight / 2;

  const targetPadding = 6;
  const spotlightBox = targetRect
    ? {
        top: Math.max(0, targetRect.top - targetPadding),
        left: Math.max(0, targetRect.left - targetPadding),
        width: targetRect.width + targetPadding * 2,
        height: targetRect.height + targetPadding * 2,
      }
    : null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden pointer-events-auto select-none">
      {/* Darkened overlay with cutout mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="spotlight-guide-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlightBox && (
              <rect
                x={spotlightBox.left}
                y={spotlightBox.top}
                width={spotlightBox.width}
                height={spotlightBox.height}
                rx="20"
                ry="20"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#0B0817"
          fillOpacity="0.82"
          mask="url(#spotlight-guide-mask)"
        />
      </svg>

      {/* Bright Green Active Feature Spotlight Ring */}
      {spotlightBox && (
        <motion.div
          initial={false}
          animate={{
            top: spotlightBox.top,
            left: spotlightBox.left,
            width: spotlightBox.width,
            height: spotlightBox.height,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="absolute rounded-[22px] border-2 border-[#22C55E] shadow-[0_0_24px_rgba(34,197,94,0.7)] pointer-events-none z-[201]"
        />
      )}

      {/* Speech Bubble / Mascot Card positioned top or bottom */}
      <div
        className={`absolute left-0 right-0 px-4 flex justify-center z-[202] transition-all duration-300 ${
          isTargetInLowerHalf ? 'top-6' : 'bottom-6'
        }`}
      >
        <div className="w-full max-w-[390px] flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.step}
              initial={{ opacity: 0, y: isTargetInLowerHalf ? -12 : 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isTargetInLowerHalf ? -8 : 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full bg-[#1C1633] rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
            >
              {/* Card Banner Header */}
              <div className={`relative bg-gradient-to-r ${currentStep.bannerGradient} p-4.5 pt-5 pb-5 overflow-hidden flex items-start justify-between`}>
                <div className="w-28 h-28 rounded-full bg-white/10 absolute -top-8 -right-8 pointer-events-none" />

                <div className="flex items-center gap-3 z-10">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    {currentStep.icon}
                  </div>
                  <div className="flex flex-col pr-6">
                    <h3 className="text-lg font-bold text-white leading-tight drop-shadow-xs">
                      {currentStep.title}
                    </h3>
                    {currentStep.subtitle && (
                      <span className="text-xs text-white/90 font-medium mt-0.5 flex items-center gap-1">
                        <ChevronRight size={12} />
                        {currentStep.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-10 shrink-0"
                  aria-label={t('guide.skip')}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 pt-4 pb-2">
                <div className="bg-[#120D24]/80 border border-white/10 rounded-2xl p-3.5 min-h-[76px] flex items-center">
                  <p className="text-xs sm:text-sm text-[#C7BFE4] leading-relaxed font-normal">
                    {currentStep.bodyText}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 pt-2 pb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    {steps.map((s, idx) => (
                      <motion.div
                        key={s.step}
                        animate={{ width: idx === currentStepIndex ? 20 : 7 }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === currentStepIndex ? 'bg-[#22C55E]' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#9B93BA]">
                    {t('guide.step_counter', { step: currentStep.step, total: steps.length })}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 py-2.5 px-3 rounded-2xl border border-white/15 hover:bg-white/5 text-[#C7BFE4] text-xs font-semibold transition-colors text-center"
                  >
                    {t('guide.skip')}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[1.4] py-2.5 px-3 rounded-2xl bg-[#22C55E] hover:bg-[#16A34A] text-[#091522] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#22C55E]/25 active:scale-[0.98]"
                  >
                    <span>{currentStep.buttonText || t('ui.next')}</span>
                    {!currentStep.buttonText && <ArrowRight size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
