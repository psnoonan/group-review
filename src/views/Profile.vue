<template>
  <form class="form-widget" @submit.prevent="updateProfile">
    <AvatarUpload v-model:path="avatar_url" @upload="updateProfile" />

    <div>
      <label for="email">Email</label>
      <input
        id="email"
        type="text"
        :value="userStore.user?.email || ''"
        disabled
      />
    </div>

    <div>
      <label for="username">Name</label>
      <input id="username" v-model="username" type="text" />
    </div>

    <div>
      <input
        type="submit"
        class="button block primary"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
    </div>

    <div>
      <button :disabled="loading" class="button block" @click="signOut">
        Sign Out
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { supabase } from '../supabase';
import { useUserStore } from '../stores/user';
import { onMounted, ref } from 'vue';

import AvatarUpload from '../components/AvatarUpload.vue';

const userStore = useUserStore();

const loading = ref(true);
const username = ref('');
const avatar_url = ref('');

async function getProfile() {
  try {
    loading.value = true;
    userStore.setUser(supabase.auth.user());

    const { data, error, status } = await supabase
      .from('profiles')
      .select(`username, avatar_url`)
      .eq('id', userStore.user?.id)
      .single();

    if (error && status !== 406) throw error;

    if (data) {
      username.value = data.username;
      avatar_url.value = data.avatar_url;
    }
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  try {
    loading.value = true;
    userStore.setUser(supabase.auth.user());

    const updates = {
      id: userStore.user?.id,
      username: username.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    });

    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getProfile();
});
</script>
