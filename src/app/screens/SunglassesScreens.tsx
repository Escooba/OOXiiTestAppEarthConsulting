import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RadioGroup, InlineError, InstructionCard } from './common';
import { RabbitBubble } from '../components/RabbitBubble';

const SUNGLASS_TYPES = ['OOXii black/red', 'OOXii black', 'OOXii metal frame mirrored', 'Other brand'];

export function SunglassesSelection({
  onBack, onNext,
}: { onBack: () => void; onNext: (type: string) => void }) {
  const [value, setValue] = useState('OOXii metal frame mirrored');
  const [error, setError] = useState(false);

  const submit = () => {
    if (!value) return setError(true);
    onNext(value);
  };

  return (
    <Shell progress={92}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light">Sunglasses selection</h1>
        <InstructionCard text="Select a sunglass type." />

        <RabbitBubble
          text={error ? 'Select a sunglass type before continuing.' : value ? 'Nice. Press Next to continue.' : "You're here. Complete this step to keep going."}
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4">
          <label className="text-[15px] font-medium leading-snug">Sunglass type</label>
          <RadioGroup
            value={value}
            onChange={(v) => { setValue(v); setError(false); }}
            options={SUNGLASS_TYPES}
            err={error}
          />
          {error && <InlineError text="Select a sunglass type before continuing." />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}
