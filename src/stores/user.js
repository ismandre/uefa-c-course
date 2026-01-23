import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const USER_NAME_KEY = 'uefa-c-user-name'

  // Load name from localStorage on initialization
  const name = ref(localStorage.getItem(USER_NAME_KEY) || '')

  function setName(newName) {
    name.value = newName
    localStorage.setItem(USER_NAME_KEY, newName)
  }

  function hasName() {
    return name.value.trim() !== ''
  }

  return { name, setName, hasName }
})
