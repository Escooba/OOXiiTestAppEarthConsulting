import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { RadioGroup, InlineError } from './common';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

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
  const { commitAndAdvance, isAdvancing } = useAutoAdvance();

  const handleNext = () => {
    if (!value) {
      setError(true);
      return;
    }
    onNext(value);
  };

  return (
    <Shell progress={progress} isAdvancing={isAdvancing}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
        </div>

        <RabbitBubble
          text={error ? 'Complete this field first.' : value ? 'Nice.' : "You're here."}
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4">
          <label className="text-sm font-medium block mb-2">Can the person read line 9 or smaller?</label>
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
