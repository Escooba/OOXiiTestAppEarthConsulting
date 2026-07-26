import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hand, X, Play } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

interface HelpButtonProps {
  title: string;
  description: string;
  pulse?: boolean;
}

export function HelpButton({ title, description, pulse = false }: HelpButtonProps) {
  const [open, setOpen] = useState(false);
  const { tokens } = useTheme();

  return (
    <>
      <button
        type="button"
        aria-label={`Get help: ${title}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 rounded-full bg-[var(--card)] border border-[var(--primary)]/40 text-[var(--primary)] text-xs font-semibold hover:bg-[var(--card-active)] transition-colors ${
          pulse ? 'animate-pulse' : ''
        }`}
      >
        <Hand size={16} />
        <span>Help</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--overlay)] backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] bg-[var(--card)] text-[var(--text)] rounded-3xl overflow-hidden border border-[var(--card-border)] shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-[var(--card-border)]">
                <h3 className="font-semibold text-[var(--text)] text-sm">{title}</h3>
                <button
                  aria-label="Close help"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 bg-[var(--bg)] rounded-full text-[var(--text)] hover:opacity-80 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative aspect-video bg-[var(--bg)] flex items-center justify-center">
                <div className="bg-[var(--primary)] rounded-full p-4 text-[var(--bg)] shadow-lg">
                  <Play className="fill-current w-8 h-8 ml-1" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{description}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 min-h-[44px] rounded-xl bg-[var(--primary)] text-[var(--bg)] font-semibold"
                  >
                    Got it
                  </button>
                  <button 
                    onClick={() => setOpen(false)}
                    className="flex-1 min-h-[44px] rounded-xl border border-[var(--card-border)] text-[var(--text)] font-medium"
                  >
                    Close
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
