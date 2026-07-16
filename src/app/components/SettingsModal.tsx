import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme, DisplayMode, Language } from '../lib/ThemeContext';
import { SelectField } from '../screens/TesterInfo';

const LANGUAGES: Language[] = [
  'English', 'Tok Pisin', 'Bislama', 'French', 'Spanish',
  'Portuguese', 'Bahasa Indonesia', 'Mongolian',
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: Props) {
  const { mode, language, setMode, setLanguage } = useTheme();
  const [draftMode, setDraftMode] = useState<DisplayMode>(mode);
  const [draftLang, setDraftLang] = useState<Language>(language);

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
              <h2 className="text-lg font-medium">Settings</h2>
              <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              <div>
                <div className="text-xs uppercase tracking-wider text-[#00D1C1] font-semibold mb-2">Language</div>
                <SelectField
                  value={draftLang}
                  onChange={(v) => setDraftLang(v as Language)}
                  placeholder="Select language"
                  options={LANGUAGES}
                />
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-[#00D1C1] font-semibold mb-2">Display mode</div>
                <div className="flex flex-col gap-2">
                  <ThemeOption
                    id="ooxii_purple"
                    title="OOXii sunlight purple"
                    desc="Best for outdoor testing and bright sunlight."
                    preview="from-[#150F26] to-[#2A2049]"
                    accent="#00D1C1"
                    icon={<Sparkles size={16} />}
                    selected={draftMode === 'ooxii_purple'}
                    onSelect={() => setDraftMode('ooxii_purple')}
                  />
                  <ThemeOption
                    id="traditional_light"
                    title="Traditional light mode"
                    desc="Light background with dark text."
                    preview="from-white to-[#F5F5F7]"
                    accent="#00D1C1"
                    icon={<Sun size={16} />}
                    selected={draftMode === 'traditional_light'}
                    onSelect={() => setDraftMode('traditional_light')}
                    light
                  />
                  <ThemeOption
                    id="traditional_dark"
                    title="Traditional dark mode"
                    desc="Dark neutral background with light text."
                    preview="from-[#111214] to-[#26272C]"
                    accent="#00D1C1"
                    icon={<Moon size={16} />}
                    selected={draftMode === 'traditional_dark'}
                    onSelect={() => setDraftMode('traditional_dark')}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border border-white/15 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={apply}
                className="flex-[2] h-11 rounded-xl bg-[#00D1C1] text-[#150F26] font-bold"
              >
                Apply
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
        selected ? 'border-[#00D1C1] bg-[#00D1C1]/10' : 'border-white/10 bg-[#150F26] hover:border-white/20'
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
          {selected && <Check size={14} className="text-[#00D1C1]" />}
        </div>
        <div className="text-xs text-[#9B93BA] mt-0.5 leading-snug">{desc}</div>
      </div>
    </button>
  );
}
