import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { SelectField } from './TesterInfo';
import { RadioGroup, InlineError, InstructionCard, ImagePanel, ReadonlyField, ChipRadio } from './common';
import { RabbitBubble } from '../components/RabbitBubble';
import { HelpButton } from '../components/HelpButton';
import { LineSlider } from '../components/LineSlider';
import { calcSnellen } from '../lib/theme';

export function WheelPDScreen({ onNext, onBack }: { onNext: (pd: number) => void; onBack: () => void }) {
  const [pd, setPd] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const n = parseInt(pd);
    if (Number.isNaN(n) || n < 52 || n > 78) return setError('Enter a PD between 52 and 78.');
    setError(null);
    onNext(n);
  };

  return (
    <Shell progress={25}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light">Wheel test</h1>
        <ImagePanel caption="Client faces vision chart" marker="3m" />
        <InstructionCard text="To improve distance vision" />
        <RabbitBubble text={error ? 'Enter a PD between 52 and 78.' : pd ? 'Nice. Press Next to continue.' : "You're here. Complete this step to keep going."} type={error ? 'error' : pd ? 'success' : 'default'} />

        <div className="bg-[#2A2049] border border-[#00D1C1]/30 rounded-3xl p-5 flex flex-col gap-3">
          <Field label="Pupillary distance (PD)">
            <div className="flex items-start gap-2">
              <input
                inputMode="numeric"
                value={pd}
                onChange={(e) => {
                  setPd(e.target.value.replace(/\D/g, ''));
                  setError(null);
                }}
                placeholder="e.g. 62"
                className={inputCls(!!error) + ' flex-1'}
              />
              <HelpButton
                title="How to read pupillary distance"
                description="Read the number from the scale next to the knob on the wheel."
              />
            </div>
          </Field>
          <p className="text-xs text-[#9B93BA] leading-relaxed">
            Valid range: 52–78. Put 0.0 lenses in front of both eyes and turn the knob to adjust
            the distance between the two eyes, read the number from the scale next to the knob.
          </p>
          {error && <InlineError text={error} />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}

interface LensProps {
  side: 'right' | 'left';
  progress: number;
  onNext: (data: { lensDirection: string; lens: string; twoColour: string; readsLine9: string }) => void;
  onBack: () => void;
}

const LENS_OPTIONS_PLUS = ['+0.5', '+1.0', '+1.5', '+2.0', '+2.5', '+3.0'];
const LENS_OPTIONS_MINUS = ['-0.5', '-1.0', '-1.5', '-2.0', '-2.5', '-3.0'];

export function WheelLensScreen({ side, progress, onNext, onBack }: LensProps) {
  const [dir, setDir] = useState('');
  const [lens, setLens] = useState('');
  const [twoColour, setTwoColour] = useState('');
  const [readsLine9, setReadsLine9] = useState('');
  const [error, setError] = useState(false);

  const requiresLens = dir === 'Plus' || dir === 'Minus';
  const opposite = side === 'right' ? 'left' : 'right';
  const submit = () => {
    if (!dir || (requiresLens && !lens) || !twoColour || !readsLine9) {
      setError(true);
      return;
    }
    onNext({ lensDirection: dir, lens, twoColour, readsLine9 });
  };

  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye</h1>
          <p className="text-sm text-[#9B93BA] mt-2">
            Make sure the black lens is covering the {opposite} eye.
          </p>
        </div>
        <ImagePanel caption={`Client occludes ${opposite} eye at wheel`} />

        <RabbitBubble
          text={error ? 'Finish these fields first, then we can move forward.' : "You're here. Complete this step to keep going."}
          type={error ? 'error' : 'default'}
        />

        <div className="bg-[#2A2049] border border-[#00D1C1]/30 rounded-3xl p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <label className="text-sm font-medium">Best {side} lens is:</label>
              <HelpButton
                title="Choose plus or minus"
                description="Try plus first. If vision improves, keep going. Otherwise try minus."
              />
            </div>
            <RadioGroup
              value={dir}
              onChange={(v) => {
                setDir(v);
                setLens('');
                setError(false);
              }}
              options={['Plus', 'Minus', 'Neither plus nor minus lenses improve vision']}
              err={error && !dir}
            />
          </div>

          {requiresLens && (
            <Field label={`Best ${dir.toLowerCase()} lens ${side} eye`}>
              <SelectField
                value={lens}
                onChange={(v) => {
                  setLens(v);
                  setError(false);
                }}
                placeholder={`Choose the best ${side} eye lens`}
                options={dir === 'Plus' ? LENS_OPTIONS_PLUS : LENS_OPTIONS_MINUS}
                err={error && !lens}
              />
            </Field>
          )}

          <div>
            <label className="text-sm font-medium block mb-2">
              Now do 2-colour test. Which letters look sharper, darker, easier to read?
            </label>
            <RadioGroup
              value={twoColour}
              onChange={(v) => {
                setTwoColour(v);
                setError(false);
              }}
              options={['Letters on red side', 'Letters on green side', 'Letters look the same']}
              err={error && !twoColour}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Can the person read line 9 or smaller?</label>
            <RadioGroup
              value={readsLine9}
              onChange={(v) => {
                setReadsLine9(v);
                setError(false);
              }}
              options={['Yes', 'No']}
              err={error && !readsLine9}
            />
          </div>

          {error && <InlineError text={`Choose the best lens before continuing.`} />}
        </div>

        {requiresLens && lens && (
          <ReadonlyField label={`Best distance lens — ${side} eye`} value={lens} placeholder="Auto-calculated" />
        )}
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}

export function WheelRightDistanceScreen({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const [improved, setImproved] = useState('');
  const [line, setLine] = useState('');
  const [letters, setLetters] = useState('');
  const [error, setError] = useState(false);
  const snellen = calcSnellen(line, letters);

  const submit = () => {
    if (!improved) return setError(true);
    if (improved === 'Yes' && (!line || !letters)) return setError(true);
    setError(false);
    onNext({ improved, line, letters, snellen });
  };

  return (
    <Shell progress={33}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light">Right distance vision at the wheel</h1>
        <ImagePanel caption="Client at wheel, facing chart" marker="3m" />
        <InstructionCard text="When you have found the lenses that give the best vision, measure the vision while the person is looking through these lenses at the wheel." />

        <RabbitBubble text={error ? 'Finish these fields first.' : "You're here."} type={error ? 'error' : 'default'} />

        <div className="bg-[#2A2049] border border-[#00D1C1]/30 rounded-3xl p-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Did vision improve with lenses at the wheel?</label>
            <RadioGroup value={improved} onChange={(v) => { setImproved(v); setError(false); }} options={['Yes', 'No']} err={error && !improved} />
          </div>

          {improved === 'Yes' && (
            <>
              <Field label="Smallest OOXii line number">
                <LineSlider
                  value={line}
                  error={error && !line}
                  onChange={(v) => { setLine(v); setError(false); }}
                />
              </Field>
              <Field label="Letters correct on next smaller line">
                <ChipRadio value={letters} onChange={(v) => { setLetters(v); setError(false); }} options={[0, 1, 2, 3, 4]} err={error && !letters} />
              </Field>
              <ReadonlyField label="RESULT — Right distance vision at the wheel" value={snellen} placeholder="Auto-calculated from line selection" />
            </>
          )}
          {error && <InlineError text="Complete the required fields before continuing." />}
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}

export function NearVisionBadAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-5 mt-2 rounded-2xl border border-[#FF5C5C]/60 bg-[#FF5C5C]/15 p-4 flex items-start gap-3"
    >
      <AlertTriangle size={20} className="text-[#FF5C5C] mt-0.5 shrink-0" />
      <div>
        <div className="font-bold text-[#FF5C5C] text-sm tracking-wide">NEAR VISION IS BAD</div>
        <div className="text-xs text-white/80 mt-1">NOW DO WHEEL TEST</div>
      </div>
    </motion.div>
  );
}
