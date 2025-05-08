<template>
    <div class="profile_block">
      <h1>Личный кабинет</h1>
      <div class="profile">
        <div class="profile_right">
          <div class="avatar_name">
            <img src="../assets/images/logo.svg" alt="" width="50" />
            <p>Имя</p>
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
import { ref } from 'vue'
import ProfileForm from './ProfileForm.vue'
const openSettings = ref(false)
  

  
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
</style>
  