import { log } from './log.js'

/**
 * Wrapper function for CLI scripts. It takes an async function and executes it
 * inside a try catch block, to provide error handling for CLI scripts.
 *
 * @example
 * run(async () => {
 *   console.log('Starting some script')
 *   const result = await doStuff()
 *   console.log('done!')
 * })
 */
export async function run(func) {
  try {
    await func()
    log.newLine()
    log('done!')
  } catch (error) {
    log.error(`[Error] ${error.message}`)
    log.stack(error)
    process.exit(1)
  }
}
