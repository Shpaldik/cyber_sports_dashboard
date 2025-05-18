<template>
  <div class="page-wrapper">
    <Header />

    <div class="main-content">
      <MainNews />
      <PopularNews class="popular-news" />
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Header from "../components/Header.vue";
import MainNews from "../components/MainNews.vue";
import Footer from "../components/Footer.vue";
import PopularNews from "@/components/PopularNews.vue";
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  padding: 10px 15%;
  flex-grow: 1;
}

.popular-news {
  margin-top: 20px;
}
</style>
