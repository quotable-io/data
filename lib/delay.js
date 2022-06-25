/**
 * Return a promise that resolves after given delay
 */
export async function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
