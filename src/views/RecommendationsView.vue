<script setup lang="ts">
import { ref } from 'vue';
import { useRecommendationsStore } from '../stores/recommendations';
import { describeProfile } from '../utils/recommendations';

const recommendations = useRecommendationsStore();
const actionMessage = ref('');

async function giveFeedback(id: number, type: 'like' | 'dislike') {
  actionMessage.value = '';
  const result = await recommendations.feedback(id, type);

  if (type === 'like' && result.addedToWardrobe) {
    actionMessage.value = 'Liked item added to your wardrobe.';
    return;
  }

  if (type === 'like' && !result.addedToWardrobe && result.reason) {
    actionMessage.value = result.reason;
    return;
  }

  actionMessage.value = result.message;
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
    <p v-if="actionMessage">{{ actionMessage }}</p>

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
