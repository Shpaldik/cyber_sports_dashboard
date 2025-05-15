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
      <!-- info -->
      <div class="news-info">
        <div class="news-title-block">
          <img
            class="dota-icon"
            :src="activeTab === 'dota' ? dotaIcon : csIcon"
            alt="icon"
          />
          <p class="news-title">{{ post.title }}</p>
        </div>
        <div class="news-meta">
          <div class="comments_block">
            <span>{{ formatDate(post.created_at) }}</span>
            <p>{{ post.comments_count }}</p>
            <img src="../assets/images/comment.svg" alt="comment" />
          </div>
        </div>
      </div>

      <!-- body -->
      <div class="news-body">
        <router-link :to="`/${post.category}/${post.id}`">
          <img
            v-if="post.image"
            class="news-image"
            :src="`http://127.0.0.1:8000/storage/${post.image}`"
            alt="news"
          />
        </router-link>

        <!-- панель с 3 комментариями + форма -->
        <div class="comments-panel">
          <div
            v-for="c in post.recent_comments"
            :key="c.id"
            class="comment"
          >
            <img class="avatar" src="../assets/images/logo.svg" alt="avatar" />
            <div>
              <p>
                <strong>{{ c.user_name }}</strong>
                {{ formatTime(c.created_at) }}
              </p>
              <p>{{ c.body }}</p>
              <button @click.prevent="replyTo(post.id, c.id)">Ответить</button>
            </div>
          </div>

          <!-- Форма для залогиненных -->
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

    <!-- если нет постов в категории -->
    <div v-else class="news-card">
      <p style="padding:1rem; color:#ccc">
        Нет новостей в категории {{ activeTab }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { usePostStore } from '@/stores/post'
import { useAuthStore } from '@/stores/auth'
import dotaIcon from '../assets/images/dota_icon.svg'
import csIcon   from '../assets/images/cs_icon.svg'

const activeTab = ref('dota')
const postStore  = usePostStore()
const auth       = useAuthStore()

// для каждого post.id своё поле ввода
const newBodies = reactive({})

async function loadPosts(cat) {
  await postStore.fetchPostsByCategory(cat)
}

onMounted(() => loadPosts(activeTab.value))
watch(activeTab, loadPosts)

function switchTab(cat) {
  activeTab.value = cat
}

const filteredPosts = computed(() => postStore.posts)

function formatDate(iso) {
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2,'0')}.` +
         `${String(d.getMonth()+1).padStart(2,'0')}.` +
         `${d.getFullYear()} в ` +
         `${String(d.getHours()).padStart(2,'0')}:` +
         `${String(d.getMinutes()).padStart(2,'0')}`
}

function formatTime(iso) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2,'0')}:` +
         `${String(d.getMinutes()).padStart(2,'0')}`
}

function replyTo(postId, commentId) {
  // заглушка: можно скроллить к форме или переадресовывать
  console.log('Reply to', postId, commentId)
}

async function submitComment(postId) {
  const body = (newBodies[postId] || '').trim()
  if (!body) return

  const res = await postStore.addComment(postId, body)
  if (res.status === 1) {
    // очистим только что отправленный
    newBodies[postId] = ''
  } else {
    alert('Ошибка: ' + (res.message || '…'))
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

.new-comment {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin: .5rem 0;
}
.new-comment textarea {
  width: 100%;
  border-radius: 8px;
  padding: .5rem;
  resize: vertical;
  background: #222;
  color: #fff;
  border: 1px solid #444;
}
.new-comment button {
  align-self: flex-end;
  padding: .5rem 1rem;
  border-radius: 8px;
  background: #6c63ff;
  color: white;
  border: none;
  cursor: pointer;
}
.new-comment button:disabled {
  opacity: .5;
  cursor: not-allowed;
}
</style>
