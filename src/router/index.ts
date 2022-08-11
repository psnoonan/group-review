import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/supabase';

import AuthView from '@/views/Auth.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/Profile.vue'),
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.name !== 'auth' && !supabase.auth.user()) {
    return { name: 'auth', replace: true };
  }
});

export default router;
