<template>
    <div class="popular-news">
      <div class="popular-header">
        <h1>Популярное</h1>
        <div class="tabs">
          <button class="active">Dota 2</button>
          <button class="tab">CS 2</button>
        </div>
      </div>
  
      <div class="news-card">
        <div class="news-info">
            <div class="news-title-block">
                <img class="dota-icon" src="../assets//images/dota_icon.svg" alt="">
                <p class="news-title">
                    Nix: «Я верю, что OG под стимуляторами играли на TI9»
                </p>
            </div>
  
            <div class="news-meta">

            <div class="comments_block">
                <span>27.01.2025 в 17:12</span>
                <p>24</p>
                <img src="../assets/images/comment.svg" alt="comment">
                </div>
            </div>

        </div>
  
        <div class="news-body">
          <img class="news-image" src="../assets/images/popular.svg" alt="OG celebrating" />
  
          <div class="comments-panel">
            <div class="comment">
              <img class="avatar" src="../assets/images/user-icon.png" alt="avatar" />
              <div>
                <p><strong>Иванов Иван</strong> 17:12</p>
                <p>Не верю! Быть такого не может</p>
                <button>Ответить</button>
              </div>
            </div>
            <div class="comment">
              <img class="avatar" src="../assets/images/user-icon.png" alt="avatar" />
              <div>
                <p><strong>Иванов Иван</strong> 17:12</p>
                <p>Не верю! Быть такого не может</p>
                <button>Ответить</button>
              </div>
            </div>
            <button class="see-all">Смотреть все</button>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <style scoped>
  .popular-news {
    width: 100%;
    box-sizing: border-box;
    color: white;
  }
  
  .popular-header {
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .tabs {
    display: flex;
    padding-top: 1rem;
    gap: 1rem;
  }
  
  .tab {
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    color: black;
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.2s ease;
  }
  
  .tabs .active{
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    color: white;
    background-color: var(--btn-color);
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.2s ease;
  }
  
  .news-card {
    border-radius: 16px;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .news-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  
  .dota-icon {
    width: 30px;
  }
  
  .news-title-block {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.4;
    gap: 10px;
  }
  
  .news-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #aaa;
  }
  
  /* FLEX-сетка: изображение слева, комменты справа */
  .news-body {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .news-image {
    width: 100%;
    max-width: 65%;
    height: auto;
    border-radius: 12px;
    object-fit: cover;
    flex: 1;
  }
  
  .comments-panel {
    background-color: rgba(13, 9, 28, 0.3);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 0 0 30%;
    max-width: 400px;
    min-width: 280px;
  }
  
  .comment {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .comments_block {
    display: flex;
    gap: 5px;
    align-items: center;
    color:white;
  }
  
  .comments_block img {
    width: 20px;
    height: 20px;
  }

  .comment p {
    margin: 0.1rem 0;
  }
  
  .comment button {
    background: none;
    border: none;
    color: #6c63ff;
    cursor: pointer;
    padding: 0;
    font-size: 0.85rem;
  }
  
  .see-all {
    margin-top: 0.5rem;
    background: #2d2dff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    align-self: flex-start;
    cursor: pointer;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    .popular-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .news-info{
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .news-body {
      flex-direction: column;
    }
  
    .news-image, .comments-panel {
      max-width: 100%;
    }
  }
  </style>
  