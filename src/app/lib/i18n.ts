export type LanguageCode = 'en' | 'tpi' | 'bi' | 'fr' | 'es' | 'pt' | 'id' | 'mn';

export const LANGUAGES: Record<LanguageCode, string> = {
  en: 'English',
  tpi: 'Tok Pisin',
  bi: 'Bislama',
  fr: 'French',
  es: 'Spanish',
  pt: 'Portuguese',
  id: 'Bahasa Indonesia',
  mn: 'Mongolian',
};

// Stable clinical codes
export type TranslationKey =
  | 'ui.next'
  | 'ui.back'
  | 'ui.save'
  | 'ui.cancel'
  | 'ui.home'
  | 'ui.garden'
  | 'ui.profile'
  | 'ui.settings'
  | 'clinical.eye.right'
  | 'clinical.eye.left'
  | 'clinical.phase.pretest'
  | 'clinical.phase.main'
  | 'clinical.phase.posttest'
  | 'clinical.phase.dispensing'
  | 'error.required'
  | 'error.invalid_pd'
  | 'garden.title'
  | 'garden.my_plot'
  | 'garden.community_plot';

type Dictionary = Record<TranslationKey, string>;

const en: Dictionary = {
  'ui.next': 'Next',
  'ui.back': 'Back',
  'ui.save': 'Save',
  'ui.cancel': 'Cancel',
  'ui.home': 'Home',
  'ui.garden': 'Garden',
  'ui.profile': 'Profile',
  'ui.settings': 'Settings',
  'clinical.eye.right': 'Right eye',
  'clinical.eye.left': 'Left eye',
  'clinical.phase.pretest': 'Pre-test',
  'clinical.phase.main': 'Main test',
  'clinical.phase.posttest': 'Post-test',
  'clinical.phase.dispensing': 'Dispensing',
  'error.required': 'This field is required',
  'error.invalid_pd': 'Enter a PD between 52 and 78',
  'garden.title': 'Garden',
  'garden.my_plot': 'My Plot',
  'garden.community_plot': 'Community Plot',
};

// Stub for other languages, defaulting to English
const stub = (dict: Partial<Dictionary>): Dictionary => ({ ...en, ...dict });

const tpi: Dictionary = stub({
  'ui.next': 'Neks',
  'ui.back': 'Bik',
  'ui.home': 'Asples',
  'clinical.eye.right': 'Rait ai',
  'clinical.eye.left': 'Lef ai',
});

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en,
  tpi,
  bi: stub({}),
  fr: stub({}),
  es: stub({}),
  pt: stub({}),
  id: stub({}),
  mn: stub({}),
};

export function translate(lang: LanguageCode, key: TranslationKey): string {
  const dict = DICTIONARIES[lang] || DICTIONARIES['en'];
  return dict[key] || key;
}
