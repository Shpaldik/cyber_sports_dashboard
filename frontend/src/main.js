// resources/js/main.js

import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

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

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)

// НЕ вызываем authStore.loadTokenFromStorage() — Pinia-persist сам восстанавливает state
// const authStore = useAuthStore()
// authStore.loadTokenFromStorage()

app.mount('#app')
