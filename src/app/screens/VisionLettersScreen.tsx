import React, { useState, useEffect } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { ChipRadio, InlineError } from './common';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';
import { preloadTumblingEChart } from '../help/apparatusHelpConfig';

interface Props {
  title: string;
  subtitle?: string;
  progress: number;
  initialValue?: string;
  selectedLine?: string;
  onNext: (letters: string) => void;
  onBack: () => void;
  helpConfigId?: string;
}

export function VisionLettersScreen({
  title, subtitle, progress, initialValue = '', selectedLine, onNext, onBack, helpConfigId = 'tumbling-e-letters'
}: Props) {
  const [letters, setLetters] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isFading } = useAutoAdvance();
  const inputCardRef = useAutoScrollInput();

  useEffect(() => {
    preloadTumblingEChart();
  }, []);

  const handleNext = () => {
    if (!letters) {
      setError(true);
      return;
    }
    onNext(letters);
  };

  return (
    <Shell progress={progress} isFading={isFading}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light text-[var(--text)]">{title}</h1>
          {subtitle && <h2 className="text-lg font-bold text-[var(--primary)] mt-1">{subtitle}</h2>}
        </div>

        <RabbitBubble
          text={error ? 'Select the number of letters correct before continuing.' : letters ? 'Nice.' : 'Next step! How many letters were correct?'}
          type={error ? 'error' : letters ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-lg scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <label className="text-[15px] font-bold leading-snug flex-1 text-[var(--text)]">
              Select number of letters correct on next smaller line
            </label>
            <HelpButton configId={helpConfigId} contextLine={selectedLine} />
          </div>
          <ChipRadio
            value={letters}
            options={['0', '1', '2', '3', '4']}
            err={error && !letters}
            onChange={(val) => {
              setLetters(val);
              if (val) {
                setError(false);
                commitAndAdvance(() => onNext(val));
              }
            }}
          />
          {error && !letters && <InlineError text="Select the number of letters correct." />}
        </div>
      </div>
      <BottomBar onNext={handleNext} onBack={onBack} hideNext={!letters} />
    </Shell>
  );
}
