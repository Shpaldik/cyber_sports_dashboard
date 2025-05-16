<template>
  <Header />
  <div class="category-page">
    <h1>Новости Dota</h1>

    <!-- === Поиск === -->
    <div class="search-fields">
      <div class="search-block">
        <input
          class="search-title"
          v-model="searchTitle"
          type="text"
          placeholder="Поиск по названию..."
        />
        <img class="search-icon" src="../assets/images/search.svg" alt="Поиск" />
      </div>
      <input class="search-date" v-model="searchDate" type="date" placeholder="Дата" />
    </div>

    <!-- === Список новостей === -->
    <div v-if="filteredPosts.length" class="news-list">
      <div v-for="post in filteredPosts" :key="post.id" class="news-card">
        <!-- заголовок + метадата -->
        <div class="news-info">
          <div class="news-title-block">
            <img class="category-icon" src="../assets/images/dota_icon.svg" alt="CS 2" />
            <p class="news-title">{{ post.title }}</p>
          </div>
          <div class="news-meta">
            <span>{{ displayDate(post.created_at) }}</span>
            <p>{{ post.comments_count }}</p>
            <img src="../assets/images/comment.svg" alt="comment" />
          </div>
        </div>

        <!-- картинка новости -->
        <div class="news-body">
          <img
            v-if="post.image"
            class="news-image"
            :src="`http://127.0.0.1:8000/storage/${post.image}`"
            alt="news"
          />
        </div>

        <!-- панель с 3 комментариями + форма -->
        <div class="comments-panel">
          <div v-for="c in post.recent_comments" :key="c.id" class="comment">
            <img class="avatar" src="../assets/images/logo.svg" alt="avatar" />
            <div>
              <p>
                <strong>{{ c.user_name }}</strong>
                {{ formatTime(c.created_at) }}
              </p>
              <p>{{ c.body }}</p>
            </div>
          </div>

          <!-- Форма (для авторизованных) -->
          <div v-if="auth.token && auth.user" class="new-comment">
            <textarea
              v-model="newBodies[post.id]"
              placeholder="Оставить комментарий…"
              rows="2"
            ></textarea>
            <button
              :disabled="!newBodies[post.id]?.trim()"
              @click="submitComment(post.id)"
            >
              Отправить
            </button>
          </div>

          <router-link :to="`/${post.category}/${post.id}`">
            <button class="see-all">Смотреть все</button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- если нет новостей -->
    <div v-else class="no-news">
      <p>Нет новостей в категории CS 2 по заданным критериям.</p>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { usePostStore } from "@/stores/post";
import { useAuthStore } from "@/stores/auth";

import csIcon from "../assets/images/cs_icon.svg";
import dotaIcon from "../assets/images/dota_icon.svg"; // не обязательно, но можно

const postStore = usePostStore();
const auth = useAuthStore();

const searchTitle = ref("");
const searchDate = ref("");
const newBodies = reactive({}); // для каждого post.id своё поле ввода

onMounted(() => {
  postStore.fetchPostsByCategory("cs");
});

const filteredPosts = computed(() =>
  postStore.posts
    .filter((p) => p.category === "cs")
    .filter((p) => p.title.toLowerCase().includes(searchTitle.value.toLowerCase()))
    .filter((p) => {
      if (!searchDate.value) return true;
      const postDate = new Date(p.created_at).toISOString().split("T")[0];
      return postDate === searchDate.value;
    })
);

function displayDate(iso) {
  const d = new Date(iso);
  return (
    `${String(d.getDate()).padStart(2, "0")}.` +
    `${String(d.getMonth() + 1).padStart(2, "0")}.` +
    `${d.getFullYear()} в ` +
    `${String(d.getHours()).padStart(2, "0")}:` +
    `${String(d.getMinutes()).padStart(2, "0")}`
  );
}

function formatTime(iso) {
  const d = new Date(iso);
  return (
    `${String(d.getHours()).padStart(2, "0")}:` +
    `${String(d.getMinutes()).padStart(2, "0")}`
  );
}

async function submitComment(postId) {
  const body = (newBodies[postId] || "").trim();
  if (!body) return;

  try {
    const res = await postStore.addComment(postId, body);

    if (res.status === 1) {
      newBodies[postId] = "";
    } else {
      alert("Ошибка: " + (res.message || "…"));
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("Вы забанены и не можете оставлять комментарии.");
    } else {
      alert("Ошибка при отправке комментария.");
      console.error(error);
    }
  }
}
</script>

<style scoped>
.category-page {
  padding: 10px 15%;
  color: white;
}
.search-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.search-block {
  position: relative;
}
.search-title {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.search-icon {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 24px;
}
.search-date {
  width: 200px;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
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
  background: #1e1e1e;
}
.news-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.news-title-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.category-icon {
  width: 30px;
}
.news-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.news-body {
  margin-top: 1rem;
}
.news-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
}
.comments-panel {
  margin-top: 1rem;
  background: rgba(13, 9, 28, 0.3);
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.comment {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.new-comment {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.new-comment textarea {
  width: 100%;
  border-radius: 8px;
  padding: 0.5rem;
  resize: vertical;
  background: #222;
  color: #fff;
  border: 1px solid #444;
}
.new-comment button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #6c63ff;
  color: white;
  border: none;
  cursor: pointer;
}
.new-comment button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.no-news {
  margin-top: 1.5rem;
  color: #ccc;
}
</style>
