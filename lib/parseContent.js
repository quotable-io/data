import stopwords from '@lukepeavey/stopwords'

/**
 * - Converts string to lowercase
 * - removes all punctuation
 * - Removes english stopwords
 */
function parseContent(str) {
  const words = String(str)
    .toLowerCase()
    .replace(/[^a-z1-9'\s]/gi, '')
    .replace(/\s+/, ' ')
    .split(' ')
  return words.filter(word => !stopwords.includes(word)).join(' ')
}

export { parseContent }
