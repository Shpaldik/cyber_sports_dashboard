<!-- src/views/PostDetail.vue -->
<template>
  <div v-if="post">
    <h1>{{ post.title }}</h1>
    <img :src="`http://127.0.0.1:8000/storage/${post.image}`" v-if="post.image" />
    <p>{{ post.body }}</p>
    <img
      :src="post.category === 'dota' ? dotaIcon : csIcon"
      alt="category"
      style="width: 40px"
    />
  </div>
  <div v-else>
    <p>Загрузка...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePostStore } from "@/stores/post";
import dotaIcon from "@/assets/images/dota_icon.svg";
import csIcon from "@/assets/images/cs_icon.svg";

const route = useRoute();
const postId = route.params.id;

const postStore = usePostStore();
const post = ref(null);

onMounted(async () => {
  post.value = await postStore.fetchPostById(postId); // загружаем пост
});
</script>
