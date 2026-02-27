import { defineStore } from 'pinia';
import { api } from '../services/api';

type User = {
  id: number;
  username: string;
  displayName: string;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('stylesavvy_token') || '',
    user: null as User | null,
    loading: false,
    error: '',
  }),
  actions: {
    async register(username: string, password: string, displayName?: string) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.post('/auth/register', { username, password, displayName });
        this.token = data.token;
        this.user = {
          id: data.user.id,
          username: data.user.username ?? data.user.email,
          displayName: data.user.displayName,
        };
        localStorage.setItem('stylesavvy_token', data.token);
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Registration failed';
      } finally {
        this.loading = false;
      }
    },
    async login(username: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.post('/auth/login', { username, password });
        this.token = data.token;
        this.user = {
          id: data.user.id,
          username: data.user.username ?? data.user.email,
          displayName: data.user.displayName,
        };
        localStorage.setItem('stylesavvy_token', data.token);
      } catch (error: any) {
        this.error = error?.response?.data?.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const { data } = await api.get('/auth/me');
        this.user = {
          id: data.id,
          username: data.username ?? data.email,
          displayName: data.displayName,
        };
      } catch {
        this.logout();
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('stylesavvy_token');
    },
  },
});
