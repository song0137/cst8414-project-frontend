<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../services/api';

const topic = ref('');
const posts = ref<any[]>([]);

async function load() {
  const { data } = await api.get('/blog/posts', { params: topic.value ? { topic: topic.value } : {} });
  posts.value = data;
}

onMounted(load);
</script>

<template>
  <section class="card">
    <h2>Fashion Blog and News</h2>
    <div class="inline-actions">
      <input v-model="topic" placeholder="Filter topic (e.g. spring)" />
      <button @click="load">Apply</button>
    </div>

    <ul class="list">
      <li v-for="p in posts" :key="p.id">
        <strong>{{ p.title }}</strong>
        <span>{{ p.summary }}</span>
      </li>
    </ul>
  </section>
</template>
