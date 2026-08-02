import React, { useState } from 'react';
import { Shell, BottomBar } from '../components/Shell';
import { Field, inputCls } from './SignupEmail';
import { ChevronDown } from 'lucide-react';

export const COUNTRIES: Record<string, Record<string, string[]>> = {
  Australia: {
    'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
    Victoria: ['Melbourne', 'Geelong'],
    Queensland: ['Brisbane', 'Cairns'],
  },
  India: {
    Maharashtra: ['Mumbai', 'Pune'],
    Karnataka: ['Bangalore', 'Mysore'],
  },
  Kenya: {
    Nairobi: ['Nairobi', 'Karen'],
    Mombasa: ['Mombasa'],
  },
  'Papua New Guinea': {
    Morobe: ['Lae', 'Bulolo'],
    'Eastern Highlands': ['Goroka', 'Kainantu'],
    Madang: ['Madang', 'Saidor'],
    'National Capital District': ['Port Moresby', 'Hanuabada'],
    'East Sepik': ['Wewak', 'Maprik'],
  },
};

interface Props {
  onNext: (data: { firstName: string; lastName: string; gender: string; country: string; state: string; city: string }) => void;
  onBack: () => void;
}

export function TesterInfo({ onNext, onBack }: Props) {
  const { t } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!firstName) e.firstName = t('error.required');
    if (!lastName) e.lastName = t('error.required');
    if (!gender) e.gender = t('error.select_option');
    if (!country) e.country = t('error.select_option');
    if (!state) e.state = t('error.select_option');
    if (!city) e.city = t('error.select_option');
    setErrors(e);
    if (Object.keys(e).length === 0) onNext({ firstName, lastName, gender, country, state, city });
  };

  const stateOptions = country ? Object.keys(COUNTRIES[country]) : [];
  const cityOptions = country && state ? COUNTRIES[country][state] || [] : [];

  return (
    <Shell progress={50}>
      <div className="px-6 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">{t('auth.tester_info_title')}</h1>

        <Field label={t('auth.first_name')} error={errors.firstName}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls(!!errors.firstName)} />
        </Field>
        <Field label={t('auth.last_name')} error={errors.lastName}>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls(!!errors.lastName)} />
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

        <h2 className="text-lg font-medium mt-2 text-[#A984FF]">{t('auth.clinic_details')}</h2>

        <Field label={t('auth.country')} error={errors.country}>
          <SelectField
            value={country}
            onChange={(v) => {
              setCountry(v);
              setState('');
              setCity('');
            }}
            placeholder={t('auth.select_country')}
            options={Object.keys(COUNTRIES)}
            err={!!errors.country}
          />
        </Field>
        <Field label={t('auth.state')} error={errors.state}>
          <SelectField
            value={state}
            onChange={(v) => {
              setState(v);
              setCity('');
            }}
            placeholder={t('auth.select_state')}
            options={stateOptions}
            err={!!errors.state}
            disabled={!country}
          />
        </Field>
        <Field label={t('auth.city')} error={errors.city}>
          <SelectField
            value={city}
            onChange={setCity}
            placeholder={t('auth.select_city')}
            options={cityOptions}
            err={!!errors.city}
            disabled={!state}
          />
        </Field>
      </div>
      <BottomBar onNext={submit} onBack={onBack} nextLabel={t('ui.next')} backLabel={t('ui.back')} />
    </Shell>
  );
}

import { useTheme } from '../lib/ThemeContext';

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  err,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  err?: boolean;
  disabled?: boolean;
}) {
  const { language, t } = useTheme();

  const getDisplayLabel = (opt: string) => {
    if (opt === 'Female') return t('ui.female');
    if (opt === 'Male') return t('ui.male');
    if (opt === 'Non-binary') return t('ui.non_binary');
    if (opt === 'Prefer not to say') return t('ui.prefer_not_to_say');
    if (language === 'es') {
      if (opt === 'Community Health Worker') return 'Trabajador de Salud Comunitaria';
      if (opt === 'Eye Nurse') return 'Enfermero(a) Oftalmológico(a)';
      if (opt === 'Refractionist') return 'Refractopeda';
      if (opt === 'Optometrist') return 'Optometrista';
      if (opt === 'Ophthalmologist') return 'Oftalmólogo(a)';
      if (opt === 'Other Doctor') return 'Otro Médico';
      if (opt === 'Other Allied Health Worker') return 'Otro Profesional de Salud';
      if (opt === 'New tester') return 'Nuevo examinador';
      if (opt === 'Some experience') return 'Alguna experiencia';
      if (opt === 'Experienced tester') return 'Examinador experimentado';
      if (opt === 'Trainer / supervisor') return 'Capacitador / Supervisor';
    }
    return opt;
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={
          inputCls(!!err) +
          ' appearance-none pr-12 ' +
          (disabled ? 'opacity-50 cursor-not-allowed' : '')
        }
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {getDisplayLabel(o)}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A608A] pointer-events-none" />
    </div>
  );
}
