<template>
  <div class="question-item" :class="{ expanded }">
    <div class="question-header">
      <div class="header-left">
        <span class="question-type-badge" :class="questionTypeClass">
          {{ questionTypeLabel }}
        </span>
        <span class="question-number">#{{ questionNumber }}</span>
      </div>
      <div class="header-right">
        <span v-if="historyStats.totalAttempts > 0" class="history-badge">
          <span class="correct-count">✓ {{ historyStats.correctCount }}</span>
          <span class="incorrect-count">✗ {{ historyStats.incorrectCount }}</span>
        </span>
      </div>
    </div>

    <div class="question-content">
      <p class="question-text" :class="{ truncated: !expanded }">
        {{ question.pitanje }}
      </p>

      <div v-if="expanded" class="question-details">
        <!-- Multiple Choice Answers -->
        <div v-if="isMultipleChoice" class="answers-section">
          <p v-if="hasMultipleCorrectAnswers" class="multiple-answers-note">
            📌 Više točnih odgovora
          </p>
          <div class="answers-list">
            <div
              v-for="(option, index) in questionOptions"
              :key="index"
              class="answer-option"
              :class="{ correct: isCorrectOption(index) }"
            >
              <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
              <span class="option-text">{{ option }}</span>
              <span v-if="isCorrectOption(index)" class="correct-icon">✓</span>
            </div>
          </div>
        </div>

        <!-- Open-Ended Answer -->
        <div v-else class="open-ended-answer">
          <div class="answer-label">Točan odgovor:</div>
          <ExplanationText :text="question.tocan_odgovor" class="answer-text" />
        </div>

        <!-- Explanation/Notes -->
        <div v-if="question.napomena && question.napomena.trim()" class="explanation">
          <div class="explanation-label">💡 Objašnjenje:</div>
          <ExplanationText :text="question.napomena" class="explanation-text" />
        </div>

        <!-- History Stats (expanded view) -->
        <div v-if="historyStats.totalAttempts > 0" class="history-stats-expanded">
          <div class="stats-label">📊 Povijest:</div>
          <div class="stats-text">
            {{ historyStats.correctCount }} točno,
            {{ historyStats.incorrectCount }} netočno
            <span v-if="historyStats.accuracy > 0" class="accuracy">
              ({{ historyStats.accuracy }}%)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="question-footer">
      <button @click="$emit('toggle')" class="toggle-button">
        {{ expanded ? 'Sakrij detalje ▲' : 'Prikaži detalje ▼' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import ExplanationText from '@/components/ExplanationText.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  questionNumber: {
    type: Number,
    required: true,
  },
})

defineEmits(['toggle'])

const historyStore = useHistoryStore()

// Question type helpers
const isMultipleChoice = computed(() => props.question.tip_pitanja === 'višestruki_izbor')

const questionTypeLabel = computed(() =>
  isMultipleChoice.value ? 'Višestruki izbor' : 'Otvoreno pitanje',
)

const questionTypeClass = computed(() =>
  isMultipleChoice.value ? 'type-multiple-choice' : 'type-open-ended',
)

// Multiple choice options
const questionOptions = computed(() => {
  if (!isMultipleChoice.value) return []
  return [
    props.question.odgovor_a,
    props.question.odgovor_b,
    props.question.odgovor_c,
    props.question.odgovor_d,
    props.question.odgovor_e,
    props.question.odgovor_f,
  ].filter((opt) => opt && opt.trim())
})

// Correct answer helpers
const correctAnswerIndices = computed(() => {
  if (!isMultipleChoice.value) return new Set()
  const answerMap = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 }

  // Handle comma-separated answers (e.g., "A,C,D")
  const answer = props.question.tocan_odgovor
  const letters = answer.split(',').map((l) => l.trim())
  const indices = letters.map((letter) => answerMap[letter]).filter((idx) => idx !== undefined)

  return new Set(indices)
})

const isCorrectOption = (index) => {
  return correctAnswerIndices.value.has(index)
}

const hasMultipleCorrectAnswers = computed(() => correctAnswerIndices.value.size > 1)

// History stats
const historyStats = computed(() => {
  return historyStore.getQuestionStats(props.question.id)
})
</script>

<style scoped>
.question-item {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.question-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.question-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-multiple-choice {
  background: #e3f2fd;
  color: #1976d2;
}

.type-open-ended {
  background: #fff3e0;
  color: #f57c00;
}

.question-number {
  color: #999;
  font-size: 0.875rem;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.history-badge {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.correct-count {
  color: #42b983;
  font-weight: 600;
}

.incorrect-count {
  color: #dc3545;
  font-weight: 600;
}

.question-content {
  margin-bottom: 1rem;
}

.question-text {
  color: #2c3e50;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  white-space: pre-wrap;
}

.question-text.truncated {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.question-details {
  margin-top: 1rem;
}

.answers-section {
  margin-bottom: 1rem;
}

.multiple-answers-note {
  color: #667eea;
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
  padding: 0.5rem 0.75rem;
  background: #eef2ff;
  border-left: 3px solid #667eea;
  border-radius: 4px;
}

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f9f9f9;
  transition: background 0.2s ease;
}

.answer-option.correct {
  background: #e8f5e9;
  border: 2px solid #42b983;
}

.option-label {
  font-weight: 700;
  color: #667eea;
  min-width: 1.5rem;
}

.option-text {
  flex: 1;
  color: #2c3e50;
  line-height: 1.5;
  white-space: pre-wrap;
}

.correct-icon {
  color: #42b983;
  font-size: 1.25rem;
  font-weight: bold;
}

.open-ended-answer {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.answer-label {
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.answer-text {
  color: #2c3e50;
  line-height: 1.6;
}

.explanation {
  padding: 1rem;
  background: #fffbf0;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.explanation-label {
  font-weight: 600;
  color: #f57c00;
  margin-bottom: 0.5rem;
}

.explanation-text {
  color: #2c3e50;
}

.history-stats-expanded {
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-label {
  font-weight: 600;
  color: #667eea;
}

.stats-text {
  color: #606060;
  font-size: 0.875rem;
}

.accuracy {
  font-weight: 600;
  color: #42b983;
}

.question-footer {
  display: flex;
  justify-content: center;
}

.toggle-button {
  background: transparent;
  border: none;
  color: #667eea;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  background: #f0f0f0;
  color: #764ba2;
}

@media (max-width: 768px) {
  .question-item {
    padding: 1rem;
  }

  .question-type-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
  }

  .question-text {
    font-size: 0.95rem;
  }

  .answer-option {
    padding: 0.5rem;
  }
}
</style>
