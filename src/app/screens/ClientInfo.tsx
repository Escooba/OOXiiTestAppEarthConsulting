import React, { useMemo, useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { SelectField } from './TesterInfo';
import { RadioGroup } from './common';
import { useTheme } from '../lib/ThemeContext';

interface Props {
  onStart: (data: { ooxiiId: string; yearOfBirth: string; gender: string; cataract: string }) => void;
  onCancel: () => void;
}

export function ClientInfo({ onStart, onCancel }: Props) {
  const { t } = useTheme();
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [cataract, setCataract] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const ooxiiId = useMemo(() => String(10000 + Math.floor(Math.random() * 89999)), []);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!year || !/^\d{4}$/.test(year)) e.year = t('error.required');
    if (!gender) e.gender = t('error.select_option');
    if (!cataract) e.cataract = t('error.select_option');
    setErrors(e);
    if (Object.keys(e).length === 0) onStart({ ooxiiId, yearOfBirth: year, gender, cataract });
  };

  return (
    <Shell progress={50}>
      <div className="px-6 pt-2 pb-48 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">{t('clients.client_info_title')}</h1>

        <div className="rounded-2xl bg-[#A984FF]/10 border border-[#A984FF]/30 p-4 flex justify-between items-center">
          <div>
            <div className="text-xs uppercase text-[#A984FF] font-semibold tracking-wider">OOXii ID</div>
            <div className="text-xs text-[#9B93BA] mt-1">{t('clients.anonymous_notice')}</div>
          </div>
          <div className="text-2xl font-bold text-[#A984FF]">{ooxiiId}</div>
        </div>

        <Field label={t('clients.year_of_birth')} error={errors.year}>
          <input
            inputMode="numeric"
            maxLength={4}
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
            className={inputCls(!!errors.year)}
            placeholder={t('clients.year_placeholder')}
          />
        </Field>
        <Field label={t('clients.gender')} error={errors.gender}>
          <SelectField
            value={gender}
            onChange={setGender}
            placeholder={t('clients.select_gender')}
            options={['Female', 'Male', 'Non-binary', 'Prefer not to say']}
            err={!!errors.gender}
          />
        </Field>

        <Field label={t('clients.cataract_surgery_question')} error={errors.cataract}>
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
        nextLabel={t('clients.start_test')} 
        backLabel={t('ui.cancel')}
        nextDisabled={!year || year.length < 4 || !gender || !cataract}
      />
    </Shell>
  );
}
