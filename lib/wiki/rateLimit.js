const { delay } = require('../delay')
/**
 * Returns the delay (in ms) that is required between requests to avoid
 * exceeding the wiki API rate limit.
 *
 * @param {number} index the index of the current request
 * @param {number} total the total number of requests
 */
const rateLimit = (index, total) => {
  let ms = 0
  if (index) {
    ms = total < 5 ? 250 : Math.min(Math.floor(total / 10) + 1, 5) * 500
  }
  return delay(ms)
}

exports.rateLimit = rateLimit
