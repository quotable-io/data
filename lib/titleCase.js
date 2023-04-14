import { words as toWords, capitalize } from 'lodash-es'

/**
 * Converts a string to title case, with words separated by a single space,
 * the first letter of each word capitalized, and all other characters in
 * lowercase.
 */
export function titleCase(str = '') {
  const words = toWords(str)
  return words.map(capitalize).join(' ')
}
