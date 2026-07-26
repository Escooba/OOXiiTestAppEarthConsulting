import React from 'react';
import { motion } from 'motion/react';
import { Flag } from 'lucide-react';
import { Shell, BottomBar } from '../components/Shell';
import { ReadonlyField } from './common';

interface Props {
  side: 'right' | 'left';
  progress: number;
  direction: string;
  power?: string;
  twoColour: string;
  line9: string;
  onNext: () => void;
  onBack: () => void;
}

export function WheelResultScreen({
  side, progress, direction, power, twoColour, line9, onNext, onBack
}: Props) {
  const resultString = direction.startsWith('Neither') 
    ? direction 
    : `${direction} ${power}`;

  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Wheel test — {side === 'right' ? 'Right' : 'Left'} eye result</h1>
        </div>

        <ReadonlyField label={`Best ${side} lens`} value={resultString} placeholder="" />
        <ReadonlyField label="2-colour test" value={twoColour} placeholder="" />
        <ReadonlyField label="Reads line 9" value={line9} placeholder="" />

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-2xl bg-[#A984FF]/10 border border-[#A984FF]/30 p-4 flex items-center gap-3"
        >
          <Flag size={20} className="text-[#A984FF] shrink-0" />
          <span className="text-sm text-white/90">Review the result. Press Next to continue to the next part of the test.</span>
        </motion.div>
      </div>
      <BottomBar onNext={onNext} onBack={onBack} />
    </Shell>
  );
}
