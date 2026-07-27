import React, { useState, useEffect } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { LineSlider } from '../components/LineSlider';
import { RabbitBubble } from '../components/RabbitBubble';
import { InstructionCard, ImagePanel, InlineError } from './common';
import { HelpButton } from '../components/HelpButton';
import { useAutoAdvance } from '../hooks/useAutoAdvance';
import { useAutoScrollInput } from '../hooks/useAutoScrollInput';
import { preloadTumblingEChart } from '../help/apparatusHelpConfig';

interface Props {
  title: string;
  subtitle?: string;
  instruction: string;
  imageCaption: string;
  imageMarker?: string;
  progress: number;
  initialValue?: string;
  onNext: (line: string) => void;
  onBack: () => void;
  helpConfigId?: string;
}

export function VisionLineSelectionScreen({
  title, subtitle, instruction, imageCaption, imageMarker, progress, initialValue = '', onNext, onBack, helpConfigId
}: Props) {
  const [line, setLine] = useState(initialValue);
  const [error, setError] = useState(false);
  const { commitAndAdvance, clearAdvance, isFading } = useAutoAdvance();
  const inputCardRef = useAutoScrollInput();

  useEffect(() => {
    preloadTumblingEChart();
  }, []);

  const isNear = title.toLowerCase().includes('near');
  const resolvedHelpId = helpConfigId || (isNear ? 'near-vision-line' : 'tumbling-e-line');

  const handleNext = () => {
    if (!line) {
      setError(true);
      return;
    }
    onNext(line);
  };

  return (
    <Shell progress={progress} isFading={isFading}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">{title}</h1>
          {subtitle && <h2 className="text-lg font-medium text-[#A984FF] mt-1">{subtitle}</h2>}
        </div>

        <ImagePanel caption={imageCaption} marker={imageMarker} />
        <InstructionCard text={instruction} />

        <RabbitBubble
          text={error ? 'Select a line before continuing.' : line ? 'Nice.' : 'Select the smallest OOXii line number where all letters were read correctly.'}
          type={error ? 'error' : line ? 'success' : 'default'}
        />

        <div ref={inputCardRef} className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center justify-between gap-3">
            <label className="text-[15px] font-semibold text-white leading-snug flex-1">
              Select the smallest OOXii line number
            </label>
            <HelpButton configId={resolvedHelpId} />
          </div>
          <div className="px-2">
            <LineSlider
              value={line}
              error={error && !line}
              onDragStart={() => {
                clearAdvance();
              }}
              onChange={(val) => {
                setLine(val);
                if (val) {
                  setError(false);
                }
              }}
              onChangeEnd={(val) => {
                if (val) {
                  setError(false);
                  commitAndAdvance(() => onNext(val));
                }
              }}
            />
          </div>
          {error && !line && <InlineError text="Select the OOXii line number before continuing." />}
        </div>
      </div>
      <BottomBar onNext={handleNext} onBack={onBack} hideNext={!line} />
    </Shell>
  );
}
