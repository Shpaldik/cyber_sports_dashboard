import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import PiniaPersistedstate from 'pinia-plugin-persistedstate'
import { createRouter, createWebHashHistory } from 'vue-router'

import Main from './pages/Main.vue'
import Register from './pages/auth/Register.vue'
import Login from './pages/auth/Login.vue'
import Profile from './pages/Profile.vue'
import AdminPanel from '@/pages/AdminPanel.vue'
import Cs_news from './pages/cs_news.vue'
import Dota_news from './pages/dota_news.vue'
import NewsDetail from './pages/NewsDetail.vue'
import PrivacyPolicy from './pages/PrivacyPolicy.vue'
import UserAgreement from './pages/UserAgreement.vue'

import { useAuthStore } from '@/stores/auth'
import api, { setupInterceptors } from '@/services/axios'

const routes = [
  { path: '/', redirect: '/main' },
  { path: '/main', component: Main },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/profile', component: Profile },
  { path: '/admin', component: AdminPanel },
  { path: '/cs_news', component: Cs_news },
  { path: '/dota_news', component: Dota_news },
  { path: '/:category/:id', name: 'NewsDetail', component: NewsDetail },
  { path: '/privacypolicy', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/useragreement', name: 'UserAgreement', component: UserAgreement },
]

const app = createApp(App)

// 1) Создаём Pinia:
const pinia = createPinia()
// 2) Подключаем плагин persistedstate:
pinia.use(PiniaPersistedstate)
// 3) Регистрируем Pinia в приложении:
app.use(pinia)

// С этого момента Pinia-persist уже может загружать/сохранять state
// И только после этого делаем:
const authStore = useAuthStore()
setupInterceptors(authStore)

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
app.use(router)
app.mount('#app')
