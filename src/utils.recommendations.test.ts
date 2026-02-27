import { describe, expect, it } from 'vitest';
import { describeProfile } from './utils/recommendations';

describe('describeProfile', () => {
  it('returns key dimensions in readable order', () => {
    const label = describeProfile({
      style: 'Streetwear',
      color: 'Bold',
      fit: 'Relaxed',
      budget: 'Mid-range',
    });

    expect(label).toContain('Style: Streetwear');
    expect(label).toContain('Color: Bold');
    expect(label).toContain('Fit: Relaxed');
    expect(label).toContain('Budget: Mid-range');
  });

  it('falls back when profile is empty', () => {
    expect(describeProfile({})).toBe('No quiz profile saved yet. Complete the quiz first.');
  });
});
