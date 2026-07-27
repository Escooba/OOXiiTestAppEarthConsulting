import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { RadioGroup, InlineError } from './common';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';

interface Props {
  side: 'right' | 'left';
  progress: number;
  initialValue?: string;
  onNext: (value: string) => void;
  onBack: () => void;
}

export function WheelTwoColourScreen({
  side, progress, initialValue = '', onNext, onBack
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
          <h1 className="text-2xl font-light">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
        </div>

        <RabbitBubble
          text={error ? 'Complete this field first.' : value ? 'Nice.' : "You're here."}
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium block flex-1">
              Now do 2-colour test. Which letters look sharper, darker, easier to read?
            </label>
            <HelpButton configId="wheel-twocolour" />
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
            options={['Letters on red side', 'Letters on green side', 'Letters look the same']}
            err={error && !value}
          />
          {error && !value && <InlineError text="Choose a 2-colour test result before continuing." />}
        </div>
      </div>
      <BottomBar onNext={handleNext} onBack={onBack} hideNext={!value} />
    </Shell>
  );
}
