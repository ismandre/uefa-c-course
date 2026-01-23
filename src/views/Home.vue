<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const inputName = ref('')
const isSubmitting = ref(false)

function handleSubmit() {
  const trimmedName = inputName.value.trim()
  if (trimmedName) {
    isSubmitting.value = true
    userStore.setName(trimmedName)
  }
}
</script>

<template>
  <div class="home-container">
    <div v-if="!userStore.hasName()" class="welcome-card">
      <h1>Welcome to UEFA C Course</h1>
      <p>Please enter your full name to get started</p>

      <form @submit.prevent="handleSubmit" class="name-form">
        <input
          v-model="inputName"
          type="text"
          placeholder="Enter your full name"
          required
          class="name-input"
          autofocus
        />
        <button type="submit" class="submit-button">Continue</button>
      </form>
    </div>

    <div v-else class="dashboard">
      <h1>Welcome back, {{ userStore.name }}!</h1>
      <p>Your learning dashboard will appear here.</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.welcome-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.welcome-card h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.welcome-card p {
  color: #606060;
  margin-bottom: 2rem;
}

.name-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.name-input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.name-input:focus {
  outline: none;
  border-color: #42b983;
}

.submit-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #359268;
}

.dashboard {
  text-align: center;
}

.dashboard h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.dashboard p {
  color: #606060;
}
</style>
