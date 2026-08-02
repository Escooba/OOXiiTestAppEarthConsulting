import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { HelpButton } from '../components/HelpButton';
import { RadioGroup, InlineError } from './common';
import { Check } from 'lucide-react';

export type FrameColor = 'blue' | 'red' | 'yellow' | 'green' | 'black' | 'white';

export const FRAME_COLORS: { id: FrameColor; label: string; bgClass: string; hex: string; isDarkText?: boolean }[] = [
  { id: 'blue', label: 'Blue', bgClass: 'bg-[#3B82F6]', hex: '#3B82F6' },
  { id: 'red', label: 'Red', bgClass: 'bg-[#EF4444]', hex: '#EF4444' },
  { id: 'yellow', label: 'Yellow', bgClass: 'bg-[#EAB308]', hex: '#EAB308', isDarkText: true },
  { id: 'green', label: 'Green', bgClass: 'bg-[#22C55E]', hex: '#22C55E' },
  { id: 'black', label: 'Black', bgClass: 'bg-[#18181B] border border-white/20', hex: '#18181B' },
  { id: 'white', label: 'White', bgClass: 'bg-white border border-slate-300', hex: '#FFFFFF', isDarkText: true },
];

interface Props {
  progress?: number;
  initialValues?: {
    frameType?: string;
    frontColour?: string;
    rightArmColour?: string;
    leftArmColour?: string;
    frameSize?: string;
  };
  onBack: () => void;
  onNext: (data: {
    frameType: string;
    frontColour: string;
    rightArmColour: string;
    leftArmColour: string;
    frameSize: string;
  }) => void;
}

export function DistanceGlassesDispensedScreen({ progress = 88, initialValues, onBack, onNext }: Props) {
  const [frameType, setFrameType] = useState<string>(initialValues?.frameType || 'Plastic');
  const [frontColour, setFrontColour] = useState<string>(initialValues?.frontColour || 'blue');
  const [rightArmColour, setRightArmColour] = useState<string>(initialValues?.rightArmColour || 'blue');
  const [leftArmColour, setLeftArmColour] = useState<string>(initialValues?.leftArmColour || 'blue');
  const [frameSize, setFrameSize] = useState<string>(initialValues?.frameSize || 'Medium');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!frameType) return setError('Please select a frame type.');
    if (!frontColour) return setError('Please select a front frame colour.');
    if (!rightArmColour) return setError('Please select a right arm colour.');
    if (!leftArmColour) return setError('Please select a left arm colour.');
    if (!frameSize) return setError('Please select a frame size.');

    setError(null);
    onNext({
      frameType,
      frontColour,
      rightArmColour,
      leftArmColour,
      frameSize,
    });
  };

  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5 text-[var(--text)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-light text-[var(--text)]">Distance glasses dispensed</h1>
          </div>
          <HelpButton configId="distance-glasses-dispensed" />
        </div>

        {/* Frame type */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-3 shadow-md">
          <label className="text-sm font-semibold text-[var(--text)]">Frame type</label>
          <RadioGroup
            value={frameType}
            onChange={(v) => { setFrameType(v); setError(null); }}
            options={['Plastic', 'Metal']}
          />
        </div>

        {/* Frame colour selection */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-4 shadow-md">
          <label className="text-sm font-semibold text-[var(--text)]">Frame colour</label>

          <ColorRow
            label="Front"
            value={frontColour}
            onChange={(c) => { setFrontColour(c); setError(null); }}
          />

          <ColorRow
            label="Right arm"
            value={rightArmColour}
            onChange={(c) => { setRightArmColour(c); setError(null); }}
          />

          <ColorRow
            label="Left arm"
            value={leftArmColour}
            onChange={(c) => { setLeftArmColour(c); setError(null); }}
          />
        </div>

        {/* Frame size */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-3 shadow-md">
          <label className="text-sm font-semibold text-[var(--text)]">Frame size</label>
          <RadioGroup
            value={frameSize}
            onChange={(v) => { setFrameSize(v); setError(null); }}
            options={['Small', 'Medium', 'Large']}
          />
        </div>

        {error && <InlineError text={error} />}
      </div>

      <BottomBar onNext={handleNext} onBack={onBack} />
    </Shell>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
        <span>{label}</span>
        <span className="capitalize text-[var(--text)] font-semibold">{value || 'Select colour'}</span>
      </div>
      <div className="flex items-center gap-3 py-1">
        {FRAME_COLORS.map((c) => {
          const selected = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              aria-label={`${label}: ${c.label}`}
              className={`w-9 h-9 rounded-full ${c.bgClass} flex items-center justify-center transition-all cursor-pointer relative ${
                selected
                  ? 'ring-2 ring-offset-2 ring-[var(--primary)] ring-offset-[var(--card)] scale-110 shadow-lg z-10'
                  : 'hover:scale-105 opacity-90'
              }`}
            >
              {selected && (
                <Check
                  size={15}
                  className={c.isDarkText ? 'text-black font-bold' : 'text-white font-bold'}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
