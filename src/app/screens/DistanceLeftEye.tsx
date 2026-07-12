import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RabbitMascot } from '../components/RabbitMascot';
import { LineSlider } from '../components/LineSlider';
import {
  Flag,
  Check,
  AlertCircle,
  ChevronDown,
  User,
  Wifi,
  Battery,
  Signal,
  ArrowRight,
  X,
  HelpCircle,
  PlayCircle,
  Play,
  Home as HomeIcon,
  Settings as SettingsIcon,
} from 'lucide-react';
import { ShellNavContext } from '../components/Shell';
import { SettingsModal } from '../components/SettingsModal';

const theme = {
  bg: 'bg-[#150F26]',
  card: 'bg-[#22193B]',
  cardActive: 'bg-[#2A2049]',
  teal: '#00D1C1',
  tealText: 'text-[#00D1C1]',
  tealBg: 'bg-[#00D1C1]',
  tealBorder: 'border-[#00D1C1]',
  error: '#FF5C5C',
  errorText: 'text-[#FF5C5C]',
  errorBorder: 'border-[#FF5C5C]',
  textMain: 'text-white',
  textMuted: 'text-[#9B93BA]',
  trackEmpty: 'bg-[#3A3059]',
};

interface Props {
  onNext: (data: { line: string; letters: string }) => void;
  onBack: () => void;
}

