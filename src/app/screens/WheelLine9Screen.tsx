import React, { useState, useEffect } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { RadioGroup, InlineError } from './common';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';
import { preloadTumblingEChart } from '../help/apparatusHelpConfig';

interface Props {
  side: 'right' | 'left';
  progress: number;
  initialValue?: string;
  onNext: (value: string) => void;
  onBack: () => void;
}

export function WheelLine9Screen({
  side, progress, initialValue = '', onNext, onBack
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isFading } = useAutoAdvance();
  const inputCardRef = useAutoScrollInput();

  useEffect(() => {
    preloadTumblingEChart();
  }, []);

  const handleNext = () => {
    if (!value) {
      setError(true);
      return;
    }
    onNext(value);
  };

  return (
    <Shell progress={progress} isFading={isFading}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light text-[var(--text)]">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
        </div>

        <RabbitBubble
          text={error ? 'Complete this field first.' : value ? 'Nice.' : "You're here."}
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-lg scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold block flex-1 text-[var(--text)]">Can the person read line 9 or smaller?</label>
            <HelpButton configId="wheel-line9" />
          </div>
          <RadioGroup
            value={value}
            onChange={(v) => {
              setValue(v);
              if (v) {
                setError(false);
                commitAndAdvance(() => onNext(v));
              }
            }}
            options={['Yes', 'No']}
            err={error && !value}
          />
          {error && !value && <InlineError text="Choose Yes or No before continuing." />}
        </div>
      </div>
      <BottomBar onNext={handleNext} onBack={onBack} hideNext={!value} />
    </Shell>
  );
}
