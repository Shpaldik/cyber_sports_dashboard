<template>
    <header class="header">
      <div class="header_items">
        <div class="header_left">
          <div class="logo">
            <img src="../assets/images/logo.svg" alt="logo" width="50">
            <h1 class="title">CYBERSPORT</h1>
  
            <img @click="toggleMenu" class="burger_menu" src="../assets/images/burger.svg" alt="menu" width="30">
            <transition name="menu">
              <div v-if="menu" class="menu">
                <RouterLink to="/"><p>Главная</p></RouterLink>
                <p>Dota 2</p>
                <p>CS 2</p>
              </div>
            </transition>
          </div>
  
          <div class="nav-links">
            <RouterLink to="/" v-if="route.path !== '/'">
              <p>Главная</p>
            </RouterLink>
            <p>Dota 2</p>
            <p>CS 2</p>
          </div>
        </div>
  
        <div v-if="!isAuthenticated" class="header_right">
          <RouterLink to="/register" v-if="!isRegisterPage">
            <button class="register">Регистрация</button>
          </RouterLink>
          <RouterLink to="/login" v-if="!isLoginPage">
            <button class="login">Вход</button>
          </RouterLink>
        </div>
  
        <div v-else class="header_right">
          <RouterLink v-if="isAuthenticated" to="/profile"><img src="../assets/images/profile.svg" alt="avatar" width="30"></RouterLink>
          <button @click="logout" class="logout">Выход</button>
        </div>
      </div>
    </header>
</template>
  

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();

// Проверка, авторизован ли пользователь
const isAuthenticated = computed(() => {
  const authStore = useAuthStore();
  return !!authStore.token; // Если токен есть, значит авторизован
});

// Проверка текущей страницы для исключения активных ссылок
const isLoginPage = computed(() => route.name === 'login');
const isRegisterPage = computed(() => route.name === 'register');

// Выход из аккаунта
const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();  // Логика выхода
  router.push('/login');  // Перенаправление на страницу логина
};

// Логика для отображения бургера
const menu = ref(false);
const toggleMenu = () => {
  menu.value = !menu.value;
};
</script>



<style scoped>
.header {
    width: 100%;
    height: 80px;
    background-color: #00000038;
    display: flex;
    justify-content: center;
    align-items: center;
}

.header_items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%; 
    padding: 10px 10%;
}

.header_left {
    display: flex;
    align-items: center;
    gap: 60px;
    flex-wrap: wrap;
}

.header_right {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;
}

.header_right button {
    padding: 10px;
    border-radius: 5px;
    font-weight: 100;
    transform: scale(1);
    transition: 0.2s;
}

.header_right button:hover {
    background: var(--btn--hover-color);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.register {
    background: var(--btn-color);
}

.login {
    background: none;
}

.nav-links {
    display: flex;
    gap: 40px;
    justify-content: center; 
}

.nav-links p{
    color: white;
}

.burger_menu {
    display: none;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: black;
    color: white;
    margin-top: 60px;
    padding: 10px;
    border-radius: 5px;
    z-index: 20;
}

.menu p {
    cursor: pointer;
    color: white;
}

.menu-enter-active, .menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from, .menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.menu-enter-to, .menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.logout{
    background: red;
}

@media (max-width: 940px) {
    .header_items {
        display: flex;
        gap: 15px;
    }

    .nav-links {
        display: none;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }

    .burger_menu {
        display: block;
        cursor: pointer;
        margin-left: auto;
    }

    .title {
        display: none;
    }

    .menu-visible .nav-links {
        display: flex;
    }

    .menu-visible .header_right {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
