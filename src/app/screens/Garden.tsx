import React, { useMemo } from 'react';
import { Shell, BottomNavigation } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { useGarden, useProgress } from '../../data/hooks';
import { useTheme } from '../lib/ThemeContext';

/**
 * Calculates the grid slot coordinates for an N x N plot recursively.
 * Rules:
 * - Base 3x3: (0,0)..(2,2)
 * - For N > 3:
 *   1. Shift previous coordinates down by 1 row: (r+1, c)
 *   2. Add new top row 0: (0, c) for c from 0 to N-1
 *   3. Add new right edge column N-1: (r, N-1) for r from 1 to N-1
 */
export function getPlotSlotOrder(maxSize: number): { row: number; col: number }[] {
  let slots: { row: number; col: number }[] = [
    { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
    { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
    { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 },
  ];

  for (let sz = 4; sz <= maxSize; sz++) {
    const shifted = slots.map(s => ({ row: s.row + 1, col: s.col }));
    const topRow: { row: number; col: number }[] = [];
    for (let c = 0; c < sz; c++) {
      topRow.push({ row: 0, col: c });
    }
    const rightEdge: { row: number; col: number }[] = [];
    for (let r = 1; r < sz; r++) {
      rightEdge.push({ row: r, col: sz - 1 });
    }
    slots = [...shifted, ...topRow, ...rightEdge];
  }

  return slots;
}

export function getPlotConfig(completedTests: number) {
  const plantedCarrots = Math.min(36, Math.floor(completedTests / 10));
  let size = 3;
  if (plantedCarrots >= 26) size = 6;
  else if (plantedCarrots >= 17) size = 5;
  else if (plantedCarrots >= 10) size = 4;
  else size = 3;

  return { plantedCarrots, size };
}

export function Garden({ onNav }: { onNav: (s: ScreenId) => void }) {
  const { progress } = useProgress();
  const { cache } = useGarden();
  const { t } = useTheme();

  const completedTests = progress?.completedTests ?? 0;
  const totalCarrots = progress?.totalCarrots ?? 0;
  const communityCarrots = cache?.totalCommunityCarrots ?? 0;

  const { plantedCarrots, size } = useMemo(() => getPlotConfig(completedTests), [completedTests]);
  const slotOrder = useMemo(() => getPlotSlotOrder(size), [size]);

  // Determine render bounds for SVG
  const tileDx = 140 / size;
  const tileDy = 70 / size;
  const originX = 180;
  const originY = 35;

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">Personal & Community</div>
            <h1 className="text-3xl font-bold text-[var(--text)] leading-tight">{t('garden.title')}</h1>
          </div>
          <div className="px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--card-border)] text-xs text-[var(--text-muted)] font-medium">
            Offline mode
          </div>
        </div>

        {/* Isometric Garden Viewport */}
        <div className="rounded-3xl overflow-hidden border border-[var(--card-border)] bg-[var(--card)] p-4 flex flex-col items-center shadow-lg">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)] mb-2">
            Your Plot ({size}x{size} Grid)
          </div>

          <div className="w-full max-w-[340px] aspect-[4/3] relative flex items-center justify-center">
            <svg viewBox="0 0 360 250" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="grassGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>
                <linearGradient id="soilLeftGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>
                <linearGradient id="soilRightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#92400E" />
                  <stop offset="100%" stopColor="#581C87" opacity="0.3" />
                </linearGradient>
              </defs>

              {/* Island Earth Sides */}
              <polygon
                points={`40,${originY + size * tileDy} 180,${originY + 2 * size * tileDy} 180,${originY + 2 * size * tileDy + 24} 40,${originY + size * tileDy + 24}`}
                fill="url(#soilLeftGrad)"
              />
              <polygon
                points={`180,${originY + 2 * size * tileDy} 320,${originY + size * tileDy} 320,${originY + size * tileDy + 24} 180,${originY + 2 * size * tileDy + 24}`}
                fill="url(#soilRightGrad)"
              />

              {/* Grass Top Surface */}
              <polygon
                points={`180,${originY} 320,${originY + size * tileDy} 180,${originY + 2 * size * tileDy} 40,${originY + size * tileDy}`}
                fill="url(#grassGrad)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />

              {/* Grid Cells & Carrots */}
              {slotOrder.slice(0, size * size).map((slot, idx) => {
                const isPlanted = idx < plantedCarrots;
                const cx = originX + (slot.col - slot.row) * (tileDx / 2);
                const cy = originY + (slot.col + slot.row) * (tileDy / 2) + tileDy / 2;

                return (
                  <g key={`${slot.row}-${slot.col}`} transform={`translate(${cx}, ${cy})`}>
                    {/* Dirt Patch */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx={tileDx / 2.6}
                      ry={tileDy / 2.6}
                      fill="#78350F"
                      opacity={isPlanted ? "0.9" : "0.3"}
                    />
                    {isPlanted ? (
                      /* Static Carrot Sprite */
                      <g transform="translate(-10, -22)">
                        <text x="0" y="16" fontSize="18" style={{ userSelect: 'none' }}>
                          🥕
                        </text>
                      </g>
                    ) : (
                      /* Subtle Soil Marker */
                      <circle cx="0" cy="0" r="2" fill="#B45309" opacity="0.4" />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full flex justify-between items-center px-4 py-2 border-t border-[var(--card-border)] mt-2">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              Planted carrots: <strong className="text-[var(--text)]">{plantedCarrots} / 36</strong>
            </span>
            <span className="text-xs text-[var(--primary)] font-semibold">
              {completedTests} tests done
            </span>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 flex items-start gap-3">
          <span className="text-2xl leading-none">🥕</span>
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">How your garden grows</div>
            <div className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
              Every completed test earns <strong>1 collected carrot</strong>. Every 10 completed tests plants <strong>1 visible carrot</strong> in your plot (up to 36 carrots in a 6x6 grid).
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)] font-medium">Completed Tests</span>
            <span className="text-2xl font-bold text-[var(--primary)]">{completedTests}</span>
          </div>
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 flex flex-col gap-1">
            <span className="text-xs text-[var(--text-muted)] font-medium">Collected Carrots</span>
            <span className="text-2xl font-bold text-[#FF9F45]">{totalCarrots}</span>
          </div>
        </div>

        {/* Global Collection */}
        <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">Global Collection</div>
            <div className="text-xl font-bold text-[var(--text)] mt-0.5">{communityCarrots.toLocaleString()} carrots</div>
          </div>
          <span className="text-xs text-[var(--text-muted)] italic">Last cached</span>
        </div>
      </div>
      <BottomNavigation current="community-garden" onNav={onNav} />
    </Shell>
  );
}
