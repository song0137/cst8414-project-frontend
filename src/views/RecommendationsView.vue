<script setup lang="ts">
import { useRecommendationsStore } from '../stores/recommendations';
import { describeProfile } from '../utils/recommendations';

const recommendations = useRecommendationsStore();

async function giveFeedback(id: number, type: 'like' | 'dislike') {
  await recommendations.feedback(id, type);
}
</script>

<template>
  <section class="card">
    <h2>Style Recommendations</h2>
    <p>Generate recommendations using wardrobe history, quiz profile, and feedback signals.</p>
    <button @click="recommendations.generate" :disabled="recommendations.loading">
      {{ recommendations.loading ? 'Generating...' : 'Generate Recommendations' }}
    </button>

    <p v-if="recommendations.error" class="error">{{ recommendations.error }}</p>
    <p class="muted">{{ describeProfile(recommendations.profile) }}</p>

    <ul class="list">
      <li v-for="item in recommendations.items" :key="item.id">
        <div>
          <strong>{{ item.title || 'Untitled item' }}</strong>
          <span>
            {{ item.itemType }} | {{ item.category || 'uncategorized' }} | score:
            {{ item.score }} | rank: {{ item.rankOrder }}
          </span>
          <span v-if="item.color || item.season">
            {{ item.color || 'No color' }} / {{ item.season || 'No season' }}
          </span>
          <span v-if="item.price !== null">
            {{ item.price }} {{ item.currency || '' }}
          </span>
        </div>
        <div class="inline-actions">
          <button @click="giveFeedback(item.id, 'like')">Like</button>
          <button @click="giveFeedback(item.id, 'dislike')">Dislike</button>
          <a v-if="item.productUrl" :href="item.productUrl" target="_blank" rel="noreferrer">Open Product</a>
        </div>
      </li>
    </ul>
  </section>
</template>
