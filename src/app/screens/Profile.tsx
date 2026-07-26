import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell, BottomNavigation } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { Users, Star, TrendingUp, Check, LogOut, Lock, ArrowLeft } from 'lucide-react';
import { RabbitMascot } from '../components/RabbitMascot';
import { useProgress, useBadges } from '../../data/hooks';
import { useData } from '../../data/DataProvider';

export function Profile({ onNav, tester }: { onNav: (s: ScreenId) => void; tester: any }) {
  const { progress } = useProgress();
  const { definitions, earned } = useBadges();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { db } = useData();

  const handleLogout = async () => {
    localStorage.removeItem('ooxii_logged_in');
    sessionStorage.removeItem('region_modal_shown');
    sessionStorage.removeItem('active_region');
    window.location.reload();
  };

  const name = `${tester?.firstName ?? 'Alex'} ${tester?.lastName ?? 'Chen'}`.trim();
  
  const CARROTS = progress?.totalCarrots ?? 0;
  const CLIENTS = progress?.clientsHelped ?? 0;
  const BADGES_EARNED = progress?.badgesEarned ?? 0;
  
  const nextBadge = progress?.nextBadge;
  const NEXT_BADGE_TARGET = nextBadge?.targetValue ?? 50;
  const REMAINING = Math.max(0, NEXT_BADGE_TARGET - CLIENTS);
  const pct = nextBadge ? Math.min(100, (CLIENTS / NEXT_BADGE_TARGET) * 100) : 100;

  const earnedSet = new Set(earned.map(b => b.badgeCode));

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
              <div className="text-[11px] uppercase tracking-[0.15em] text-[#7E92B5]">Tester Profile</div>
              <h1 className="text-3xl font-bold text-white leading-tight">{name}</h1>
              <div className="text-xs text-[#9BB0D1] mt-0.5">{tester?.role || 'Community Health Tester'}</div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl bg-[#22314D] border border-white/10 flex items-center justify-center shrink-0 mt-1"
          >
            <RabbitMascot size={26} />
          </motion.div>
        </div>

        {/* Carrot card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A2338] border border-white/5 rounded-3xl p-5 flex items-center gap-4 mt-2"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FF9F45]/10 flex items-center justify-center text-3xl">🥕</div>
          <div>
            <div className="text-3xl font-bold text-[#FF9F45] leading-none">{CARROTS}</div>
            <div className="text-sm text-[#9BB0D1] mt-1">Total carrots collected</div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="bg-[#1A2338] border border-white/5 rounded-3xl p-4 flex items-center">
          <Stat icon={<Users size={18} className="text-[#5B8DEF]" />} value={String(CLIENTS)} label="Clients tested" />
          <Divider />
          <Stat icon={<Star size={18} className="text-[#EAB308]" />} value={String(BADGES_EARNED)} label="Badges earned" />
          <Divider />
          <Stat icon={<TrendingUp size={18} className="text-[#22C55E]" />} value="#46" label="Local rank" />
        </div>

        {/* Next Badge */}
        {nextBadge && (
          <div className="bg-[#1A2338] border border-white/5 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">Next Badge</span>
              <span className="text-sm text-[#9BB0D1]">{CLIENTS} / {NEXT_BADGE_TARGET}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#122E2C] border border-[#A984FF]/40 flex items-center justify-center text-xl">
                {nextBadge.iconKey}
              </div>
              <div>
                <div className="font-medium text-white">{nextBadge.displayName}</div>
                <div className="text-xs text-[#9BB0D1] mt-0.5">{REMAINING} more clients to unlock</div>
              </div>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#2A3550] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#A984FF] to-[#3BE0D4]"
              />
            </div>
          </div>
        )}

        {/* Rabbit encouragement */}
        <div className="bg-[#12251E] border border-[#22C55E]/25 rounded-3xl p-4 flex items-start gap-3">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="shrink-0"
          >
            <RabbitMascot size={26} />
          </motion.div>
          <div>
            <div className="text-[#4ADE80] font-semibold text-sm leading-snug">
              Every completed test helps someone see better.
            </div>
            {nextBadge && (
              <div className="text-[#5FA97F] text-xs mt-1">
                {REMAINING} clients away from the "{nextBadge.displayName}" badge.
              </div>
            )}
          </div>
        </div>

        {/* Badge Collection */}
        <h2 className="text-lg font-semibold text-white mt-1">Badge Collection</h2>
        <div className="grid grid-cols-3 gap-3">
          {definitions.map((b, idx) => {
            const isEarned = earnedSet.has(b.badgeCode);
            const isNext = nextBadge?.badgeCode === b.badgeCode;
            
            // Re-apply static tint logic per badge
            let tint = 'bg-[#151D2E] border-white/5';
            if (isEarned) {
              if (b.badgeCode === 'FIRST_VISION') tint = 'bg-[#1B3A5B]/60 border-[#3B82F6]/50';
              else if (b.badgeCode === 'TEN_HELPERS') tint = 'bg-[#4A3A12]/60 border-[#EAB308]/60';
              else if (b.badgeCode === 'VISION_GUIDE') tint = 'bg-[#122E2C]/60 border-[#A984FF]';
              else tint = 'bg-[#2D1B3A]/60 border-[#A855F7]/50'; // Default earned
            } else if (isNext) {
              tint = 'bg-[#1E293B]/80 border-[#475569] border-dashed';
            }

            return (
              <motion.div
                key={b.badgeCode}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBadge(b)}
                className={`relative rounded-2xl border p-3 flex flex-col items-center text-center gap-1.5 aspect-[3/3.4] justify-center cursor-pointer transition-colors ${tint}`}
              >
                {isEarned && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#A984FF] flex items-center justify-center">
                    <Check size={12} className="text-[#0B0817]" strokeWidth={3} />
                  </span>
                )}

                <span className={`text-3xl leading-none ${!isEarned ? 'grayscale opacity-70' : ''}`}>{b.iconKey}</span>
                <div className={`text-xs font-semibold ${!isEarned ? 'text-[#64748B]' : 'text-white'}`}>
                  {b.displayName}
                </div>
                <div className="text-[10px] text-[#7E8AA5]">{b.targetValue}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badge Popup */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="absolute inset-0 bg-[#0B0817]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#162032] p-6 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute right-4 top-4 text-[#7E8AA5] hover:text-white"
              >
                ✕
              </button>
              <div className="flex flex-col items-center text-center gap-3">
                <span className={`text-6xl ${earnedSet.has(selectedBadge.badgeCode) ? '' : 'grayscale'}`}>{selectedBadge.iconKey}</span>
                <h3 className="text-xl font-bold text-white">{selectedBadge.displayName}</h3>
                <p className="text-sm text-[#9BB0D1] leading-relaxed">
                  {selectedBadge.description}
                </p>
                <div className="mt-4 w-full rounded-2xl bg-[#0B0817]/40 p-4 border border-white/5">
                  <div className="text-xs uppercase tracking-wider text-[#7E8AA5] font-semibold mb-2">Unlock Condition</div>
                  <div className="text-sm text-white font-medium">
                    {selectedBadge.ruleType === 'completed_tests' && `Complete ${selectedBadge.targetValue} vision tests`}
                    {selectedBadge.ruleType === 'clients_helped' && `Help ${selectedBadge.targetValue} distinct clients`}
                    {selectedBadge.ruleType === 'distinct_testing_days' && `Test on ${selectedBadge.targetValue} different days`}
                    {selectedBadge.ruleType === 'carrots_earned' && `Earn ${selectedBadge.targetValue} carrots`}
                    {selectedBadge.ruleType === 'eye_festivals_attended' && `Attend ${selectedBadge.targetValue} Eye Festivals`}
                    {selectedBadge.ruleType === 'custom_counter' && `Reach milestone of ${selectedBadge.targetValue}`}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Popup */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-[#0B0817]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#162032] p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                  <LogOut size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Log out?</h3>
                <p className="text-sm text-[#9BB0D1]">
                  Are you sure you want to log out of your account?
                </p>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="px-5 pb-8 flex justify-center">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium border border-red-500/20"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
      <BottomNavigation current="tester-profile" onNav={onNav} />
    </Shell>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 text-center">
      {icon}
      <div className="text-lg font-bold text-white leading-none mt-0.5">{value}</div>
      <div className="text-[10px] text-[#7E8AA5]">{label}</div>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-10 bg-white/10" />;
}
