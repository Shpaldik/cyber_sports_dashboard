<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content">
      <LoginForm />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;

  max-height: 100%;
}
</style>
