import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, ChevronRight, Home as HomeIcon, User, Sprout, Sparkles } from 'lucide-react';
import { RabbitMascot } from '../components/RabbitMascot';

interface Props {
  onDone: () => void;
}

type Step = {
  title: string;
  emoji?: string;
  sub?: string;
  body: string;
  gradient: string;
  icon: React.ReactNode;
  iconBg: string;
  cta: string;
};

const STEPS: Step[] = [
  {
    title: "Hi! I'm Bun",
    emoji: '🐰',
    body: "I'll show you around the app so you can start helping clients see better. It only takes a minute!",
    gradient: 'from-[#A984FF] to-[#0FB5A8]',
    icon: <RabbitMascot size={26} />,
    iconBg: 'bg-white/25',
    cta: 'Next',
  },
  {
    title: 'Start Tests Here',
    sub: 'See the Home tab below',
    body: 'Tap "Start Vision Test" to run a simulation with a client. Complete the steps and log their results.',
    gradient: 'from-[#3B82F6] to-[#4F6BF0]',
    icon: <HomeIcon size={24} className="text-white" />,
    iconBg: 'bg-white/20',
    cta: 'Next',
  },
  {
    title: 'Track Your Progress',
    sub: 'See the Profile tab below',
    body: "Your Profile shows how many clients you've helped, carrots collected, and badges earned along the way.",
    gradient: 'from-[#A855F7] to-[#8B5CF6]',
    icon: <User size={24} className="text-white" />,
    iconBg: 'bg-white/20',
    cta: 'Next',
  },
  {
    title: 'Grow the Community Garden',
    sub: 'See the Garden tab below',
    body: 'Every test you complete adds carrots to the global garden. See how your work joins the worldwide effort.',
    gradient: 'from-[#22C55E] to-[#16A34A]',
    icon: <Sprout size={24} className="text-white" />,
    iconBg: 'bg-white/20',
    cta: 'Next',
  },
  {
    title: 'Follow the Rabbit!',
    body: "During tests, the rabbit points to what you should do next. Look for it when you're unsure.",
    gradient: 'from-[#F97316] to-[#FB923C]',
    icon: <Sparkles size={24} className="text-white" />,
    iconBg: 'bg-white/20',
    cta: "Let's go!",
  },
];

export function FirstLoginGuide({ onDone }: Props) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const isLast = i === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center">
      <div className="absolute inset-0 bg-[#0B0817]/80 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-[430px] px-4 pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          >
            {/* gradient header */}
            <div className={`relative bg-gradient-to-br ${step.gradient} px-5 pt-5 pb-8`}>
              <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute right-10 top-10 w-16 h-16 rounded-full bg-white/10" />
              <button
                onClick={onDone}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                aria-label="Close guide"
              >
                <X size={16} />
              </button>
              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shrink-0 shadow-inner`}
                >
                  {step.icon}
                </motion.div>
                <div className="pr-8">
                  <h2 className="text-white text-xl font-semibold leading-tight">
                    {step.title} {step.emoji && <span>{step.emoji}</span>}
                  </h2>
                  {step.sub && (
                    <div className="flex items-center gap-1 mt-1 text-white/90 text-xs font-medium">
                      <ChevronRight size={13} />
                      {step.sub}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* body (overlaps header) */}
            <div className="bg-[#1C1633] -mt-4 rounded-t-3xl px-5 pt-5 pb-5">
              <p className="text-sm text-[#C7BFE4] leading-relaxed">{step.body}</p>

              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                  {STEPS.map((_, idx) => (
                    <motion.span
                      key={idx}
                      animate={{ width: idx === i ? 22 : 8 }}
                      className={`h-2 rounded-full ${idx === i ? 'bg-[#A984FF]' : 'bg-white/25'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#9B93BA] font-medium">{i + 1} of {STEPS.length}</span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={onDone}
                  className="flex-1 h-12 rounded-2xl border border-white/15 text-[#C7BFE4] font-medium hover:bg-white/5 transition-colors"
                >
                  Skip guide
                </button>
                <button
                  onClick={() => (isLast ? onDone() : setI(i + 1))}
                  className="flex-[1.4] h-12 rounded-2xl bg-[#A984FF] text-[#2A0730] font-bold flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  {step.cta}
                  {isLast ? <RabbitMascot size={18} /> : <ArrowRight size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
