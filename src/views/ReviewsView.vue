<script setup lang="ts">
import { reactive, ref } from 'vue';
import { api } from '../services/api';

const form = reactive({ targetType: 'product', targetId: 1, rating: 5, comment: '' });
const reviews = ref<any[]>([]);

async function submit() {
  await api.post('/reviews', form);
  await load();
  form.comment = '';
}

async function load() {
  const { data } = await api.get('/reviews', {
    params: { targetType: form.targetType, targetId: form.targetId },
  });
  reviews.value = data;
}
</script>

<template>
  <section class="grid two-col">
    <article class="card">
      <h2>Submit Review</h2>
      <form class="form-grid" @submit.prevent="submit">
        <label>
          Target Type
          <select v-model="form.targetType">
            <option value="product">product</option>
            <option value="outfit">outfit</option>
          </select>
        </label>
        <label>Target ID <input type="number" v-model.number="form.targetId" min="1" /></label>
        <label>Rating <input type="number" v-model.number="form.rating" min="1" max="5" /></label>
        <label>Comment <textarea v-model="form.comment" required /></label>
        <button type="submit">Submit</button>
      </form>
    </article>

    <article class="card">
      <h2>Review List</h2>
      <button @click="load">Refresh</button>
      <ul class="list">
        <li v-for="r in reviews" :key="r.id">
          <strong>{{ r.rating }}/5</strong>
          <span>{{ r.comment }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>
