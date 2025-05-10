<template>
  <Header />
  <div class="admin-wrapper">
    <h1 class="admin-title">Админ панель</h1>

    <div class="form-card">
      <h2 class="form-title">Добавить новость</h2>
      <form @submit.prevent="addPost" class="form" enctype="multipart/form-data">
        <input
          v-model="newPost.title"
          type="text"
          placeholder="Title"
          class="form-input"
        />
        <textarea
          v-model="newPost.body"
          placeholder="Body"
          class="form-textarea"
        ></textarea>
        <select v-model="newPost.category" class="form-input">
          <option disabled value="">Select Category</option>
          <option value="cs">CS</option>
          <option value="dota">Dota</option>
        </select>
        <input
          type="file"
          @change="handleImageUpload($event, 'newPost')"
          class="form-input"
        />
        <button type="submit" class="btn btn-primary">Add Post</button>
      </form>
    </div>

    <div class="product-grid">
      <div v-for="post in postStore.posts" :key="post.id" class="product-card">
        <h3 class="product-title">{{ post.title }}</h3>
        <p class="product-body">{{ post.body }}</p>
        <p class="product-meta">Category: {{ post.category }}</p>
        <img v-if="post.image" :src="`/storage/${post.image}`" class="product-img" />
        <div class="btn-group">
          <button @click="startEdit(post)" class="btn btn-edit">Edit</button>
          <button @click="deletePost(post.id)" class="btn btn-delete">Удалить</button>
        </div>
      </div>
    </div>

    <div v-if="isEditing" class="modal-overlay">
      <div class="modal">
        <h2 class="form-title">Edit Post</h2>
        <form @submit.prevent="updatePost" class="form" enctype="multipart/form-data">
          <input
            v-model="editedPost.title"
            type="text"
            placeholder="Title"
            class="form-input"
          />
          <textarea
            v-model="editedPost.body"
            placeholder="Body"
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
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/axios";
import { useAuthStore } from "@/stores/auth";
import { usePostStore } from "@/stores/post";

const authStore = useAuthStore();
const router = useRouter();
const postStore = usePostStore();

if (authStore.role !== "admin") {
  router.push("/main");
}

const newPost = ref({ title: "", body: "", category: "", image: null });
const editedPost = ref({});
const isEditing = ref(false);

onMounted(() => {
  postStore.fetchPosts();
});

// Handle file input
function handleImageUpload(e) {
  newPost.value.image = e.target.files[0] || null;
}

// Add a new post
async function addPost() {
  const formData = new FormData();
  formData.append("title", newPost.value.title);
  formData.append("body", newPost.value.body);
  formData.append("category", newPost.value.category);
  if (newPost.value.image) {
    formData.append("image", newPost.value.image);
  }

  try {
    // ВНИМАНИЕ: НЕ устанавливаем вручную Content-Type — браузер сам подставит нужный boundary
    const res = await api.post("/posts", formData);
    if (res.data.status === 1) {
      postStore.posts.unshift(res.data.data);
      newPost.value = { title: "", body: "", category: "", image: null };
    }
  } catch (err) {
    console.error("Error adding post:", err.response?.data || err);
  }
}

// Start editing
function startEdit(post) {
  isEditing.value = true;
  editedPost.value = { ...post, image: null };
}

// Cancel edit
function cancelEdit() {
  isEditing.value = false;
  editedPost.value = {};
}

// Update post
async function updatePost() {
  try {
    const formData = new FormData();
    formData.append("title", editedPost.value.title);
    formData.append("body", editedPost.value.body);
    formData.append("category", editedPost.value.category);
    if (editedPost.value.image) formData.append("image", editedPost.value.image);

    const res = await api.post(`/posts/${editedPost.value.id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.status === 1) {
      const idx = postStore.posts.findIndex((p) => p.id === editedPost.value.id);
      if (idx !== -1) postStore.posts[idx] = res.data.data;
      cancelEdit();
    }
  } catch (err) {
    console.error("Error updating post:", err);
  }
}

// Delete post
function deletePost(id) {
  postStore.deletePost(id);
}
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1f2937, #161e26);
  padding: 2rem;
}
.admin-title {
  text-align: center;
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
  font-weight: bold;
}
.form-card {
  background-color: #2a3b4e;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
}
.form-title {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}
.form {
  display: grid;
  gap: 1rem;
}
.form-input,
.form-textarea {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #4b5563;
  border: none;
  color: white;
  outline: none;
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
  transition: background 0.3s ease;
}
.btn-primary {
  background-color: #4a90e2;
}
.btn-primary:hover {
  background-color: #357abd;
}
.btn-edit {
  background-color: #fbbf24;
}
.btn-edit:hover {
  background-color: #f59e0b;
}
.btn-delete {
  background-color: #ef4444;
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
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.product-card {
  background-color: #2a3b4e;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}
.product-title {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.product-body,
.product-meta {
  color: #d1d5db;
  margin-bottom: 0.5rem;
}
.product-img {
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
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
  background-color: #2a3b4e;
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
</style>
