import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { InlineError } from './common';
import { SelectField } from './TesterInfo';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';

interface Props {
  side: 'right' | 'left';
  direction: string;
  progress: number;
  initialValue?: string;
  onNext: (power: string) => void;
  onBack: () => void;
}

const LENS_OPTIONS_PLUS = ['+0.5', '+1.0', '+1.5', '+2.0', '+2.5', '+3.0'];
const LENS_OPTIONS_MINUS = ['-0.5', '-1.0', '-1.5', '-2.0', '-2.5', '-3.0'];

export function WheelPowerScreen({
  side, direction, progress, initialValue = '', onNext, onBack
}: Props) {
  const [power, setPower] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isFading } = useAutoAdvance(500);
  const inputCardRef = useAutoScrollInput();

  const handleNext = () => {
    if (!power) {
      setError(true);
      return;
    }
    onNext(power);
  };

  const options = direction === 'Plus' ? LENS_OPTIONS_PLUS : LENS_OPTIONS_MINUS;

  return (
    <Shell progress={progress} isFading={isFading}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light text-[var(--text)]">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
        </div>

        <RabbitBubble
          text={error ? 'Select a lens power before continuing.' : power ? 'Nice.' : "You're here."}
          type={error ? 'error' : power ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-lg scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold block flex-1 text-[var(--text)]">Best {direction.toLowerCase()} lens {side} eye</label>
            <HelpButton configId="wheel-power" />
          </div>
          <SelectField
            value={power}
            onChange={(v) => {
              setPower(v);
              if (v) {
                setError(false);
                commitAndAdvance(() => onNext(v));
              }
            }}
            placeholder={`Choose the best ${side} eye lens`}
            options={options}
            err={error && !power}
          />
          {error && !power && <InlineError text="Select a lens power before continuing." />}
        </div>
      </div>
      <BottomBar onNext={handleNext} onBack={onBack} hideNext={!power} />
    </Shell>
  );
}
