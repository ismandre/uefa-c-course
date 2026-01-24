/**
 * Parse TSV content with tab delimiter
 * @param {string} tsvContent - Raw TSV file content
 * @returns {Array<Object>} Parsed questions array
 */
export function parseQuestionsTSV(tsvContent) {
  const lines = tsvContent.split('\n').filter((line) => line.trim() !== '')

  if (lines.length === 0) return []

  // First line is the header - skip it
  // Parse remaining lines as data
  const questions = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Split by tab
    const values = line.split('\t')

    // Create question object
    const question = {
      predmet: values[0]?.trim() || '',
      pitanje: values[1]?.trim() || '',
      tip_pitanja: values[2]?.trim() || '',
      odgovor_a: values[3]?.trim() || '',
      odgovor_b: values[4]?.trim() || '',
      odgovor_c: values[5]?.trim() || '',
      odgovor_d: values[6]?.trim() || '',
      tocan_odgovor: values[7]?.trim() || '',
      napomena: values[8]?.trim() || '',
    }

    questions.push(question)
  }

  return questions
}

/**
 * Extract subject code and part number from filename
 * @param {string} filename - e.g., "pni_questions_pt1.tsv"
 * @returns {Object} { subjectCode: 'PNI', partNumber: 1 }
 */
export function parseFilename(filename) {
  // Extract filename without path
  const name = filename.split('/').pop()

  // Pattern: {{subject_code}}_questions_pt{{number}}.tsv
  const match = name.match(/^([a-z]+)_questions_pt(\d+)\.tsv$/i)

  if (!match) {
    console.warn(`Invalid filename format: ${filename}`)
    return null
  }

  return {
    subjectCode: match[1].toUpperCase(),
    partNumber: parseInt(match[2], 10),
  }
}
