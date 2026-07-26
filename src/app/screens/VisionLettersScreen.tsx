import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { ChipRadio, InlineError } from './common';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

interface Props {
  title: string;
  subtitle?: string;
  progress: number;
  initialValue?: string;
  onNext: (letters: string) => void;
  onBack: () => void;
}

export function VisionLettersScreen({
  title, subtitle, progress, initialValue = '', onNext, onBack
}: Props) {
  const [letters, setLetters] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isAdvancing } = useAutoAdvance();

  const handleNext = () => {
    if (!letters) {
      setError(true);
      return;
    }
    onNext(letters);
  };

  return (
    <Shell progress={progress} isAdvancing={isAdvancing}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">{title}</h1>
          {subtitle && <h2 className="text-lg font-medium text-[#A984FF] mt-1">{subtitle}</h2>}
        </div>

        <RabbitBubble
          text={error ? 'Select the number of letters correct before continuing.' : letters ? 'Nice.' : 'Next step! How many letters were correct?'}
          type={error ? 'error' : letters ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4">
          <label className="text-[15px] font-medium leading-snug">
            Select number of letters correct on next smaller line
          </label>
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
