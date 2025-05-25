<template>
  <div class="popular-news">
    <!-- === Шапка и табы === -->
    <div class="popular-header">
      <h1>Популярное</h1>
      <div class="tabs">
        <button :class="{ active: activeTab === 'dota' }" @click="switchTab('dota')">
          Dota 2
        </button>
        <button :class="{ active: activeTab === 'cs' }" @click="switchTab('cs')">
          CS 2
        </button>
      </div>
    </div>

    <!-- === Карточки новостей === -->
    <div
      v-if="filteredPosts.length"
      v-for="post in filteredPosts"
      :key="post.id"
      class="news-card"
    >
      <div class="news-info">
        <div class="news-title-block">
          <img
            class="dota-icon"
            :src="activeTab === 'dota' ? dotaIcon : csIcon"
            alt="icon"
          />
          <p class="news-title">{{ post.title }}</p>
        </div>
        <div class="rating-block">
          <!-- 1) Отображаем средний рейтинг (например, «4.2 (23)» ) -->
          <span class="avg-rating">
            {{ post.average_rating.toFixed(1) }}
            <small>({{ post.rating_count }})</small>
          </span>

          <!-- 2) Если пользователь авторизован, показываем «звёздочки» для оценки -->
          <!-- Показываем звёзды всегда -->
          <div class="stars">
            <template v-for="star in 5" :key="star">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :class="[
                  'star-icon',
                  {
                    filled: star <= (post.user_rating || Math.round(post.average_rating)),
                  },
                ]"
                @click="
                  () => {
                    if (auth.token && auth.user) setRating(post.id, star);
                  }
                "
                :style="{ cursor: auth.token && auth.user ? 'pointer' : 'default' }"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 19.771 4.665 24 6 15.6 0 9.753l8.332-1.735z"
                />
              </svg>
            </template>
          </div>
        </div>
        <div class="news-meta">
          <div class="comments_block">
            <span>{{ formatDate(post.created_at) }}</span>
            <p>{{ post.comments_count }}</p>
            <img src="../assets/images/comment.svg" alt="comment" />
          </div>
        </div>
      </div>

      <div class="news-body">
        <router-link :to="`/${post.category}/${post.id}`">
          <img
            v-if="post.image"
            class="news-image"
            :src="
              isUrl(post.image)
                ? post.image
                : `http://127.0.0.1:8000/storage/${post.image}`
            "
            alt="news"
          />
        </router-link>

        <div class="comments-panel">
          <div v-for="c in post.recent_comments" :key="c.id" class="comment">
            <img
              class="avatar"
              :src="
                (c.user && c.user.avatar_url) ||
                (c.user && c.user.avatar) ||
                '/default-avatar.png'
              "
              alt="avatar"
            />
            <div>
              <p>
                <strong>{{ c.user.name }}</strong>
                {{ formatTime(c.created_at) }}
              </p>
              <p>{{ c.body }}</p>
              <button v-if="role === 'admin'" @click="handleDelete(c.id)">Удалить</button>
            </div>
          </div>

          <div v-if="auth.token && auth.user" class="new-comment">
            <textarea
              v-model="newBodies[post.id]"
              placeholder="Оставить комментарий…"
              rows="2"
              :disabled="Boolean(Number(auth.user.banned))"
            ></textarea>

            <button
              :disabled="!newBodies[post.id]?.trim() || Boolean(Number(auth.user.banned))"
              @click="submitComment(post.id)"
            >
              Отправить
            </button>

            <p
              v-if="Boolean(Number(auth.user.banned))"
              style="color: red; margin-top: 0.3rem"
            >
              Вы забанены и не можете оставлять комментарии.
            </p>
          </div>

          <router-link :to="`/${post.category}/${post.id}`">
            <button class="see_all">Смотреть все</button>
          </router-link>
        </div>
      </div>
    </div>

    <div v-else class="news-card">
      <p class="no-news">Нет новостей в категории {{ activeTab }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { usePostStore } from "@/stores/post";
import { useAuthStore } from "@/stores/auth";
import dotaIcon from "../assets/images/dota_icon.svg";
import csIcon from "../assets/images/cs_icon.svg";

const activeTab = ref("dota");
const postStore = usePostStore();
const auth = useAuthStore();
const role = computed(() => auth.user?.role);

// Для каждого post.id своё поле ввода комментария
const newBodies = reactive({});

async function loadPosts(cat) {
  await postStore.fetchPostsByCategory(cat);
  // После загрузки постов можно сразу получить рейтинг каждого (если авторизован):
  if (auth.token && auth.user) {
    for (const p of postStore.posts) {
      await postStore.fetchPostRating(p.id);
    }
  }
}

onMounted(() => loadPosts(activeTab.value));
watch(activeTab, loadPosts);

function switchTab(cat) {
  activeTab.value = cat;
}

const filteredPosts = computed(() => {
  return [...postStore.posts].sort((a, b) => b.average_rating - a.average_rating);
});

function formatDate(iso) {
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

// Удаление комментария (как было раньше)
const handleDelete = async (id) => {
  if (confirm("Вы точно хотите удалить комментарий?")) {
    await postStore.deleteComment(id);
  }
};

// Функция выставления рейтинга пользователем
const setRating = async (postId, starValue) => {
  // Если не авторизован — ничего не делаем
  if (!auth.token || !auth.user) {
    alert("Только авторизованные пользователи могут ставить рейтинг.");
    return;
  }

  try {
    const res = await postStore.ratePost({ postId, rating: starValue });
    if (res.status !== 1) {
      alert("Не удалось сохранить рейтинг: " + (res.message || "…"));
    }
    // После успешной отправки метод ratePost в сторе уже обновит post.average_rating, post.rating_count и post.user_rating
  } catch (e) {
    console.error("Ошибка при установке рейтинга:", e);
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
.popular-news {
  width: 100%;
  box-sizing: border-box;
  color: white;
}

.popular-header {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
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
  background: rgba(255, 255, 255, 1);
  color: black;
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

.news-title {
  font-weight: bold;
  font-size: 1.2rem;
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
  flex-wrap: nowrap; /* Запрет обтекания */
  gap: 1rem;
  justify-content: space-between;
}

.news-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.comments-panel {
  flex: 1 1 35%;
  max-width: 55%;
  background: rgba(13, 9, 28, 0.3);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 280px;
  max-height: fit-content;
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

.see_all {
  background: white;
  width: 100%;
  padding: 10px;
  margin: 5px auto;

  border-radius: 16px;

  color: black;

  cursor: pointer;
  transition: all 0.3s ease;
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
    flex: unset;
  }
}

.new-comment {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0;
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

@media (max-width: 1024px) {
  .news-body {
    display: flex;
    flex-direction: column;
  }

  .comments-panel {
    max-width: 100%;
    width: 100%;
  }
}

.rating-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Средний рейтинг (число и кол-во голосов) */
.avg-rating {
  font-size: 0.9rem;
  color: #fff;
}

/* Контейнер звёздочек */
.stars {
  display: flex;
  gap: 2px;
  cursor: pointer;
}

/* Если неавторизованный — курсор по умолчанию */
.stars.readonly {
  cursor: default;
}

/* SVG-иконка звезды */
.star-icon {
  fill: #555; /* серый цвет по умолчанию */
  transition: fill 0.2s;
}

/* Залитая звезда */
.star-icon.filled {
  fill: #ffd700; /* «золотой» цвет */
}

/* При наведении, если можно голосовать */
.stars:hover .star-icon {
  fill: #ddd;
}
</style>
