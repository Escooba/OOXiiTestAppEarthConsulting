import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { RadioGroup, InlineError, ImagePanel } from './common';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

interface Props {
  side: 'right' | 'left';
  progress: number;
  initialValue?: string;
  onNext: (direction: string) => void;
  onBack: () => void;
}

export function WheelDirectionScreen({
  side, progress, initialValue = '', onNext, onBack
}: Props) {
  const [direction, setDirection] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance } = useAutoAdvance();

  const opposite = side === 'right' ? 'left' : 'right';

  const handleNext = () => {
    if (!direction) {
      setError(true);
      return;
    }
    onNext(direction);
  };

  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
          <p className="text-sm text-[#9B93BA] mt-2">
            Make sure the black lens is covering the {opposite} eye.
          </p>
        </div>
        <ImagePanel caption={`Client occludes ${opposite} eye at wheel`} />

        <RabbitBubble
          text={error ? 'Choose the best lens before continuing.' : direction ? 'Nice.' : "You're here. Complete this step to keep going."}
          type={error ? 'error' : direction ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#00D1C1]/30 rounded-3xl p-5 flex flex-col gap-4">
          <label className="text-sm font-medium block">Best {side} lens is:</label>
          <RadioGroup
            value={direction}
            onChange={(v) => {
              setDirection(v);
              if (v) {
                setError(false);
                commitAndAdvance(() => onNext(v));
              }
            }}
            options={['Plus', 'Minus', 'Neither plus nor minus lenses improve vision']}
            err={error && !direction}
          />
          {error && !direction && <InlineError text="Choose the best lens before continuing." />}
        </div>
      </div>
      <BottomBar onNext={handleNext} onBack={onBack} hideNext={true} />
    </Shell>
  );
}
