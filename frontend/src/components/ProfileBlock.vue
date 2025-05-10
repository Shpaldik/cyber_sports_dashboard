<template>
    <div class="profile_block">
      <h1>Личный кабинет</h1>
      <div class="profile">
        <div class="profile_right">
          <div class="avatar_name">
            <img class="avatar" :src="user.avatar_url || '../assets/images/logo.svg'" alt="avatar" width="80"/>
            <p class="name">{{ user.name || 'Имя' }}</p>
          </div>
        </div>
  
        <div class="profile_left">
          <div class="settings">
            <button class="btn" type="button" @click="openSettingsHandle"><img src="../assets/images/settings.svg" alt="settings" width="30" /><p>Настройки профиля</p></button>
          </div>
        </div>
      </div>
  
      <div v-if="openSettings" class="settings-panel">
        <ProfileForm />
      </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import ProfileForm from './ProfileForm.vue'
import api from '@/services/axios'

const openSettings = ref(false)
const user = ref({
  name: '',
  avatar_url: ''
})

const fetchProfile = async () => {
  try {
    const { data } = await api.get('/profile')
    user.value.name = data.name
    user.value.avatar_url = data.avatar_url
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
  }
}

onMounted(fetchProfile)

const openSettingsHandle = () => {
  openSettings.value = !openSettings.value
}
</script>

  
<style scoped>
  .profile_block {
    max-width: 1122px;
    width: 100%;
    margin: 20px auto;
    padding: 24px;
    border-radius: 16px;
  }
  
  .profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .avatar_name {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .settings {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .settings-panel {
    margin-top: 20px;
    padding: 16px;
    border-radius: 8px;
  }

  .btn{
    display: flex;
    align-items: center;
    background: var(--btn-color);
    color: #fff;
    padding: 8px 30px;
    border-radius: 10px;
    font-weight: bold;
    font-size: 16px;

    gap: 5px;
  }

  .avatar{
    border-radius: 100%;
  
  }

  .name{
    font-size: 20px;
    font-weight: bold;
  }
</style>
  