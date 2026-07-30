import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell, BottomNavigation } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { Eye, Search, MapPin, PlayCircle, BookOpen, User, Flag, ArrowRight, UserPlus } from 'lucide-react';
import { SelectField } from './TesterInfo';
import { COUNTRIES } from './TesterInfo';
import { RabbitMascot } from '../components/RabbitMascot';
import { useTheme } from '../lib/ThemeContext';

interface Props {
  onNav: (s: ScreenId) => void;
  testerName: string;
  showRegionModal: boolean;
  onRegionSaved: (region: string) => void;
  region: string;
  inProgressTest?: { clientId: string; step: string; screen: ScreenId } | null;
  onResumeTest?: () => void;
  onCancelTest?: () => void;
}

export function Home({ onNav, testerName, showRegionModal, onRegionSaved, region, inProgressTest, onResumeTest, onCancelTest }: Props) {
  const { t } = useTheme();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  return (
    <Shell showProgress={false}>
      <div className={`px-6 pt-4 pb-32 flex flex-col gap-5 ${showRegionModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* welcome + region */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-light text-white/90">{t('home.welcome', { name: testerName })}</h1>
          <div className="flex items-center gap-1.5 text-xs text-[#9B93BA]">
            <MapPin size={12} /> {region}
          </div>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-4 pt-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="relative w-20 h-20 rounded-3xl border border-[#A984FF]/40 bg-[#A984FF]/10 flex items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl bg-[#A984FF]/20 blur-xl"
            />
            <Eye size={36} className="relative text-[#3BE0D4]" strokeWidth={1.8} />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">{t('home.hero_title_1')}</h2>
            <h2 className="text-3xl font-bold text-[#3BE0D4] leading-tight">{t('home.hero_title_2')}</h2>
          </div>
          <p className="text-sm text-[#9B93BA] leading-relaxed max-w-[300px]">
            {t('home.hero_subtitle')}
          </p>
        </div>

        {/* Bun guide card */}
        <div className="rounded-3xl border border-white/8 bg-[#1C1633]/80 p-5 flex items-start gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center shrink-0"
          >
            <RabbitMascot size={24} />
          </motion.div>
          <div>
            <div className="text-sm font-semibold text-white">{t('home.bun_intro_title')}</div>
            <div className="text-xs text-[#9B93BA] mt-1 leading-relaxed">
              {t('home.bun_intro_body')}
            </div>
          </div>
        </div>

        {/* Resume in-progress test */}
        {inProgressTest && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[var(--primary)]/40 bg-[var(--card)] p-5 flex flex-col gap-3.5 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <PlayCircle size={24} className="text-[var(--primary)] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--text)]">{t('home.test_in_progress')}</div>
                <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                  {t('clients.client_id', { id: inProgressTest.clientId })} · {inProgressTest.step}
                </div>
              </div>
            </div>
            <div className="flex gap-2.5">
              {onCancelTest && (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex-1 min-h-[44px] px-3 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  {t('ui.cancel_test')}
                </button>
              )}
              <button
                type="button"
                onClick={onResumeTest}
                className="flex-1 min-h-[44px] px-3 rounded-2xl bg-[var(--primary)] text-[var(--bg)] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-md"
              >
                <span>{t('ui.resume')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Info boxes */}
        <HomeCard
          icon={<UserPlus size={22} />}
          title={t('home.new_client_title')}
          body={t('home.new_client_body')}
          cta={t('home.new_client_cta')}
          onClick={() => onNav('client-info')}
        />
        <HomeCard
          icon={<Search size={22} />}
          title={t('home.search_client_title')}
          body={t('home.search_client_body')}
          cta={t('home.search_client_cta')}
          onClick={() => onNav('find-client')}
        />
      </div>

      <AnimatePresence>
        {showRegionModal && <RegionModal onSaved={onRegionSaved} defaultRegion={region} />}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <PlayCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-[var(--text)]">{t('ui.cancel_test_title')}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t('ui.cancel_test_body')}
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 min-h-[44px] rounded-xl bg-[var(--bg)] text-[var(--text)] font-medium border border-[var(--card-border)]"
                >
                  {t('ui.keep_testing')}
                </button>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    onCancelTest?.();
                  }}
                  className="flex-1 min-h-[44px] rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  {t('ui.cancel_test')}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <BottomNavigation current="home" onNav={onNav} />
    </Shell>
  );
}

function HomeCard({
  icon, title, body, cta, onClick,
}: {
  icon: React.ReactNode; title: string; body: string; cta: string; onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-[#22193B] border border-white/5 rounded-3xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="bg-[#A984FF]/15 text-[#A984FF] p-2.5 rounded-full">{icon}</div>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <p className="text-sm text-[#9B93BA] leading-relaxed">{body}</p>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="mt-2 h-12 rounded-2xl bg-[#A984FF] text-[#2A0730] font-semibold"
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}

function RegionModal({ onSaved, defaultRegion }: { onSaved: (region: string) => void; defaultRegion: string }) {
  const { t } = useTheme();
  const [choice, setChoice] = useState<'tester' | 'other'>('tester');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [village, setVillage] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-5 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-[380px] bg-[#22193B] rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-medium">{t('home.confirm_region_title')}</h2>

        <label className="flex items-start gap-3 p-3 rounded-2xl border border-white/10 bg-[#2A0730] cursor-pointer">
          <input type="radio" checked={choice === 'tester'} onChange={() => setChoice('tester')} className="accent-[#A984FF] mt-1" />
          <div>
            <div className="text-sm font-medium">{t('home.tester_region')}</div>
            <div className="text-xs text-[#9B93BA] mt-1">{t('home.tester_region_sub')}</div>
          </div>
        </label>
        <label className="flex items-start gap-3 p-3 rounded-2xl border border-white/10 bg-[#2A0730] cursor-pointer">
          <input type="radio" checked={choice === 'other'} onChange={() => setChoice('other')} className="accent-[#A984FF] mt-1" />
          <div className="flex-1">
            <div className="text-sm font-medium">{t('home.other_region')}</div>
            <div className="text-xs text-[#9B93BA] mt-1">{t('home.other_region_sub')}</div>
          </div>
        </label>

        {choice === 'tester' ? (
          <div className="rounded-2xl border border-[#A984FF]/30 bg-[#A984FF]/10 p-4">
            <div className="text-xs uppercase text-[#A984FF] font-semibold tracking-wider">{t('home.current_tester_region')}</div>
            <div className="text-sm mt-1 text-white">{defaultRegion}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SelectField value={country} onChange={(v) => { setCountry(v); setState(''); setCity(''); }} placeholder={t('auth.country')} options={Object.keys(COUNTRIES)} />
            <SelectField value={state} onChange={(v) => { setState(v); setCity(''); }} placeholder={t('auth.state')} options={country ? Object.keys(COUNTRIES[country]) : []} disabled={!country} />
            <SelectField value={city} onChange={setCity} placeholder={t('auth.city')} options={country && state ? COUNTRIES[country][state] || [] : []} disabled={!state} />
            <input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder={t('home.optional_village')}
              className="w-full bg-[#2A0730] border border-white/10 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#A984FF]"
            />
          </div>
        )}

        <button onClick={() => {
          if (choice === 'tester') {
            onSaved(defaultRegion);
          } else {
            const parts = [village, city, state, country].filter(Boolean);
            onSaved(parts.join(', '));
          }
        }} className="mt-2 h-12 rounded-2xl bg-[#A984FF] text-[#2A0730] font-bold">
          {t('ui.save')}
        </button>
      </motion.div>
    </motion.div>
  );
}
