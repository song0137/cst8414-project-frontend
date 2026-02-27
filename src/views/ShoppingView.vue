<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../services/api';

const products = ref<any[]>([]);

onMounted(async () => {
  const { data } = await api.get('/products/suggestions');
  products.value = data;
});
</script>

<template>
  <section class="card">
    <h2>Shopping Suggestions</h2>
    <ul class="list">
      <li v-for="p in products" :key="p.id">
        <strong>{{ p.title }}</strong>
        <span>{{ p.category }} • {{ p.price }} {{ p.currency }}</span>
        <a :href="p.product_url" target="_blank">Open product</a>
      </li>
    </ul>
  </section>
</template>
