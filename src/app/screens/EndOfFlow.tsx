import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Glasses, BookOpen, Sun, AlertCircle, Smile } from 'lucide-react';
import { Shell, BottomBar } from '../components/Shell';
import { RabbitBubble } from '../components/RabbitBubble';
import { RadioGroup, InlineError } from './common';
import { Field, inputCls } from './SignupEmail';

// ============================================================================
// GLASSES DISPENSED REVIEW
// ============================================================================
export function GlassesDispensedReview({
  onBack, onNext, sunglassesDispensed,
}: { onBack: () => void; onNext: (totalPaid: string) => void; sunglassesDispensed: boolean }) {
  const [price, setPrice] = useState('1000');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!price) return setError('Enter the total amount paid, or enter 0 if there was no payment.');
    onNext(price);
  };

  const cards = [
    { title: 'Distance Glasses Dispensed', icon: <Glasses size={20} />, complete: true },
    { title: 'Reading Glasses Dispensed', icon: <BookOpen size={20} />, complete: true },
    { title: 'Sunglasses Dispensed', icon: <Sun size={20} />, complete: sunglassesDispensed },
  ];

  return (
    <Shell progress={94}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Glasses Dispensed Review</h1>
          <p className="text-sm text-[#9B93BA] mt-1">
            Review by dispensed type, then enter the total amount paid.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-[#22193B] border border-white/5 rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`p-2.5 rounded-full ${c.complete ? 'bg-[#A984FF]/15 text-[#A984FF]' : 'bg-white/10 text-[#9B93BA]'}`}>
                {c.icon}
              </div>
              <div className="flex-1 text-sm font-medium">{c.title}</div>
              {c.complete && (
                <div className="w-7 h-7 rounded-full bg-[#A984FF] flex items-center justify-center">
                  <Check size={16} className="text-[#2A0730]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-3">
          <Field label="Total price paid" error={error || undefined}>
            <div className="flex items-stretch gap-2">
              <div className="flex items-center px-4 rounded-xl bg-[#2A0730] border border-white/10 text-[#9B93BA] text-sm font-medium">
                A$
              </div>
              <input
                inputMode="decimal"
                value={price}
                onChange={(e) => { setPrice(e.target.value.replace(/[^\d.]/g, '')); setError(null); }}
                placeholder="e.g. 25.00"
                className={inputCls(!!error) + ' flex-1'}
              />
            </div>
          </Field>
          <p className="text-xs text-[#9B93BA] leading-relaxed">
            Manual record of an amount paid outside the app. This is not an in-app payment system.
          </p>
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}

// ============================================================================
// FINAL CHECKLIST
// ============================================================================
const CHECKLIST = [
  'Results card completed',
  'Glasses care instructions given',
  'Asked to return if any problems with glasses',
  'Advised to have regular eye health checks',
];

export function FinalChecklist({
  onBack, onNext,
}: { onBack: () => void; onNext: (state: Record<string, boolean>) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState(false);

  const allChecked = CHECKLIST.every((c) => checked[c]);
  const firstUnchecked = CHECKLIST.find((c) => !checked[c]);

  const submit = () => {
    if (!allChecked) return setError(true);
    onNext(checked);
  };

  return (
    <Shell progress={96}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-light">Final checklist</h1>
          <p className="text-sm text-[#9B93BA] mt-1">Review your checklist.</p>
        </div>

        <RabbitBubble
          text={error ? `Please check "${firstUnchecked}" first.` : allChecked ? 'Great — all done. Press Next.' : 'Point to the first unchecked item.'}
          type={error ? 'error' : allChecked ? 'success' : 'default'}
        />

        <div className="flex flex-col gap-3">
          {CHECKLIST.map((c) => {
            const on = !!checked[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => { setChecked((s) => ({ ...s, [c]: !s[c] })); setError(false); }}
                className={`text-left rounded-2xl border p-4 flex items-center gap-4 transition-all ${
                  on
                    ? 'bg-[#A984FF]/10 border-[#A984FF]'
                    : `bg-[#22193B] ${error ? 'border-[#FF5C5C]/40' : 'border-white/10 hover:border-white/20'}`
                }`}
              >
                <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  on ? 'bg-[#A984FF] border-[#A984FF] text-[#2A0730]' : 'border-white/40'
                }`}>
                  {on && <Check size={16} />}
                </span>
                <span className="text-sm font-medium">{c}</span>
              </button>
            );
          })}
        </div>

        {error && <InlineError text="Complete each checklist item before continuing." />}
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}

// ============================================================================
// ADDITIONAL DETAILS
// ============================================================================
export function AdditionalDetails({
  onBack, onSubmit,
}: { onBack: () => void; onSubmit: (data: any) => void }) {
  const [comments, setComments] = useState('');
  const [includeClinical, setIncludeClinical] = useState(false);
  const [referralNeeded, setReferralNeeded] = useState('');
  const [referralReason, setReferralReason] = useState('');
  const [urgency, setUrgency] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (includeClinical && referralNeeded === 'Yes' && !referralReason) {
      return setError('Enter a reason for the referral.');
    }
    onSubmit({ comments, includeClinical, referralNeeded, referralReason, urgency });
  };

  return (
    <Shell progress={98}>
      <div className="px-5 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light">Additional details</h1>

        <Field label="Comments">
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter additional comments"
            rows={4}
            className={inputCls(false) + ' resize-none'}
          />
        </Field>

        <label className="flex items-start gap-3 bg-[#22193B] border border-white/10 rounded-2xl p-4 cursor-pointer">
          <input
            type="checkbox"
            checked={includeClinical}
            onChange={(e) => setIncludeClinical(e.target.checked)}
            className="accent-[#A984FF] mt-1"
          />
          <div>
            <div className="text-sm font-medium">Add clinical and/or referral information</div>
            <div className="text-xs text-[#9B93BA] mt-1">Optional — for onward care records.</div>
          </div>
        </label>

        <AnimatePresence>
          {includeClinical && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#2A2049] border border-[#A984FF]/30 rounded-3xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-medium text-[#A984FF] uppercase tracking-wider">
                  Clinical and/or referral information
                </h3>
                <Field label="Referral needed?">
                  <RadioGroup value={referralNeeded} onChange={setReferralNeeded} options={['Yes', 'No']} />
                </Field>
                {referralNeeded === 'Yes' && (
                  <>
                    <Field label="Reason for referral" error={error || undefined}>
                      <textarea
                        value={referralReason}
                        onChange={(e) => { setReferralReason(e.target.value); setError(null); }}
                        rows={3}
                        className={inputCls(!!error) + ' resize-none'}
                      />
                    </Field>
                    <Field label="Urgency">
                      <RadioGroup value={urgency} onChange={setUrgency} options={['Routine', 'Soon', 'Urgent']} />
                    </Field>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomBar onNext={submit} onBack={onBack} nextLabel="Submit" />
    </Shell>
  );
}

// ============================================================================
// TEST RESULTS SAVED
// ============================================================================
export function TestResultsSaved({ onHome }: { onHome: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onHome, 6000);
    return () => clearTimeout(t);
  }, [onHome]);

  return (
    <Shell progress={100} showProgress={false}>
      <div className="flex-1 px-6 pt-4 pb-32 flex flex-col items-center justify-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-32 h-32 rounded-full bg-[#A984FF]/15 border-2 border-[#A984FF] flex items-center justify-center text-[#A984FF]"
        >
          <Smile size={64} strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-3xl font-light">Test results saved</h1>
        <p className="text-sm text-[#9B93BA] leading-relaxed max-w-[300px]">
          You are the key to improving vision and improving lives! You are being returned to the dashboard.
        </p>
        <RabbitBubble text="Great work. This test has been saved on this device." type="success" />
        <button
          onClick={onHome}
          className="h-12 px-6 rounded-2xl bg-[#A984FF] text-[#2A0730] font-bold"
        >
          Return to dashboard
        </button>
      </div>
    </Shell>
  );
}
