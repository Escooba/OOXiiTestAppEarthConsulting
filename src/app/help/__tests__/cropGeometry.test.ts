import { describe, it, expect } from 'vitest';
import { calculateFocusTransform, clampPanOffset } from '../cropGeometry';

describe('Crop Geometry Calculation', () => {
  it('calculates scale and translate coordinates for a focus region', () => {
    const imageSize = { width: 447, height: 447 };
    const viewportSize = { width: 360, height: 270 };
    const focusRegion = { xPercent: 20, yPercent: 40, widthPercent: 50, heightPercent: 30 };

    const transform = calculateFocusTransform(imageSize, viewportSize, focusRegion, 2.0);

    expect(transform.scale).toBeGreaterThan(1.0);
    expect(transform.scale).toBeLessThanOrEqual(2.0);
    expect(typeof transform.translateX).toBe('number');
    expect(typeof transform.translateY).toBe('number');
  });

  it('clamps pan offsets so image stays inside viewport bounds', () => {
    const scaledImageSize = { width: 600, height: 600 };
    const viewportSize = { width: 400, height: 400 };

    // Max pan X/Y is (600-400)/2 = 100
    const clamped = clampPanOffset({ x: 500, y: -400 }, scaledImageSize, viewportSize);
    expect(clamped.x).toBe(100);
    expect(clamped.y).toBe(-100);
  });
});
