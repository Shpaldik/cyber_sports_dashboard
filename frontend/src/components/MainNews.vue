<template>
    <div class="MainNews_container">
      <h1>Главные новости</h1>
      <div class="MainNews_items">
        <img class="news_icon" src="../assets/images/dota_icon.svg" alt="Dota icon">
        <div class="news_content">
          <p class="news_text">
            AVULUS проиграла Talon Esports и покинула FISSURE PLAYGROUND Belgrade 2025
          </p>
          <div class="news_meta">
            <time datetime="21.01.2025">21.01.2025</time>
            <div class="comments_block">
              <p>24</p>
              <img src="../assets/images/comment.svg" alt="comment">
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
  <style scoped>
  .MainNews_container {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;
  }
  
  .MainNews_items {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
    margin-top: 20px;

  }
  
  .news_icon {
    width: 60px;
    height: auto;
    flex-shrink: 0;
  }
  
  .news_content {
    flex: 1;
    min-width: 200px;
  }
  
  .news_text {
    font-size: 1rem;
    margin: 0 0 10px 0;
  }
  
  .news_meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    font-size: 0.9rem;
    color: #D0D0D0;
  }
  
  .comments_block {
    display: flex;
    gap: 5px;
    align-items: center;
    color:white;
  }
  
  .comments_block img {
    width: 16px;
    height: 16px;
  }
  
  /* Адаптация под маленькие экраны */
  @media (max-width: 600px) {
    .MainNews_items {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .news_icon {
      width: 40px;
    }
  
    .news_text {
      font-size: 0.95rem;
    }
  
    .news_meta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  </style>
  