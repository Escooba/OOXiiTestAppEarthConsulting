import React from 'react';
import { Shell } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { Play, ArrowLeft } from 'lucide-react';

const SECTIONS: { title: string; items: { title: string; duration: string }[] }[] = [
  {
    title: 'Getting started',
    items: [{ title: 'Welcome to OOXii', duration: '1:00' }],
  },
  {
    title: 'Distance vision',
    items: [
      { title: 'How to select an OOXii line number', duration: '0:45' },
      { title: 'How to count letters on the next line', duration: '1:15' },
    ],
  },
  {
    title: 'Near vision',
    items: [{ title: 'How to measure near vision at 40cm', duration: '1:05' }],
  },
  {
    title: 'Wheel test',
    items: [
      { title: 'How to read pupillary distance on the wheel', duration: '1:20' },
      { title: 'How to choose plus or minus lenses', duration: '1:40' },
    ],
  },
  {
    title: 'Reading glasses',
    items: [{ title: 'When to recommend reading glasses', duration: '0:55' }],
  },
  {
    title: 'Using the physical kit',
    items: [{ title: 'Setting up your OOXii kit', duration: '2:00' }],
  },
  {
    title: 'Troubleshooting',
    items: [{ title: 'What to do if the client cannot read line 9', duration: '1:10' }],
  },
];

export function Tutorial({ onNav }: { onNav: (s: ScreenId) => void }) {
  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => onNav('home')} className="p-2 -ml-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-light leading-none">Tutorial</h1>
            <p className="text-xs text-[#9B93BA] mt-1">Short guides for whenever you need a refresher.</p>
          </div>
        </div>

        {SECTIONS.map((s) => (
          <div key={s.title} className="flex flex-col gap-2">
            <h2 className="text-xs uppercase tracking-wider text-[#00D1C1] font-semibold px-1">{s.title}</h2>
            {s.items.map((it) => (
              <div
                key={it.title}
                className="bg-[#22193B] border border-white/5 rounded-2xl p-3 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#150F26] flex items-center justify-center text-[#00D1C1]">
                  <Play size={20} className="fill-current ml-0.5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium leading-tight">{it.title}</div>
                  <div className="text-xs text-[#9B93BA] mt-0.5">{it.duration}</div>
                </div>
                <button className="px-3 py-1.5 rounded-full bg-[#00D1C1]/15 border border-[#00D1C1]/40 text-[#00D1C1] text-xs font-semibold">
                  Watch
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Shell>
  );
}
