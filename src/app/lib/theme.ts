export const theme = {
  bg: 'bg-[#150F26]',
  card: 'bg-[#22193B]',
  cardActive: 'bg-[#2A2049]',
  teal: '#00D1C1',
  tealText: 'text-[#00D1C1]',
  tealBg: 'bg-[#00D1C1]',
  tealBorder: 'border-[#00D1C1]',
  error: '#FF5C5C',
  errorText: 'text-[#FF5C5C]',
  errorBorder: 'border-[#FF5C5C]',
  textMain: 'text-white',
  textMuted: 'text-[#9B93BA]',
  trackEmpty: 'bg-[#3A3059]',
};

export const snellenMap: Record<number, string> = {
  0: '6/60', 1: '6/48', 2: '6/38', 3: '6/30', 4: '6/24', 5: '6/19',
  6: '6/15', 7: '6/12', 8: '6/10', 9: '6/8', 10: '6/6', 11: '6/5',
};

export function calcSnellen(line: string, letters: string): string {
  if (!line) return '';
  const n = parseInt(line.replace(/\D/g, ''));
  if (Number.isNaN(n)) return '';
  const base = snellenMap[n];
  if (!base) return '';
  const l = parseInt(letters || '0');
  return l > 0 ? `${base}+${l}` : base;
}

export type ScreenId =
  | 'login'
  | 'signup-email'
  | 'signup-tester'
  | 'signup-additional'
  | 'first-login-guide'
  | 'home'
  | 'client-info'
  | 'glasses-question'
  | 'distance-right-line'
  | 'distance-right-letters'
  | 'distance-right-result'
  | 'distance-left-line'
  | 'distance-left-letters'
  | 'distance-left-result'
  | 'distance-both-glasses-line'
  | 'distance-both-glasses-letters'
  | 'distance-both-glasses-result'
  | 'near-no-glasses-line'
  | 'near-no-glasses-result'
  | 'reading-glasses-question'
  | 'near-own-glasses-line'
  | 'near-own-glasses-result'
  | 'wheel-pd'
  | 'wheel-right-direction'
  | 'wheel-right-power'
  | 'wheel-right-two-colour'
  | 'wheel-right-line-nine'
  | 'wheel-right-result'
  | 'wheel-right-distance-improved'
  | 'wheel-right-distance-line'
  | 'wheel-right-distance-letters'
  | 'wheel-right-distance-result'
  | 'wheel-left-direction'
  | 'wheel-left-power'
  | 'wheel-left-two-colour'
  | 'wheel-left-line-nine'
  | 'wheel-left-result'
  | 'sunglasses-question'
  | 'sunglasses-selection'
  | 'dispensed-review'
  | 'final-checklist'
  | 'additional-details'
  | 'test-saved'
  | 'final-summary'
  | 'tester-profile'
  | 'community-garden'
  | 'tutorial'
  | 'find-client'
  | 'client-profile'
  | 'vision-review'
  | 'client-prescription';
