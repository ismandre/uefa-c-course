<template>
  <div class="question-list-view">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-top">
          <button @click="goBack" class="back-button">← Natrag</button>
          <h1 class="page-title">
            Pitanja: <span v-if="currentClass">{{ currentClass.name }}</span>
          </h1>
          <RouterLink :to="`/quiz/${classId}`" class="quiz-button-link">
            <button class="quiz-button">
              <span class="quiz-icon">📝</span>
              Započni kviz
            </button>
          </RouterLink>
        </div>

        <!-- Search and Filter Controls -->
        <div class="controls">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pretraži pitanja..."
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <div class="filter-box">
            <label for="type-filter" class="filter-label">Tip pitanja:</label>
            <select id="type-filter" v-model="selectedType" class="filter-select">
              <option value="all">Svi tipovi</option>
              <option value="višestruki_izbor">Višestruki izbor</option>
              <option value="otvoreno">Otvoreno pitanje</option>
            </select>
          </div>

          <div class="question-count">
            📊 {{ filteredQuestions.length }} {{ questionCountLabel }}
            <span v-if="totalQuestions !== filteredQuestions.length" class="total-count">
              (od {{ totalQuestions }})
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <p>Učitavanje pitanja...</p>
      </div>

      <!-- Empty State - No Questions -->
      <div v-else-if="totalQuestions === 0" class="empty-state">
        <p class="empty-icon">📭</p>
        <p class="empty-text">Nema dostupnih pitanja za ovaj predmet</p>
      </div>

      <!-- Empty State - No Results -->
      <div v-else-if="filteredQuestions.length === 0" class="empty-state">
        <p class="empty-icon">🔍</p>
        <p class="empty-text">Nema pitanja za odabrane filtere</p>
        <button @click="resetFilters" class="reset-button">Resetiraj filtere</button>
      </div>

      <!-- Questions Grid -->
      <div v-else class="questions-grid">
        <QuestionListItem
          v-for="(question, index) in filteredQuestions"
          :key="question.id"
          :question="question"
          :question-number="index + 1"
          :expanded="expandedQuestions.has(question.id)"
          @toggle="toggleQuestion(question.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuestionsStore } from '@/stores/questions'
import { useClassesStore } from '@/stores/classes'
import QuestionListItem from '@/components/QuestionListItem.vue'

const route = useRoute()
const router = useRouter()
const questionsStore = useQuestionsStore()
const classesStore = useClassesStore()

// Parse classId from route params
const classId = parseInt(route.params.classId)

// State
const searchQuery = ref('')
const selectedType = ref('all')
const expandedQuestions = ref(new Set())
const isLoading = ref(true)

// Get current class
const currentClass = computed(() => classesStore.getClassById(classId))

// Check if class exists, redirect if not
if (!currentClass.value) {
  router.push('/')
}

// All questions for this class
const allQuestions = computed(() => {
  return questionsStore.getQuestionsByClassId(classId) || []
})

const totalQuestions = computed(() => allQuestions.value.length)

// Filtered questions based on search and filter
const filteredQuestions = computed(() => {
  let questions = [...allQuestions.value]

  // Filter by type
  if (selectedType.value !== 'all') {
    questions = questions.filter((q) => q.tip_pitanja === selectedType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    questions = questions.filter((q) => {
      return (
        q.pitanje?.toLowerCase().includes(query) ||
        q.odgovor_a?.toLowerCase().includes(query) ||
        q.odgovor_b?.toLowerCase().includes(query) ||
        q.odgovor_c?.toLowerCase().includes(query) ||
        q.odgovor_d?.toLowerCase().includes(query) ||
        q.tocan_odgovor?.toLowerCase().includes(query) ||
        q.napomena?.toLowerCase().includes(query)
      )
    })
  }

  return questions
})

// Question count label (singular/plural)
const questionCountLabel = computed(() => {
  const count = filteredQuestions.value.length
  if (count === 1) return 'pitanje'
  if (count >= 2 && count <= 4) return 'pitanja'
  return 'pitanja'
})

// Toggle question expansion
function toggleQuestion(questionId) {
  if (expandedQuestions.value.has(questionId)) {
    expandedQuestions.value.delete(questionId)
  } else {
    expandedQuestions.value.add(questionId)
  }
}

// Reset filters
function resetFilters() {
  searchQuery.value = ''
  selectedType.value = 'all'
}

// Navigation
function goBack() {
  router.push('/')
}

// Load questions on mount
onMounted(async () => {
  try {
    await questionsStore.loadQuestions()
  } catch (error) {
    console.error('Failed to load questions:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.question-list-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.back-button {
  background: transparent;
  border: 1px solid #ddd;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #f0f0f0;
  border-color: #667eea;
}

.page-title {
  flex: 1;
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
}

.page-title span {
  color: #667eea;
}

.quiz-button-link {
  text-decoration: none;
}

.quiz-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.quiz-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.quiz-icon {
  font-size: 1.1rem;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  pointer-events: none;
}

.filter-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  color: #606060;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.question-count {
  color: #606060;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.total-count {
  color: #999;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-text {
  color: #606060;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.reset-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: #764ba2;
  transform: translateY(-2px);
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .question-list-view {
    padding: 1rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .page-header {
    padding: 1rem;
  }

  .header-top {
    flex-direction: column;
    align-items: stretch;
  }

  .page-title {
    font-size: 1.25rem;
    text-align: center;
  }

  .back-button,
  .quiz-button {
    width: 100%;
    justify-content: center;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-box {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-label {
    text-align: left;
  }

  .filter-select {
    width: 100%;
  }

  .questions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
