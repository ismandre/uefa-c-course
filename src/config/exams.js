/**
 * Exam Configuration
 *
 * This file defines the exam groups for UEFA C course classes.
 * Each exam can include multiple classes, and classes display
 * a badge indicating which exam they belong to.
 */

export const exams = {
  SIU1: {
    id: 'SIU1',
    name: 'SIU1',
    fullName: 'SIU1',
    description:
      'Ispit koji obuhvaća osnove anatomije, fiziologije, sportske medicine i zaštite na radu i od požara',
    color: '#FACE68',
    order: 1,
    classIds: [4, 5, 6, 7], // UFAF, UMS, ZNR, ZOP
  },
  SIU2: {
    id: 'SIU2',
    name: 'SIU2',
    fullName: 'SIU2',
    description: 'Ispit koji obuhvaća didaktiku i pedagogiju sporta',
    color: '#FF6B6B',
    order: 2,
    classIds: [2, 3], // ODS, OPS
  },
  SIU3: {
    id: 'SIU3',
    name: 'SIU3',
    fullName: 'SIU3',
    description: 'Ispit koji obuhvaća uvod u nogomet',
    color: '#4ECDC4',
    order: 3,
    classIds: [1], // PNI
  },
}

/**
 * Get exam information for a specific class
 * @param {number} classId - The ID of the class
 * @returns {Object|null} Exam object or null if class doesn't belong to an exam
 */
export function getExamForClass(classId) {
  for (const exam of Object.values(exams)) {
    if (exam.classIds.includes(classId)) {
      return exam
    }
  }
  return null
}

/**
 * Get all classes belonging to a specific exam
 * @param {string} examId - The ID of the exam
 * @returns {number[]} Array of class IDs
 */
export function getClassesForExam(examId) {
  const exam = exams[examId]
  return exam ? exam.classIds : []
}

/**
 * Get all exams sorted by their display order
 * @returns {Object[]} Array of exam objects in display order
 */
export function getOrderedExams() {
  return Object.values(exams).sort((a, b) => a.order - b.order)
}
