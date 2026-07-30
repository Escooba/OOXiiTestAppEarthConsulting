import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell, BottomNavigation } from '../components/Shell';
import { ScreenId } from '../lib/theme';
import { Users, Star, LogOut, X, Check } from 'lucide-react';
import { RabbitMascot } from '../components/RabbitMascot';
import { useProgress, useBadges } from '../../data/hooks';
import { useAuthContext } from '../lib/AuthProvider';
import { useTheme } from '../lib/ThemeContext';
import type { TranslationKey } from '../lib/i18n';

export function getBadgeMetricValue(ruleType: string, progress: any): number {
  if (!progress) return 0;
  switch (ruleType) {
    case 'completed_tests':
      return progress.completedTests ?? 0;
    case 'clients_helped':
      return progress.clientsHelped ?? 0;
    case 'distinct_testing_days':
      return progress.distinctTestingDays ?? 0;
    case 'carrots_earned':
      return progress.totalCarrots ?? 0;
    case 'eye_festivals_attended':
      return 0;
    default:
      return progress.completedTests ?? 0;
  }
}

export function Profile({ onNav }: { onNav: (s: ScreenId) => void }) {
  const { progress } = useProgress();
  const { definitions, earned } = useBadges();
  const { tester, logout } = useAuthContext();
  const { tokens, t } = useTheme();

  const getBadgeName = (badgeCode: string, fallback: string) => {
    const code = badgeCode.toLowerCase();
    const key = `badge.${code}.name` as TranslationKey;
    const val = t(key);
    return val !== key ? val : fallback;
  };

  const getBadgeDesc = (badgeCode: string, fallback: string) => {
    const code = badgeCode.toLowerCase();
    const key = `badge.${code}.desc` as TranslationKey;
    const val = t(key);
    return val !== key ? val : fallback;
  };

  const getUnlockRuleText = (ruleType: string, targetValue: number) => {
    if (ruleType === 'completed_tests') return t('badge.rule.completed_tests', { target: targetValue });
    if (ruleType === 'clients_helped') return t('badge.rule.clients_helped', { target: targetValue });
    if (ruleType === 'distinct_testing_days') return t('badge.rule.distinct_testing_days', { target: targetValue });
    if (ruleType === 'carrots_earned') return t('badge.rule.carrots_earned', { target: targetValue });
    return `Complete ${targetValue} steps`;
  };

  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const name = `${tester?.firstName ?? 'Tester'} ${tester?.lastName ?? ''}`.trim();
  
  const CARROTS = progress?.totalCarrots ?? 0;
  const CLIENTS = progress?.clientsHelped ?? 0;
  const BADGES_EARNED = progress?.badgesEarned ?? 0;
  
  const nextBadge = progress?.nextBadge;
  const NEXT_BADGE_TARGET = nextBadge?.targetValue ?? 50;
  const REMAINING = Math.max(0, NEXT_BADGE_TARGET - CLIENTS);
  const pct = nextBadge ? Math.min(100, (CLIENTS / NEXT_BADGE_TARGET) * 100) : 100;

  const earnedMap = new Map(earned.map(b => [b.badgeCode, b]));
  const enabledBadges = definitions.filter(d => d.enabled).sort((a, b) => a.displayOrder - b.displayOrder);
  const previewBadges = enabledBadges.slice(0, 3);

  return (
    <Shell showProgress={false}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.15em] text-[var(--text-muted)]">{t('profile.tester_profile_subtitle')}</div>
            <h1 className="text-3xl font-bold text-[var(--text)] leading-tight">{name}</h1>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">{tester?.role || 'Community Health Tester'}</div>
          </div>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-12 h-12 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] flex items-center justify-center shrink-0 mt-1"
          >
            <RabbitMascot size={26} />
          </motion.div>
        </div>

        {/* Carrot card */}
        <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FF9F45]/10 flex items-center justify-center text-3xl">🥕</div>
          <div>
            <div className="text-3xl font-bold text-[#FF9F45] leading-none">{CARROTS}</div>
            <div className="text-sm text-[var(--text-muted)] mt-1">{t('profile.total_carrots')}</div>
          </div>
        </div>

        {/* Balanced two-column statistics section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-4 flex flex-col items-center gap-1 text-center">
            <Users size={20} className="text-[var(--primary)]" />
            <div className="text-2xl font-bold text-[var(--text)] leading-none mt-1">{CLIENTS}</div>
            <div className="text-xs text-[var(--text-muted)]">{t('profile.clients_tested')}</div>
          </div>
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-4 flex flex-col items-center gap-1 text-center">
            <Star size={20} className="text-[#EAB308]" />
            <div className="text-2xl font-bold text-[var(--text)] leading-none mt-1">{BADGES_EARNED}</div>
            <div className="text-xs text-[var(--text-muted)]">{t('profile.badges_earned')}</div>
          </div>
        </div>

        {/* Next Badge */}
        {nextBadge && (
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--text)] text-sm">{t('profile.next_badge')}</span>
              <span className="text-xs text-[var(--text-muted)]">{CLIENTS} / {NEXT_BADGE_TARGET}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg)] border border-[var(--primary)]/40 flex items-center justify-center text-2xl">
                {nextBadge.iconKey}
              </div>
              <div>
                <div className="font-medium text-[var(--text)] text-sm">{getBadgeName(nextBadge.badgeCode, nextBadge.displayName)}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{t('profile.more_to_unlock', { count: REMAINING })}</div>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--bg)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full bg-[var(--primary)]"
              />
            </div>
          </div>
        )}

        {/* Badge Collection Section Header */}
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-lg font-semibold text-[var(--text)]">{t('profile.badge_collection')}</h2>
          <button
            onClick={() => setShowAllBadges(true)}
            className="text-xs font-semibold text-[var(--primary)] hover:underline min-h-[44px] px-2 flex items-center"
          >
            {t('profile.view_all', { count: enabledBadges.length })}
          </button>
        </div>

        {/* Exactly 3 Badge Previews */}
        <div className="grid grid-cols-3 gap-3">
          {previewBadges.map((b) => {
            const earnedItem = earnedMap.get(b.badgeCode);
            const isEarned = !!earnedItem;
            const currentMetric = getBadgeMetricValue(b.ruleType, progress);

            return (
              <button
                key={b.badgeCode}
                type="button"
                onClick={() => setSelectedBadge(b)}
                className={`relative rounded-2xl border p-3 flex flex-col items-center text-center gap-1.5 aspect-[3/3.4] justify-center cursor-pointer transition-all ${
                  isEarned
                    ? 'bg-[var(--card-active)] border-[var(--primary)]/50'
                    : 'bg-[var(--card)] border-[var(--card-border)] opacity-70'
                }`}
              >
                {isEarned && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <Check size={10} className="text-[var(--bg)]" strokeWidth={3} />
                  </span>
                )}
                <span className={`text-3xl leading-none ${!isEarned ? 'grayscale' : ''}`}>{b.iconKey}</span>
                <div className="text-xs font-semibold text-[var(--text)] line-clamp-1">{getBadgeName(b.badgeCode, b.displayName)}</div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  {isEarned ? t('profile.earned') : `${currentMetric}/${b.targetValue}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium border border-red-500/20"
          >
            <LogOut size={18} />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      </div>

      {/* View All Badges Modal */}
      <AnimatePresence>
        {showAllBadges && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllBadges(false)}
              className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[80vh] rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center pb-3 border-b border-[var(--card-border)]">
                <h3 className="text-lg font-bold text-[var(--text)]">{t('profile.all_badges', { count: enabledBadges.length })}</h3>
                <button
                  aria-label="Close badges"
                  onClick={() => setShowAllBadges(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 pr-1">
                {enabledBadges.map((b) => {
                  const earnedItem = earnedMap.get(b.badgeCode);
                  const isEarned = !!earnedItem;
                  const currentVal = getBadgeMetricValue(b.ruleType, progress);
                  const badgePct = Math.min(100, Math.round((currentVal / b.targetValue) * 100));

                  return (
                    <div
                      key={b.badgeCode}
                      onClick={() => {
                        setShowAllBadges(false);
                        setSelectedBadge(b);
                      }}
                      className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors ${
                        isEarned
                          ? 'bg-[var(--card-active)] border-[var(--primary)]/40'
                          : 'bg-[var(--bg)] border-[var(--card-border)]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${!isEarned ? 'grayscale opacity-60' : ''}`}>
                        {b.iconKey}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-[var(--text)] truncate">{getBadgeName(b.badgeCode, b.displayName)}</span>
                          <span className={`text-xs font-semibold ${isEarned ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                            {isEarned ? t('profile.earned') : `${currentVal} / ${b.targetValue}`}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{getBadgeDesc(b.badgeCode, b.description)}</p>
                        {!isEarned && (
                          <div className="w-full h-1.5 rounded-full bg-[var(--card)] mt-2 overflow-hidden">
                            <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${badgePct}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Single Badge Detail Dialog */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl"
            >
              <button
                aria-label="Close"
                onClick={() => setSelectedBadge(null)}
                className="absolute right-4 top-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center gap-3">
                <span className={`text-6xl ${earnedMap.has(selectedBadge.badgeCode) ? '' : 'grayscale'}`}>
                  {selectedBadge.iconKey}
                </span>
                <h3 className="text-xl font-bold text-[var(--text)]">{getBadgeName(selectedBadge.badgeCode, selectedBadge.displayName)}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{getBadgeDesc(selectedBadge.badgeCode, selectedBadge.description)}</p>

                <div className="mt-4 w-full rounded-2xl bg-[var(--bg)] p-4 border border-[var(--card-border)]">
                  <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-2">
                    {t('profile.unlock_condition')}
                  </div>
                  <div className="text-sm text-[var(--text)] font-medium">
                    {getUnlockRuleText(selectedBadge.ruleType, selectedBadge.targetValue)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                  <LogOut size={32} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text)]">{t('profile.logout')}?</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {t('profile.logout_confirm_body')}
                </p>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 min-h-[44px] rounded-xl bg-[var(--bg)] text-[var(--text)] font-medium border border-[var(--card-border)]"
                  >
                    {t('ui.cancel')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 min-h-[44px] rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                  >
                    {t('profile.logout')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNavigation current="tester-profile" onNav={onNav} />
    </Shell>
  );
}
