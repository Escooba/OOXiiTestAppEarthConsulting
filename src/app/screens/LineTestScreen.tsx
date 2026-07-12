import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flag, Check, AlertCircle, ChevronDown, User, X, HelpCircle, PlayCircle, Play, ArrowRight,
} from 'lucide-react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitMascot } from '../components/RabbitMascot';
import { LineSlider } from '../components/LineSlider';
import { calcSnellen } from '../lib/theme';
import { HelpButton } from '../components/HelpButton';

interface Props {
  title: string;
  subtitle?: string;
  instruction: string;
  imageCaption: string;
  imageMarker?: string;
  snellenLabel: string;
  progress: number;
  onNext: (value: { line: string; letters: string; snellen: string }) => void;
  onBack: () => void;
  showLetters?: boolean;
  helpTitle?: string;
  helpBody?: string;
}

/**
 * Test-input screen matching the visual language of the approved Distance Left Eye
 * screen: step cards with ring highlight, auto-advance, inline rabbit bubble beside
 * the active step, tutorial thumbnails, and Snellen auto-calc.
 */
export function LineTestScreen({
  title, subtitle, instruction, imageCaption, imageMarker, snellenLabel,
  progress, onNext, onBack, showLetters = true,
  helpTitle = 'How to find the OOXii line number',
  helpBody = 'Use the number beside the smallest line the client reads correctly.',
}: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedLetters, setSelectedLetters] = useState('');
  const [showError, setShowError] = useState(false);
  const [activeHelp, setActiveHelp] = useState<string | null>(null);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const advanceTimeoutRef = useRef<NodeJS.Timeout>();

  const isStep1Complete = selectedLine !== '';
  const isStep2Complete = !showLetters || selectedLetters !== '';
  const allComplete = isStep1Complete && isStep2Complete;

  const snellen = calcSnellen(selectedLine, showLetters ? selectedLetters : '0');

  let bubbleText = "You're here. Complete this step to keep going.";
  let bubbleType: 'default' | 'error' | 'success' = 'default';
  if (currentStepIndex === 1) {
    if (showError) { bubbleText = 'Finish this line first, then we can move forward.'; bubbleType = 'error'; }
    else if (isStep1Complete) { bubbleText = showLetters ? "Looks good. Let's move to the next field." : 'Nice. Press Next to continue.'; bubbleType = 'success'; }
  } else if (currentStepIndex === 2) {
    if (showError) { bubbleText = 'Select the letters correct before continuing.'; bubbleType = 'error'; }
    else if (isStep2Complete) { bubbleText = 'Nice. Press Next to continue.'; bubbleType = 'success'; }
    else { bubbleText = 'Next step! How many letters were correct?'; }
  }

  const handleNext = () => {
    if (!isStep1Complete) { setCurrentStepIndex(1); setShowError(true); step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (showLetters && !selectedLetters) { setCurrentStepIndex(2); setShowError(true); step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setShowError(false);
    onNext({ line: selectedLine, letters: selectedLetters, snellen });
  };

  useEffect(() => {
    setTimeout(() => {
      if (currentStepIndex === 1) step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (currentStepIndex === 2) step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }, [currentStepIndex]);

  const renderRabbit = () => (
    <motion.div
      layoutId="rabbit-mascot-container"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
      <div className={`px-4 py-2.5 rounded-2xl rounded-bl-sm text-[13px] font-medium shadow-lg max-w-[260px] leading-snug ${
        bubbleType === 'error' ? 'bg-[#FF5C5C] text-white' :
        bubbleType === 'success' ? 'bg-[#00D1C1] text-[#150F26]' :
        'bg-white text-[#150F26]'
      }`}>{bubbleText}</div>
    </motion.div>
  );

  return (
    <Shell progress={progress}>
      <div className="flex-1 px-5 pb-32 pt-2 flex flex-col gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-light mb-1">{title}</h1>
          {subtitle && <h2 className="text-xl font-medium text-[#00D1C1]">{subtitle}</h2>}
        </div>

        {/* Image panel */}
        <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#00D1C1]/25 to-[#00D1C1]/5 p-6 min-h-[140px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(0,209,193,0.5),transparent_70%)]" />
          <div className="relative z-10 text-center">
            <div className="text-[#00D1C1] font-medium text-sm">{imageCaption}</div>
            {imageMarker && (
              <div className="mt-3 inline-block bg-[#150F26] text-[#00D1C1] px-3 py-1 rounded-full text-xs font-bold border border-[#00D1C1]/40">
                {imageMarker}
              </div>
            )}
          </div>
        </div>

        {/* Instruction card */}
        <div className="bg-[#22193B] p-5 rounded-2xl flex gap-4 items-start border border-white/5">
          <div className="bg-white/10 p-3 rounded-full shrink-0">
            <User size={24} className="text-[#00D1C1]" />
          </div>
          <p className="text-sm text-gray-200 leading-relaxed">{instruction}</p>
        </div>

        {/* STEP 1: Select Line */}
        <div ref={step1Ref} className="scroll-mt-32 flex flex-col relative min-h-[140px]">
          <AnimatePresence mode="wait">
            {currentStepIndex === 1 && renderRabbit()}
          </AnimatePresence>

          <motion.div
            onClick={() => setCurrentStepIndex(1)}
            animate={{ opacity: currentStepIndex >= 1 ? 1 : 0.5, scale: currentStepIndex === 1 ? 1 : 0.98 }}
            className={`relative rounded-3xl overflow-hidden transition-all duration-300 z-0
              ${currentStepIndex === 1
                ? 'ring-2 ring-[#00D1C1] shadow-[0_0_20px_rgba(0,209,193,0.15)] bg-[#2A2049]'
                : 'border border-white/5 hover:border-white/20 cursor-pointer bg-[#22193B]'}`}
          >
            <div className={`px-5 py-3 border-b flex justify-between items-center ${
              currentStepIndex === 1 ? 'border-[#00D1C1]/20 bg-[#00D1C1]/5' : 'border-white/5'}`}>
              <span className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2 ${
                currentStepIndex === 1 ? 'text-[#00D1C1]' : 'text-[#6A608A]'}`}>
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
                        onClick={(e) => { e.stopPropagation(); setActiveHelp(activeHelp === 'step1' ? null : 'step1'); }}
                        className="text-[#00D1C1] p-0.5 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <HelpCircle size={14} />
                      </button>
                    </label>
                    {selectedLine && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLine(''); setSelectedLetters(''); setCurrentStepIndex(1);
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
                        <div className="p-2 bg-[#150F26] rounded-xl flex items-center gap-3 border border-white/5">
                          <div className="w-[60px] h-[40px] rounded bg-[#2A2049] relative overflow-hidden shrink-0 flex items-center justify-center">
                            <PlayCircle size={20} className="text-white" />
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
                        if (showLetters) {
                          clearTimeout(advanceTimeoutRef.current);
                          advanceTimeoutRef.current = setTimeout(() => setCurrentStepIndex(2), 500);
                        }
                      }
                    }}
                  />
                </div>

                <AnimatePresence>
                  {showError && currentStepIndex === 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
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

        {/* STEP 2: Letters correct (optional) */}
        {showLetters && (
          <div ref={step2Ref} className="scroll-mt-32 flex flex-col relative min-h-[140px]">
            <AnimatePresence mode="wait">
              {currentStepIndex === 2 && renderRabbit()}
            </AnimatePresence>

            <motion.div
              onClick={() => { if (isStep1Complete) setCurrentStepIndex(2); }}
              animate={{ opacity: currentStepIndex >= 2 ? 1 : 0.4, scale: currentStepIndex === 2 ? 1 : 0.98 }}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 z-0
                ${currentStepIndex === 2 ? 'ring-2 ring-[#00D1C1] shadow-[0_0_20px_rgba(0,209,193,0.15)] bg-[#2A2049]' : 'border border-white/5 bg-[#22193B]'}
                ${currentStepIndex !== 2 && isStep1Complete ? 'hover:border-white/20 cursor-pointer' : ''}`}
            >
              <div className={`px-5 py-3 border-b flex justify-between items-center ${
                currentStepIndex === 2 ? 'border-[#00D1C1]/20 bg-[#00D1C1]/5' : 'border-white/5'}`}>
                <span className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-2 ${
                  currentStepIndex === 2 ? 'text-[#00D1C1]' : 'text-[#6A608A]'}`}>
                  {isStep2Complete && currentStepIndex > 2 ? 'Completed' : 'Next Step'}
                </span>
                {isStep2Complete && currentStepIndex > 2 && <Check size={16} className="text-[#00D1C1]" />}
              </div>

              <div className="p-5 flex flex-col gap-5">
                <label className="text-[15px] font-medium leading-snug flex items-start gap-1.5">
                  Select number of letters correct on next smaller line
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveHelp(activeHelp === 'step2' ? null : 'step2'); }}
                    className="text-[#00D1C1] p-0.5 mt-0.5 rounded-full hover:bg-white/5 transition-colors shrink-0"
                  >
                    <HelpCircle size={16} />
                  </button>
                </label>
                <AnimatePresence>
                  {activeHelp === 'step2' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-2 bg-[#150F26] rounded-xl flex items-center gap-3 border border-white/5">
                        <div className="w-[60px] h-[40px] rounded bg-[#2A2049] relative overflow-hidden shrink-0 flex items-center justify-center">
                          <PlayCircle size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-medium text-white leading-tight">Counting letters correctly</div>
                          <div className="text-[11px] text-[#9B93BA] mt-0.5">1:15 min</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((num) => {
                    const isSelected = selectedLetters === num.toString();
                    return (
                      <button
                        key={num}
                        disabled={!isStep1Complete}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) setSelectedLetters('');
                          else { setSelectedLetters(num.toString()); setShowError(false); setCurrentStepIndex(2); }
                        }}
                        className={`h-12 rounded-xl text-lg font-medium transition-all flex items-center justify-center border
                          ${isSelected
                            ? 'bg-[#00D1C1] border-[#00D1C1] text-[#150F26] shadow-[0_0_15px_rgba(0,209,193,0.3)]'
                            : 'bg-[#150F26] border-white/10 text-white hover:border-white/30'}
                          ${showError && currentStepIndex === 2 && !isSelected ? 'border-[#FF5C5C]/50' : ''}
                          disabled:opacity-50 disabled:cursor-not-allowed`}
                      >{num}</button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showError && currentStepIndex === 2 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
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
        )}

        {/* Readonly Result Field */}
        <div className="flex flex-col gap-2 px-1 opacity-80">
          <label className="text-xs text-[#9B93BA] leading-tight">{snellenLabel}</label>
          <div className="w-full bg-[#150F26] border border-white/5 rounded-xl py-4 px-4 text-sm text-white">
            {snellen ? `${snellen} (Calculated)` : <span className="text-[#6A608A]">Auto-calculated from line selection</span>}
          </div>
        </div>

        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl bg-[#00D1C1]/10 border border-[#00D1C1]/30 p-4 flex items-center gap-3"
          >
            <Flag size={20} className="text-[#00D1C1]" />
            <span className="text-sm text-white/90">All fields complete. Press Next to continue.</span>
          </motion.div>
        )}
      </div>

      <BottomBar onNext={handleNext} onBack={onBack} nextLabel="Next" />
    </Shell>
  );
}
