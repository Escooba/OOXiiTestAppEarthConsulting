import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RadioGroup, InlineError } from './common';
import { RabbitBubble } from '../components/RabbitBubble';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';

interface Props {
  title: string;
  subtitle?: string;
  question: string;
  options: string[];
  progress: number;
  initialValue?: string;
  onNext: (value: string) => void;
  onBack: () => void;
  helpTitle?: string;
  helpBody?: string;
  errorText?: string;
  autoAdvance?: boolean;
}

export function QuestionScreen({
  title,
  subtitle,
  question,
  options,
  progress,
  initialValue = '',
  onNext,
  onBack,
  helpTitle,
  helpBody,
  errorText = 'Select Yes or No before continuing.',
  autoAdvance = true,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isAdvancing } = useAutoAdvance();

  const submit = () => {
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
          <h1 className="text-2xl font-light">{title}</h1>
          {subtitle && <h2 className="text-lg font-medium text-[#A984FF] mt-1">{subtitle}</h2>}
        </div>

        <RabbitBubble
          text={
            error
              ? 'Finish this field first, then we can move forward.'
              : value
              ? 'Nice. ' + (autoAdvance ? '' : 'Press Next to continue.')
              : "You're here. Complete this step to keep going."
          }
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-[15px] leading-snug">{question}</p>
            {helpTitle && helpBody && <HelpButton title={helpTitle} description={helpBody} />}
          </div>
          <RadioGroup
            value={value}
            onChange={(v) => {
              setValue(v);
              setError(false);
              if (autoAdvance) {
                commitAndAdvance(() => onNext(v));
              }
            }}
            options={options}
            err={error && !value}
          />
          {error && !value && <InlineError text={errorText} />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} hideNext={autoAdvance} />
    </Shell>
  );
}
