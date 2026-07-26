import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, Play } from 'lucide-react';

interface HelpButtonProps {
  title: string;
  description: string;
  pulse?: boolean;
}

export function HelpButton({ title, description, pulse = false }: HelpButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#A984FF]/15 border border-[#A984FF]/40 text-[#A984FF] text-xs font-semibold hover:bg-[#A984FF]/25 transition-colors ${
          pulse ? 'animate-pulse' : ''
        }`}
      >
        <HelpCircle size={12} />
        Help
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A0730]/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] bg-[#22193B] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-white/5">
                <h3 className="font-semibold text-white text-sm">{title}</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="relative aspect-video bg-[#2A0730] flex items-center justify-center">
                <div className="bg-[#A984FF]/90 rounded-full p-4 text-[#2A0730] shadow-lg">
                  <Play className="fill-current w-8 h-8 ml-1" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-[#9B93BA] leading-relaxed">{description}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 h-11 rounded-xl bg-[#A984FF] text-[#2A0730] font-semibold"
                  >
                    Got it
                  </button>
                  <button className="flex-1 h-11 rounded-xl border border-white/15 text-white font-medium">
                    Watch again
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
