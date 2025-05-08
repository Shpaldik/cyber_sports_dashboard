<template>
  <div class="profile-container">
    <h2 class="title">Личный кабинет</h2>

    <form @submit.prevent="updateProfile" class="form">
      <div class="form-group">
        <label>Никнейм:</label>
        <input type="text" v-model="form.name" />
      </div>
      <div class="form-group">
        <label>Email:</label>
        <input v-model="form.email" type="email" />
      </div>
      <div class="form-group">
        <label>Аватар:</label>
        <label class="file-upload">
          <span class="avatar-upload">Выберите изображение</span>
          <input type="file" @change="handleAvatarUpload" hidden />
        </label>
      </div>
      <div v-if="previewAvatar" class="avatar-preview">
        <img :src="previewAvatar" alt="preview" />
      </div>
      <button type="submit" class="btn">Сохранить изменения</button>
    </form>

    <hr />

    <form @submit.prevent="changePassword" class="form">
      <h3>Сменить пароль</h3>
      <div class="form-group">
        <input v-model="passwords.old_password" type="password" placeholder="Старый пароль" />
      </div>
      <div class="form-group">
        <input v-model="passwords.new_password" type="password" placeholder="Новый пароль" />
      </div>
      <div class="form-group">
        <input v-model="passwords.new_password_confirmation" type="password" placeholder="Подтвердите новый пароль" />
      </div>
      <button type="submit" class="btn alt">Обновить пароль</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: ''
})
const previewAvatar = ref(null)
const avatarFile = ref(null)

const passwords = ref({
  old_password: '',
  new_password: '',
  new_password_confirmation: ''
})

onMounted(async () => {
  try {
    const { data } = await api.get('/profile')
    form.value.name = data.name
    form.value.email = data.email
    previewAvatar.value = data.avatar_url
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error)
  }
})

const handleAvatarUpload = (e) => {
  avatarFile.value = e.target.files[0]
  previewAvatar.value = URL.createObjectURL(avatarFile.value)
}

const updateProfile = async () => {
  const formData = new FormData()
  formData.append('_method', 'PUT')
  formData.append('name', form.value.name)
  formData.append('email', form.value.email)
  if (avatarFile.value) {
    formData.append('avatar', avatarFile.value)
  }

  try {
    await api.post('/profile', formData)

    alert('Профиль обновлён!')
  } catch (error) {
    alert('Ошибка при обновлении профиля')
    console.error(error)
  }
}

const changePassword = async () => {
  try {
    await api.put('/profile/password', passwords.value)
    alert('Пароль обновлён!')
    passwords.value = {
      old_password: '',
      new_password: '',
      new_password_confirmation: ''
    }
  } catch (error) {
    alert('Ошибка при смене пароля')
    console.error(error)
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background: var(--secondary-color);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 24px;
  color:white;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
  color:white;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="file"] {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
}

.avatar-preview img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 8px;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #357ab8;
}

.btn.alt {
  background-color: #27ae60;
}

.btn.alt:hover {
  background-color: #1e8c4a;
}

.avatar-upload{
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
</style>
