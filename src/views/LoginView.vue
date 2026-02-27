<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const password = ref('');

async function submit() {
  await auth.login(username.value, password.value);

  if (auth.token) {
    router.push('/wardrobe');
  }
}
</script>

<template>
  <section class="card auth-card">
    <h1>Sign in to StyleSavvy (POC)</h1>
    <p>Enter username and any password. Password is ignored in this proof of concept.</p>

    <form class="form-grid" @submit.prevent="submit">
      <label>
        Username
        <input v-model="username" type="text" required />
      </label>

      <label>
        Password
        <input v-model="password" type="password" required />
      </label>

      <button type="submit" :disabled="auth.loading">
        {{ auth.loading ? 'Please wait...' : 'Login' }}
      </button>
    </form>

    <p v-if="auth.error" class="error">{{ auth.error }}</p>
  </section>
</template>
