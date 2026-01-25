<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
import { useClassesStore } from '@/stores/classes'
import { useHistoryStore } from '@/stores/history'
import { useAnalyticsStore } from '@/stores/analytics'
import QuestionHistory from '@/components/QuestionHistory.vue'

const route = useRoute()
const router = useRouter()
const questionsStore = useQuestionsStore()
const classesStore = useClassesStore()
const historyStore = useHistoryStore()
const analyticsStore = useAnalyticsStore()

const classId = parseInt(route.params.id)
const currentClass = computed(() => classesStore.getClassById(classId))
const questions = ref([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const userAnswer = ref('')
const showAnswer = ref(false)
const isCorrect = ref(null)

// Analytics tracking
const quizStartTime = ref(null)
const correctAnswersCount = ref(0)
const answeredQuestions = ref(new Set())

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const isFirstQuestion = computed(() => currentQuestionIndex.value === 0)

// Computed properties to handle CSV question format
const isMultipleChoice = computed(() => currentQuestion.value?.tip_pitanja === 'visestruki_izbor')
const isOpenEnded = computed(() => currentQuestion.value?.tip_pitanja === 'otvoreno')

const questionOptions = computed(() => {
  if (!currentQuestion.value || !isMultipleChoice.value) return []

  const options = []
  if (currentQuestion.value.odgovor_a) options.push(currentQuestion.value.odgovor_a)
  if (currentQuestion.value.odgovor_b) options.push(currentQuestion.value.odgovor_b)
  if (currentQuestion.value.odgovor_c) options.push(currentQuestion.value.odgovor_c)
  if (currentQuestion.value.odgovor_d) options.push(currentQuestion.value.odgovor_d)

  return options
})

const correctAnswerIndex = computed(() => {
  if (!currentQuestion.value || !isMultipleChoice.value) return -1

  const letter = currentQuestion.value.tocan_odgovor
  const letterToIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
  return letterToIndex[letter] ?? -1
})

onMounted(async () => {
  // Load questions from CSV files first
  await questionsStore.loadQuestions()

  // Then get randomized questions for this class
  questions.value = questionsStore.getRandomizedQuestions(classId)
  if (questions.value.length === 0) {
    // No questions available for this class
    console.warn('No questions available for class', classId)
  } else {
    // Track quiz start
    quizStartTime.value = Date.now()
    analyticsStore.trackQuizStarted(classId, currentClass.value?.name || '', questions.value.length)
  }
})

function selectOption(index) {
  if (isMultipleChoice.value && !showAnswer.value) {
    selectedAnswer.value = index
  }
}

function checkAnswer() {
  if (isMultipleChoice.value) {
    isCorrect.value = selectedAnswer.value === correctAnswerIndex.value

    // Record the attempt
    historyStore.addAttempt(currentQuestion.value.id, isCorrect.value)

    // Track analytics
    const questionHistory = historyStore.getQuestionHistory(currentQuestion.value.id)
    analyticsStore.trackQuestionAnswered(
      currentQuestion.value.id,
      classId,
      currentQuestion.value.tip_pitanja,
      isCorrect.value,
      questionHistory.length,
    )

    // Update correct answers count
    if (isCorrect.value && !answeredQuestions.value.has(currentQuestion.value.id)) {
      correctAnswersCount.value++
      answeredQuestions.value.add(currentQuestion.value.id)
    }
  }
  showAnswer.value = true
}

function toggleAnswer() {
  showAnswer.value = !showAnswer.value
}

function markAsCorrect() {
  isCorrect.value = true

  // Record the attempt
  historyStore.addAttempt(currentQuestion.value.id, true)

  // Track analytics
  const questionHistory = historyStore.getQuestionHistory(currentQuestion.value.id)
  analyticsStore.trackQuestionAnswered(
    currentQuestion.value.id,
    classId,
    currentQuestion.value.tip_pitanja,
    true,
    questionHistory.length,
  )

  // Update correct answers count
  if (!answeredQuestions.value.has(currentQuestion.value.id)) {
    correctAnswersCount.value++
    answeredQuestions.value.add(currentQuestion.value.id)
  }
}

function markAsIncorrect() {
  isCorrect.value = false

  // Record the attempt
  historyStore.addAttempt(currentQuestion.value.id, false)

  // Track analytics
  const questionHistory = historyStore.getQuestionHistory(currentQuestion.value.id)
  analyticsStore.trackQuestionAnswered(
    currentQuestion.value.id,
    classId,
    currentQuestion.value.tip_pitanja,
    false,
    questionHistory.length,
  )

  // Mark question as answered
  if (!answeredQuestions.value.has(currentQuestion.value.id)) {
    answeredQuestions.value.add(currentQuestion.value.id)
  }
}

function nextQuestion() {
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++
    resetQuestion()
  }
}

function previousQuestion() {
  if (!isFirstQuestion.value) {
    currentQuestionIndex.value--
    resetQuestion()
  }
}

function resetQuestion() {
  selectedAnswer.value = null
  userAnswer.value = ''
  showAnswer.value = false
  isCorrect.value = null
}

function completeQuiz() {
  if (quizStartTime.value) {
    const duration = Date.now() - quizStartTime.value
    analyticsStore.trackQuizCompleted(
      classId,
      currentClass.value?.name || '',
      correctAnswersCount.value,
      questions.value.length,
      duration,
    )
  }
}

function goBackToHome() {
  // If on last question or have answered questions, mark quiz as completed
  if (isLastQuestion.value || answeredQuestions.value.size > 0) {
    completeQuiz()
  }
  router.push('/')
}
</script>

<template>
  <div class="quiz-container">
    <div v-if="questions.length === 0" class="no-questions">
      <h2>Nema dostupnih pitanja</h2>
      <p>Pitanja za ovaj predmet još nisu dodana.</p>
      <button @click="goBackToHome" class="back-button">Povratak na početnu</button>
    </div>

    <div v-else class="quiz-content">
      <div class="quiz-header">
        <h1 class="quiz-title">{{ currentClass?.name }}</h1>
        <div class="quiz-progress">
          Pitanje {{ currentQuestionIndex + 1 }} / {{ questions.length }}
        </div>
      </div>

      <div class="question-card">
        <h2 class="question-text">{{ currentQuestion.pitanje }}</h2>

        <!-- Multiple Choice Question -->
        <div v-if="isMultipleChoice" class="options-container">
          <button
            v-for="(option, index) in questionOptions"
            :key="index"
            @click="selectOption(index)"
            class="option-button"
            :class="{
              selected: selectedAnswer === index && !showAnswer,
              correct: showAnswer && index === correctAnswerIndex,
              incorrect: showAnswer && selectedAnswer === index && index !== correctAnswerIndex,
            }"
            :disabled="showAnswer"
          >
            <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
            <span class="option-text">{{ option }}</span>
          </button>

          <button
            v-if="selectedAnswer !== null && !showAnswer"
            @click="checkAnswer"
            class="check-button"
          >
            Provjeri odgovor
          </button>
        </div>

        <!-- Open-Ended Question -->
        <div v-if="isOpenEnded" class="open-ended-container">
          <textarea
            v-model="userAnswer"
            placeholder="Unesite svoj odgovor ovdje..."
            class="answer-textarea"
            rows="5"
          ></textarea>

          <button @click="toggleAnswer" class="reveal-button">
            {{ showAnswer ? 'Sakrij odgovor' : 'Prikaži odgovor' }}
          </button>

          <div v-if="showAnswer" class="correct-answer-section">
            <h3>Točan odgovor:</h3>
            <p class="correct-answer">{{ currentQuestion.tocan_odgovor }}</p>

            <div class="self-grade">
              <p>Jeste li odgovorili točno?</p>
              <div class="grade-buttons">
                <button
                  @click="markAsCorrect"
                  class="grade-button correct"
                  :class="{ active: isCorrect === true }"
                >
                  Točno
                </button>
                <button
                  @click="markAsIncorrect"
                  class="grade-button incorrect"
                  :class="{ active: isCorrect === false }"
                >
                  Netočno
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Explanation -->
        <div v-if="showAnswer && currentQuestion.napomena" class="explanation">
          <h3>Objašnjenje:</h3>
          <p>{{ currentQuestion.napomena }}</p>
        </div>

        <!-- Result Message -->
        <div v-if="showAnswer && isCorrect !== null" class="result-message" :class="{ correct: isCorrect, incorrect: !isCorrect }">
          {{ isCorrect ? '✓ Točno!' : '✗ Netočno' }}
        </div>

        <!-- Question History -->
        <QuestionHistory :question-id="currentQuestion.id" />
      </div>

      <!-- Navigation -->
      <div class="navigation">
        <button
          @click="previousQuestion"
          :disabled="isFirstQuestion"
          class="nav-button"
        >
          ← Prethodno
        </button>
        <button
          @click="goBackToHome"
          class="nav-button home-button"
        >
          Početna
        </button>
        <button
          v-if="!isLastQuestion"
          @click="nextQuestion"
          class="nav-button"
        >
          Sljedeće →
        </button>
        <button
          v-else
          @click="goBackToHome"
          class="nav-button finish-button"
        >
          Završi kviz
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.no-questions {
  text-align: center;
  padding: 4rem 2rem;
}

