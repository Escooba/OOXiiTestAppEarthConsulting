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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const e: Record<string, string> = {};
    if (!firstName) e.firstName = 'Enter your first name.';
    if (!lastName) e.lastName = 'Enter your last name.';
    if (!gender) e.gender = 'Select a gender.';
    if (!country) e.country = 'Select a country.';
    if (!state) e.state = 'Select a state or province.';
    if (!city) e.city = 'Select a city.';
    setErrors(e);
    if (Object.keys(e).length === 0) onNext({ firstName, lastName, gender, country, state, city });
  };

  const stateOptions = country ? Object.keys(COUNTRIES[country]) : [];
  const cityOptions = country && state ? COUNTRIES[country][state] || [] : [];

  return (
    <Shell progress={50}>
      <div className="px-6 pt-2 pb-32 flex flex-col gap-5">
        <h1 className="text-2xl font-light mt-4">Tester information</h1>

        <Field label="First name" error={errors.firstName}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputCls(!!errors.firstName)} />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputCls(!!errors.lastName)} />
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

        <h2 className="text-lg font-medium mt-2 text-[#00D1C1]">Clinic details</h2>

        <Field label="Country" error={errors.country}>
          <SelectField
            value={country}
            onChange={(v) => {
              setCountry(v);
              setState('');
              setCity('');
            }}
            placeholder="Select country"
            options={Object.keys(COUNTRIES)}
            err={!!errors.country}
          />
        </Field>
        <Field label="State / Province" error={errors.state}>
          <SelectField
            value={state}
            onChange={(v) => {
              setState(v);
              setCity('');
            }}
            placeholder="Select state / province"
            options={stateOptions}
            err={!!errors.state}
            disabled={!country}
          />
        </Field>
        <Field label="City" error={errors.city}>
          <SelectField
            value={city}
            onChange={setCity}
            placeholder="Select city"
            options={cityOptions}
            err={!!errors.city}
            disabled={!state}
          />
        </Field>
      </div>
      <BottomBar onNext={submit} onBack={onBack} />
    </Shell>
  );
}

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
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A608A] pointer-events-none" />
    </div>
  );
}
