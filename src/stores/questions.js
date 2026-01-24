import { ref } from 'vue'
import { defineStore } from 'pinia'
import { parseQuestionsTSV, parseFilename } from '@/utils/tsvParser'

export const useQuestionsStore = defineStore('questions', () => {
  // Map subject abbreviations to class IDs (must match classes.js)
  const subjectToClassId = {
    PNI: 1, // Pravila nogometne igre
    ODS: 2, // Osnove didaktike sporta
    OPS: 3, // Osnove pedagogije sporta
    UAFS: 4, // Uvod u anatomiju i fiziologiju sporta
    UMS: 5, // Uvod u medicinu sporta
    OMT: 6, // Osnove metodike tehnike
    OMTK: 7, // Osnove metodike taktike
    // Alternative abbreviations (if TSV files use different codes)
    UFAF: 4, // Alternative for UAFS
    UMKP: 6, // Alternative for OMT
    UMTA: 7, // Alternative for OMTK
    UMTE: 6, // Alternative for OMT
    UMT: 6, // Alternative for OMT
  }

  const questionsByClass = ref({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  })

  let questionsLoaded = false
  let nextQuestionId = 1

  /**
   * Load all TSV files and populate questionsByClass
   */
  async function loadQuestions() {
    if (questionsLoaded) return

    try {
      // Import all TSV files from the questions directory
      // Using Vite's import.meta.glob with { query: '?raw' } to get file contents as strings
      const tsvFiles = import.meta.glob('/src/data/questions/*_questions_pt*.tsv', {
        query: '?raw',
        import: 'default',
      })

      // Load and parse each TSV file
      for (const [path, importFn] of Object.entries(tsvFiles)) {
        try {
          // Get the file content
          const tsvContent = await importFn()

          // Parse the filename to get subject code
          const fileInfo = parseFilename(path)
          if (!fileInfo) continue

          const { subjectCode } = fileInfo

          // Get the class ID for this subject
          const classId = subjectToClassId[subjectCode]
          if (!classId) {
            console.warn(`Unknown subject code: ${subjectCode} in file ${path}`)
            continue
          }

          // Parse the TSV content
          const questions = parseQuestionsTSV(tsvContent)

          // Add unique IDs to questions and add to the appropriate class
          questions.forEach((question) => {
            questionsByClass.value[classId].push({
              ...question,
              id: nextQuestionId++,
            })
          })

          console.log(`Loaded ${questions.length} questions from ${path} for class ${classId}`)
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

  function getQuestionsByClassId(classId) {
    return questionsByClass.value[classId] || []
  }

  function getRandomizedQuestions(classId) {
    const questions = getQuestionsByClassId(classId)
    // Fisher-Yates shuffle algorithm
    const shuffled = [...questions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  return {
    questionsByClass,
    getQuestionsByClassId,
    getRandomizedQuestions,
    loadQuestions,
  }
})
