import chalk from 'chalk'
import { isEmpty } from 'lodash-es'
import wrap from 'word-wrap'
import { Table } from './Table.js'
import { log } from './log.js'

/**
 * Creates a table representation of an array of JSON objects and logs it to
 * the console.
 */
export function logJSONTable(objects, options = {}) {
  const { excludeKeys = [], excludeEmpty = true } = options
  const WIDTH = Math.min(process.stdout.columns, 105)
  const KEY_COL_WIDTH = 14
  const PADDING = 2
  const CONTENT_COL_WIDTH = WIDTH - KEY_COL_WIDTH - PADDING * 2
  const TEXT_WIDTH = CONTENT_COL_WIDTH - PADDING * 2
  objects.map(object => {
    const entries = Object.entries(object).filter(([key, value]) => {
      if (excludeKeys.includes(key)) return false
      if (excludeEmpty && isEmpty(value)) return false
      return true
    })
    // blank space between items
    log.newLine()
    // Outputs a table representation of the given object
    const table = Table({
      colWidths: [KEY_COL_WIDTH, CONTENT_COL_WIDTH],
      styles: { paddingLeft: PADDING, paddingRight: PADDING },
      items: entries.map(([key, rawValue]) => {
        const value = wrap(String(rawValue), { width: TEXT_WIDTH, indent: '' })
        return [chalk.dim(key), value]
      }),
    })
    console.log(table.toString())
  })
}
