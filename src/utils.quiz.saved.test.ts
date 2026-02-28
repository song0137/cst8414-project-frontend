import { describe, expect, it } from 'vitest';
import { applySavedQuizAnswers } from './utils/quiz';

describe('applySavedQuizAnswers', () => {
  it('hydrates local answers from selectedAnswerId values', () => {
    const answers = applySavedQuizAnswers([
      { id: 1, selectedAnswerId: 10 },
      { id: 2, selectedAnswerId: null },
      { id: 3, selectedAnswerId: 30 },
    ]);

    expect(answers).toEqual({ 1: 10, 3: 30 });
  });
});
