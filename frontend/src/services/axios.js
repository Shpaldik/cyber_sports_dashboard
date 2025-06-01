// src/plugins/axios.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export function setupAxiosInterceptors() {
  const api = axios.create({
    baseURL: 'http://ruslad71.beget.tech/api',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  })

  api.interceptors.request.use(config => {
    const authStore = useAuthStore()
    console.log('[Axios] Bearer из Pinia:', authStore.token)
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.warn('[Axios] Получен 401 — сбрасываем Pinia-auth')
        useAuthStore().logout()
      }
      return Promise.reject(error)
    }
  )

  return api
}

const api = setupAxiosInterceptors()
export default api
