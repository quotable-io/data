const _ = require('lodash')
const stopwords = require('@lukepeavey/stopwords')

/**
 * - Converts string to lowercase
 * - removes all punctuation
 * - Removes english stopwords
 */
function parseText(str) {
  const words = String(str)
    .toLowerCase()
    .replace(/[^a-z1-9'\s]/gi, '')
    .replace(/\s+/, ' ')
    .split(' ')
  return words.filter(word => !stopwords.includes(word)).join(' ')
}

/**
 * Compares two or more strings and returns true if they are equal or similar.
 * It ignores all punctuation, case, and stopwords.
 *
 * @example
 * isContentEqual("Its a glorious day!", "What a glorious day.")
 * // => true
 */
function isContentEqual(...strings) {
  return _.isEqual(...strings.map(parseText))
}

exports.isContentEqual = isContentEqual
