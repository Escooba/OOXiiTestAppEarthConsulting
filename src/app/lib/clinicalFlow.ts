import { ScreenId } from './theme';

export function getNextClinicalRoute(current: ScreenId, results: Record<string, any>): ScreenId {
  switch (current) {
    case 'glasses-question':
      return 'distance-right-line';

    // Distance Right
    case 'distance-right-line':
      return 'distance-right-letters';
    case 'distance-right-letters':
      return 'distance-right-result';
    case 'distance-right-result':
      return 'distance-left-line';

    // Distance Left
    case 'distance-left-line':
      return 'distance-left-letters';
    case 'distance-left-letters':
      return 'distance-left-result';
    case 'distance-left-result':
      return results.hasDistanceGlasses === 'Yes' ? 'distance-both-glasses-line' : 'near-no-glasses-line';

    // Distance Both (Optional)
    case 'distance-both-glasses-line':
      return 'distance-both-glasses-letters';
    case 'distance-both-glasses-letters':
      return 'distance-both-glasses-result';
    case 'distance-both-glasses-result':
      return 'near-no-glasses-line';

    // Near No Glasses
    case 'near-no-glasses-line':
      return 'near-no-glasses-result';
    case 'near-no-glasses-result':
      return 'reading-glasses-question';

    // Reading Glasses Question
    case 'reading-glasses-question':
      return results.hasReadingGlasses === 'Yes' ? 'near-own-glasses-line' : 'wheel-pd';

    // Near Own Glasses (Optional)
    case 'near-own-glasses-line':
      return 'near-own-glasses-result';
    case 'near-own-glasses-result':
      return 'wheel-pd';

    // Wheel PD
    case 'wheel-pd':
      return 'wheel-right-direction';

    // Wheel Right Lens
    case 'wheel-right-direction':
      return String(results.wheelRightDirection).startsWith('Neither') ? 'wheel-right-two-colour' : 'wheel-right-power';
    case 'wheel-right-power':
      return 'wheel-right-two-colour';
    case 'wheel-right-two-colour':
      return 'wheel-right-line-nine';
    case 'wheel-right-line-nine':
      return 'wheel-right-result';
    case 'wheel-right-result':
      return 'wheel-right-distance-improved';

    // Wheel Right Distance
    case 'wheel-right-distance-improved':
      return results.wheelRightDistanceImproved === 'Yes' ? 'wheel-right-distance-line' : 'wheel-right-distance-result';
    case 'wheel-right-distance-line':
      return 'wheel-right-distance-letters';
    case 'wheel-right-distance-letters':
      return 'wheel-right-distance-result';
    case 'wheel-right-distance-result':
      return 'wheel-left-direction';

    // Wheel Left Lens
    case 'wheel-left-direction':
      return String(results.wheelLeftDirection).startsWith('Neither') ? 'wheel-left-two-colour' : 'wheel-left-power';
    case 'wheel-left-power':
      return 'wheel-left-two-colour';
    case 'wheel-left-two-colour':
      return 'wheel-left-line-nine';
    case 'wheel-left-line-nine':
      return 'wheel-left-result';
    case 'wheel-left-result':
      return 'distance-glasses-dispensed';
    case 'distance-glasses-dispensed':
      return 'sunglasses-question';

    // End flow
    case 'sunglasses-question':
      return results.sunglassesDispensed === true || results.sunglassesDispensed === 'Yes' ? 'sunglasses-selection' : 'dispensed-review';
    case 'sunglasses-selection':
      return 'dispensed-review';
    case 'dispensed-review':
      return 'final-checklist';
    case 'final-checklist':
      return 'additional-details';
    case 'additional-details':
      return 'test-saved';

    default:
      return current;
  }
}

