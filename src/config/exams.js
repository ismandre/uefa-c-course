/**
 * Exam Configuration
 *
 * This file defines the exam groups for UEFA C course classes.
 * Each exam can include multiple classes, and classes display
 * a badge indicating which exam they belong to.
 */

export const exams = {
  SIU2: {
    id: 'SIU2',
    name: 'SIU2',
    fullName: 'Sportsko-informatička urgencija 2',
    description: 'Ispit koji obuhvaća didaktiku i pedagogiju sporta',
    color: '#FF6B6B', // Red
    classIds: [2, 3], // ODS, OPS
  },
  SIU3: {
    id: 'SIU3',
    name: 'SIU3',
    fullName: 'Sportsko-informatička urgencija 3',
    description: 'Ispit koji obuhvaća anatomiju, fiziologiju i medicinu sporta',
    color: '#4ECDC4', // Teal
    classIds: [4, 5], // UAFS, UMS
  },
  // Add more exam groups as needed
  // EXAMPLE:
  // METODIKA: {
  //   id: 'METODIKA',
  //   name: 'Metodika',
  //   fullName: 'Metodika tehnike i taktike',
  //   description: 'Ispit koji obuhvaća metodiku tehnike i taktike',
  //   color: '#95E1D3',
  //   classIds: [6, 7], // OMT, OMTK
  // },
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
