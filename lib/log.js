import chalk from 'chalk'
import { isString } from 'lodash-es'
import { identity } from 'lodash-es'
import { range } from 'lodash-es'
import wrap from 'word-wrap'

// Configuration for text wrapping
const MAX_WIDTH = 100
const WIDTH = Math.min(MAX_WIDTH, process.stdout.columns) - 5
const wrapOptions = { width: WIDTH, trim: false, indent: ' ' }

/**
 * Creates a log function with the specified `level` and text formatting.
 *
 * @param {'log' | 'warn' | 'error' | 'info'} level
 * @param {string => string} color a chalk function
 * @return {(message?: any, optionalParams?: any) => void} A function with the
 *     same signature as built-in console methods.
 */
const createLogger =
  (level, color = identity) =>
  (message, ...args) => {
    // If `value` **IS NOT** a string, we pass it directly to the built-in
    // console method to maintain the default formatting of objects and arrays
    if (!isString(message)) console[level](message, ...args)
    // For string values, we wrap text to a specified width and format with the
    // the provided color function.
    else console[level](`${wrap(color(message), wrapOptions)}`, ...args)
  }

/**
 * The default log function. When called as a function, this is equivalent to
 * `console.log`.
 *
 * It is also an object that contains all the other log methods, such as
 * `log.error`, `log.success`, etc.
 *
 * @example
 * // Called as a function, outputs message with default formatting
 * log('some value')
 *
 * // Outputs message with error formatting
 * log.error("something went wrong")
 *
 * // Outputs message with success formatting
 * log.success("something worked")
 */
function log(message, ...args) {
  return createLogger('log')(message, ...args)
}

log.warn = createLogger('warn', chalk.magentaBright)
log.info = createLogger('warn', chalk.yellowBright)
log.error = createLogger('error', chalk.bold.redBright)
log.success = createLogger('warn', chalk.greenBright)
log.dim = createLogger('warn', chalk.dim)
log.bgGreen = createLogger('warn', chalk.white.bgGreenBright.bold)
log.bgRed = createLogger('error', chalk.white.bgRedBright.bold)
log.bgYellow = createLogger('warn', chalk.white.bgYellowBright.bold)
log.link = createLogger('log', chalk.dim.underline)

/**
 * Outputs the stack trace from an error
 * Removes the error message and only displays the stack trace.
 */
log.stack = (error = {}) => {
  const { stack = '' } = error
  const lines = stack.split('\n').filter(line => /^\s+at/i.test(line))
  const str = lines.map(line => `   ${line.trim()}`).join('\n')
  console.error(chalk.dim(str))
}

/**
 * Outputs a horizontal divider
 */
log.divider = ({ char = '-', compact = false, color = chalk.dim } = {}) => {
  const w = process.stdout.columns - 2
  const divider = `${color(char.padEnd(w, char))}`
  console.log(compact ? divider : `\n${divider}\n`)
}

/**
 * Outputs a block header
 */
log.header = (str, { color = chalk.yellow, char = '=' } = {}) => {
  const w = process.stdout.columns - 3
  console.log(' ')
  console.log(` ${color.dim(''.padEnd(w, char))}`)
  console.log(` ${color(str)} `)
  console.log(` ${color.dim(''.padEnd(w, char))} `)
  console.log(' ')
}

/**
 * Outputs a single empty line
 */
log.newLine = (n = 1) => {
  range(n).forEach(() => console.log(' '))
}
export { log }
