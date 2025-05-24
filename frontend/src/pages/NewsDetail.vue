<template>
  <Header />

  <div class="post-detail">
    <div class="post-header">
      <img
        class="dota-icon"
        :src="post.category === 'dota' ? dotaIcon : csIcon"
        alt="icon"
      />
      <h1>{{ post.title }}</h1>
    </div>

    <img
      v-if="post.image"
      class="news-image"
      :src="
        isUrl(post.image) ? post.image : `http://127.0.0.1:8000/storage/${post.image}`
      "
      alt="news"
    />

    <p class="post-body">Описание:</p>
    <p>{{ post.body }}</p>
  </div>

  <!-- Комментарии -->
  <div v-if="post.comments" class="comments-section">
    <h2>Комментарии ({{ post.comments.length }}):</h2>

    <!-- Список комментариев с прокруткой -->
    <div class="comments-list">
      <div v-for="c in post.comments" :key="c.id" class="comment">
        <img
          class="avatar"
          :src="
            (c.user && c.user.avatar_url) ||
            (c.user && c.user.avatar) ||
            '/default-avatar.png'
          "
          alt="avatar"
        />

        <div class="comment-body">
          <p class="author">
            <strong>
              {{ (c.user && c.user.name) || c.user_name }}
            </strong>
            <span class="time">{{ formatTime(c.created_at) }}</span>
          </p>
          <p>{{ c.body }}</p>
          <button class="delete" v-if="role === 'admin'" @click="handleDelete(c.id)">
            Удалить
          </button>
        </div>
      </div>
    </div>

    <!-- Форма добавления комментария -->
    <div v-if="auth.token && auth.user" class="new-comment">
      <textarea
        v-model="newComment"
        placeholder="Оставить комментарий…"
        rows="3"
      ></textarea>
      <button :disabled="!newComment.trim()" @click="submitComment">Отправить</button>
    </div>

    <p v-else class="login-prompt">Войдите, чтобы оставить комментарий.</p>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import api from "@/services/axios";
import { usePostStore } from "@/stores/post";
import { useAuthStore } from "@/stores/auth";

import dotaIcon from "../assets/images/dota_icon.svg";
import csIcon from "../assets/images/cs_icon.svg";

const route = useRoute();
const post = ref({ comments: [] });
const activeTab = ref("dota");
const newComment = ref("");

const postStore = usePostStore();
const auth = useAuthStore();
const role = computed(() => auth.user?.role);

// загрузка поста
onMounted(async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`);
    post.value = res.data.data;
    // гарантируем, что это массив
    post.value.comments = Array.isArray(post.value.comments) ? post.value.comments : [];
  } catch (err) {
    console.error("Ошибка при получении поста:", err);
  }
});

//форматирование даты
function formatTime(iso) {
  const d = new Date(iso);
  return (
    `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )} ` +
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  );
}

// отправка новых комментариев
async function submitComment() {
  const body = newComment.value.trim();
  if (!body) return;

  try {
    const res = await postStore.addComment(post.value.id, body);

    if (res.status === 1) {
      newComment.value = "";
      // перезагрузка поста и комментарии
      const refreshed = await api.get(`/posts/${post.value.id}`);
      post.value = refreshed.data.data;
      post.value.comments = Array.isArray(post.value.comments) ? post.value.comments : [];
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

const handleDelete = async (id) => {
  if (confirm("Вы точно хотите удалить комментарий?")) {
    await postStore.deleteComment(id);
  }
};

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}
</script>

<style scoped>
.post-detail {
  padding: 2rem;
  color: white;
  margin: 10px 13%;
  display: flex;
  flex-direction: column;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.post-image {
  width: 100%;
  margin-bottom: 20px;
}
.post-body {
  margin-top: 20px;
  font-weight: bold;
  font-size: 24px;
}
.dota-icon {
  width: 10vw;
  max-width: 64px;
}
.comments-section {
  margin: 2rem 13%;
  padding: 1rem;
  background-color: #1e1e1e;
  border-radius: 10px;
}
.comment {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
}
.avatar {
  width: 48px;
  height: 48px;
}
.comment p {
  margin: 0;
}
.time {
  margin-left: 0.5rem;
  font-size: 0.85em;
  color: #888;
}
.new-comment {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
}
.new-comment textarea {
  resize: none;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 8px;
  background-color: #2a2a2a;
  color: #fff;
  border: 1px solid #555;
  margin-bottom: 0.5rem;
}
.new-comment button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.new-comment button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.login-prompt {
  margin-top: 1rem;
  color: #aaa;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 1rem;
}
.comments-list::-webkit-scrollbar {
  width: 8px;
}
.comments-list::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
}
.comment {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.comment-body {
  flex: 1;
}
.author {
  margin: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.time {
  font-size: 0.85em;
  color: #888;
}

.delete {
  background: none;
  border: none;
  color: #6c63ff;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>
