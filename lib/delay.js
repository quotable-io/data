/**
 * Return a promise that resolves after given delay
 */
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

exports.delay = delay
