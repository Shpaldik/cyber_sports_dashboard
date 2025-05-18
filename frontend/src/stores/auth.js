import { defineStore } from 'pinia';
import api from '@/services/axios';

// Хранилище авторизации (логин, регистрация, выход, загрузка токена)
export const useAuthStore = defineStore('auth', {
  // === Состояние ===
  state: () => ({
    user: null,   // Объект с данными текущего пользователя
    token: null,  // JWT токен авторизации
    role: null,   // Роль пользователя (например: 'user', 'admin')
  }),

  actions: {
    // === Регистрация пользователя ===
    async register(formData) {
      try {
        const { data } = await api.post('/register', formData);

        // Если регистрация успешна
        if (data.status === 1) {
          this.user = data.data;
          this.token = data.data.token;
          this.role = data.data.role || 'user';

          // Сохраняем в localStorage для автологина при следующем заходе
          localStorage.setItem('token', this.token);
          localStorage.setItem('role', this.role);
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        return data;
      } catch (error) {
        console.error(error); // В случае ошибки логируем её
        return null;
      }
    },

    // === Авторизация пользователя ===
    async login(formData) {
      try {
        const { data } = await api.post('/login', formData);

        // Если логин успешен — сохраняем пользователя и токен
        if (data.status === 1) {
          this.user = data.data;
          this.token = data.data.token;
          this.role = data.data.role || 'user';

          // Сохраняем токен и данные в браузере
          localStorage.setItem('token', this.token);
          localStorage.setItem('role', this.role);
          localStorage.setItem('user', JSON.stringify(this.user));
        }
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    // === Загрузка токена и пользователя из localStorage (при обновлении страницы) ===
    loadTokenFromStorage() {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedUser = localStorage.getItem('user');

      if (savedToken) {
        this.token = savedToken;
        // Добавляем токен в заголовки для всех будущих API-запросов
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
      if (savedRole) {
        this.role = savedRole;
      }
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    },

    // === Выход пользователя из системы ===
    logout() {
      this.user = null;
      this.token = null;
      this.role = null;

      // Удаляем все сохранённые данные из браузера
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
  },

  // === Автоматическое сохранение состояния в localStorage (через pinia-plugin-persist) ===
  persist: true,
});
