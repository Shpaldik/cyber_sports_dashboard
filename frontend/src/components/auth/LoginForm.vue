<template>
    <div class="login-page">
      <div class="login-container">
  
        <div class="form-block">
          <h1>Войти</h1>
  
          <form @submit.prevent="handleLogin" class="login-form">
            <input type="email" placeholder="Email" v-model="email" required/>
            <input type="password" placeholder="Пароль" v-model="password" required/>
            <button type="submit">Войти</button>
            <p v-if="errorMessage" class="error_message">{{ errorMessage }}</p>
          </form>
  
          <p class="register-link-1">
            Нет аккаунта?
          </p>
          <RouterLink to="/register" class="register-link-2">Зарегистрироваться</RouterLink>
        </div>
  
        <div class="image-block">
          <img class="login-icon" src="../../assets/images/login_icon.svg" alt="login character" />
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const errorMessage = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    const res = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (res && res.status === 1) {
      console.log('Logged in!')
      router.push('/main')
    } else {
      errorMessage.value = res?.message || 'Ошибка входа'
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Something went wrong'
    }
  }
}
</script>

  
  
<style scoped>
  .login-page {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 10px;
    box-sizing: border-box;
  }
  
  .login-container {
    display: flex;
    justify-content: center;
    gap: 80px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .form-block {
    display: flex;
    flex-direction: column;
    max-width: 450px;
    width: 100%;
    gap: 5px;
  }
  
  .form-block h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .login-form input {
    padding: 14px 20px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    outline: none;
  }
  
  .login-form button {
    background-color: #5d3bee;
    color: white;
    font-size: 16px;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .login-form button:hover {
    background-color: #4c33c1;
  }
  
  .register-link-1 {
    font-size: 14px;
    color: white;
  }
  
  .register-link-2 {
    font-size: 14px;
    color: white;
    text-decoration: underline;
  }
  
  .image-block img {
    width: 100%;
    max-width: 700px;
    height: auto;
  }

  .error_message {
    color: red;
  }
  
 @media (max-width: 930px) {
  .login-container {
    flex-direction: column;
    padding: 0 20px; /* ➕ Добавляем горизонтальные отступы */
    align-items: center; /* ➕ Центрируем форму */
  }

  .image-block {
    display: none;
  }
}

  </style>
  