import { describe, expect, it } from 'vitest';
import { getQuizProgress } from './utils/quiz';

describe('getQuizProgress', () => {
  it('tracks answered/remaining questions', () => {
    const progress = getQuizProgress([10, 11, 12, 13], {
      10: 1,
      12: 2,
    });

    expect(progress.answered).toBe(2);
    expect(progress.total).toBe(4);
    expect(progress.isComplete).toBe(false);
    expect(progress.missingQuestionIds).toEqual([11, 13]);
  });

  it('marks quiz complete when all questions answered', () => {
    const progress = getQuizProgress([1, 2], { 1: 10, 2: 20 });

    expect(progress.answered).toBe(2);
    expect(progress.isComplete).toBe(true);
    expect(progress.missingQuestionIds).toEqual([]);
  });
});
