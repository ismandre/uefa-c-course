import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useClassesStore } from '@/stores/classes'
import { parseQuestionsTSV, parseFilename } from '@/utils/tsvParser'

export const useQuestionsStore = defineStore('questions', () => {
  // Questions stored by uppercase subject code (e.g. 'PNI', 'UPS', 'UFAF')
  // This allows classes to share a question source via class-level config.
  const questionsBySource = ref({})

  let questionsLoaded = false
  let nextQuestionId = 1

  /**
   * Load all TSV files and populate questionsBySource.
   * No subject-to-class mapping needed here — that resolution happens at query time.
   */
  async function loadQuestions() {
    if (questionsLoaded) return

    try {
      const tsvFiles = import.meta.glob('/src/data/questions/*_questions*.tsv', {
        query: '?raw',
        import: 'default',
      })

      for (const [path, importFn] of Object.entries(tsvFiles)) {
        try {
          const tsvContent = await importFn()

          const fileInfo = parseFilename(path)
          if (!fileInfo) continue

          const sourceCode = fileInfo.subjectCode.toUpperCase()

          const questions = parseQuestionsTSV(tsvContent)

          if (!questionsBySource.value[sourceCode]) {
            questionsBySource.value[sourceCode] = []
          }

          questions.forEach((question) => {
            questionsBySource.value[sourceCode].push({
              ...question,
              id: nextQuestionId++,
            })
          })

          console.log(`Loaded ${questions.length} questions from ${path} (source: ${sourceCode})`)
        } catch (error) {
          console.error(`Error loading TSV file ${path}:`, error)
        }
      }

      questionsLoaded = true
      console.log('All questions loaded successfully')
    } catch (error) {
      console.error('Error loading questions:', error)
    }
  }

  /**
   * Get questions for a class.
   * Uses the class's `questionSource` if configured, otherwise falls back
   * to the class's own abbreviation as the source code.
   * @param {number} classId
   * @returns {Array}
   */
  function getQuestionsByClassId(classId) {
    const classesStore = useClassesStore()
    const classObj = classesStore.getClassById(classId)
    const sourceCode = (classObj?.questionSource ?? classObj?.abbreviation)?.toUpperCase()
    if (!sourceCode) return []
    return questionsBySource.value[sourceCode] || []
  }

  function getRandomizedQuestions(classId) {
    const questions = getQuestionsByClassId(classId)
    const shuffled = [...questions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  return {
    questionsBySource,
    getQuestionsByClassId,
    getRandomizedQuestions,
    loadQuestions,
  }
})
