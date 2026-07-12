import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RadioGroup, InlineError } from './common';
import { RabbitBubble } from '../components/RabbitBubble';
import { HelpButton } from '../components/HelpButton';

interface Props {
  title: string;
  subtitle?: string;
  question: string;
  options: string[];
  progress: number;
  onNext: (value: string) => void;
  onBack: () => void;
  helpTitle?: string;
  helpBody?: string;
  errorText?: string;
}

export function QuestionScreen({
  title,
  subtitle,
  question,
  options,
  progress,
  onNext,
  onBack,
  helpTitle,
  helpBody,
  errorText = 'Select Yes or No before continuing.',
}: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    if (!value) {
      setError(true);
      return;
    }
    onNext(value);
  };

  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">{title}</h1>
          {subtitle && <h2 className="text-lg font-medium text-[#00D1C1] mt-1">{subtitle}</h2>}
        </div>

        <RabbitBubble
          text={
            error
              ? 'Finish this field first, then we can move forward.'
              : value
              ? 'Nice. Press Next to continue.'
              : "You're here. Complete this step to keep going."
          }
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#00D1C1]/30 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-[15px] leading-snug">{question}</p>
            {helpTitle && helpBody && <HelpButton title={helpTitle} description={helpBody} />}
          </div>
          <RadioGroup
            value={value}
            onChange={(v) => {
              setValue(v);
              setError(false);
            }}
            options={options}
            err={error}
          />
          {error && <InlineError text={errorText} />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}
