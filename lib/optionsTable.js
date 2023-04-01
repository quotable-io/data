import Table from 'cli-table3'
import { max } from 'lodash-es'

const MAX_TEXT_WIDTH = 100

/**
 *
 */
export function optionsTable(rows) {
  // Set the border characters for the table. The table is displayed without
  // any visible borders.
  const chars = {
    top: ' ',
    'top-mid': ' ',
    'top-left': '',
    'top-right': ' ',
    bottom: ' ',
    'bottom-mid': ' ',
    'bottom-left': ' ',
    'bottom-right': ' ',
    left: '',
    'left-mid': '',
    mid: ' ',
    'mid-mid': ' ',
    right: ' ',
    'right-mid': ' ',
    middle: ' ',
  }

  const data = rows.map(row => row.split(':').map(v => v.trim()))
  // Width of the left column is set to the length of text content in left column
  const leftColWidth = max(data.map(([leftCol]) => leftCol.length)) + 2
  // Width of the right column is based on the available space in the terminal, with a max
  // width of 100
  const rightColWidth = Math.min(
    MAX_TEXT_WIDTH,
    process.stdout.columns - leftColWidth
  )

  // Create a table with no visible borders. This creates a two column layout
  // where the option is displayed in the left column and description is
  // displayed in the right column.  The text in the description column is
  // wrapped to a readable line length, while maintaining alignment with the
  // column.
  const table = new Table({
    chars,
    colWidths: [leftColWidth, rightColWidth],
    wordWrap: true,
  })
  data.forEach(row => table.push(row))

  return table
}
