import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { SelectField } from './TesterInfo';
import { useTheme } from '../lib/ThemeContext';

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
  const { t } = useTheme();
  const [role, setRole] = useState('');
  const [exp, setExp] = useState('');
  const [org, setOrg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!role) e.role = t('error.select_option');
    if (!exp) e.exp = t('error.select_option');
    if (!org) e.org = t('error.required');
    setErrors(e);
    if (Object.keys(e).length === 0) onCreate({ role, experience: exp, organisation: org });
  };

  return (
    <Shell progress={75}>
      <div className="px-6 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">{t('auth.additional_info_title')}</h1>

        <Field label={t('auth.health_role')} error={errors.role}>
          <SelectField value={role} onChange={setRole} placeholder={t('auth.select_role')} options={ROLES} err={!!errors.role} />
        </Field>
        <Field label={t('auth.experience_level')} error={errors.exp}>
          <SelectField value={exp} onChange={setExp} placeholder={t('auth.select_experience')} options={EXPERIENCE} err={!!errors.exp} />
        </Field>
        <Field label={t('auth.organization')} error={errors.org}>
          <input value={org} onChange={(e) => setOrg(e.target.value)} className={inputCls(!!errors.org)} />
        </Field>

        <div className="text-center text-xs text-[#9B93BA] mt-4">
          {t('auth.already_registered')}{' '}
          <span className="text-[#A984FF] font-medium">{t('auth.login_to_account')}</span>
        </div>
      </div>
      <BottomBar onNext={submit} onBack={onBack} nextLabel={t('auth.create_account')} backLabel={t('ui.back')} />
    </Shell>
  );
}
