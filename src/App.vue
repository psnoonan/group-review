<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

supabase.auth.onAuthStateChange((_, session) => {
  userStore.setUser(session?.user);
  if (session?.user) {
    router.push({ name: 'profile' });
  } else {
    router.push({ name: 'auth' });
  }
});
</script>

<template>
  <RouterView />
</template>
