import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import WardrobeView from '../views/WardrobeView.vue';
import RecommendationsView from '../views/RecommendationsView.vue';
import QuizView from '../views/QuizView.vue';
import ShoppingView from '../views/ShoppingView.vue';
import ReviewsView from '../views/ReviewsView.vue';
import BlogView from '../views/BlogView.vue';
import ProfileView from '../views/ProfileView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/', redirect: '/wardrobe' },
    { path: '/wardrobe', name: 'wardrobe', component: WardrobeView },
    { path: '/recommendations', name: 'recommendations', component: RecommendationsView },
    { path: '/quiz', name: 'quiz', component: QuizView },
    { path: '/shopping', name: 'shopping', component: ShoppingView },
    { path: '/reviews', name: 'reviews', component: ReviewsView },
    { path: '/blog', name: 'blog', component: BlogView },
    { path: '/profile', name: 'profile', component: ProfileView },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem('stylesavvy_token');
  if (to.name !== 'login' && !token) {
    return { name: 'login' };
  }
  if (to.name === 'login' && token) {
    return { name: 'wardrobe' };
  }
  return true;
});

export default router;
