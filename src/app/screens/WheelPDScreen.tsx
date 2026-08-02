import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { InlineError, InstructionCard, ImagePanel } from './common';
import { RabbitBubble } from '../components/RabbitBubble';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';

interface Props {
  progress: number;
  initialValue?: string;
  onNext: (pd: number) => void;
  onBack: () => void;
}

export function WheelPDScreen({ progress, initialValue = '', onNext, onBack }: Props) {
  const [pd, setPd] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const { commitAndAdvance, isFading } = useAutoAdvance();
  const inputCardRef = useAutoScrollInput();

  const handleBlurOrEnter = () => {
    const n = parseInt(pd);
    if (Number.isNaN(n) || n < 52 || n > 78) {
      setError('Enter a PD between 52 and 78.');
      return;
    }
    setError(null);
    commitAndAdvance(() => onNext(n));
  };

  const submit = () => {
    handleBlurOrEnter();
  };

  return (
    <Shell progress={progress} isFading={isFading}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light text-[var(--text)]">Wheel test</h1>
        <ImagePanel caption="Client faces vision chart" marker="3m" />
        <InstructionCard text="To improve distance vision" />
        <RabbitBubble text={error ? 'Enter a PD between 52 and 78.' : pd ? 'Nice. Press Next to continue.' : "You're here. Complete this step to keep going."} type={error ? 'error' : pd ? 'success' : 'default'} />

        <div ref={inputCardRef} className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-3 shadow-lg scroll-mt-20">
          <Field label="Pupillary distance (PD)">
            <div className="flex items-start gap-2">
              <input
                inputMode="numeric"
                value={pd}
                onChange={(e) => {
                  setPd(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                onBlur={handleBlurOrEnter}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBlurOrEnter();
                }}
                placeholder="e.g. 62"
                className={inputCls(!!error) + ' flex-1'}
              />
              <HelpButton configId="wheel-pd" />
            </div>
          </Field>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Valid range: 52–78. Put 0.0 lenses in front of both eyes and turn the knob to adjust
            the distance between the two eyes, read the number from the scale next to the knob.
          </p>
          {error && <InlineError text={error} />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} hideNext={!pd} />
    </Shell>
  );
}
