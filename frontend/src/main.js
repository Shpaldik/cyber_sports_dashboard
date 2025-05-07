import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import Main from './pages/Main.vue'
import Register from './pages/auth/Register.vue'
import Login from './pages/auth/Login.vue'

const routes = [
    { path: '/', redirect: '/main' },
    { path: '/main', component: Main },
    { path: '/register', component: Register },
    { path: '/login', component: Login }
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
