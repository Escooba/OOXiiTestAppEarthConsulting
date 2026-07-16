import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { SelectField } from './TesterInfo';

const ROLES = [
  'Community Health Worker',
  'Eye Nurse',
  'Refractionist',
  'Optometrist',
  'Ophthalmologist',
  'Other Doctor',
  'Other Allied Health Worker',
];

const EXPERIENCE = ['New tester', 'Some experience', 'Experienced tester', 'Trainer / supervisor'];

interface Props {
  onCreate: (data: { role: string; experience: string; organisation: string }) => void;
  onBack: () => void;
}

export function AdditionalInfo({ onCreate, onBack }: Props) {
  const [role, setRole] = useState('');
  const [exp, setExp] = useState('');
  const [org, setOrg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!role) e.role = 'Select a health care role.';
    if (!exp) e.exp = 'Select an experience level.';
    if (!org) e.org = 'Enter your organisation.';
    setErrors(e);
    if (Object.keys(e).length === 0) onCreate({ role, experience: exp, organisation: org });
  };

  return (
    <Shell progress={75}>
      <div className="px-6 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">Additional information</h1>

        <Field label="Health care role" error={errors.role}>
          <SelectField value={role} onChange={setRole} placeholder="Select role" options={ROLES} err={!!errors.role} />
        </Field>
        <Field label="Level of experience" error={errors.exp}>
          <SelectField value={exp} onChange={setExp} placeholder="Select experience" options={EXPERIENCE} err={!!errors.exp} />
        </Field>
        <Field label="Organisation" error={errors.org}>
          <input value={org} onChange={(e) => setOrg(e.target.value)} className={inputCls(!!errors.org)} />
        </Field>

        <div className="text-center text-xs text-[#9B93BA] mt-4">
          Already registered?{' '}
          <span className="text-[#00D1C1] font-medium">Login to your account</span>
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} nextLabel="Create account" />
    </Shell>
  );
}
