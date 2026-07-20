import React from 'react';
import { motion } from 'motion/react';
import { Flag } from 'lucide-react';
import { Shell, BottomBar } from '../components/Shell';
import { ReadonlyField } from './common';

interface Props {
  title: string;
  subtitle?: string;
  progress: number;
  snellenLabel: string;
  snellen: string;
  onNext: () => void;
  onBack: () => void;
}

export function VisionResultScreen({
  title, subtitle, progress, snellenLabel, snellen, onNext, onBack
}: Props) {
  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">{title}</h1>
          {subtitle && <h2 className="text-lg font-medium text-[#00D1C1] mt-1">{subtitle}</h2>}
        </div>

        <ReadonlyField label={snellenLabel} value={snellen ? `${snellen} (Calculated)` : 'N/A'} placeholder="" />

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-2xl bg-[#00D1C1]/10 border border-[#00D1C1]/30 p-4 flex items-center gap-3"
        >
          <Flag size={20} className="text-[#00D1C1] shrink-0" />
          <span className="text-sm text-white/90">Section complete. Press Next to continue to the next part of the test.</span>
        </motion.div>
      </div>
      <BottomBar onNext={onNext} onBack={onBack} />
    </Shell>
  );
}
