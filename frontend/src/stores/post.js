
import { defineStore } from 'pinia';
import api from '@/services/axios'; // Подключение настроенного axios для работы с API

export const usePostStore = defineStore('post', {
  // Состояние хранилища
  state: () => ({
    posts: [],     // Посты, отфильтрованные по категории (например, только CS2)
    allPosts: []   // Все посты, загруженные с сервера (нужно для админки или общего списка)
  }),

  actions: {
    // Загрузка всех постов с сервера (используется, например, в админке)
    async fetchPosts() {
      const res = await api.get('/posts');
      this.allPosts = res.data.data.data; // Присваиваем массив постов из ответа
    },

    // Загрузка постов по конкретной категории (например, "cs")
    async fetchPostsByCategory(category) {
      const res = await api.get('/posts', { params: { category } });
      // Сохраняем посты и добавляем в каждый:
      // - recent_comments (последние 3 комментария)
      // - comments_count (кол-во комментариев)
      this.posts = res.data.data.data.map(p => ({
        ...p,
        recent_comments: p.comments || [],
        comments_count: p.comments_count || 0
      }));
    },

    // Удаление поста по ID (используется в админке)
    async deletePost(id) {
      const res = await api.delete(`/posts/${id}`);
      if (res.data.status === 1) {
        // Удаляем пост из локального массива после успешного ответа
        this.posts = this.posts.filter(p => p.id !== id);
      }
    },

    // Добавление комментария к посту
    async addComment(postId, body) {
      const res = await api.post(`/posts/${postId}/comments`, { body });

      if (res.data.status === 1) {
        const newComment = res.data.data;
        const post = this.posts.find(p => p.id === postId);

        if (post) {
          // Обновляем список последних комментариев (макс. 3)
          post.recent_comments = post.recent_comments || [];
          post.recent_comments.unshift(newComment);
          post.recent_comments = post.recent_comments.slice(0, 3);

          // Увеличиваем счётчик комментариев
          post.comments_count = (post.comments_count || 0) + 1;

          // Если есть полный список комментариев — добавляем и туда
          if (Array.isArray(post.comments)) {
            post.comments.unshift(newComment);
          }
        }
      }
      
      return res.data; // Возвращаем ответ для возможной обработки в компоненте
    },

async deleteComment(commentId) {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    if (res.data.status === 1) {
      // находим пост, у которого есть этот комментарий
      const targetPost = this.posts.find(post =>
        post.recent_comments.some(c => c.id === commentId)
      );

      if (targetPost) {
        // Удаляем комментарий из recent_comments
        targetPost.recent_comments = targetPost.recent_comments.filter(c => c.id !== commentId);

        // Уменьшаем счётчик ---- если он больше 0
        if (typeof targetPost.comments_count === 'number' && targetPost.comments_count > 0) {
          targetPost.comments_count--;
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при удалении комментария:', error);
  }
}


  }
});
