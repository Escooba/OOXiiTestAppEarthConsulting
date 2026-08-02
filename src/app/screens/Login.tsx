import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shell } from '../components/Shell';
import { Eye, EyeOff, UserCheck } from 'lucide-react';
import { RabbitMascot } from '../components/RabbitMascot';
import { inputCls, Field } from './SignupEmail';
import { useAuthContext } from '../lib/AuthProvider';

import { useTheme } from '../lib/ThemeContext';

interface Props {
  onLoginSuccess: () => void;
  onCreateAccount: () => void;
}

export function Login({ onLoginSuccess, onCreateAccount }: Props) {
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Legacy linking state
  const [linkingTesterId, setLinkingTesterId] = useState<string | null>(null);

  const { login, linkAccount, legacyTesters } = useAuthContext();

  const submit = async () => {
    if (isSubmitting) return;
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t('auth.err_email_invalid');
    if (!pw) e.pw = t('auth.err_pw_required');
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (linkingTesterId) {
        await linkAccount(linkingTesterId, email, pw);
      } else {
        await login(email, pw);
      }
      onLoginSuccess();
    } catch (err: any) {
      setErrors({ pw: err.message || t('auth.err_auth_failed') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell showProgress={false}>
      <div className="px-6 pt-6 pb-32 flex flex-col gap-6">
        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-4 pt-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="relative w-20 h-20 rounded-3xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 flex items-center justify-center"
          >
            <Eye size={36} className="relative text-[var(--primary)]" strokeWidth={1.8} />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] leading-tight">
              {linkingTesterId ? t('auth.link_profile') : t('auth.welcome_back')}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2 max-w-[280px]">
              {linkingTesterId
                ? t('auth.link_subtitle')
                : t('auth.login_subtitle')}
            </p>
          </div>
        </div>

        {/* Legacy Tester Migration Banner */}
        {legacyTesters.length > 0 && !linkingTesterId && (
          <div className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--card)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[var(--primary)] font-semibold text-xs uppercase tracking-wider">
              <UserCheck size={16} />
              <span>{t('auth.legacy_found_title')}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {t('auth.legacy_found_body')}
            </p>
            <div className="flex flex-col gap-2 mt-1">
              {legacyTesters.map((tItem) => (
                <button
                  key={tItem.localId}
                  type="button"
                  onClick={() => setLinkingTesterId(tItem.localId)}
                  className="w-full text-left p-2.5 rounded-xl bg-[var(--bg)] border border-[var(--card-border)] hover:border-[var(--primary)] text-xs text-[var(--text)] font-semibold flex justify-between items-center"
                >
                  <span>{tItem.firstName} {tItem.lastName} ({tItem.role || 'Tester'})</span>
                  <span className="text-[var(--primary)]">{t('auth.link_account_arrow')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-5">
          <Field label={t('auth.email')} error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: '' })); }}
              placeholder={t('auth.email_placeholder')}
              className={inputCls(!!errors.email)}
            />
          </Field>

          <Field label={t('auth.password')} error={errors.pw}>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErrors((x) => ({ ...x, pw: '' })); }}
                placeholder={t('auth.password_placeholder')}
                className={inputCls(!!errors.pw) + ' pr-12'}
              />
              <button
                type="button"
                aria-label={showPw ? 'Hide password' : 'Show password'}
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          onClick={submit}
          className="min-h-[52px] rounded-3xl bg-[var(--primary)] text-[var(--bg)] font-bold text-base disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? t('auth.authenticating') : (linkingTesterId ? t('auth.create_login_link') : t('auth.log_in'))}
        </motion.button>

        {/* Create an account */}
        <div className="text-center text-sm text-[var(--text-muted)]">
          {t('auth.dont_have_account')}{' '}
          <button onClick={onCreateAccount} className="text-[var(--primary)] font-semibold min-h-[44px] px-1">
            {t('auth.create_account')}
          </button>
        </div>
      </div>
    </Shell>
  );
}
