<template>
  <div class="page-wrapper">
    <Header />
    <main class="main-content">
      <RegisterForm />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import RegisterForm from "@/components/auth/RegisterForm.vue";
import Header from "@/components/Header.vue";
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
}
</style>
