<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useClassesStore } from '@/stores/classes'
import ClassCard from '@/components/ClassCard.vue'

const userStore = useUserStore()
const classesStore = useClassesStore()
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
      <h1>Dobrodošli u UEFA C tečaj</h1>
      <p>Molimo unesite svoje puno ime za početak</p>

      <form @submit.prevent="handleSubmit" class="name-form">
        <input
          v-model="inputName"
          type="text"
          placeholder="Unesite svoje puno ime"
          required
          class="name-input"
          autofocus
        />
        <button type="submit" class="submit-button">Nastavi</button>
      </form>
    </div>

    <div v-else class="dashboard">
      <div class="dashboard-header">
        <h1>Moji predmeti</h1>
        <p>Pristupite materijalima i resursima za vaše predmete</p>
      </div>

      <div class="classes-grid">
        <ClassCard
          v-for="classItem in classesStore.classes"
          :key="classItem.id"
          :class-data="classItem"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 80vh;
  padding: 3rem 2rem;
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
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  color: #606060;
  font-size: 1.125rem;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  padding: 0;
}
</style>
