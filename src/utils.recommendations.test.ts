import { describe, expect, it } from 'vitest';
import { describeProfile, describeReviewSummary, describeShoppingMode } from './utils/recommendations';

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

  it('formats review summaries for rated products', () => {
    expect(describeReviewSummary(4.3, 12)).toBe('4.3/5 from 12 reviews');
  });

  it('handles products with no reviews yet', () => {
    expect(describeReviewSummary(null, 0)).toBe('No reviews yet');
  });

  it('formats shopping sort modes for the UI', () => {
    expect(describeShoppingMode('top-rated')).toBe('Top rated');
  });
});
