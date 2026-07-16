import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface Props {
  onNext: () => void;
  onLogin?: () => void;
}

export function SignupEmail({ onNext, onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rules = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'At least 1 uppercase letter (A–Z)', ok: /[A-Z]/.test(pw) },
    { label: 'At least 1 special character (e.g. !@#$)', ok: /[^\w\s]/.test(pw) },
  ];

  const submit = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!rules.every((r) => r.ok)) e.pw = 'Password does not meet the rules below.';
    if (pw !== pw2) e.pw2 = 'Passwords do not match.';
    setErrors(e);
    if (Object.keys(e).length === 0) onNext();
  };

  return (
    <Shell progress={20}>
      <div className="px-6 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">Create an account</h1>

        <Field label="Your email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls(!!errors.email)}
          />
        </Field>

        <Field label="Password" error={errors.pw}>
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
          <div className="mt-2 text-xs text-[#9B93BA]">It should include:</div>
          <ul className="mt-1 space-y-1">
            {rules.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-xs">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    r.ok ? 'bg-[#00D1C1] text-[#150F26]' : 'bg-[#3A3059] text-[#9B93BA]'
                  }`}
                >
                  {r.ok ? <Check size={10} /> : null}
                </span>
                <span className={r.ok ? 'text-white' : 'text-[#9B93BA]'}>{r.label}</span>
              </li>
            ))}
          </ul>
        </Field>

        <Field label="Confirm password" error={errors.pw2}>
          <input
            type={showPw ? 'text' : 'password'}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className={inputCls(!!errors.pw2)}
          />
        </Field>

        <div className="text-center text-xs text-[#9B93BA] mt-4">
          Already registered?{' '}
          <button type="button" onClick={onLogin} className="text-[#00D1C1] font-medium">Login to your account</button>
        </div>
      </div>
      <BottomBar onNext={submit} hideBack nextLabel="Next" />
    </Shell>
  );
}

export function inputCls(err: boolean) {
  return `w-full bg-[#150F26] border rounded-xl py-3.5 px-4 text-base outline-none transition-colors ${
    err ? 'border-[#FF5C5C] text-white focus:ring-1 focus:ring-[#FF5C5C]' : 'border-white/10 text-white focus:border-[#00D1C1]'
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
