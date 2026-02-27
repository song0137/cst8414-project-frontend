<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const isAuthPage = computed(() => route.name === 'login');

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <div class="brand">StyleSavvy</div>
      <nav v-if="!isAuthPage" class="nav-links">
        <RouterLink to="/wardrobe">Wardrobe</RouterLink>
        <RouterLink to="/quiz">Quiz</RouterLink>
        <RouterLink to="/recommendations">Recommendations</RouterLink>
        <RouterLink to="/shopping">Shopping</RouterLink>
        <RouterLink to="/reviews">Reviews</RouterLink>
        <RouterLink to="/blog">Blog</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <button @click="logout">Logout</button>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>
