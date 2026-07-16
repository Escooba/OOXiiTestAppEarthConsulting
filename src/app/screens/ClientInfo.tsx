import React, { useMemo, useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { SelectField } from './TesterInfo';
import { RadioGroup } from './common';

interface Props {
  onStart: (data: { ooxiiId: string; yearOfBirth: string; gender: string; cataract: string }) => void;
  onCancel: () => void;
}

export function ClientInfo({ onStart, onCancel }: Props) {
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [cataract, setCataract] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ooxiiId = useMemo(() => String(10000 + Math.floor(Math.random() * 89999)), []);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!year || !/^\d{4}$/.test(year)) e.year = 'Enter a 4-digit year of birth.';
    if (!gender) e.gender = 'Select a gender.';
    if (!cataract) e.cataract = 'Select an answer.';
    setErrors(e);
    if (Object.keys(e).length === 0) onStart({ ooxiiId, yearOfBirth: year, gender, cataract });
  };

  return (
    <Shell progress={50}>
      <div className="px-6 pt-2 pb-48 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">Client information</h1>

        <div className="rounded-2xl bg-[#00D1C1]/10 border border-[#00D1C1]/30 p-4 flex justify-between items-center">
          <div>
            <div className="text-xs uppercase text-[#00D1C1] font-semibold tracking-wider">OOXii ID</div>
            <div className="text-xs text-[#9B93BA] mt-1">Anonymous — no personal data stored</div>
          </div>
          <div className="text-2xl font-bold text-[#00D1C1]">{ooxiiId}</div>
        </div>

        <Field label="Year of birth" error={errors.year}>
          <input
            inputMode="numeric"
            maxLength={4}
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
            className={inputCls(!!errors.year)}
            placeholder="e.g. 1978"
          />
        </Field>
        <Field label="Gender" error={errors.gender}>
          <SelectField
            value={gender}
            onChange={setGender}
            placeholder="Select gender"
            options={['Female', 'Male', 'Non-binary', 'Prefer not to say']}
            err={!!errors.gender}
          />
        </Field>

        <Field label="Have you had cataract surgery before?" error={errors.cataract}>
          <RadioGroup
            value={cataract}
            onChange={setCataract}
            options={['No', 'Yes, right eye', 'Yes, left eye', 'Yes, both eyes']}
            err={!!errors.cataract}
          />
        </Field>
      </div>
      <BottomBar 
        onNext={submit} 
        onBack={onCancel} 
        nextLabel="Start test" 
        backLabel="Cancel"
        nextDisabled={!year || year.length < 4 || !gender || !cataract}
      />
    </Shell>
  );
}
