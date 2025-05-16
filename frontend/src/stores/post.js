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
  const res = await api.post(`/posts/${postId}/comments`, { body });
  if (res.data.status === 1) {
    const newComment = res.data.data;
    const post = this.posts.find(p => p.id === postId);

    if (post) {
      // ✅ Добавляем в recent_comments
      post.recent_comments = post.recent_comments || [];
      post.recent_comments.unshift(newComment);
      post.recent_comments = post.recent_comments.slice(0, 3);

      // ✅ Увеличиваем счётчик
      post.comments_count = (post.comments_count || 0) + 1;

      // ✅ Если есть полноценный список комментариев — добавляем и туда
      if (Array.isArray(post.comments)) {
        post.comments.unshift(newComment);
      }
    }
  }
  return res.data;
}


  }
})
