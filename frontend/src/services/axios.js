import axios from 'axios'
import { useAuthStore } from "@/stores/auth" // Импортируем хранилище для авторизации

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true // Позволяет работать с cookies
})

api.interceptors.request.use(config => {
  // Получаем токен из Pinia store или localStorage
  const authStore = useAuthStore()
  const token = authStore.token || localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}` // Добавляем токен в заголовок
  }
  return config
}, error => {
  return Promise.reject(error) // Если запрос не удался
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Если получили ошибку 401, очищаем токен
      const authStore = useAuthStore()
      authStore.logout()  // Можно добавить метод logout в store для очистки токена
      localStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default api
