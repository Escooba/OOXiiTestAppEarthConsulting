import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { InlineError } from './common';
import { SelectField } from './TesterInfo';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

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
  const { commitAndAdvance, isAdvancing } = useAutoAdvance(750);

  const handleNext = () => {
    if (!power) {
      setError(true);
      return;
    }
    onNext(power);
  };

  const options = direction === 'Plus' ? LENS_OPTIONS_PLUS : LENS_OPTIONS_MINUS;

  return (
    <Shell progress={progress} isAdvancing={isAdvancing}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
        </div>

        <RabbitBubble
          text={error ? 'Select a lens power before continuing.' : power ? 'Nice.' : "You're here."}
          type={error ? 'error' : power ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4">
          <label className="text-sm font-medium block">Best {direction.toLowerCase()} lens {side} eye</label>
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
