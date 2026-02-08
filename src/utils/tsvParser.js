/**
 * Parse TSV content with tab delimiter
 * Uses header row to dynamically map columns, making it resilient to column additions.
 * @param {string} tsvContent - Raw TSV file content
 * @returns {Array<Object>} Parsed questions array
 */
export function parseQuestionsTSV(tsvContent) {
  const lines = tsvContent.split('\n').filter((line) => line.trim() !== '')

  if (lines.length === 0) return []

  // Parse header row to get column indices dynamically
  const headers = lines[0].split('\t').map((h) => h.trim().toLowerCase())
  const col = (name) => headers.indexOf(name)

  const idxPredmet = col('predmet')
  const idxPitanje = col('pitanje')
  const idxTip = col('tip_pitanja')
  const idxA = col('odgovor_a')
  const idxB = col('odgovor_b')
  const idxC = col('odgovor_c')
  const idxD = col('odgovor_d')
  const idxE = col('odgovor_e')
  const idxF = col('odgovor_f')
  const idxTocan = col('tocan_odgovor')
  const idxNapomena = col('napomena')

  const parseField = (values, idx) => {
    if (idx === -1) return ''
    return values[idx]?.trim().replace(/\\n/g, '\n') || ''
  }

  // Normalize question type to handle both ASCII and Croatian spelling
  const normalizeTipPitanja = (value) => {
    if (!value) return ''
    const v = value.trim()
    // Treat "visestruki_izbor" as an alias for "višestruki_izbor"
    return v === 'visestruki_izbor' ? 'višestruki_izbor' : v
  }

  const questions = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const values = line.split('\t')

    const question = {
      predmet: values[idxPredmet]?.trim() || '',
      pitanje: parseField(values, idxPitanje),
      tip_pitanja: normalizeTipPitanja(values[idxTip]),
      odgovor_a: parseField(values, idxA),
      odgovor_b: parseField(values, idxB),
      odgovor_c: parseField(values, idxC),
      odgovor_d: parseField(values, idxD),
      odgovor_e: parseField(values, idxE),
      odgovor_f: parseField(values, idxF),
      tocan_odgovor: parseField(values, idxTocan),
      napomena: parseField(values, idxNapomena),
    }

    questions.push(question)
  }

  return questions
}

/**
 * Extract subject code from filename.
 * Supports both formats:
 *   - {subject_code}_questions_pt{number}.tsv  (e.g., pni_questions_pt1.tsv)
 *   - {subject_code}_questions.tsv             (e.g., ufaf_questions.tsv)
 * @param {string} filename - full path or just filename
 * @returns {Object|null} { subjectCode: 'PNI', partNumber: 1 | null }
 */
export function parseFilename(filename) {
  const name = filename.split('/').pop()

  // Try numbered format first: {code}_questions_pt{N}.tsv
  const numberedMatch = name.match(/^([a-z]+)_questions_pt(\d+)\.tsv$/i)
  if (numberedMatch) {
    return {
      subjectCode: numberedMatch[1].toUpperCase(),
      partNumber: parseInt(numberedMatch[2], 10),
    }
  }

  // Try unnumbered format: {code}_questions.tsv
  const simpleMatch = name.match(/^([a-z]+)_questions\.tsv$/i)
  if (simpleMatch) {
    return {
      subjectCode: simpleMatch[1].toUpperCase(),
      partNumber: null,
    }
  }

  console.warn(`Invalid filename format: ${filename}`)
  return null
}
