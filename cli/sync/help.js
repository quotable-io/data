// import wrap from 'word-wrap'

import { log } from '../../lib/log.js'
import { optionsTable } from '../../lib/optionsTable.js'

export function help() {
  // Configuration for text wrapping
  // const MAX_WIDTH = 100
  // const WIDTH = Math.min(MAX_WIDTH, process.stdout.columns) - 5
  // const wrapOptions = { width: WIDTH, trim: false, indent: ' ' }
  log.newLine()

  log.bold(`Description:`)
  log.newLine()
  log(
    `Sync the data from the JSON files in this repository to a MongoDB database. The performs a one-way sync from JSON files to database`
  )

  log.newLine()
  log.newLine()
  log.newLine()

  log.bold('Usage:')
  log.newLine()
  log(`$ node cli/syncData [<dataDir>] [..options]`)

  log.newLine()
  log.newLine()
  log.newLine()

  log.bold('Options:')

  const options = [
    `[--help | -h] : Show command documentation`,

    `[--overwrite | -o] : If this flag is included, the command removes all existing documents from the MongoDB collections, and then populated them with the data from the JSON files. Otherwise, the command will only add, update, and remove the documents that have been modified since the last sync`,

    `[--verbose | -v] : If this flag is included, the command will show more detailed output about the operation. This includes the full list of objects that will be added, updated, and removed for each collection.`,
  ]
  console.log(optionsTable(options).toString())
}