export function getPreviousClinicalRoute(current: ScreenId, results: Record<string, any>): ScreenId {
  switch (current) {
    // Distance Right
    case 'distance-right-line':
      return 'glasses-question';
    case 'distance-right-letters':
      return 'distance-right-line';
    case 'distance-right-result':
      return 'distance-right-letters';

    // Distance Left
    case 'distance-left-line':
      return 'distance-right-result';
    case 'distance-left-letters':
      return 'distance-left-line';
    case 'distance-left-result':
      return 'distance-left-letters';

    // Distance Both (Optional)
    case 'distance-both-glasses-line':
      return 'distance-left-result';
    case 'distance-both-glasses-letters':
      return 'distance-both-glasses-line';
    case 'distance-both-glasses-result':
      return 'distance-both-glasses-letters';

    // Near No Glasses
    case 'near-no-glasses-line':
      return results.hasDistanceGlasses === 'Yes' ? 'distance-both-glasses-result' : 'distance-left-result';
    case 'near-no-glasses-result':
      return 'near-no-glasses-line';

    // Reading Glasses Question
    case 'reading-glasses-question':
      return 'near-no-glasses-result';

    // Near Own Glasses (Optional)
    case 'near-own-glasses-line':
      return 'reading-glasses-question';
    case 'near-own-glasses-result':
      return 'near-own-glasses-line';

    // Wheel PD
    case 'wheel-pd':
      return results.hasReadingGlasses === 'Yes' ? 'near-own-glasses-result' : 'reading-glasses-question';

    // Wheel Right Lens
    case 'wheel-right-direction':
      return 'wheel-pd';
    case 'wheel-right-power':
      return 'wheel-right-direction';
    case 'wheel-right-two-colour':
      return String(results.wheelRightDirection).startsWith('Neither') ? 'wheel-right-direction' : 'wheel-right-power';
    case 'wheel-right-line-nine':
      return 'wheel-right-two-colour';
    case 'wheel-right-result':
      return 'wheel-right-line-nine';

    // Wheel Right Distance
    case 'wheel-right-distance-improved':
      return 'wheel-right-result';
    case 'wheel-right-distance-line':
      return 'wheel-right-distance-improved';
    case 'wheel-right-distance-letters':
      return 'wheel-right-distance-line';
    case 'wheel-right-distance-result':
      return results.wheelRightDistanceImproved === 'Yes' ? 'wheel-right-distance-letters' : 'wheel-right-distance-improved';

    // Wheel Left Lens
    case 'wheel-left-direction':
      return 'wheel-right-distance-result';
    case 'wheel-left-power':
      return 'wheel-left-direction';
    case 'wheel-left-two-colour':
      return String(results.wheelLeftDirection).startsWith('Neither') ? 'wheel-left-direction' : 'wheel-left-power';
    case 'wheel-left-line-nine':
      return 'wheel-left-two-colour';
    case 'wheel-left-result':
      return 'wheel-left-line-nine';

    // Dispensing & End flow
    case 'distance-glasses-dispensed':
      return 'wheel-left-result';
    case 'sunglasses-question':
      return 'distance-glasses-dispensed';
    case 'sunglasses-selection':
      return 'sunglasses-question';
    case 'dispensed-review':
      return results.sunglassesDispensed === true || results.sunglassesDispensed === 'Yes' ? 'sunglasses-selection' : 'sunglasses-question';
    case 'final-checklist':
      return 'dispensed-review';
    case 'additional-details':
      return 'final-checklist';
    case 'test-saved':
      return 'additional-details';

    default:
      return current;
  }
}

export function getProgressForRoute(route: ScreenId): number {
  const map: Partial<Record<ScreenId, number>> = {
    'glasses-question': 8,
    'distance-right-line': 10,
    'distance-right-letters': 12,
    'distance-right-result': 15,
    'distance-left-line': 18,
    'distance-left-letters': 20,
    'distance-left-result': 22,
    'distance-both-glasses-line': 24,
    'distance-both-glasses-letters': 26,
    'distance-both-glasses-result': 28,
    'near-no-glasses-line': 30,
    'near-no-glasses-result': 32,
    'reading-glasses-question': 35,
    'near-own-glasses-line': 38,
    'near-own-glasses-result': 40,
    'wheel-pd': 45,
    'wheel-right-direction': 50,
    'wheel-right-power': 52,
    'wheel-right-two-colour': 55,
    'wheel-right-line-nine': 58,
    'wheel-right-result': 60,
    'wheel-right-distance-improved': 65,
    'wheel-right-distance-line': 67,
    'wheel-right-distance-letters': 69,
    'wheel-right-distance-result': 72,
    'wheel-left-direction': 75,
    'wheel-left-power': 78,
    'wheel-left-two-colour': 80,
    'wheel-left-line-nine': 82,
    'wheel-left-result': 85,
    'distance-glasses-dispensed': 88,
    'sunglasses-question': 90,
    'sunglasses-selection': 92,
    'dispensed-review': 95,
    'final-checklist': 98,
    'additional-details': 99,
    'test-saved': 100,
  };
  return map[route] || 0;
}
