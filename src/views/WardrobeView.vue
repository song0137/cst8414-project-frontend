<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useWardrobeStore } from '../stores/wardrobe';

const wardrobe = useWardrobeStore();

const form = reactive({
  name: '',
  category: '',
  color: '',
  season: '',
  brand: '',
  imageUrl: '',
});

const filters = reactive({
  q: '',
  category: '',
  color: '',
  season: '',
});

onMounted(() => {
  wardrobe.fetchItems();
});

async function createItem() {
  await wardrobe.createItem({ ...form, imageUrl: form.imageUrl || undefined });
  form.name = '';
  form.category = '';
  form.color = '';
  form.season = '';
  form.brand = '';
  form.imageUrl = '';
}

async function applyFilter() {
  await wardrobe.fetchItems({ ...filters });
}
</script>

<template>
  <section class="grid two-col">
    <article class="card">
      <h2>Add Wardrobe Item</h2>
      <form class="form-grid" @submit.prevent="createItem">
        <label>Name <input v-model="form.name" required /></label>
        <label>Category <input v-model="form.category" required /></label>
        <label>Color <input v-model="form.color" required /></label>
        <label>Season <input v-model="form.season" required /></label>
        <label>Brand <input v-model="form.brand" required /></label>
        <label>Image URL <input v-model="form.imageUrl" /></label>
        <button type="submit">Add Item</button>
      </form>
    </article>

    <article class="card">
      <h2>Filter and Search</h2>
      <form class="form-grid" @submit.prevent="applyFilter">
        <label>Keyword <input v-model="filters.q" /></label>
        <label>Category <input v-model="filters.category" /></label>
        <label>Color <input v-model="filters.color" /></label>
        <label>Season <input v-model="filters.season" /></label>
        <button type="submit">Apply</button>
      </form>

      <p v-if="wardrobe.loading">Loading...</p>
      <p v-if="wardrobe.error" class="error">{{ wardrobe.error }}</p>

      <ul class="list" v-if="!wardrobe.loading">
        <li v-for="item in wardrobe.items" :key="item.id">
          <strong>{{ item.name }}</strong>
          <span>{{ item.category }} • {{ item.color }} • {{ item.season }} • {{ item.brand }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>
