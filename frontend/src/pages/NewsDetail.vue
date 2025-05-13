<template>
  <Header />
  <div class="post-detail">
    <div class="post-header">
      <img class="dota-icon" :src="activeTab === 'dota' ? dotaIcon : csIcon" alt="icon" />
      <h1>{{ post.title }}</h1>
    </div>
    <img class="post-image" v-if="post.image" :src="`http://127.0.0.1:8000/storage/${post.image}`" alt="post image" />
    <p class="post-body">Описание:</p>
    <p>{{ post.body }}</p>
  </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/axios'
import dotaIcon from '../assets/images/dota_icon.svg';
import csIcon from '../assets/images/cs_icon.svg';

const route = useRoute()
const post = ref({})
const activeTab = ref('dota');

onMounted(async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`)
    post.value = res.data.data
  } catch (err) {
    console.error('Ошибка при получении поста:', err)
  }
})
</script>

<style scoped>
.post-detail {
  padding: 2rem;
  display: flex;
  flex-direction: column;

  justify-content: center;

  color: white;
  margin: 10px 13%;
}

.post-header{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.post-image{
  width: 100%;
  height: auto;
}

.post-body{
  margin-top: 20px;
  font-weight: bold;
  font-size: 24px;
}

.dota-icon {
  width: 10vw; 
  max-width: 64px;
  height: auto; 
}
</style>
