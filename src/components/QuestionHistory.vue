<script setup>
import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'

const props = defineProps({
  questionId: {
    type: Number,
    required: true,
  },
})

const historyStore = useHistoryStore()

const history = computed(() => historyStore.getQuestionHistory(props.questionId))
const stats = computed(() => historyStore.getQuestionStats(props.questionId))

function formatDate(isoString) {
  const date = new Date(isoString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
}
</script>

<template>
  <div class="question-history">
    <div class="history-header">
      <h3>Povijest odgovora</h3>
      <div v-if="stats.total > 0" class="stats">
        <span class="stat-item">
          <strong>{{ stats.total }}</strong> pokušaja
        </span>
        <span class="stat-item correct">
          <strong>{{ stats.correct }}</strong> točnih
        </span>
        <span class="stat-item incorrect">
          <strong>{{ stats.incorrect }}</strong> netočnih
        </span>
        <span class="stat-item accuracy">
          <strong>{{ stats.accuracy }}%</strong> točnosti
        </span>
      </div>
    </div>

    <div v-if="history.length === 0" class="no-history">
      <p>Još niste odgovorili na ovo pitanje.</p>
    </div>

    <div v-else class="history-list">
      <div
        v-for="(attempt, index) in history"
        :key="index"
        class="history-item"
        :class="{ correct: attempt.isCorrect, incorrect: !attempt.isCorrect }"
      >
        <div class="attempt-result">
          <span class="result-icon">{{ attempt.isCorrect ? '✓' : '✗' }}</span>
          <span class="result-text">{{ attempt.isCorrect ? 'Točno' : 'Netočno' }}</span>
        </div>
        <div class="attempt-date">{{ formatDate(attempt.timestamp) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-history {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.history-header {
  margin-bottom: 1rem;
}

.history-header h3 {
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #606060;
}

.stat-item strong {
  color: #2c3e50;
}

.stat-item.correct strong {
  color: #28a745;
}

.stat-item.incorrect strong {
  color: #dc3545;
}

.stat-item.accuracy strong {
  color: #667eea;
}

.no-history {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
}

.no-history p {
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: white;
  border-radius: 6px;
  border-left: 4px solid;
  transition: transform 0.2s;
}

.history-item.correct {
  border-left-color: #28a745;
}

.history-item.incorrect {
  border-left-color: #dc3545;
}

.history-item:hover {
  transform: translateX(4px);
}

.attempt-result {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-icon {
  font-size: 1.125rem;
  font-weight: bold;
}

.history-item.correct .result-icon {
  color: #28a745;
}

.history-item.incorrect .result-icon {
  color: #dc3545;
}

.result-text {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.875rem;
}

.attempt-date {
  color: #606060;
  font-size: 0.8125rem;
}
</style>
