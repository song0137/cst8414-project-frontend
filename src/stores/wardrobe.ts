import { defineStore } from 'pinia';
import { api } from '../services/api';

export type WardrobeItem = {
  id: number;
  name: string;
  category: string;
  color: string;
  season: string;
  brand: string;
  image_url?: string;
};

export const useWardrobeStore = defineStore('wardrobe', {
  state: () => ({
    items: [] as WardrobeItem[],
    loading: false,
    error: '',
  }),
  actions: {
    async fetchItems(filters: { q?: string; category?: string; color?: string; season?: string } = {}) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.get('/wardrobe/items', { params: filters });
        this.items = data;
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Failed to load wardrobe';
      } finally {
        this.loading = false;
      }
    },
    async createItem(payload: {
      name: string;
      category: string;
      color: string;
      season: string;
      brand: string;
      imageUrl?: string;
    }) {
      this.error = '';
      try {
        await api.post('/wardrobe/items', payload);
        await this.fetchItems();
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Failed to create wardrobe item';
      }
    },
  },
});
