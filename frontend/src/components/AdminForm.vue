<template>
  <Header />
  <div class="admin-wrapper">
    <h1 class="admin-title">Админ панель</h1>
    <p class="admin-subtitle">Управление новостями</p>

    <div class="form-card">
      <div class="form-header">
        <img
          @click="addNews = !addNews"
          src="../assets/images/plus.svg"
          alt="Добавить"
          width="40"
        />
        <h2 class="form-title">Добавить новость</h2>
      </div>

      <form
        v-if="addNews"
        @submit.prevent="addPost"
        class="form"
        enctype="multipart/form-data"
      >
        <input
          v-model="newPost.title"
          type="text"
          placeholder="Заголовок"
          class="form-input"
        />
        <textarea
          v-model="newPost.body"
          placeholder="Описание"
          class="form-textarea"
        ></textarea>
        <div class="btn-group">
          <select v-model="newPost.category" class="form-input-select">
            <option disabled value="">Выберите категорию</option>
            <option value="cs">CS</option>
            <option value="dota">Dota</option>
          </select>
          <label class="file-upload">
            <span class="avatar-upload">Выберите изображение</span>
            <input type="file" @change="handleImageUpload($event, 'newPost')" hidden />
          </label>
        </div>
        <button type="submit" class="btn btn-primary">Добавить новость</button>
      </form>
    </div>

    <div class="product-grid">
      <div v-for="post in postStore.posts" :key="post.id" class="product-card">
        <div class="product-header">
          <img
            class="dota-icon"
            :src="post.category === 'dota' ? dotaIcon : csIcon"
            alt="icon"
            width="40"
          />
          <h3 class="product-title">{{ post.title }}</h3>
        </div>

        <div class="btn-group">
          <button @click="startEdit(post)" class="btn btn-edit">
            <img src="../assets/images/edit_icon.svg" alt="edit" width="30" />
          </button>
          <button @click="deletePost(post.id)" class="btn btn-delete">
            <img src="../assets/images/delete_icon.svg" alt="delete" width="30" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="isEditing" class="modal-overlay">
      <div class="modal">
        <h2 class="form-title">Редактировать новость</h2>
        <form @submit.prevent="updatePost" class="form" enctype="multipart/form-data">
          <input
            v-model="editedPost.title"
            type="text"
            placeholder="Заголовок"
            class="form-input"
          />
          <textarea
            v-model="editedPost.body"
            placeholder="Описание"
            class="form-textarea"
          ></textarea>
          <select v-model="editedPost.category" class="form-input">
            <option value="cs">CS</option>
            <option value="dota">Dota</option>
          </select>
          <input
            type="file"
            @change="handleImageUpload($event, 'editedPost')"
            class="form-input"
          />
          <div class="btn-group">
            <button type="button" @click="cancelEdit" class="btn btn-cancel">
              Отменить
            </button>
            <button type="submit" class="btn btn-save">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
    <p class="admin-subtitle">Управление пользователями</p>

    <!-- === Список пользователей === -->
    <div class="user-grid">
      <div v-for="u in users" :key="u.id" class="user-card">
        <img :src="u.avatar_url" class="avatar" alt="avatar" />
        <h3>{{ u.name }}</h3>
        <p>{{ u.email }}</p>
        <p>Роль: {{ u.role }}</p>
        <p :class="{ banned: u.banned }">
          {{ u.banned ? "Забанен" : "Активен" }}
        </p>
        <div class="btn-group">
          <button @click="viewUser(u.id)" class="btn btn-view">View</button>
          <button
            @click="toggleBan(u.id)"
            :class="['btn', u.banned ? 'btn-unban' : 'btn-ban']"
          >
            {{ u.banned ? "Unban" : "Ban" }}
          </button>
        </div>
      </div>
    </div>

    <!-- === Модалка профиля === -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>Профиль пользователя</h2>
        <img :src="modalUser.avatar_url" class="avatar-large" />
        <p><strong>Имя:</strong> {{ modalUser.name }}</p>
        <p><strong>Email:</strong> {{ modalUser.email }}</p>
        <p><strong>Роль:</strong> {{ modalUser.role }}</p>
        <p><strong>Забанен:</strong> {{ modalUser.banned ? "Да" : "Нет" }}</p>
        <button class="btn btn-close" @click="closeModal">Закрыть</button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/axios";
import { useAuthStore } from "@/stores/auth";
import { usePostStore } from "@/stores/post";
import csIcon from "../assets/images/cs_icon.svg";
import dotaIcon from "../assets/images/dota_icon.svg";

// Хранилища и роутер
const authStore = useAuthStore();
const postStore = usePostStore();
const router = useRouter();

// Редирект, если не админ
if (authStore.role !== "admin") {
  router.push("/main");
}

// Управление пользователями
const users = ref([]);
const showModal = ref(false);
const modalUser = ref({});

