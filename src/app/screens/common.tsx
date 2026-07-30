import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, User, Eye } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

export function RadioGroup({
  value,
  onChange,
  options,
  err,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  err?: boolean;
}) {
  const { t } = useTheme();
  const getDisplayLabel = (opt: string) => {
    if (opt === 'Yes') return t('ui.yes');
    if (opt === 'No') return t('ui.no');
    if (opt === 'Yes, right eye') return t('clients.yes_right_eye');
    if (opt === 'Yes, left eye') return t('clients.yes_left_eye');
    if (opt === 'Yes, both eyes') return t('clients.yes_both_eyes');
    if (opt === 'Female') return t('ui.female');
    if (opt === 'Male') return t('ui.male');
    if (opt === 'Non-binary') return t('ui.non_binary');
    if (opt === 'Prefer not to say') return t('ui.prefer_not_to_say');
    if (opt === 'Other') return t('ui.other');
    if (opt === 'None') return t('ui.none');
    if (opt === 'Plus (+)' || opt === 'Plus') return t('wheel.plus');
    if (opt === 'Minus (-)' || opt === 'Minus') return t('wheel.minus');
    if (opt === 'Neither / Equal' || opt === 'Neither plus nor minus lenses improve vision') return t('wheel.neither');
    if (opt === 'Red' || opt === 'Letters on red side') return t('wheel.red');
    if (opt === 'Green' || opt === 'Letters on green side') return t('wheel.green');
    if (opt === 'Equal / Same' || opt === 'Letters look the same') return t('wheel.equal');
    return opt;
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`text-left px-4 py-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
              active
                ? 'bg-[#A984FF]/10 border-[#A984FF] text-white'
                : `bg-[#2A0730] text-white hover:border-white/30 ${
                    err ? 'border-[#FF5C5C]/40' : 'border-white/10'
                  }`
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                active ? 'border-[#A984FF]' : 'border-white/40'
              }`}
            >
              {active && <span className="w-2.5 h-2.5 rounded-full bg-[#A984FF]" />}
            </span>
            <span className="text-sm">{getDisplayLabel(o)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ChipRadio({
  value,
  onChange,
  options,
  err,
}: {
  value: string;
  onChange: (v: string) => void;
  options: (string | number)[];
  err?: boolean;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {options.map((o) => {
        const s = String(o);
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(active ? '' : s)}
            className={`h-12 rounded-xl text-lg font-medium border transition-all ${
              active
                ? 'bg-[#A984FF] border-[#A984FF] text-[#2A0730] shadow-[0_0_15px_rgba(0,209,193,0.3)]'
                : `bg-[#2A0730] text-white ${err ? 'border-[#FF5C5C]/50' : 'border-white/10 hover:border-white/30'}`
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

export function InlineError({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[#FF5C5C] text-xs flex items-start gap-1.5 mt-1"
    >
      <AlertCircle size={14} className="shrink-0 mt-0.5" />
      <span>{text}</span>
    </motion.div>
  );
}

export function InstructionCard({ text, icon = 'user' }: { text: string; icon?: 'user' | 'eye' }) {
  const Icon = icon === 'eye' ? Eye : User;
  return (
    <div className="bg-[#22193B] p-5 rounded-2xl flex gap-4 items-start border border-white/5">
      <div className="bg-white/10 p-3 rounded-full shrink-0">
        <Icon size={22} className="text-[#A984FF]" />
      </div>
      <p className="text-sm text-gray-200 leading-relaxed">{text}</p>
    </div>
  );
}

export function ImagePanel({ caption, marker }: { caption: string; marker?: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#A984FF]/20 to-[#A984FF]/5 p-6 min-h-[160px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(0,209,193,0.5),transparent_70%)]" />
      <div className="relative z-10 text-center">
        <div className="text-[#A984FF] font-medium text-sm">{caption}</div>
        {marker && (
          <div className="mt-3 inline-block bg-[#2A0730] text-[#A984FF] px-3 py-1 rounded-full text-xs font-bold border border-[#A984FF]/40">
            {marker}
          </div>
        )}
      </div>
    </div>
  );
}

export function ReadonlyField({ label, value, placeholder }: { label: string; value: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2 px-1 opacity-80">
      <label className="text-xs text-[#9B93BA] leading-tight">{label}</label>
      <div className="w-full bg-[#2A0730] border border-white/5 rounded-xl py-4 px-4 text-sm text-white">
        {value || <span className="text-[#6A608A]">{placeholder}</span>}
      </div>
    </div>
  );
}
