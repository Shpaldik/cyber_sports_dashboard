// src/stores/auth.js
import { defineStore } from 'pinia'
import { setupAxiosInterceptors } from '@/services/axios' // Импортируем функцию

const api = setupAxiosInterceptors()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    role: null,
  }),
  actions: {
    async register(formData) {
      const { data } = await api.post('/register', formData)
      if (data.status === 1) {
        this.user  = data.data
        this.token = data.data.token
        this.role  = data.data.role || 'user'
      }
      return data
    },
    async login(formData) {
      const { data } = await api.post('/login', formData)
      if (data.status === 1) {
        this.user  = data.data
        this.token = data.data.token
        this.role  = data.data.role || 'user'
      }
      return data
    },
    logout() {
      this.user  = null
      this.token = null
      this.role  = null
    },
  },
  persist: {
    key: 'auth',
    storage: localStorage,
  },
})

export default useAuthStore