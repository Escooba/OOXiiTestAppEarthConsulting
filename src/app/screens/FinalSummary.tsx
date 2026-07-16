import React from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';

interface Row {
  label: string;
  value: string;
}

interface Props {
  rows: Row[];
  onHome: () => void;
}

export function FinalSummary({ rows, onHome }: Props) {
  return (
    <Shell progress={100}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light">Test section complete</h1>
        <RabbitBubble text="Great work. This client's test data is saved on this device." type="success" />

        <div className="flex flex-col gap-3">
          {rows.map((r) => (
            <div key={r.label} className="bg-[#22193B] border border-white/5 rounded-2xl p-4 flex justify-between items-center">
              <span className="text-xs text-[#9B93BA] uppercase tracking-wider">{r.label}</span>
              <span className="text-sm font-medium text-white">{r.value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomBar onNext={onHome} hideBack nextLabel="Return home" />
    </Shell>
  );
}
