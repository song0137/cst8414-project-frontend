import { describe, expect, it } from 'vitest';
import { APP_FOOTNOTE } from './utils/footer';

describe('APP_FOOTNOTE', () => {
  it('matches the required team attribution text', () => {
    expect(APP_FOOTNOTE).toBe('cst8414 group 2, Xiao Song, Rowan Pilon, Suleman Qureshi');
  });
});
