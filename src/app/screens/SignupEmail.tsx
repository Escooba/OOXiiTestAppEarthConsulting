import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

interface Props {
  onNext: (email: string, pw: string) => void;
  onLogin?: () => void;
}

export function SignupEmail({ onNext, onLogin }: Props) {
  const { t } = useTheme();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rules = [
    { label: t('auth.rule_min_8'), ok: pw.length >= 8 },
    { label: t('auth.rule_uppercase'), ok: /[A-Z]/.test(pw) },
    { label: t('auth.rule_special'), ok: /[^\w\s]/.test(pw) },
  ];

  const submit = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t('auth.err_email_invalid');
    if (!rules.every((r) => r.ok)) e.pw = t('error.required');
    if (pw !== pw2) e.pw2 = t('error.required');
    setErrors(e);
    if (Object.keys(e).length === 0) onNext(email, pw);
  };

  return (
    <Shell progress={20}>
      <div className="px-6 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">{t('auth.sign_up_title')}</h1>

        <Field label={t('auth.email')} error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email_placeholder')}
            className={inputCls(!!errors.email)}
          />
        </Field>

        <Field label={t('auth.password')} error={errors.pw}>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className={inputCls(!!errors.pw) + ' pr-12'}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B93BA] p-2"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="mt-2 text-xs text-[#9B93BA]">{t('auth.should_include')}</div>
          <ul className="mt-1 space-y-1">
            {rules.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-xs">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    r.ok ? 'bg-[#A984FF] text-[#2A0730]' : 'bg-[#3A3059] text-[#9B93BA]'
                  }`}
                >
                  {r.ok ? <Check size={10} /> : null}
                </span>
                <span className={r.ok ? 'text-white' : 'text-[#9B93BA]'}>{r.label}</span>
              </li>
            ))}
          </ul>
        </Field>

        <Field label={t('auth.confirm_password')} error={errors.pw2}>
          <input
            type={showPw ? 'text' : 'password'}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className={inputCls(!!errors.pw2)}
          />
        </Field>

        <div className="text-center text-xs text-[#9B93BA] mt-4">
          {t('auth.already_registered')}{' '}
          <button type="button" onClick={onLogin} className="text-[#A984FF] font-medium">{t('auth.login_to_account')}</button>
        </div>
      </div>
      <BottomBar onNext={submit} hideBack nextLabel={t('ui.next')} />
    </Shell>
  );
}

export function inputCls(err: boolean) {
  return `w-full bg-[#2A0730] border rounded-xl py-3.5 px-4 text-base outline-none transition-colors ${
    err ? 'border-[#FF5C5C] text-white focus:ring-1 focus:ring-[#FF5C5C]' : 'border-white/10 text-white focus:border-[#A984FF]'
  }`;
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#9B93BA] font-medium">{label}</label>
      {children}
      {error && (
        <div className="text-[#FF5C5C] text-xs flex items-start gap-1.5 mt-1">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
