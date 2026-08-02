import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RadioGroup, InlineError } from './common';
import { RabbitBubble } from '../components/RabbitBubble';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';

interface Props {
  title: string;
  subtitle?: string;
  question: string;
  options: string[];
  progress: number;
  initialValue?: string;
  onNext: (value: string) => void;
  onBack: () => void;
  helpConfigId?: string;
  helpTitle?: string;
  helpBody?: string;
  errorText?: string;
  autoAdvance?: boolean;
}

import { useTheme } from '../lib/ThemeContext';

export function QuestionScreen({
  title,
  subtitle,
  question,
  options,
  progress,
  initialValue = '',
  onNext,
  onBack,
  helpConfigId,
  helpTitle,
  helpBody,
  errorText,
  autoAdvance = true,
}: Props) {
  const { t } = useTheme();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, isFading } = useAutoAdvance();
  const inputCardRef = useAutoScrollInput();

  const activeErrorText = errorText || t('error.select_option');

  const submit = () => {
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
          <h1 className="text-2xl font-light text-[var(--text)]">{title}</h1>
          {subtitle && <h2 className="text-lg font-bold text-[var(--primary)] mt-1">{subtitle}</h2>}
        </div>

        <RabbitBubble
          text={
            error
              ? t('mascot.error_generic')
              : value
              ? t('mascot.success_generic')
              : t('mascot.default_generic')
          }
          type={error ? 'error' : value ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-lg scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <p className="font-bold text-[15px] leading-snug flex-1 text-[var(--text)]">{question}</p>
            <HelpButton configId={helpConfigId} title={helpTitle} description={helpBody} />
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
          {error && !value && <InlineError text={activeErrorText} />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} hideNext={autoAdvance} />
    </Shell>
  );
}
