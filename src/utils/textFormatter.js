/**
 * Formats explanation/notes text for display by splitting inline bullet points
 * and numbered list items onto separate lines.
 *
 * This is purely a display-side transformation — the original data is never modified.
 *
 * @param {string} text - Raw explanation text from TSV
 * @returns {string[]} Array of segments, one per line/bullet/numbered item
 */
export function formatExplanation(text) {
  if (!text || !text.trim()) return []

  let result = text

  // Break inline bullet/sub-bullet points onto new lines.
  // "...sentence. • Next bullet" → "...sentence.\n• Next bullet"
  result = result.replace(/([.!?])\s+(•|◦)/g, '$1\n$2')

  // Break inline numbered list items onto new lines.
  // Only triggers when a 1-2 digit number followed by ". " appears after sentence-ending
  // punctuation AND the list item begins with an uppercase letter — this avoids
  // false splits on abbreviations like "br. 5." or "npr. 3.5 kg".
  result = result.replace(/([.!?:;–—])\s+(\d{1,2}\.)\s+(?=[A-ZŠĐŽČĆ])/g, '$1\n$2 ')

  return result.split('\n').map((s) => s.trim()).filter(Boolean)
}

/**
 * Classifies a single text segment for styling purposes.
 * @param {string} segment
 * @returns {'bullet' | 'sub-bullet' | 'numbered' | 'text'}
 */
export function segmentType(segment) {
  if (segment.startsWith('•')) return 'bullet'
  if (segment.startsWith('◦')) return 'sub-bullet'
  if (/^\d{1,2}\./.test(segment)) return 'numbered'
  return 'text'
}
