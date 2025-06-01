import axios from 'axios'

const api = axios.create({
  baseURL: 'http://ruslad71.beget.tech/api',
  withCredentials: true,
})

export function setupInterceptors(authStore) {
  api.interceptors.request.use(config => {
    // 1. Сначала пытаемся взять token из уже восстановленного Pinia-state
    let token = authStore.token

    // 2. Если Pinia-store ещё не «наполнен» (например, сразу после F5), пробуем достать из localStorage
    if (!token) {
      const raw = localStorage.getItem('auth')
      console.log('[Axios] raw из localStorage[\'auth\']:', raw)

      if (raw) {
        try {
          const parsed = JSON.parse(raw)

          // Вариант A: если плагин хранит state «плоско» — parsed.token
          if (parsed.token) {
            token = parsed.token
          }
          // Вариант B: если плагин обёрнут state внутрь { state: { … } }
          else if (parsed.state && parsed.state.token) {
            token = parsed.state.token
          }

          // Если нашли token — пишем его в Pinia, чтобы дальше authStore.token уже был не null
          if (token) {
            authStore.token = token
          }
        } catch (e) {
          console.warn('[Axios] не удалось распарсить localStorage[\'auth\']:', e)
          token = null
        }
      }
    }

    // 3. Если всё-таки есть token — добавляем заголовок
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[Axios] Bearer из Pinia:', token)
    } else {
      console.log('[Axios] Bearer из Pinia: null')
    }

    return config
  }, error => {
    return Promise.reject(error)
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        authStore.logout()
        // По желанию можно полностью очищать весь сохранённый state:
        // localStorage.removeItem('auth')
      }
      return Promise.reject(error)
    }
  )
}

export default api