.no-questions h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.no-questions p {
  color: #606060;
  margin-bottom: 2rem;
}

.back-button {
  padding: 0.75rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #359268;
}

.quiz-header {
  margin-bottom: 2rem;
  text-align: center;
}

.quiz-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.quiz-progress {
  color: #606060;
  font-size: 1rem;
}

.question-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.question-text {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.option-button:hover:not(:disabled) {
  border-color: #42b983;
  transform: translateX(4px);
}

.option-button.selected {
  border-color: #667eea;
  background-color: #eef2ff;
}

.option-button.correct {
  border-color: #42b983;
  background-color: #d4edda;
}

.option-button.incorrect {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.option-button:disabled {
  cursor: not-allowed;
}

.option-label {
  font-weight: 700;
  color: #2c3e50;
  min-width: 2rem;
}

.option-text {
  flex: 1;
  color: #2c3e50;
}

.check-button {
  margin-top: 1rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.check-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.open-ended-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.answer-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s;
}

.answer-textarea:focus {
  outline: none;
  border-color: #42b983;
}

.reveal-button {
  padding: 0.875rem 2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.reveal-button:hover {
  background-color: #5a6268;
}

.correct-answer-section {
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #42b983;
}

.correct-answer-section h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.correct-answer {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.self-grade p {
  color: #606060;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.grade-buttons {
  display: flex;
  gap: 1rem;
}

.grade-button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: white;
}

.grade-button.correct {
  border-color: #42b983;
  color: #42b983;
}

.grade-button.correct.active {
  background-color: #42b983;
  color: white;
}

.grade-button.incorrect {
  border-color: #dc3545;
  color: #dc3545;
}

.grade-button.incorrect.active {
  background-color: #dc3545;
  color: white;
}

.explanation {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.explanation h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.explanation p {
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

.result-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
}

.result-message.correct {
  background-color: #d4edda;
  color: #155724;
}

.result-message.incorrect {
  background-color: #f8d7da;
  color: #721c24;
}

.navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.nav-button {
  padding: 0.875rem 2rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-button:hover:not(:disabled) {
  background-color: #5a6268;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.home-button {
  background-color: #42b983;
}

.nav-button.home-button:hover {
  background-color: #359268;
}

.nav-button.finish-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nav-button.finish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}
</style>
