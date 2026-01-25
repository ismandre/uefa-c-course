<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  error.value = ''
  isLoading.value = true

  const result = await adminStore.login(email.value, password.value)

  isLoading.value = false

  if (result.success) {
    router.push('/admin/analytics')
  } else {
    error.value = 'Neuspješna prijava. Provjerite email i lozinku.'
  }
}
</script>

<template>
  <div class="admin-login-container">
    <div class="login-card">
      <h1>Admin prijava</h1>
      <p class="subtitle">Pristup analitici aplikacije</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="input-field"
          />
        </div>

        <div class="form-group">
          <label for="password">Lozinka</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="input-field"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? 'Prijavljivanje...' : 'Prijavi se' }}
        </button>
      </form>

      <div class="back-link-container">
        <RouterLink to="/" class="back-link">← Povratak na početnu</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.login-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: #606060;
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.input-field {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: border-color 0.3s;
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  padding: 0.75rem 1rem;
  background-color: #f8d7da;
  border: 1px solid #dc3545;
  border-radius: 8px;
  color: #721c24;
  font-size: 0.9rem;
}

.login-button {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link-container {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.back-link {
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: #359268;
}
</style>
