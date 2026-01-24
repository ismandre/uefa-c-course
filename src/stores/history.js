import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useHistoryStore = defineStore('history', () => {
  const HISTORY_KEY = 'uefa-c-quiz-history'

  // Load history from localStorage on initialization
  const attempts = ref(loadHistory())

  function loadHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load history:', error)
      return []
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(attempts.value))
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }

  function addAttempt(questionId, isCorrect) {
    const userStore = useUserStore()

    const attempt = {
      questionId,
      userId: userStore.name,
      timestamp: new Date().toISOString(),
      isCorrect,
    }

    attempts.value.push(attempt)
    saveHistory()
  }

  function getQuestionHistory(questionId) {
    const userStore = useUserStore()

    // Filter attempts for this question and current user, sorted by most recent first
    return attempts.value
      .filter((attempt) => attempt.questionId === questionId && attempt.userId === userStore.name)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  function getQuestionStats(questionId) {
    const history = getQuestionHistory(questionId)
    const total = history.length
    const correct = history.filter((attempt) => attempt.isCorrect).length
    const incorrect = total - correct

    return {
      total,
      correct,
      incorrect,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  }

  function clearHistory() {
    attempts.value = []
    saveHistory()
  }

  return {
    attempts,
    addAttempt,
    getQuestionHistory,
    getQuestionStats,
    clearHistory,
  }
})
