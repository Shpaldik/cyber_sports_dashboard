import { defineStore } from 'pinia';
import api from '@/services/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    role: null,
  }),

  actions: {
    async register(formData) {
      try {
        const { data } = await api.post('/register', formData);
        if (data.status === 1) {
          this.user = data.data;
          this.token = data.data.token;
          this.role = data.data.role || 'user';
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

    async login(formData) {
      try {
        const { data } = await api.post('/login', formData);
        if (data.status === 1) {
          this.user = data.data;
          this.token = data.data.token;
          this.role = data.data.role || 'user';
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
    loadTokenFromStorage() {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedUser = localStorage.getItem('user');
      if (savedToken) {
        this.token = savedToken;
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
      if (savedRole) {
        this.role = savedRole;
      }
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    },

    // Выход
    logout() {
      this.user = null;
      this.token = null;
      this.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    },
  },

  persist: true,
});
