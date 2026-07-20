import { describe, it, expect } from 'vitest';
import { getNextClinicalRoute, getPreviousClinicalRoute } from '../clinicalFlow';

describe('Clinical Flow Routing', () => {
  describe('getNextClinicalRoute', () => {
    it('progresses through distance right', () => {
      expect(getNextClinicalRoute('glasses-question', {})).toBe('distance-right-line');
      expect(getNextClinicalRoute('distance-right-line', {})).toBe('distance-right-letters');
      expect(getNextClinicalRoute('distance-right-letters', {})).toBe('distance-right-result');
      expect(getNextClinicalRoute('distance-right-result', {})).toBe('distance-left-line');
    });

    it('branches at distance-left-result based on glasses', () => {
      expect(getNextClinicalRoute('distance-left-result', { hasDistanceGlasses: 'Yes' })).toBe('distance-both-glasses-line');
      expect(getNextClinicalRoute('distance-left-result', { hasDistanceGlasses: 'No' })).toBe('near-no-glasses-line');
    });

    it('branches at reading-glasses-question', () => {
      expect(getNextClinicalRoute('reading-glasses-question', { hasReadingGlasses: 'Yes' })).toBe('near-own-glasses-line');
      expect(getNextClinicalRoute('reading-glasses-question', { hasReadingGlasses: 'No' })).toBe('wheel-pd');
    });

    it('skips power screen when Neither is selected for right direction', () => {
      expect(getNextClinicalRoute('wheel-right-direction', { wheelRightDirection: 'Neither plus nor minus' })).toBe('wheel-right-two-colour');
      expect(getNextClinicalRoute('wheel-right-direction', { wheelRightDirection: 'Plus' })).toBe('wheel-right-power');
    });

    it('skips distance line/letters when distance is not improved', () => {
      expect(getNextClinicalRoute('wheel-right-distance-improved', { wheelRightDistanceImproved: 'Yes' })).toBe('wheel-right-distance-line');
      expect(getNextClinicalRoute('wheel-right-distance-improved', { wheelRightDistanceImproved: 'No' })).toBe('wheel-right-distance-result');
    });

    it('skips sunglasses selection when not dispensed', () => {
      expect(getNextClinicalRoute('sunglasses-question', { sunglassesDispensed: 'Yes' })).toBe('sunglasses-selection');
      expect(getNextClinicalRoute('sunglasses-question', { sunglassesDispensed: 'No' })).toBe('dispensed-review');
    });
  });

  describe('getPreviousClinicalRoute', () => {
    it('returns to distance-both or distance-left depending on glasses', () => {
      expect(getPreviousClinicalRoute('near-no-glasses-line', { hasDistanceGlasses: 'Yes' })).toBe('distance-both-glasses-result');
      expect(getPreviousClinicalRoute('near-no-glasses-line', { hasDistanceGlasses: 'No' })).toBe('distance-left-result');
    });

    it('returns to reading-glasses-question or near-own-glasses based on reading glasses', () => {
      expect(getPreviousClinicalRoute('wheel-pd', { hasReadingGlasses: 'Yes' })).toBe('near-own-glasses-result');
      expect(getPreviousClinicalRoute('wheel-pd', { hasReadingGlasses: 'No' })).toBe('reading-glasses-question');
    });

    it('returns to direction from two-colour if Neither was selected', () => {
      expect(getPreviousClinicalRoute('wheel-right-two-colour', { wheelRightDirection: 'Neither plus nor minus' })).toBe('wheel-right-direction');
      expect(getPreviousClinicalRoute('wheel-right-two-colour', { wheelRightDirection: 'Plus' })).toBe('wheel-right-power');
    });
    
    it('returns to improved from result if No was selected', () => {
      expect(getPreviousClinicalRoute('wheel-right-distance-result', { wheelRightDistanceImproved: 'Yes' })).toBe('wheel-right-distance-letters');
      expect(getPreviousClinicalRoute('wheel-right-distance-result', { wheelRightDistanceImproved: 'No' })).toBe('wheel-right-distance-improved');
    });
  });
});
