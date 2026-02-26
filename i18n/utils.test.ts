/**
 * @vitest-environment jsdom
 */

import { isRTL } from './utils';
import { describe, it, expect } from 'vitest';

describe('isRTL', () => {
  it('returns true for Arabic locale', () => {
    expect(isRTL('ar')).toBe(true);
  });

  it('returns false for English locale', () => {
    expect(isRTL('en')).toBe(false);
  });

  it('returns false for Japanese locale', () => {
    expect(isRTL('ja')).toBe(false);
  });

  it('returns false for an unsupported RTL locale (e.g., Hebrew is not in our list)', () => {
    expect(isRTL('he')).toBe(false);
  });

  it('returns false for a non-string input', () => {
    // @ts-ignore
    expect(isRTL(null)).toBe(false);
    // @ts-ignore
    expect(isRTL(undefined)).toBe(false);
    // @ts-ignore
    expect(isRTL(123)).toBe(false);
  });
});

