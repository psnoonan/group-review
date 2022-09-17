<script setup lang="ts">
import { watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { supabase } from '@/supabase';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

userStore.setUser(supabase.auth.user());

supabase.auth.onAuthStateChange((_, session) => {
  userStore.setUser(session?.user);
});

watch(
  () => userStore.user,
  (user) => {
    if (user) router.replace({ name: 'profile' });
    else router.replace({ name: 'auth' });
  }
);
</script>

<template>
  <RouterView />
</template>
