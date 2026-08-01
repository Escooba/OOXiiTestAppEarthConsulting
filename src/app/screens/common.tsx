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
                ? 'bg-[var(--primary)]/15 border-[var(--primary)] text-[var(--text)] font-semibold shadow-xs'
                : `bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)]/40 ${
                    err ? 'border-red-500/50' : 'border-[var(--card-border)]'
                  }`
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                active ? 'border-[var(--primary)]' : 'border-[var(--card-border)]'
              }`}
            >
              {active && <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />}
            </span>
            <span className="text-sm font-medium">{getDisplayLabel(o)}</span>
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
            className={`h-12 rounded-xl text-lg font-bold border transition-all ${
              active
                ? 'bg-[var(--btn-primary-bg)] border-[var(--primary)] text-[var(--btn-primary-text)] shadow-md'
                : `bg-[var(--card)] text-[var(--text)] ${err ? 'border-red-500/50' : 'border-[var(--card-border)] hover:border-[var(--primary)]/40'}`
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
      className="text-red-500 dark:text-red-400 text-xs flex items-start gap-1.5 mt-1 font-medium"
    >
      <AlertCircle size={14} className="shrink-0 mt-0.5" />
      <span>{text}</span>
    </motion.div>
  );
}

export function InstructionCard({ text, icon = 'user' }: { text: string; icon?: 'user' | 'eye' }) {
  const Icon = icon === 'eye' ? Eye : User;
  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl flex gap-4 items-start border border-[var(--card-border)] shadow-sm">
      <div className="bg-[var(--primary)]/10 p-3 rounded-full shrink-0">
        <Icon size={22} className="text-[var(--primary)]" />
      </div>
      <p className="text-sm text-[var(--text)] leading-relaxed">{text}</p>
    </div>
  );
}

export function ImagePanel({ caption, marker }: { caption: string; marker?: string }) {
  return (
    <div className="relative rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 min-h-[160px] flex items-center justify-center overflow-hidden shadow-sm">
      <div className="relative z-10 text-center">
        <div className="text-[var(--primary)] font-semibold text-sm">{caption}</div>
        {marker && (
          <div className="mt-3 inline-block bg-[var(--card)] text-[var(--text)] px-3 py-1 rounded-full text-xs font-bold border border-[var(--primary)]/40">
            {marker}
          </div>
        )}
      </div>
    </div>
  );
}

export function ReadonlyField({ label, value, placeholder }: { label: string; value: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2 px-1 opacity-90">
      <label className="text-xs text-[var(--text-muted)] leading-tight">{label}</label>
      <div className="w-full bg-[var(--input)] border border-[var(--input-border)] rounded-xl py-4 px-4 text-sm text-[var(--text)]">
        {value || <span className="text-[var(--text-muted)]">{placeholder}</span>}
      </div>
    </div>
  );
}
