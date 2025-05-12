<template>
  <Header />
  <div class="category-page">
    <h1>CS 2 Новости</h1>

    <!-- Поля поиска -->
    <div class="search-fields">
      <input v-model="searchTitle" type="text" placeholder="Поиск по названию..." />
      <input v-model="searchDate" type="date" placeholder="Поиск по дате публикации..." />
    </div>

    <!-- Список отфильтрованных новостей -->
    <div v-if="filteredPosts.length" class="news-list">
      <div v-for="post in filteredPosts" :key="post.id" class="news-card">
        <div class="news-info">
          <div class="news-title-block">
            <img class="category-icon" src="../assets/images/cs_icon.svg" alt="CS 2" />
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
      <p>Нет новостей в категории CS 2 по заданным критериям.</p>
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
  postStore.fetchPostsByCategory("cs");
});

const filteredPosts = computed(() => {
  return postStore.posts
    .filter((p) => p.category === "cs")
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
  padding: 10px 5rem;

  box-sizing: border-box;
  color: white;
}
.search-fields {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-fields input {
  padding: 0.5rem;
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
  background: #000;
}

.news-body {
  margin-top: 1rem;
}

.news-image {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  object-fit: cover;
}

.no-news {
  margin-top: 1.5rem;
  color: #ccc;
}
</style>
