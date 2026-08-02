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
          <h1 className="text-xl font-medium text-[var(--text)]">{t('home.welcome', { name: testerName })}</h1>
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] font-semibold">
            <MapPin size={14} /> {region}
          </div>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-4 pt-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="relative w-20 h-20 rounded-3xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 flex items-center justify-center shadow-sm"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl bg-[var(--primary)]/20 blur-xl"
            />
            <Eye size={36} className="relative text-[var(--primary)]" strokeWidth={1.8} />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-[var(--text)] leading-tight">{t('home.hero_title_1')}</h2>
            <h2 className="text-3xl font-bold text-[var(--card-hero-title)] leading-tight">{t('home.hero_title_2')}</h2>
          </div>
          <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-[320px]">
            {t('home.hero_subtitle')}
          </p>
        </div>

        {/* Bun guide card */}
        <div data-tour="welcome-hero" className="rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5 flex items-start gap-3 shadow-md">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-11 h-11 rounded-2xl bg-[var(--pill-bg)] border border-[var(--card-border)] flex items-center justify-center shrink-0"
          >
            <RabbitMascot size={24} />
          </motion.div>
          <div>
            <div className="text-base font-bold text-[var(--text)]">{t('home.bun_intro_title')}</div>
            <div className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
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
                  className="flex-1 min-h-[44px] px-3 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                >
                  {t('ui.cancel_test')}
                </button>
              )}
              <button
                type="button"
                onClick={onResumeTest}
                className="flex-1 min-h-[44px] px-3 rounded-2xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-md"
              >
                <span>{t('ui.resume')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Info boxes */}
        <HomeCard
          dataTour="new-client"
          icon={<UserPlus size={22} />}
          title={t('home.new_client_title')}
          body={t('home.new_client_body')}
          cta={t('home.new_client_cta')}
          onClick={() => onNav('client-info')}
        />
        <HomeCard
          dataTour="search-client"
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
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 dark:text-red-400">
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
  icon, title, body, cta, onClick, dataTour,
}: {
  icon: React.ReactNode; title: string; body: string; cta: string; onClick: () => void; dataTour?: string;
}) {
  return (
    <motion.div
      data-tour={dataTour}
      whileHover={{ scale: 1.01 }}
      className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-3 shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="bg-[var(--primary)]/15 text-[var(--primary)] p-2.5 rounded-full">{icon}</div>
        <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
      </div>
      <p className="text-base text-[var(--text-muted)] leading-relaxed">{body}</p>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="mt-2 h-12 rounded-2xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-md hover:brightness-110 transition-all"
      >
        {cta}
      </motion.button>
    </motion.div>
  );
}

function RegionModal({ onSaved, defaultRegion }: { onSaved: (r: string) => void; defaultRegion: string }) {
  const { t } = useTheme();
  const [choice, setChoice] = useState<'tester' | 'other'>('tester');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [village, setVillage] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-5 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-[380px] bg-[var(--card)] rounded-3xl border border-[var(--card-border)] shadow-2xl p-6 flex flex-col gap-4 text-[var(--text)]"
      >
        <h2 className="text-xl font-bold text-[var(--text)]">{t('home.confirm_region_title')}</h2>

        <label className="flex items-start gap-3 p-3 rounded-2xl border border-[var(--card-border)] bg-[var(--bg)] cursor-pointer">
          <input type="radio" checked={choice === 'tester'} onChange={() => setChoice('tester')} className="accent-[var(--primary)] mt-1" />
          <div>
            <div className="text-sm font-semibold text-[var(--text)]">{t('home.tester_region')}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{t('home.tester_region_sub')}</div>
          </div>
        </label>
        <label className="flex items-start gap-3 p-3 rounded-2xl border border-[var(--card-border)] bg-[var(--bg)] cursor-pointer">
          <input type="radio" checked={choice === 'other'} onChange={() => setChoice('other')} className="accent-[var(--primary)] mt-1" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-[var(--text)]">{t('home.other_region')}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">{t('home.other_region_sub')}</div>
          </div>
        </label>

        {choice === 'tester' ? (
          <div className="rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 p-4">
            <div className="text-xs uppercase text-[var(--primary)] font-semibold tracking-wider">{t('home.current_tester_region')}</div>
            <div className="text-sm mt-1 text-[var(--text)] font-semibold">{defaultRegion}</div>
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
              className="w-full bg-[var(--input)] border border-[var(--input-border)] text-[var(--text)] rounded-xl py-3 px-4 text-sm outline-none focus:border-[var(--primary)]"
            />
          </div>
        )}

        <button onClick={() => {
          if (choice === 'tester') {
            onSaved(defaultRegion);
          } else {
            const parts = [village, city, state, country].filter(Boolean);
            onSaved(parts.join(', ') || defaultRegion);
          }
        }} className="mt-2 h-12 rounded-2xl bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-md hover:brightness-110 transition-all">
          {t('ui.save')}
        </button>
      </motion.div>
    </motion.div>
  );
}
