export type QuizProgress = {
  answered: number;
  total: number;
  isComplete: boolean;
  missingQuestionIds: number[];
};

export type SavedQuizQuestion = {
  id: number;
  selectedAnswerId?: number | null;
};

export function getQuizProgress(
  questionIds: number[],
  answers: Record<number, number | undefined>,
): QuizProgress {
  const uniqueQuestionIds = [...new Set(questionIds)].sort((a, b) => a - b);
  const answeredQuestionIds = new Set<number>();

  for (const questionId of uniqueQuestionIds) {
    const answerId = answers[questionId];
    if (typeof answerId === 'number' && Number.isFinite(answerId)) {
      answeredQuestionIds.add(questionId);
    }
  }

  const missingQuestionIds = uniqueQuestionIds.filter((questionId) => !answeredQuestionIds.has(questionId));

  return {
    answered: answeredQuestionIds.size,
    total: uniqueQuestionIds.length,
    isComplete: uniqueQuestionIds.length > 0 && missingQuestionIds.length === 0,
    missingQuestionIds,
  };
}

export function applySavedQuizAnswers(questions: SavedQuizQuestion[]): Record<number, number> {
  const mapped: Record<number, number> = {};
  for (const question of questions) {
    if (typeof question.selectedAnswerId === 'number' && Number.isFinite(question.selectedAnswerId)) {
      mapped[question.id] = question.selectedAnswerId;
    }
  }
  return mapped;
}
