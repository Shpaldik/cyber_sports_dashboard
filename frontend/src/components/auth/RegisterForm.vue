<template>
  <div class="register-page">
    <div class="register-container">
      <div class="form-block">
        <h1>Регистрация</h1>

        <form @submit.prevent="handleRegister" class="register-form">
          <input type="text" v-model="name" placeholder="Ваш никнейм" />
          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Пароль" />
          <button type="submit">Зарегистрироваться</button>
          <p v-if="errorMessage" class="error_message">{{ errorMessage }}</p>
        </form>

        <label class="checkbox-container">
          <input type="checkbox" v-model="acceptedPrivacy" />
          <span
            >Я подтверждаю свое согласие на обработку
            <strong>персональных данных</strong></span
          >
        </label>

        <p class="login-link-1">Уже есть аккаунт?</p>
        <RouterLink to="/login"><p class="login-link-2">Войти</p></RouterLink>
      </div>

      <div class="image-block">
        <img src="../../assets/images/register_icon.svg" alt="login character" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const name = ref(""); // Имя
const email = ref(""); // Email
const password = ref(""); // Пароль
const errorMessage = ref(""); // Сообщение об ошибке
const authStore = useAuthStore(); // Хранилище авторизации
const route = useRouter(); // Роутер
const acceptedPrivacy = ref(false); // Согласие на обработку персональных данных

// Регистрация
const handleRegister = async () => {
  errorMessage.value = "";

  if (!name.value || !email.value || !password.value) {
    errorMessage.value = "Требуется все поля!";
    return;
  }

  if (!acceptedPrivacy.value) {
    errorMessage.value = "Требуется согласие на обработку персональных данных";
    return;
  }

  if (password.value.length < 5) {
    errorMessage.value = "Пароль должен быть не менее 5 символов";
    return;
  }

  try {
    const res = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (res && res.status === 1) {
      route.push("/main");
    } else if (res && res.status === 0) {
      errorMessage.value = "Пользователь уже существует";
    } else {
      errorMessage.value = "Регистрация не удалась";
    }
  } catch (error) {
    errorMessage.value = "Произошла ошибка регистрации";
  }
};
</script>

<style scoped>
.register-page {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 10px;
  box-sizing: border-box;
}

.register-container {
  display: flex;
  justify-content: center;
  gap: 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.form-block {
  display: flex;
  flex-direction: column;
  max-width: 450px;
  width: 100%;
  gap: 5px;
}

.form-block h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: bold;
  margin-bottom: 10px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.register-form input {
  padding: 14px 20px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  outline: none;
  color: var(--primary-color);
}

.register-form button {
  background-color: #5d3bee;
  color: white;
  font-size: 16px;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.register-form button:hover {
  background-color: #4c33c1;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.4;
}

.checkbox-container input[type="checkbox"] {
  transform: scale(1.1);
  margin-top: 4px;
}

.login-link-1 {
  font-size: 14px;
  color: white;
}

.login-link-2 {
  font-size: 14px;
  color: white;
  text-decoration: underline;
}

.login-link a {
  color: white;
  text-decoration: underline;
  font-weight: 500;
}

.image-block img {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.error_message {
  color: red;
}

@media (max-width: 1024px) {
  .register-container {
    flex-direction: column;
  }

  .checkbox-container {
    justify-content: center;
  }

  .image-block {
    display: none;
  }
}
</style>
