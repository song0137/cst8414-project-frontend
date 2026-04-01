<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { api } from '../services/api';
import { useWardrobeStore } from '../stores/wardrobe';
import { buildSharePreview } from '../utils/social';

type ShareHistoryItem = {
  id: number;
  platform: string;
  privacySetting: string;
  sharedAt: string;
  title: string;
  source: string;
  itemCount: number;
  itemNames: string[];
};

const wardrobe = useWardrobeStore();
const shareForm = reactive({
  platform: 'Instagram',
  privacySetting: 'friends',
  title: 'StyleSavvy outfit',
});
const selectedIds = ref<number[]>([]);
const shareHistory = ref<ShareHistoryItem[]>([]);
const loadingHistory = ref(false);
const sharing = ref(false);
const error = ref('');
const actionMessage = ref('');

const selectedItems = computed(() =>
  wardrobe.items.filter((item) => selectedIds.value.includes(item.id)).map((item) => ({
    id: item.id,
    name: item.name,
  })),
);

const preview = computed(() =>
  buildSharePreview({
    source: 'wardrobe',
    title: shareForm.title,
    items: selectedItems.value,
  }),
);

async function loadHistory() {
  loadingHistory.value = true;
  try {
    const { data } = await api.get('/social/shares');
    shareHistory.value = data;
  } finally {
    loadingHistory.value = false;
  }
}

async function loadPage() {
  error.value = '';
  await Promise.all([wardrobe.fetchItems(), loadHistory()]);
}

async function submitShare() {
  if (selectedItems.value.length === 0) return;

  sharing.value = true;
  actionMessage.value = '';
  error.value = '';

  try {
    await api.post('/social/share', {
      platform: shareForm.platform,
      privacySetting: shareForm.privacySetting,
      outfitPayload: {
        source: 'wardrobe',
        title: shareForm.title,
        items: selectedItems.value,
      },
    });
    actionMessage.value = `Shared to ${shareForm.platform} with ${shareForm.privacySetting} visibility.`;
    await loadHistory();
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to share outfit';
  } finally {
    sharing.value = false;
  }
}

onMounted(loadPage);
</script>

<template>
  <section class="grid two-col">
    <article class="card">
      <h2>Social Sharing</h2>
      <p>Create a share-ready outfit story from your wardrobe, choose privacy before posting, and keep a history for the demo.</p>

      <form class="form-grid" @submit.prevent="submitShare">
        <label>
          Share title
          <input v-model="shareForm.title" />
        </label>
        <label>
          Platform
          <select v-model="shareForm.platform">
            <option>Instagram</option>
            <option>Pinterest</option>
            <option>X</option>
          </select>
        </label>
        <label>
          Privacy
          <select v-model="shareForm.privacySetting">
            <option value="public">Public</option>
            <option value="friends">Friends</option>
            <option value="private">Private</option>
          </select>
        </label>

        <div class="selection-panel">
          <strong>Select wardrobe items</strong>
          <label v-for="item in wardrobe.items" :key="item.id" class="checkbox-row">
            <input v-model="selectedIds" type="checkbox" :value="item.id" />
            <span>{{ item.name }} - {{ item.category }} - {{ item.color }}</span>
          </label>
        </div>

        <button type="submit" :disabled="sharing || selectedItems.length === 0">
          {{ sharing ? 'Sharing...' : 'Share Outfit' }}
        </button>
      </form>

      <p v-if="actionMessage">{{ actionMessage }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </article>

    <article class="card">
      <h2>Share Preview</h2>
      <div class="share-preview">
        <strong>{{ preview.heading }}</strong>
        <span>{{ preview.sourceLabel }}</span>
        <span>{{ preview.itemCountLabel }}</span>
        <ul class="list compact-list">
          <li v-for="itemName in preview.itemNames" :key="itemName">{{ itemName }}</li>
        </ul>
      </div>

      <h3>Recent Shares</h3>
      <p v-if="loadingHistory">Loading share history...</p>
      <ul class="list" v-else>
        <li v-for="share in shareHistory" :key="share.id">
          <strong>{{ share.title }}</strong>
          <span>{{ share.platform }} - {{ share.privacySetting }} - {{ share.itemCount }} items</span>
          <span>{{ share.itemNames.join(', ') }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>
