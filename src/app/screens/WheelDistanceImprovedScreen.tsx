import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { RadioGroup, InlineError, ImagePanel, InstructionCard } from './common';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';

interface Props {
  progress: number;
  initialValue?: string;
  onNext: (value: string) => void;
  onBack: () => void;
}

export function WheelDistanceImprovedScreen({
  progress, initialValue = '', onNext, onBack
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isFading } = useAutoAdvance();
  const inputCardRef = useAutoScrollInput();

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
          <h1 className="text-2xl font-light">Right distance vision at the wheel</h1>
        </div>
        
        <ImagePanel caption="Client at wheel, facing chart" marker="3m" />
        <InstructionCard text="When you have found the lenses that give the best vision, measure the vision while the person is looking through these lenses at the wheel." />

        <RabbitBubble
          text={error ? 'Complete this field first.' : value ? 'Nice.' : "You're here."}
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-lg scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold block flex-1 text-[var(--text)]">Did vision improve with lenses at the wheel?</label>
            <HelpButton configId="wheel-distance-improved" />
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
