import { defineStore } from 'pinia'
import api from '@/services/axios'

export const usePostStore = defineStore('post', {
  state: () => ({ posts: [] }),
  actions: {
    async fetchPosts() {
      const res = await api.get('/posts')
      this.posts = res.data.data.data
    },
    async fetchPostsByCategory(category) {
      const res = await api.get(`/posts?category=${category}`)
      this.posts = res.data.data.data
    },
    async deletePost(id) {
      const res = await api.delete(`/posts/${id}`)
      if (res.data.status === 1) {
        this.posts = this.posts.filter(p => p.id !== id)
      }
    }
  }
})
