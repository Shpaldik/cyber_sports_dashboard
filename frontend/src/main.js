import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import Main from './pages/Main.vue'
import Register from './pages/auth/Register.vue'
import Login from './pages/auth/Login.vue'
import Profile from './pages/Profile.vue'
import AdminPanel from '@/pages/AdminPanel.vue'
import Cs_news from './pages/cs_news.vue'
import Dota_news from './pages/dota_news.vue'

const routes = [
    { path: '/', redirect: '/main' },
    { path: '/main', component: Main },
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/profile', component: Profile},
    { path: '/admin', component: AdminPanel },
    { path: '/cs_news', component: Cs_news},
    { path: '/dota_news', component: Dota_news},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const pinia = createPinia()

const app = createApp(App)


app.use(pinia)
app.use(router)


const authStore = useAuthStore()
authStore.loadTokenFromStorage()


app.mount('#app')
