import wrap from 'word-wrap'
import chalk from 'chalk'
import { log } from '../../lib/log.js'
import { Table } from '../../lib/Table.js'

function logResults(duplicateGroups) {
  const WIDTH = Math.min(process.stdout.columns, 105)
  const ID_COL_WIDTH = 14
  const PADDING = 3
  const CONTENT_COL_WIDTH = WIDTH - ID_COL_WIDTH - PADDING * 2
  const TEXT_WIDTH = CONTENT_COL_WIDTH - PADDING * 2
  const count = duplicateGroups.length
  log.newLine()
  log[count ? 'warn' : 'success'](`Found ${count} possible duplicates`)
  log.newLine()

  duplicateGroups.map(quotes => {
    const table = Table({
      colWidths: [ID_COL_WIDTH, CONTENT_COL_WIDTH],
      styles: { paddingLeft: PADDING, paddingRight: PADDING },
      items: quotes.map(quote => {
        const id = chalk.dim(quote._id)
        const content = wrap(quote.content, { width: TEXT_WIDTH, indent: '' })
        return { [id]: content }
      }),
    })
    console.log(table.toString())
  })
}

export { logResults }
