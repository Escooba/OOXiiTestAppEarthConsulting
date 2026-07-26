import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell, BottomNavigation } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { ArrowLeft, Wifi, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGarden } from '../../data/hooks';
import { useTheme } from '../lib/ThemeContext';


const MILESTONES = [
  { emoji: '🌱', name: 'Sprouting', target: 1000, reached: true },
  { emoji: '🌿', name: 'Growing strong', target: 5000, reached: true },
  { emoji: '🌳', name: 'Thriving garden', target: 10000, reached: true },
  { emoji: '⚙️', name: 'Community harvest', target: 25000, reached: false },
  { emoji: '🏔️', name: 'Global forest', target: 100000, reached: false },
];

export function Garden({ onNav }: { onNav: (s: ScreenId) => void }) {
  const [view, setView] = useState<'mine' | 'community'>('mine');
  const { localCarrots, cache } = useGarden();
  const { t } = useTheme();

  const globalCarrots = cache?.totalCommunityCarrots ?? 0;
  const visionTests = cache?.totalCompletedTests ?? 0;

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => onNav('home')} className="p-2 -ml-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors mt-0.5">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-[#7E92B5]">Community</div>
              <h1 className="text-3xl font-bold text-white leading-tight">{t('garden.title')}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#123A2A] border border-[#22C55E]/40">
            <Wifi size={13} className="text-[#4ADE80]" />
            <span className="text-xs font-medium text-[#4ADE80]">Online</span>
          </div>
        </div>

        {/* Garden scene */}
        <div className="rounded-3xl overflow-hidden border border-white/5 bg-[#132033]">
          
          {/* View Toggle */}
          <div className="relative z-10 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-[#0B1423] to-transparent">
            <button 
              onClick={() => setView('mine')}
              className={`p-2 rounded-full transition-colors ${view === 'community' ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col items-center">
               <motion.div 
                 key={view}
                 initial={{ opacity: 0, y: -5 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-sm font-bold text-white tracking-wide uppercase"
               >
                 {view === 'mine' ? t('garden.my_plot') : t('garden.community_plot')}
               </motion.div>
               <div className="text-[10px] text-[#8AA0C0]">
                 {view === 'mine' ? 'Your contribution' : 'Global worldwide plots'}
               </div>
            </div>
            <button 
              onClick={() => setView('community')}
              className={`p-2 rounded-full transition-colors ${view === 'mine' ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <GardenScene view={view} localCarrots={localCarrots} globalCarrots={globalCarrots} />

          {/* stats */}
          <div className="flex items-center justify-between px-5 py-4 bg-[#132033] relative z-10 border-t border-white/5">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ rotate: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="text-3xl leading-none"
              >
                🥕
              </motion.span>
              <div>
                <AnimatedNumber 
                  value={view === 'mine' ? localCarrots : globalCarrots} 
                  className="text-2xl font-bold text-[#FF9F45] leading-none" 
                />
                <div className="text-xs text-[#8AA0C0] mt-1">
                  {view === 'mine' ? 'Your carrots collected' : 'Global carrots collected'}
                </div>
              </div>
            </div>
            {view === 'community' && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-[#7E92B5]">Vision tests</div>
                <AnimatedNumber value={visionTests} className="text-xl font-bold text-[#3BE0D4] leading-none mt-1" />
              </div>
            )}
          </div>
        </div>

        {/* Each carrot note */}
        <div className="rounded-2xl border border-[#4A3A12]/70 bg-[#211705]/60 p-4 flex items-start gap-3 mt-2">
          <span className="text-xl leading-none">🥕</span>
          <div>
            <div className="text-sm font-semibold text-[#FFB35C]">1 client tested = 1 carrot earned</div>
            <div className="text-xs text-[#B08A55] mt-1 leading-relaxed">
              Every 10 carrots you earn adds a new planted carrot to your plot. Once your plot is full, your planted carrots grow bigger!
            </div>
          </div>
        </div>

        {/* Your contribution summary */}
        {view === 'mine' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/5 bg-[#141E33] p-5 flex flex-col gap-4 mt-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Your Contribution</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🥕</span>
                <span className="font-bold text-[#FF9F45]">{localCarrots}</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="h-12 rounded-2xl bg-[#3BE0D4] text-[#0B1B2A] font-bold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(59,224,212,0.25)]"
            >
              <Upload size={18} /> Upload My Carrots to the Garden
            </motion.button>
          </motion.div>
        )}

        {/* Global milestones */}
        <h2 className="text-lg font-semibold text-white mt-3">Global Milestones</h2>
        <div className="flex flex-col gap-2.5">
          {MILESTONES.map((m, idx) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-2xl border p-4 flex items-center gap-3 ${
                m.reached
                  ? 'bg-[#0F2A1E]/70 border-[#22C55E]/30'
                  : 'bg-[#141E33]/60 border-white/5 opacity-50'
              }`}
            >
              <span className={`text-2xl leading-none ${m.reached ? '' : 'grayscale'}`}>{m.emoji}</span>
              <div className="flex-1 flex items-baseline gap-2">
                <span className={`font-semibold ${m.reached ? 'text-[#4ADE80]' : 'text-[#8A93A8]'}`}>{m.name}</span>
                <span className="text-xs text-[#7E8AA5]">{m.target.toLocaleString()}</span>
              </div>
              {m.reached && (
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: idx * 0.2 }}
                  className="text-[#4ADE80]"
                >
                  🌱
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <BottomNavigation current="community-garden" onNav={onNav} />
    </Shell>
  );
}

// ---------------------------
// 3D Isometric Garden Scene
// ---------------------------

function GardenScene({ view, localCarrots, globalCarrots }: { view: 'mine' | 'community'; localCarrots: number; globalCarrots: number }) {
  return (
    <div className="relative h-[340px] -mt-16 bg-gradient-to-b from-[#4A7C59] via-[#335C41] to-[#1E3626] overflow-hidden flex items-center justify-center">
      {/* Decorative environment */}
      <motion.div
        animate={{ x: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        className="absolute left-8 top-16 w-32 h-8 rounded-full bg-white/10 blur-xl"
      />
      <motion.div
        animate={{ x: [0, -16, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
        className="absolute right-12 top-20 w-24 h-6 rounded-full bg-white/10 blur-xl"
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />

      {/* Flat 2D container */}
      <div className="relative w-full h-full flex items-center justify-center mt-14 px-2">
        <motion.div
          layout
          initial={false}
          animate={{
            scale: view === 'mine' ? 1.1 : 0.5,
            y: view === 'mine' ? 10 : 0
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 14 }}
          className="relative flex items-center justify-center"
        >
          {view === 'mine' ? (
            <MyPlot carrots={localCarrots} />
          ) : (
            <CommunityPlots total={globalCarrots} myCarrots={localCarrots} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

function getGridConfig(displayedCarrots: number) {
  let size = 3;
  if (displayedCarrots > 25) size = 6;
  else if (displayedCarrots > 16) size = 5;
  else if (displayedCarrots > 9) size = 4;
  
  const capacity = size * size;
  const tier = Math.floor(Math.max(0, displayedCarrots - 1) / 36);
  const count = displayedCarrots === 0 ? 0 : ((displayedCarrots - 1) % 36) + 1;
  return { size, capacity, tier, count };
}

function MyPlot({ carrots }: { carrots: number }) {
  const displayedCarrots = Math.floor(carrots / 10);
  const { size, tier, count } = getGridConfig(displayedCarrots);

  return (
    <div className={`w-[320px] aspect-square bg-[#3D2916] rounded-xl grid gap-2.5 p-3 border-4 border-[#24170B] shadow-[0_15px_35px_rgba(0,0,0,0.4)]`} 
         style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${size}, minmax(0, 1fr))` }}>
      {Array.from({ length: size * size }).map((_, i) => (
        <div key={i} className="relative bg-[#291A0D] rounded-md shadow-inner overflow-visible">
          {/* Soil detail */}
          <div className="absolute inset-1.5 rounded-sm bg-[#1E1108] opacity-50"></div>
          
          {i < count && (
            <div 
              className="absolute left-1/2 top-1/2 z-10"
              style={{ transform: 'translate(-50%, -50%) translateY(-5px)' }}
            >
              <AnimatedChunkyCarrot tier={tier} index={i} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CommunityPlots({ total, myCarrots }: { total: number; myCarrots: number }) {
  // A 5x5 grid of plots to represent the community
  const myDisplayedCarrots = Math.floor(myCarrots / 10);
  const myConfig = getGridConfig(myDisplayedCarrots);

  return (
    <div className="w-[700px] aspect-square bg-[#3D2916] rounded-2xl grid grid-cols-5 grid-rows-5 gap-1 p-2 border-4 border-[#24170B] shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
      {Array.from({ length: 25 }).map((_, i) => {
        // Highlight one as "Your Plot"
        const isMine = i === 12; // center one
        
        let plotSize = 3;
        let plotCount = 0;
        let plotTier = 0;
        
        if (isMine) {
          plotSize = myConfig.size;
          plotCount = myConfig.count;
          plotTier = myConfig.tier;
        } else {
          plotSize = [3, 4, 5, 6][Math.floor(Math.abs(Math.sin(i * 3.14)) * 4)];
          plotCount = Math.floor(Math.abs(Math.sin(i * 12.34)) * (plotSize * plotSize)) + 1;
          plotTier = Math.floor(Math.abs(Math.cos(i * 7.65)) * 4);
        }

        return (
          <div 
            key={i} 
            className={`relative grid gap-1 ${isMine ? 'ring-2 ring-[#3BE0D4] ring-offset-2 ring-offset-[#3D2916] rounded-sm z-10' : ''}`}
            style={{ gridTemplateColumns: `repeat(${plotSize}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${plotSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: plotSize * plotSize }).map((_, j) => (
              <div key={j} className="relative bg-[#291A0D] rounded-[3px] shadow-inner overflow-visible">
                {/* Soil detail */}
                <div className="absolute inset-0.5 rounded-[2px] bg-[#1E1108] opacity-50"></div>

                {j < plotCount && (
                  <div 
                    className="absolute left-1/2 top-1/2 z-10"
                    style={{ transform: 'translate(-50%, -50%) translateY(-2px)' }}
                  >
                    <AnimatedChunkyCarrot tier={plotTier} index={j} />
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function AnimatedChunkyCarrot({ tier, index }: { tier: number, index: number }) {
  // Cap at tier 4 for the "fully out" state calculation
  const effectiveTier = Math.min(tier, 4);
  
  // Tier 0 = max underground offset (e.g. 40px down)
  // Tier 4 = fully out (0px offset)
  const maxOffset = 38;
  const yOffset = maxOffset - (effectiveTier * (maxOffset / 4));
  const scale = 1 + (effectiveTier * 0.1); // Also grow slightly in overall volume

  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: scale, y: 0 }}
      transition={{ 
        delay: index * 0.03, 
        type: 'spring', 
        stiffness: 200, 
        damping: 12 
      }}
      className="w-[24px] h-[28px] flex items-center justify-center transform-origin-bottom drop-shadow-md"
    >
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 3 + (index % 5) * 0.5, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 100 120" className="w-[36px] h-[44px] overflow-visible">
          <defs>
            <clipPath id={`carrot-clip-${index}`}>
              <polygon points="0,0 100,0 100,95 50,110 0,95" />
            </clipPath>
          </defs>

          {/* Back dirt hole */}
          <path d="M 50 85 L 25 70 L 50 55 L 75 70 Z" fill="#1A0F0A" opacity="0.6" />

          {/* Group that moves up as tier increases, clipped so it doesn't poke out the bottom of the dirt mound */}
          <g clipPath={`url(#carrot-clip-${index})`}>
            <motion.g
              initial={{ y: maxOffset }}
              animate={{ y: yOffset }}
              transition={{ type: 'spring', stiffness: 100, damping: 14 }}
            >
              {/* Left Leaf */}
              <path d="M 45 40 L 25 15 L 35 10 L 50 35 Z" fill="#16A34A" />
              <path d="M 25 15 L 20 25 L 45 40 Z" fill="#15803D" />

              {/* Right Leaf */}
              <path d="M 55 40 L 75 15 L 65 10 L 50 35 Z" fill="#22C55E" />
              <path d="M 75 15 L 80 25 L 55 40 Z" fill="#16A34A" />

              {/* Center Leaf */}
              <path d="M 50 42 L 50 10 L 60 15 L 55 40 Z" fill="#4ADE80" />
              <path d="M 50 42 L 40 15 L 50 10 Z" fill="#22C55E" />

              {/* Carrot Body - Isometric Cone */}
              {/* Top Face */}
              <path d="M 50 55 L 30 45 L 50 35 L 70 45 Z" fill="#FB923C" />
              {/* Left Face */}
              <path d="M 50 55 L 30 45 L 50 95 Z" fill="#EA580C" />
              {/* Right Face */}
              <path d="M 50 55 L 70 45 L 50 95 Z" fill="#F97316" />
            </motion.g>
          </g>

          {/* Dirt Mound Overlapping (Isometric block) */}
          <path d="M 50 105 L 20 90 L 50 80 L 80 90 Z" fill="#3D2916" />
          <path d="M 20 90 L 50 105 L 50 115 L 20 100 Z" fill="#291A0D" />
          <path d="M 50 105 L 80 90 L 80 100 L 50 115 Z" fill="#1E1108" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <div className={className}>{display.toLocaleString()}</div>;
}
