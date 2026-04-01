<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { api } from '../services/api';
import { describeReviewSummary, describeShoppingMode, type ShoppingSortMode } from '../utils/recommendations';

type ShoppingSuggestion = {
  id: number;
  provider: string;
  title: string;
  category: string;
  price: number;
  currency: string;
  productUrl: string;
  imageUrl: string | null;
  averageRating: number | null;
  reviewCount: number;
  score: number;
  matchReasons: string[];
};

type ReviewDraft = {
  rating: number;
  comment: string;
};

const products = ref<ShoppingSuggestion[]>([]);
const loading = ref(false);
const error = ref('');
const actionMessage = ref('');
const draftReviews = reactive<Record<number, ReviewDraft>>({});
const controls = reactive<{
  sort: ShoppingSortMode;
  minRating: 'all' | '4' | '4.5';
}>({
  sort: 'personalized',
  minRating: 'all',
});

function ensureDraft(productId: number): ReviewDraft {
  if (!draftReviews[productId]) {
    draftReviews[productId] = { rating: 5, comment: '' };
  }

  return draftReviews[productId];
}

function reviewDraft(productId: number): ReviewDraft {
  return ensureDraft(productId);
}

async function loadProducts() {
  loading.value = true;
  error.value = '';

  try {
    const params: Record<string, string> = { sort: controls.sort };
    if (controls.minRating !== 'all') {
      params.minRating = controls.minRating;
    }

    const { data } = await api.get('/products/suggestions', { params });
    products.value = data;
    for (const product of products.value) {
      ensureDraft(product.id);
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to load shopping suggestions';
  } finally {
    loading.value = false;
  }
}

async function submitReview(productId: number) {
  const draft = ensureDraft(productId);
  if (!draft.comment.trim()) return;

  actionMessage.value = '';
  await api.post('/reviews', {
    targetType: 'product',
    targetId: productId,
    rating: draft.rating,
    comment: draft.comment.trim(),
  });

  actionMessage.value = 'Review submitted. Suggestions updated with the latest rating signal.';
  draft.rating = 5;
  draft.comment = '';
  await loadProducts();
}

onMounted(loadProducts);
</script>

<template>
  <section class="grid">
    <article class="card">
      <h2>Shopping Suggestions</h2>
      <p>These products are ranked from your quiz profile, recommendation feedback, price fit, and review signals.</p>
      <form class="shopping-toolbar" @submit.prevent="loadProducts">
        <label>
          Sort
          <select v-model="controls.sort">
            <option value="personalized">Best match</option>
            <option value="top-rated">Top rated</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
        <label>
          Minimum rating
          <select v-model="controls.minRating">
            <option value="all">All ratings</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
          </select>
        </label>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Refreshing...' : 'Refresh Suggestions' }}
        </button>
      </form>
      <p class="muted">Viewing: {{ describeShoppingMode(controls.sort) }}</p>
      <div class="inline-actions">
        <span v-if="actionMessage">{{ actionMessage }}</span>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </article>

    <div class="shopping-grid">
      <article v-for="product in products" :key="product.id" class="card shopping-card">
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" class="shopping-image" />

        <div class="shopping-content">
          <div class="shopping-heading">
            <div>
              <h3>{{ product.title }}</h3>
              <p class="muted">{{ product.provider }} • {{ product.category }}</p>
            </div>
            <span class="score-pill">Score {{ product.score }}</span>
          </div>

          <p class="price-line">{{ product.price }} {{ product.currency }}</p>
          <p class="muted">{{ describeReviewSummary(product.averageRating, product.reviewCount) }}</p>

          <ul class="reason-list">
            <li v-for="reason in product.matchReasons" :key="reason">{{ reason }}</li>
          </ul>

          <div class="inline-actions">
            <a :href="product.productUrl" target="_blank" rel="noreferrer">Open product</a>
          </div>

          <form class="form-grid review-form" @submit.prevent="submitReview(product.id)">
            <label>
              Your rating
              <select v-model.number="reviewDraft(product.id).rating">
                <option :value="5">5</option>
                <option :value="4">4</option>
                <option :value="3">3</option>
                <option :value="2">2</option>
                <option :value="1">1</option>
              </select>
            </label>
            <label>
              Quick review
              <textarea
                v-model="reviewDraft(product.id).comment"
                rows="3"
                placeholder="What worked or did not work for this product?"
                required
              />
            </label>
            <button type="submit" :disabled="!reviewDraft(product.id).comment.trim()">Submit Review</button>
          </form>
        </div>
      </article>
    </div>
  </section>
</template>
