import { createRouter, createWebHistory } from 'vue-router';
import authStore from '@/store/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  strict: true,
  sensitive: true,
  routes: [
    {
      path: '/video',
      name: 'Video',
      component: () => import('@/pages/Video.vue'),
      alias: '/',
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/pages/Settings.vue'),
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('@/pages/SignIn.vue'),
      props: true,
      meta: {
        public: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import(/* webpackChunkName: "404" */ '@/pages/404.vue'),
      meta: {
        public: true,
      },
    },
  ],
});

const { isAuthenticated } = authStore;

router.beforeEach((to) => {
  if (to.name === 'SignIn' && isAuthenticated.value) {
    return { path: '/' };
  }

  if (to.matched.some(({ meta }) => !meta.public) && !isAuthenticated.value) {
    return {
      name: 'SignIn',
    };
  }

  return true;
});

export default router;
