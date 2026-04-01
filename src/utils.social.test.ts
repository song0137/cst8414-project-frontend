import { describe, expect, it } from 'vitest';
import { buildSharePreview } from './utils/social';

describe('buildSharePreview', () => {
  it('summarizes selected wardrobe items for sharing', () => {
    const preview = buildSharePreview({
      source: 'wardrobe',
      title: 'City Casual',
      items: [
        { id: 1, name: 'Denim Jacket' },
        { id: 2, name: 'White Tee' },
        { id: 3, name: 'Black Jeans' },
      ],
    });

    expect(preview.heading).toBe('City Casual');
    expect(preview.itemCountLabel).toBe('3 items selected');
    expect(preview.itemNames).toContain('White Tee');
  });
});
