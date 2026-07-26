import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme, DisplayMode } from '../lib/ThemeContext';
import { SelectField } from '../screens/TesterInfo';
import { LanguageCode, LANGUAGES } from '../lib/i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: Props) {
  const { mode, language, t, setMode, setLanguage } = useTheme();
  const [draftMode, setDraftMode] = useState<DisplayMode>(mode);
  const [draftLang, setDraftLang] = useState<LanguageCode>(language);

  React.useEffect(() => {
    if (open) {
      setDraftMode(mode);
      setDraftLang(language);
    }
  }, [open, mode, language]);

  const apply = () => {
    setMode(draftMode);
    setLanguage(draftLang);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] bg-[#22193B] rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-white"
          >
            <div className="flex justify-between items-center p-5 border-b border-white/5">
              <h2 className="text-xl font-medium text-white">{t('ui.settings')}</h2>
              <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-white/10 text-[#9B93BA] transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#A984FF] font-semibold mb-2">Language</div>
                <SelectField
                  value={LANGUAGES[draftLang]}
                  onChange={(v) => {
                    const code = Object.keys(LANGUAGES).find(k => LANGUAGES[k as LanguageCode] === v) as LanguageCode;
                    if (code) setDraftLang(code);
                  }}
                  placeholder="Select language"
                  options={Object.values(LANGUAGES)}
                />
              </div>

              {/* Theme Settings */}
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#A984FF] uppercase tracking-wider">Display Mode</h3>
                <div className="flex gap-2 p-1 bg-[var(--card)] rounded-xl border border-[var(--card-border)] shadow-sm">
                  <button
                    onClick={() => setDraftMode('ooxii')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      draftMode === 'ooxii'
                        ? 'bg-[var(--bg)] text-[var(--primary)] shadow-sm ring-1 ring-[var(--primary)]/30'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                    }`}
                  >
                    <Sparkles size={16} />
                    OOXii Default
                  </button>
                  <button
                    onClick={() => setDraftMode('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      draftMode === 'light'
                        ? 'bg-[var(--bg)] text-[var(--text)] shadow-sm ring-1 ring-[var(--card-border)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]'
                    }`}
                  >
                    <Sun size={16} />
                    Light Mode
                  </button>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-white/5 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
              >
                {t('ui.cancel')}
              </button>
              <button
                onClick={apply}
                className="flex-1 py-3.5 rounded-2xl bg-[#A984FF] text-[#2A0730] font-bold shadow-[0_0_20px_rgba(169,132,255,0.3)] hover:bg-[#BBA0FF] transition-colors"
              >
                {t('ui.save')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ThemeOption({
  title, desc, preview, accent, icon, selected, onSelect, light,
}: {
  id: string; title: string; desc: string; preview: string; accent: string;
  icon: React.ReactNode; selected: boolean; onSelect: () => void; light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left p-3 rounded-2xl border transition-all flex gap-3 items-center ${
        selected ? 'border-[#A984FF] bg-[#A984FF]/10' : 'border-white/10 bg-[#2A0730] hover:border-white/20'
      }`}
    >
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${preview} border border-white/10 flex items-center justify-center shrink-0`}
        style={{ color: accent }}
      >
        <div className={light ? 'text-[#1A1B3A]' : ''}>{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium flex items-center gap-2">
          {title}
          {selected && <Check size={14} className="text-[#A984FF]" />}
        </div>
        <div className="text-xs text-[#9B93BA] mt-0.5 leading-snug">{desc}</div>
      </div>
    </button>
  );
}
