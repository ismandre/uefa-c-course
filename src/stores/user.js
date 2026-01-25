import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const USER_NAME_KEY = 'uefa-c-user-name'
  const USER_GROUP_KEY = 'uefa-c-user-group'

  // Load name and group from localStorage on initialization
  const name = ref(localStorage.getItem(USER_NAME_KEY) || '')
  const group = ref(localStorage.getItem(USER_GROUP_KEY) || null)

  function setName(newName) {
    name.value = newName
    localStorage.setItem(USER_NAME_KEY, newName)
  }

  function setGroup(newGroup) {
    group.value = newGroup
    localStorage.setItem(USER_GROUP_KEY, newGroup)
  }

  function setUserData(newName, newGroup) {
    setName(newName)
    setGroup(newGroup)
  }

  function hasName() {
    return name.value.trim() !== ''
  }

  return { name, group, setName, setGroup, setUserData, hasName }
})