export function DistanceLeftEye({ onNext, onBack }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [selectedLetters, setSelectedLetters] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const [activeHelp, setActiveHelp] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { onNav } = useContext(ShellNavContext);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const advanceTimeoutRef1 = useRef<NodeJS.Timeout>();
  const advanceTimeoutRef2 = useRef<NodeJS.Timeout>();

  const isStep1Complete = selectedLine !== '';
  const isStep2Complete = selectedLetters !== '';

  let bubbleText = "You're here. Complete this step to keep going.";
  let bubbleType = 'default';

  if (currentStepIndex === 1) {
    if (showError) {
      bubbleText = 'Finish this line first, then we can move forward.';
      bubbleType = 'error';
    } else if (isStep1Complete) {
      bubbleText = "Looks good. Let's move to the next field.";
      bubbleType = 'success';
    } else {
      bubbleText = "You're here. Complete this step to keep going.";
      bubbleType = 'default';
    }
  } else if (currentStepIndex === 2) {
    if (showError) {
      bubbleText = 'Select the letters correct before continuing.';
      bubbleType = 'error';
    } else if (isStep2Complete) {
      bubbleText = 'Nice. Press Next to go to the next page.';
      bubbleType = 'success';
    } else {
      bubbleText = 'Next step! How many letters were correct?';
      bubbleType = 'default';
    }
  } else if (currentStepIndex === 4) {
    bubbleText = 'You did it! Ready for the next page.';
    bubbleType = 'success';
  }

  const handleNext = () => {
    if (!isStep1Complete) {
      setCurrentStepIndex(1);
      setShowError(true);
      step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (!isStep2Complete) {
      setCurrentStepIndex(2);
      setShowError(true);
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setShowError(false);
      onNext({ line: selectedLine, letters: selectedLetters });
    }
  };

  const handleBack = () => {
    if (currentStepIndex === 4) {
      setCurrentStepIndex(2);
    } else {
      onBack();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (currentStepIndex === 1) {
        step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (currentStepIndex === 2) {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }, [currentStepIndex]);

  const overallProgress = currentStepIndex === 4 ? 8 : isStep2Complete ? 8 : isStep1Complete ? 5 : 3;

  const renderRabbitBubble = (stepIndex: number) => {
    if (currentStepIndex !== stepIndex) return null;
    return (
      <motion.div
        layoutId="rabbit-mascot-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex items-end gap-3 mb-4 ml-2"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="bg-[#150F26] p-2 rounded-full shadow-[0_4px_15px_rgba(0,209,193,0.3)] relative z-10 shrink-0 border-2 border-[#00D1C1] flex items-center justify-center"
        >
          <RabbitMascot size={24} />
        </motion.div>

        <div
          className={`px-4 py-2.5 rounded-2xl rounded-bl-sm text-[13px] font-medium shadow-lg max-w-[260px] leading-snug
          ${
            bubbleType === 'error'
              ? 'bg-[#FF5C5C] text-white'
              : bubbleType === 'success'
              ? 'bg-[#00D1C1] text-[#150F26]'
              : 'bg-white text-[#150F26]'
          }`}
        >
          {bubbleText}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} flex flex-col font-sans items-center overflow-x-hidden`}>
      <div className="w-full max-w-[430px] relative min-h-screen flex flex-col shadow-2xl bg-inherit">
        <div className="flex justify-between items-center px-6 py-3 text-xs font-medium text-gray-300">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-between z-20 gap-2">
          <div className="font-bold text-xl tracking-wide">OOXii</div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNav('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors bg-[#22193B] text-white border-[#00D1C1]/30 hover:border-[#00D1C1]"
            >
              <HomeIcon size={13} />
              Home
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors bg-[#22193B] text-white border-[#00D1C1]/30 hover:border-[#00D1C1]"
            >
              <SettingsIcon size={13} />
              Settings
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-[#22193B] px-3 py-1 rounded-full border border-[#3A3059]">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-30 pt-8 pb-6 px-6 bg-gradient-to-b from-[#150F26] via-[#150F26] to-transparent">
          <div className="flex justify-between items-end mb-2 pr-8">
            <span className="text-xs text-[#9B93BA] font-semibold uppercase tracking-wider">Overall Progress</span>
            <span className="text-[#00D1C1] font-bold text-sm">{overallProgress}%</span>
          </div>

          <div className="relative w-[calc(100%-32px)] mt-2">
            <div className="relative w-full h-3 rounded-full bg-[#22193B] border border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,#3A3059_6px,#3A3059_12px)] opacity-40" />

              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-[#00D1C1] shadow-[0_0_12px_rgba(0,209,193,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(255,255,255,0.25)_6px,rgba(255,255,255,0.25)_12px)] mix-blend-overlay rounded-full" />
              </motion.div>
            </div>

            <motion.div
              className="absolute top-1/2 z-20 flex flex-col items-center"
              initial={{ left: '3%' }}
              animate={{ left: `${overallProgress}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                className="bg-[#150F26] rounded-full shadow-[0_0_10px_rgba(0,209,193,0.6)] border border-[#00D1C1] flex items-center justify-center w-6 h-6"
              >
                <RabbitMascot size={14} />
              </motion.div>
            </motion.div>

            <div className="absolute right-[-32px] top-1/2 -translate-y-1/2 text-white/40">
              <Flag size={16} className={overallProgress >= 100 ? 'text-[#00D1C1] fill-[#00D1C1]' : ''} />
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 pb-32 pt-2 flex flex-col gap-6">
          <div className="mb-2">
            <h1 className="text-3xl font-light text-white mb-1">Distance vision</h1>
            <h2 className="text-xl font-medium text-[#00D1C1]">Left eye</h2>
          </div>

          <div
            onClick={() => setIsVideoOpen(true)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-white/10"
          >
            <div className="absolute inset-0 bg-[#2A2049]" />
            <img
              src="https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBleGFtJTIwY2xpbmljfGVufDF8fHx8MTc4MjcyMTkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Video Tutorial"
              className="w-full h-[120px] object-cover opacity-50 group-hover:opacity-60 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-[#00D1C1]/90 rounded-full p-3 text-[#150F26] transform group-hover:scale-110 transition-transform">
                <Play className="fill-current w-6 h-6 ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
              <span className="font-semibold text-white drop-shadow-md">Watch Guide</span>
              <span className="text-xs bg-black/60 px-2 py-1 rounded-md text-white backdrop-blur-sm">1:20</span>
            </div>
          </div>

          <div className={`${theme.card} p-5 rounded-2xl flex gap-4 items-start border border-white/5`}>
            <div className="bg-white/10 p-3 rounded-full shrink-0">
              <User size={24} className="text-[#00D1C1]" />
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              No glasses, ask the person to cover their right eye with the palm of their hand.
            </p>
          </div>

          <div ref={step1Ref} className="scroll-mt-32 flex flex-col relative min-h-[140px]">
            <AnimatePresence mode="wait">
              {currentStepIndex === 1 && renderRabbitBubble(1)}
            </AnimatePresence>

            <motion.div
              onClick={() => setCurrentStepIndex(1)}
              animate={{
                opacity: currentStepIndex >= 1 ? 1 : 0.5,
                scale: currentStepIndex === 1 ? 1 : 0.98,
              }}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 z-0
                ${
                  currentStepIndex === 1
                    ? 'ring-2 ring-[#00D1C1] shadow-[0_0_20px_rgba(0,209,193,0.15)]'
                    : 'border border-white/5 hover:border-white/20 cursor-pointer'
                }
                ${currentStepIndex === 1 ? theme.cardActive : theme.card}`}
            >
              <div
                className={`px-5 py-3 border-b flex justify-between items-center
                ${currentStepIndex === 1 ? 'border-[#00D1C1]/20 bg-[#00D1C1]/5' : 'border-white/5'}`}
              >
                <span
                  className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2
                  ${currentStepIndex === 1 ? 'text-[#00D1C1]' : 'text-[#6A608A]'}`}
                >
                  {isStep1Complete && currentStepIndex > 1 ? 'Completed' : 'Current Step'}
                </span>
                {isStep1Complete && currentStepIndex > 1 && <Check size={16} className="text-[#00D1C1]" />}
              </div>

              <div className="p-5 flex flex-col gap-5">
                <p className="font-medium text-[15px] leading-snug">
                  Select the smallest OOXii line number with all letters correct.
                </p>

                <div className="flex flex-col gap-2 relative">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-[#9B93BA] flex items-center gap-1.5">
                        Smallest OOXii line number
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHelp(activeHelp === 'step1' ? null : 'step1');
                          }}
                          className="text-[#00D1C1] p-0.5 rounded-full hover:bg-white/5 transition-colors"
                        >
                          <HelpCircle size={14} />
                        </button>
                      </label>
                      {selectedLine && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLine('');
                            setSelectedLetters('');
                            setCurrentStepIndex(1);
                          }}
                          className="text-[#FF5C5C] hover:text-[#ff7676] flex items-center gap-1 transition-colors text-xs"
                        >
                          <X size={12} /> Clear
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {activeHelp === 'step1' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsVideoOpen(true);
                            }}
                            className="p-2 bg-[#150F26] rounded-xl flex items-center gap-3 border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                          >
                            <div className="w-[60px] h-[40px] rounded bg-[#2A2049] relative overflow-hidden shrink-0">
                              <img
                                src="https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBleGFtJTIwY2xpbmljfGVufDF8fHx8MTc4MjcyMTkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                className="w-full h-full object-cover opacity-60"
                              />
                              <PlayCircle size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-[13px] font-medium text-white leading-tight">How to select a line</div>
                              <div className="text-[11px] text-[#9B93BA] mt-0.5">0:45 min</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <LineSlider
                      value={selectedLine}
                      error={showError && currentStepIndex === 1}
                      onChange={(val) => {
                        setSelectedLine(val);
                        setCurrentStepIndex(1);
                        if (val === '') {
                          setSelectedLetters('');
                        } else {
                          setShowError(false);
                          clearTimeout(advanceTimeoutRef1.current);
                          advanceTimeoutRef1.current = setTimeout(() => setCurrentStepIndex(2), 500);
                        }
                      }}
                    />
                  </div>

                  <AnimatePresence>
                    {showError && currentStepIndex === 1 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#FF5C5C] text-xs flex items-start gap-1.5 mt-1"
                      >
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <span>Select the OOXii line number before continuing.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          <div ref={step2Ref} className="scroll-mt-32 flex flex-col relative min-h-[140px]">
            <AnimatePresence mode="wait">
              {currentStepIndex === 2 && renderRabbitBubble(2)}
            </AnimatePresence>

            <motion.div
              onClick={() => {
                if (isStep1Complete) setCurrentStepIndex(2);
              }}
              animate={{
                opacity: currentStepIndex >= 2 ? 1 : 0.4,
                scale: currentStepIndex === 2 ? 1 : 0.98,
              }}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 z-0
                ${currentStepIndex === 2 ? 'ring-2 ring-[#00D1C1] shadow-[0_0_20px_rgba(0,209,193,0.15)]' : 'border border-white/5'}
                ${currentStepIndex !== 2 && isStep1Complete ? 'hover:border-white/20 cursor-pointer' : ''}
                ${currentStepIndex === 2 ? theme.cardActive : theme.card}`}
            >
              <div
                className={`px-5 py-3 border-b flex justify-between items-center
                ${currentStepIndex === 2 ? 'border-[#00D1C1]/20 bg-[#00D1C1]/5' : 'border-white/5'}`}
              >
                <span
                  className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2
                  ${currentStepIndex === 2 ? 'text-[#00D1C1]' : 'text-[#6A608A]'}`}
                >
                  {isStep2Complete && currentStepIndex > 2 ? 'Completed' : 'Next Step'}
                </span>
                {isStep2Complete && currentStepIndex > 2 && <Check size={16} className="text-[#00D1C1]" />}
              </div>

              <div className="p-5 flex flex-col gap-5">
                <div className="flex flex-col">
                  <label className="text-[15px] font-medium leading-snug flex items-start gap-1.5">
                    Select number of letters correct on next smaller line
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHelp(activeHelp === 'step2' ? null : 'step2');
                      }}
                      className="text-[#00D1C1] p-0.5 mt-0.5 rounded-full hover:bg-white/5 transition-colors shrink-0"
                    >
                      <HelpCircle size={16} />
                    </button>
                  </label>

                  <AnimatePresence>
                    {activeHelp === 'step2' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsVideoOpen(true);
                          }}
                          className="p-2 bg-[#150F26] rounded-xl flex items-center gap-3 border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
                        >
                          <div className="w-[60px] h-[40px] rounded bg-[#2A2049] relative overflow-hidden shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBleGFtJTIwY2xpbmljfGVufDF8fHx8MTc4MjcyMTkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                              className="w-full h-full object-cover opacity-60"
                            />
                            <PlayCircle size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[13px] font-medium text-white leading-tight">Counting letters correctly</div>
                            <div className="text-[11px] text-[#9B93BA] mt-0.5">1:15 min</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-5 gap-2 relative">
                  {[0, 1, 2, 3, 4].map((num) => {
                    const isSelected = selectedLetters === num.toString();
                    return (
                      <button
                        key={num}
                        disabled={!isStep1Complete}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (isSelected) {
                            setSelectedLetters('');
                          } else {
                            setSelectedLetters(num.toString());
                            setShowError(false);
                            setCurrentStepIndex(2);
                          }
                        }}
                        className={`h-12 rounded-xl text-lg font-medium transition-all flex items-center justify-center border
                          ${
                            isSelected
                              ? 'bg-[#00D1C1] border-[#00D1C1] text-[#150F26] shadow-[0_0_15px_rgba(0,209,193,0.3)]'
                              : 'bg-[#150F26] border-white/10 text-white hover:border-white/30'
                          }
                          ${showError && currentStepIndex === 2 && !isSelected ? 'border-[#FF5C5C]/50' : ''}
                          disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showError && currentStepIndex === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[#FF5C5C] text-xs flex items-start gap-1.5"
                    >
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>Select the number of letters correct.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-2 px-1 opacity-70">
            <label className="text-xs text-[#9B93BA] leading-tight">
              Left eye distance vision no glasses — Snellen (metres)
            </label>
            <div className="w-full bg-[#150F26] border border-white/5 rounded-xl py-4 px-4 text-sm text-[#6A608A]">
              {selectedLine && selectedLetters
                ? `6/${parseInt(selectedLine.split(' ')[1]) * 2}+${selectedLetters} (Calculated)`
                : 'Auto-calculated from line selection'}
            </div>
          </div>

          {currentStepIndex === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-[#00D1C1]/10 border border-[#00D1C1]/30 rounded-3xl p-8 flex flex-col items-center text-center"
            >
              <div className="bg-[#00D1C1] text-[#150F26] p-3 rounded-full mb-4">
                <Flag size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#00D1C1] mb-2">Page Complete</h3>
              <p className="text-[#9B93BA] text-sm max-w-[200px]">
                You have successfully recorded all distance vision data for this eye. Press Next to continue to the next page.
              </p>
            </motion.div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#150F26] via-[#150F26] to-[#150F26]/0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] flex gap-3 pointer-events-auto">
            <button
              onClick={handleBack}
              className="flex-1 max-w-[100px] h-14 rounded-2xl border border-white/20 font-medium text-white flex items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-[2] h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg bg-[#00D1C1] text-[#150F26] hover:brightness-110 shadow-[#00D1C1]/20"
            >
              Next Page
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isVideoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#150F26]/90 backdrop-blur-sm"
              onClick={() => setIsVideoOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[360px] bg-[#22193B] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <div className="p-4 flex justify-between items-center border-b border-white/5">
                  <h3 className="font-semibold text-white">Tutorial Video</h3>
                  <button
                    onClick={() => setIsVideoOpen(false)}
                    className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative aspect-video bg-black flex items-center justify-center cursor-pointer group">
                  <img
                    src="https://images.unsplash.com/photo-1766310549795-dd0fc75d499f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWUlMjBleGFtJTIwY2xpbmljfGVufDF8fHx8MTc4MjcyMTkwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-50 transition-opacity"
                  />
                  <div className="relative bg-[#00D1C1]/90 rounded-full p-4 text-[#150F26] transform group-hover:scale-110 transition-transform shadow-lg shadow-[#00D1C1]/20">
                    <Play className="fill-current w-8 h-8 ml-1" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-[#00D1C1] w-1/3" />
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-medium text-lg mb-1 text-white">Measuring Distance Vision</h4>
                  <p className="text-sm text-[#9B93BA] leading-relaxed">
                    Learn how to correctly measure and record distance vision using the chart. This guide will walk you through line selection and letter counting.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}
