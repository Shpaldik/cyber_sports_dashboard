<template>
  <Header />
  <div class="category-page">
    <h1>Dota 2 Новости</h1>

    <div class="search-fields">
    <div class="search-block">
      <input
        class="search-title"
        v-model="searchTitle"
        type="text"
        placeholder="Поиск по названию..."
      />
      <img class="search-icon" src="../assets/images/search.svg" alt="Поиск">
    </div>

      <input class="search-date" v-model="searchDate" type="date" placeholder="Дата" />
    </div>

    <div v-if="filteredPosts.length" class="news-list">
      <div v-for="post in filteredPosts" :key="post.id" class="news-card">
        <div class="news-info">
          <div class="news-title-block">
            <img
              class="category-icon"
              src="../assets/images/dota_icon.svg"
              alt="Dota 2"
            />
            <p class="news-title">{{ post.title }}</p>
          </div>
          <div class="news-meta">
            <span>{{ displayDate(post.created_at) }}</span>
            <p>{{ post.comments_count || 0 }}</p>
            <img src="../assets/images/comment.svg" alt="comment" />
          </div>
        </div>

        <div class="news-body">
          <img
            v-if="post.image"
            class="news-image"
            :src="`http://127.0.0.1:8000/storage/${post.image}`"
            alt="news"
          />
        </div>
      </div>
    </div>

    <div v-else class="no-news">
      <p>Нет новостей в категории Dota 2 по заданным критериям.</p>
    </div>
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import { ref, computed, onMounted } from "vue";
import { usePostStore } from "@/stores/post";

const postStore = usePostStore();
const searchTitle = ref("");
const searchDate = ref("");

onMounted(() => {
  postStore.fetchPostsByCategory("dota");
});

const filteredPosts = computed(() => {
  return postStore.posts
    .filter((p) => p.category === "dota")
    .filter((p) => p.title.toLowerCase().includes(searchTitle.value.toLowerCase()))
    .filter((p) => {
      if (!searchDate.value) return true;
      const postDate = new Date(p.created_at).toISOString().split("T")[0];
      return postDate === searchDate.value;
    });
});

function displayDate(iso) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yy} в ${hh}:${mi}`;
}
</script>

<style scoped>

.category-page {
  padding: 10px 15%;
  width: 100%;
  box-sizing: border-box;
  color: white;
}

.search-fields {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  gap: 1rem;
}

.search-title {
  position: relative;
  width: 100%;
  padding: 5px;
}

.search-block {
  position: relative;
}

.search-icon {
  position: absolute;
  top: 3px;
  right: 5px;
  width: 30px;
}

.search-date {
  width: 100%;
  max-width: 200px;
}

.search-fields input {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  color: black;
}

.news-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-card {
  border-radius: 16px;
  padding: 1rem;
}

.news-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-title-block {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 1rem;
}

.category-icon {
  width: 30px;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #fff;
}

.news-body {
  margin-top: 1rem;
}

.news-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.no-news {
  margin-top: 1.5rem;
  color: #ccc;
}
</style>
