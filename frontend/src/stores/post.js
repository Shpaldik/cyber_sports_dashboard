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
      const res = await api.get('/posts', { params: { category } })
      // Laravel-пагинация: data.data.data — это массив
      this.posts = res.data.data.data.map(p => ({
        ...p,
        // переименуем comments → recent_comments
        recent_comments: p.comments || [],
        comments_count: p.comments_count || 0
      }))
    },
    async deletePost(id) {
      const res = await api.delete(`/posts/${id}`)
      if (res.data.status === 1) {
        this.posts = this.posts.filter(p => p.id !== id)
      }
    },

     async addComment(postId, body) {
      const res = await api.post(`/posts/${postId}/comments`, { body })
      if (res.data.status === 1) {
        // обновляем локально:
        const post = this.posts.find(p => p.id === postId)
        if (post) {
          // пушим в начало recent_comments
          post.recent_comments.unshift(res.data.data)
          post.comments_count++
          // держим только 3
          post.recent_comments = post.recent_comments.slice(0, 3)
        }
      }
      return res.data
    }
  }
})
