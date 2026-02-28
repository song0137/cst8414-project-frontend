import { defineStore } from 'pinia';
import { api } from '../services/api';
import type { RecommendationProfile } from '../utils/recommendations';

export type RecommendationItem = {
  id: number;
  itemType: string;
  score: number;
  rankOrder: number;
  category: string | null;
  title: string | null;
  color: string | null;
  season: string | null;
  brand: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string | null;
  productUrl: string | null;
};

export type FeedbackResult = {
  message: string;
  addedToWardrobe: boolean;
  reason?: string;
  wardrobeItemId?: number;
};

export const useRecommendationsStore = defineStore('recommendations', {
  state: () => ({
    runId: null as number | null,
    profile: {} as RecommendationProfile,
    items: [] as RecommendationItem[],
    loading: false,
    error: '',
  }),
  actions: {
    async generate() {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.post('/recommendations/generate');
        this.runId = data.runId;
        this.profile = data.profile ?? {};
        this.items = data.items ?? [];
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Failed to generate recommendations';
      } finally {
        this.loading = false;
      }
    },
    async feedback(id: number, feedbackType: 'like' | 'dislike'): Promise<FeedbackResult> {
      const { data } = await api.post(`/recommendations/${id}/feedback`, { feedbackType });
      return data;
    },
  },
});