const addNews = ref(false);
// Посты
const newPost = ref({ title: "", body: "", category: "", image: null });
const editedPost = ref({});
const isEditing = ref(false);

// Получение пользователей
async function fetchUsers() {
  try {
    const res = await api.get("/admin/users");
    if (res.data.status === 1) {
      users.value = res.data.data;
    }
  } catch (err) {
    console.error("Ошибка при получении пользователей:", err.response?.data || err);
  }
}

// Открытие модалки пользователя
async function viewUser(userId) {
  try {
    const res = await api.get(`/admin/users/${userId}`);
    if (res.data.status === 1) {
      modalUser.value = res.data.data;
      showModal.value = true;
    }
  } catch (err) {
    console.error("Ошибка при получении пользователя:", err.response?.data || err);
  }
}

function closeModal() {
  showModal.value = false;
  modalUser.value = {};
}

// Бан/разбан пользователя
async function toggleBan(userId) {
  try {
    const user = users.value.find((u) => u.id === userId);
    const res = await api.put(`/admin/users/${userId}/ban`);
    if (res.data.status === 1) {
      // Если API вернул обновлённого пользователя
      if (res.data.data) {
        Object.assign(user, res.data.data);
      } else {
        user.banned = user.banned ? 0 : 1;
      }
    }
  } catch (err) {
    console.error("Ошибка при бане/разбане:", err.response?.data || err);
  }
}

// Добавление поста
async function addPost() {
  const formData = new FormData();
  formData.append("title", newPost.value.title);
  formData.append("body", newPost.value.body);
  formData.append("category", newPost.value.category);
  if (newPost.value.image) {
    formData.append("image", newPost.value.image);
  }

  try {
    const res = await api.post("/posts", formData);
    if (res.data.status === 1) {
      postStore.posts.unshift(res.data.data);
      newPost.value = { title: "", body: "", category: "", image: null };
    }
  } catch (err) {
    console.error("Ошибка при добавлении поста:", err.response?.data || err);
  }
}

// Редактирование поста
function startEdit(post) {
  isEditing.value = true;
  editedPost.value = { ...post, image: null };
}

function cancelEdit() {
  isEditing.value = false;
  editedPost.value = {};
}

async function updatePost() {
  const formData = new FormData();
  formData.append("title", editedPost.value.title);
  formData.append("body", editedPost.value.body);
  formData.append("category", editedPost.value.category);
  if (editedPost.value.image) {
    formData.append("image", editedPost.value.image);
  }

  try {
    const res = await api.post(`/posts/${editedPost.value.id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.status === 1) {
      const idx = postStore.posts.findIndex((p) => p.id === editedPost.value.id);
      if (idx !== -1) postStore.posts[idx] = res.data.data;
      cancelEdit();
    }
  } catch (err) {
    console.error("Ошибка при обновлении поста:", err.response?.data || err);
  }
}

// Удаление поста
function deletePost(id) {
  postStore.deletePost(id);
}

// Обработка загрузки изображения
function handleImageUpload(e, target) {
  const file = e.target.files[0] || null;
  if (target === "newPost") {
    newPost.value.image = file;
  } else if (target === "editedPost") {
    editedPost.value.image = file;
  }
}

// onMounted
onMounted(() => {
  fetchUsers();
  postStore.fetchPosts();
});
</script>

<style scoped>
.admin-wrapper {
  min-height: 80vh;
  padding: 3rem clamp(1rem, 15vw, 15rem);
}

.admin-title {
  font-size: 2rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: bold;
}

.admin-subtitle {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1rem;
  font-weight: bold;
}

.form-header {
  display: flex;
  align-items: center;
}

.product-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
}

.form-title {
  color: white;
  font-size: 1.2rem;
}

.form {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.form-input,
.form-textarea {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  color: black;
  outline: none;
}

.form-input-select {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  color: black;
  outline: none;
  max-width: 200px;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: none;
  transition: background 0.3s ease;
}

.btn-primary {
  background-color: #4a90e2;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-edit:hover {
  background-color: #f59e0b;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.btn-cancel {
  background-color: #6b7280;
}

.btn-cancel:hover {
  background-color: #4b5563;
}

.btn-save {
  background-color: #22c55e;
}

.btn-save:hover {
  background-color: #16a34a;
}

.product-grid {
  width: 100%;
  gap: 2.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.product-card {
  background-color: rgba(13, 9, 28, 0.3);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-height: 400px;
  margin-top: 20px;
}

.product-title {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.btn-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.product-body,
.product-meta {
  color: #d1d5db;
  margin-bottom: 0.5rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background-color: rgba(0, 0, 0, 0.96);
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.avatar-upload {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.banned {
  color: red;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 1rem auto;
  display: block;
}

.user-grid {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  margin-top: 2rem;
}

.user-card {
  background-color: rgba(13, 9, 28, 0.3);
  padding: 1.5rem;
  border-radius: 0.75rem;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
</style>
