<template>
  <div class="popular-news">
    <div class="popular-header">
      <h1>Популярное</h1>
      <div class="tabs">
        <button :class="{ active: activeTab === 'dota' }" @click="switchTab('dota')">
          Dota 2
        </button>
        <button :class="{ active: activeTab === 'cs' }" @click="switchTab('cs')">
          CS 2
        </button>
      </div>
    </div>

    <!-- Перебираем все посты категории -->
    <div
      v-if="filteredPosts.length"
      class="news-card"
      v-for="post in filteredPosts"
      :key="post.id"
    >
      <div class="news-info">
        <div class="news-title-block">
          <img
            class="dota-icon"
            :src="activeTab === 'dota' ? dotaIcon : csIcon"
            alt="icon" loading="lazy"
          />
          <p class="news-title">{{ post.title }}</p>
        </div>
        <div class="news-meta">
          <div class="comments_block">
            <span>{{ displayDate(post.created_at) }}</span>
            <p>{{ post.comments_count || 0 }}</p>
            <img src="../assets/images/comment.svg" alt="comment" loading="lazy"/>
          </div>
        </div>
      </div>

      <div class="news-body">
      <router-link :to="`/${post.category}/${post.id}`">
        <img
          v-if="post.image"
          class="news-image"
          :src="`http://127.0.0.1:8000/storage/${post.image}`"
          alt="news"
          loading="lazy"
        />
        </router-link>

        <div class="comments-panel">
          <div class="comment" v-for="(c, i) in demoComments" :key="i">
            <img class="avatar" src="../assets/images/logo.svg" alt="avatar" loading="lazy"/>
            <div>
              <p>
                <strong>{{ c.user }}</strong> {{ c.time }}
              </p>
              <p>{{ c.text }}</p>
              <button>Ответить</button>
            </div>
          </div>
          <button class="see-all">Смотреть все</button>
        </div>
      </div>
    </div>

    <div v-else class="news-card">
      <p style="padding: 1rem; color: #ccc">Нет новостей в категории {{ activeTab }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { usePostStore } from "@/stores/post";
import dotaIcon from '../assets/images/dota_icon.svg';
import csIcon from '../assets/images/cs_icon.svg';

const activeTab = ref('dota');

const postStore = usePostStore();

const demoComments = [
  { user: "Иванов Иван", time: "17:12", text: "Не верю! Быть такого не может" },
  { user: "Петров Петр", time: "17:15", text: "Интересная теория 😄" },
];

// Загрузка постов по категории
async function loadCategory(cat) {
  await postStore.fetchPostsByCategory(cat);
}

onMounted(() => loadCategory(activeTab.value));
watch(activeTab, loadCategory);

function switchTab(cat) {
  activeTab.value = cat;
}

// Отфильтровываем посты по активной категории
const filteredPosts = computed(() =>
  postStore.posts.filter((p) => p.category === activeTab.value)
);

// Вспомогательная функция форматирования даты
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
.popular-news {
  width: 100%;
  box-sizing: border-box;
  color: white;
}
.popular-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.tabs {
  display: flex;
  gap: 1rem;
}
.tabs button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
  background: #444;
  color: #aaa;
}
.tabs button.active {
  background: var(--btn-color);
  color: white;
}
.news-card {
  border-radius: 16px;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
.dota-icon {
  width: 30px;
}
.news-meta .comments_block {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #fff;
}
.news-body {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.news-image {
  width: 100%;
  max-width: 65%;
  border-radius: 12px;
  object-fit: cover;
  flex: 1;
}
.comments-panel {
  background: rgba(13, 9, 28, 0.3);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 0 0 30%;
  max-width: 400px;
  min-width: 280px;
}
.comment {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.comment p {
  margin: 0.1rem 0;
}
.comment button {
  background: none;
  border: none;
  color: #6c63ff;
  cursor: pointer;
  font-size: 0.85rem;
}
.see-all {
  margin-top: 0.5rem;
  background: #2d2dff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  align-self: flex-start;
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 768px) {
  .popular-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .news-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .news-body {
    flex-direction: column;
  }
  .news-image,
  .comments-panel {
    max-width: 100%;
  }
}
</style>
