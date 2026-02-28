<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { api } from '../services/api';
import { applySavedQuizAnswers, getQuizProgress } from '../utils/quiz';

type Question = {
  id: number;
  questionText: string;
  dimension: string;
  selectedAnswerId?: number | null;
  answers: { id: number; answerText: string }[];
};

const questions = ref<Question[]>([]);
const answers = reactive<Record<number, number>>({});
const message = ref('');
const error = ref('');

const progress = computed(() => getQuizProgress(questions.value.map((q) => q.id), answers));

onMounted(async () => {
  try {
    const { data } = await api.get('/quiz/questions');
    questions.value = data;
    const restored = applySavedQuizAnswers(data);
    for (const [questionId, answerId] of Object.entries(restored)) {
      answers[Number(questionId)] = answerId;
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load quiz questions';
  }
});

async function submitQuiz() {
  message.value = '';
  error.value = '';
  if (!progress.value.isComplete) {
    error.value = `Please answer all questions first. Missing question IDs: ${progress.value.missingQuestionIds.join(', ')}`;
    return;
  }

  const responses = Object.entries(answers).map(([questionId, answerId]) => ({
    questionId: Number(questionId),
    answerId: Number(answerId),
  }));

  try {
    const { data } = await api.post('/quiz/responses', { responses });
    const profileSummary = Object.entries(data.profile ?? {})
      .map(([k, v]) => `${k}: ${v}`)
      .join(' | ');
    message.value = profileSummary
      ? `Quiz responses saved. Profile: ${profileSummary}`
      : 'Quiz responses saved.';
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to save quiz responses';
  }
}
</script>

<template>
  <section class="card">
    <h2>Personalized Style Quiz</h2>
    <p>Progress: {{ progress.answered }} / {{ progress.total }}</p>
    <form class="form-grid" @submit.prevent="submitQuiz">
      <fieldset v-for="q in questions" :key="q.id">
        <legend>{{ q.questionText }} ({{ q.dimension }})</legend>
        <label v-for="a in q.answers" :key="a.id">
          <input type="radio" :name="`q-${q.id}`" :value="a.id" v-model="answers[q.id]" required />
          {{ a.answerText }}
        </label>
      </fieldset>
      <button type="submit" :disabled="!progress.isComplete">Save Quiz</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>
