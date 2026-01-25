import { ref } from 'vue'
import { defineStore } from 'pinia'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const isLoading = ref(true)
  const adminUser = ref(null)

  // Listen for auth state changes
  onAuthStateChanged(auth, (user) => {
    adminUser.value = user
    isAuthenticated.value = !!user
    isLoading.value = false
  })

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      adminUser.value = userCredential.user
      isAuthenticated.value = true
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.message }
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      adminUser.value = null
      isAuthenticated.value = false
      return { success: true }
    } catch (error) {
      console.error('Logout failed:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    isAuthenticated,
    isLoading,
    adminUser,
    login,
    logout,
  }
})
