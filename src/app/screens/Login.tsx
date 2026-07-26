import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shell } from '../components/Shell';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { RabbitMascot } from '../components/RabbitMascot';
import { inputCls, Field } from './SignupEmail';

interface Props {
  onLogin: () => void;
  onCreateAccount: () => void;
}

export function Login({ onLogin, onCreateAccount }: Props) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!pw) e.pw = 'Enter your password.';
    setErrors(e);
    if (Object.keys(e).length === 0) onLogin();
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
            <h1 className="text-3xl font-bold text-white leading-tight">Welcome back</h1>
            <p className="text-sm text-[#9B93BA] mt-2 max-w-[280px]">
              Log in to continue helping clients see better.
            </p>
          </div>
        </div>

        {/* Bun greeting */}
        <div className="rounded-3xl border border-white/8 bg-[#1C1633]/80 p-4 flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="bg-[#2A0730] p-2 rounded-full border-2 border-[#A984FF] shrink-0 flex items-center justify-center"
          >
            <RabbitMascot size={22} />
          </motion.div>
          <div className="text-sm text-[#C7BFE4]">Hi, it's Bun! Ready when you are.</div>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          <Field label="Your email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: '' })); }}
              placeholder="you@example.com"
              className={inputCls(!!errors.email)}
            />
          </Field>

          <Field label="Password" error={errors.pw}>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={pw}
                onChange={(e) => { setPw(e.target.value); setErrors((x) => ({ ...x, pw: '' })); }}
                placeholder="Enter your password"
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
            <div className="text-right mt-2">
              <span className="text-xs text-[#A984FF] font-medium cursor-pointer">Forgot password?</span>
            </div>
          </Field>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={submit}
          className="h-14 rounded-3xl bg-[#3BE0D4] text-[#0B1B2A] font-bold text-base shadow-[0_0_30px_rgba(59,224,212,0.3)]"
        >
          Log in
        </motion.button>

        {/* Create an account */}
        <div className="text-center text-sm text-[#9B93BA]">
          Don't have an account?{' '}
          <button onClick={onCreateAccount} className="text-[#A984FF] font-semibold">
            Create an account
          </button>
        </div>
      </div>
    </Shell>
  );
}
