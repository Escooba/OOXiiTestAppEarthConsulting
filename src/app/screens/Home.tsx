import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { Eye, Search, MapPin, PlayCircle, BookOpen, User, Flag, ArrowRight, UserPlus } from 'lucide-react';
import { SelectField } from './TesterInfo';
import { COUNTRIES } from './TesterInfo';
import { RabbitMascot } from '../components/RabbitMascot';

interface Props {
  onNav: (s: ScreenId) => void;
  testerName: string;
  showRegionModal: boolean;
  onRegionSaved: (region: string) => void;
  region: string;
  inProgressTest?: { clientId: string; step: string; screen: ScreenId } | null;
  onResumeTest?: () => void;
}

export function Home({ onNav, testerName, showRegionModal, onRegionSaved, region, inProgressTest, onResumeTest }: Props) {
  return (
    <Shell showProgress={false}>
      <div className={`px-6 pt-4 pb-32 flex flex-col gap-5 ${showRegionModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* welcome + region */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-light text-white/90">Welcome {testerName}</h1>
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
            <h2 className="text-3xl font-bold text-white leading-tight">Vision Testing</h2>
            <h2 className="text-3xl font-bold text-[#3BE0D4] leading-tight">Field App</h2>
          </div>
          <p className="text-sm text-[#9B93BA] leading-relaxed max-w-[300px]">
            A guided, step-by-step tool for community vision testers. Bun the rabbit will guide you through every screen.
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
            <div className="text-sm font-semibold text-white">Hi! I'm Bun, your testing guide.</div>
            <div className="text-xs text-[#9B93BA] mt-1 leading-relaxed">
              I will point to the next field, remind you when you need help, and celebrate every completed client test with a carrot.
            </div>
          </div>
        </div>

        {/* Resume in-progress test */}
        {inProgressTest && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#A984FF]/40 bg-[#A984FF]/10 p-4 flex items-center gap-3"
          >
            <PlayCircle size={22} className="text-[#A984FF]" />
            <div className="flex-1">
              <div className="text-sm font-medium">Test in progress</div>
              <div className="text-xs text-[#9B93BA] mt-0.5">
                Client ID: {inProgressTest.clientId} · {inProgressTest.step}
              </div>
            </div>
            <button
              onClick={onResumeTest}
              className="h-9 px-3 rounded-full bg-[#A984FF] text-[#2A0730] text-xs font-bold flex items-center gap-1"
            >
              Resume <ArrowRight size={12} />
            </button>
          </motion.div>
        )}

        {/* Info boxes */}
        <HomeCard
          icon={<UserPlus size={22} />}
          title="New Client"
          body="Conduct a test for a new client and set up their profile."
          cta="Start new test"
          onClick={() => onNav('client-info')}
        />
        <HomeCard
          icon={<Search size={22} />}
          title="Search Client Info"
          body="Find a client using their OOXii ID and review saved test information."
          cta="Search client"
          onClick={() => onNav('find-client')}
        />

        {/* Quick nav */}
        <div className="grid grid-cols-3 gap-2">
          <QuickNav icon={<BookOpen size={16} />} label="Tutorial" onClick={() => onNav('tutorial')} />
          <QuickNav icon={<User size={16} />} label="Profile" onClick={() => onNav('tester-profile')} />
          <QuickNav icon={<Flag size={16} />} label="Garden" onClick={() => onNav('community-garden')} />
        </div>
      </div>

      <AnimatePresence>
        {showRegionModal && <RegionModal onSaved={onRegionSaved} defaultRegion={region} />}
      </AnimatePresence>
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

function QuickNav({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-[#1C1633]/60 border border-white/5 hover:border-white/20"
    >
      <span className="text-[#3BE0D4]">{icon}</span>
      <span className="text-xs text-white/80">{label}</span>
    </motion.button>
  );
}

function RegionModal({ onSaved, defaultRegion }: { onSaved: (region: string) => void; defaultRegion: string }) {
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
        <h2 className="text-xl font-medium">Confirm your region</h2>

        <label className="flex items-start gap-3 p-3 rounded-2xl border border-white/10 bg-[#2A0730] cursor-pointer">
          <input type="radio" checked={choice === 'tester'} onChange={() => setChoice('tester')} className="accent-[#A984FF] mt-1" />
          <div>
            <div className="text-sm font-medium">Tester Region</div>
            <div className="text-xs text-[#9B93BA] mt-1">Use the region set on your profile</div>
          </div>
        </label>
        <label className="flex items-start gap-3 p-3 rounded-2xl border border-white/10 bg-[#2A0730] cursor-pointer">
          <input type="radio" checked={choice === 'other'} onChange={() => setChoice('other')} className="accent-[#A984FF] mt-1" />
          <div className="flex-1">
            <div className="text-sm font-medium">Other Region</div>
            <div className="text-xs text-[#9B93BA] mt-1">Choose manually for outreach visits</div>
          </div>
        </label>

        {choice === 'tester' ? (
          <div className="rounded-2xl border border-[#A984FF]/30 bg-[#A984FF]/10 p-4">
            <div className="text-xs uppercase text-[#A984FF] font-semibold tracking-wider">Current tester region</div>
            <div className="text-sm mt-1 text-white">{defaultRegion}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <SelectField value={country} onChange={(v) => { setCountry(v); setState(''); setCity(''); }} placeholder="Country" options={Object.keys(COUNTRIES)} />
            <SelectField value={state} onChange={(v) => { setState(v); setCity(''); }} placeholder="State / Province" options={country ? Object.keys(COUNTRIES[country]) : []} disabled={!country} />
            <SelectField value={city} onChange={setCity} placeholder="City / Town" options={country && state ? COUNTRIES[country][state] || [] : []} disabled={!state} />
            <input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Optional village / site name"
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
          Save
        </button>
      </motion.div>
    </motion.div>
  );
}
