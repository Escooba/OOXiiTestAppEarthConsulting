import React from 'react';
import { motion } from 'motion/react';

interface Props {
  /** '' when nothing selected, otherwise 'Line N' */
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  disabled?: boolean;
  max?: number;
}

/**
 * Intuitive line-number slider used across the vision-test screens in place of
 * a dropdown. Internally the range runs from -1 (nothing selected) to `max`, so
 * the "can't continue without selecting" constraint is preserved — value stays
 * '' until the tester actually moves the slider onto a line.
 */
export function LineSlider({ value, onChange, error, disabled, max = 11 }: Props) {
  const raw = value === '' ? -1 : parseInt(value.replace(/\D/g, ''), 10);
  const selected = raw >= 0;

  const handle = (n: number) => {
    onChange(n < 0 ? '' : `Line ${n}`);
  };

  // Percentage position of the thumb across the -1..max span.
  const span = max + 1;
  const pct = selected ? ((raw + 1) / span) * 100 : 0;
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-4">
      {/* Big readout */}
      <div
        className={`rounded-2xl border p-4 ${
          error ? 'border-[#FF5C5C]/50 bg-[#FF5C5C]/5' : 'border-white/10 bg-[#150F26]'
        }`}
      >
        <div className="text-xs text-[#9B93BA]">Selected line</div>
        <motion.div
          key={raw}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl font-semibold ${selected ? 'text-[#00D1C1]' : 'text-[#6A608A]'}`}
        >
          {selected ? `Line ${raw}` : 'Not selected'}
        </motion.div>
      </div>

      {/* Slider track */}
      <div className="px-1">
        <input
          type="range"
          min={-1}
          max={max}
          step={1}
          value={raw}
          disabled={disabled}
          onChange={(e) => handle(parseInt(e.target.value, 10))}
          className={`w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            error ? 'accent-[#FF5C5C]' : 'accent-[#00D1C1]'
          }`}
          style={{
            background: selected
              ? `linear-gradient(to right, ${error ? '#FF5C5C' : '#00D1C1'} ${pct}%, #3A3059 ${pct}%)`
              : '#3A3059',
          }}
          aria-label="Smallest OOXii line number"
        />

        {/* Interval ticks — one per line number */}
        <div className="relative mt-2 h-6">
          {numbers.map((n) => {
            const leftPct = ((n + 1) / span) * 100;
            // Native range thumb shifts its center from W/2 to W_{track} - W/2.
            // Assuming standard 16px thumb width for browsers:
            const offsetPx = (0.5 - leftPct / 100) * 16;
            const leftCalc = `calc(${leftPct}% + ${offsetPx}px)`;
            const active = selected && raw === n;
            return (
              <button
                key={n}
                type="button"
                disabled={disabled}
                onClick={() => handle(n)}
                style={{ left: leftCalc }}
                className="absolute -translate-x-1/2 flex flex-col items-center gap-1 top-0"
              >
                <span
                  className={`w-px h-2 ${active ? (error ? 'bg-[#FF5C5C]' : 'bg-[#00D1C1]') : 'bg-white/20'}`}
                />
                <span
                  className={`text-[10px] leading-none ${
                    active ? (error ? 'text-[#FF5C5C]' : 'text-[#00D1C1]') : 'text-[#6A608A]'
                  }`}
                >
                  {n}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
