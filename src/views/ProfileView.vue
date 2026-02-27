<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from '../services/api';

const profile = ref<any>(null);

onMounted(async () => {
  const { data } = await api.get('/users/profile');
  profile.value = data;
});
</script>

<template>
  <section class="card">
    <h2>User Profile</h2>
    <p v-if="!profile">Loading...</p>
    <div v-else>
      <p><strong>Name:</strong> {{ profile.displayName }}</p>
      <p><strong>Username:</strong> {{ profile.username || profile.email }}</p>
      <p><strong>User ID:</strong> {{ profile.id }}</p>
    </div>
  </section>
</template>
