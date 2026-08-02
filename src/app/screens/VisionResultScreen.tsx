import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Flag } from 'lucide-react';
import { Shell, BottomBar } from '../components/Shell';
import { ReadonlyField } from './common';
import { HelpButton } from '../components/HelpButton';
import { preloadTumblingEChart } from '../help/apparatusHelpConfig';

interface Props {
  title: string;
  subtitle?: string;
  progress: number;
  snellenLabel: string;
  snellen: string;
  onNext: () => void;
  onBack: () => void;
  helpConfigId?: string;
}

export function VisionResultScreen({
  title, subtitle, progress, snellenLabel, snellen, onNext, onBack, helpConfigId = 'tumbling-e-result'
}: Props) {
  useEffect(() => {
    preloadTumblingEChart();
  }, []);

  return (
    <Shell progress={progress}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-light">{title}</h1>
            {subtitle && <h2 className="text-lg font-medium text-[#A984FF] mt-1">{subtitle}</h2>}
          </div>
          <HelpButton configId={helpConfigId} />
        </div>

        <ReadonlyField label={snellenLabel} value={snellen ? `${snellen} (Calculated)` : 'N/A'} placeholder="" />

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-2xl bg-[#A984FF]/10 border border-[#A984FF]/30 p-4 flex items-center gap-3"
        >
          <Flag size={20} className="text-[#A984FF] shrink-0" />
          <span className="text-sm text-white/90">Section complete. Press Next to continue to the next part of the test.</span>
        </motion.div>
      </div>
      <BottomBar onNext={onNext} onBack={onBack} />
    </Shell>
  );
}
