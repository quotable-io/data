import * as fs from 'fs'
import chalk from 'chalk'
import minimist from 'minimist'
import * as path from 'path'
import shell from 'shelljs'
import { faker } from '@faker-js/faker'
import { run } from '../../lib/run.js'
import { findAuthorByName } from '../../lib/findAuthorByName.js'
import { parseDataFiles } from '../../lib/parseDataFiles.js'
import { writeJSONFiles } from '../../lib/writeJSONFiles.js'
import { Table } from '../../lib/Table.js'

const { random } = faker

/** Outputs a table showing the results */
function createResultsTable(sample) {
  return Table({
    items: Object.entries(sample).map(([COLLECTION, documents]) => {
      return [`${COLLECTION}.json`, `${documents.length} documents`]
    }),
  })
}

/** Parses the CLI arguments */
function parseArgs() {
  const args = minimist(process.argv.slice(2))
  if (!(args.dest || args.d)) {
    throw new Error('Missing required argument --dest')
  }
  const SRC = path.resolve(args.src || args.s || 'data')
  const DEST = path.resolve(args.dest || args.d)
  const COUNT = args.count || args.c || 500
  return { SRC, DEST, COUNT }
}

run(async () => {
  const { SRC, DEST, COUNT } = parseArgs()
  // The data files
  const db = parseDataFiles(SRC)

  // The sample data
  const sample = { quotes: [], authors: [], tags: db.tags }
  // Keep track of the quote _ids that have been added to sample
  const ids = []

  // Select the specified number (`COUNT`)  of random quotes
  while (sample.quotes.length < COUNT) {
    let quote = random.arrayElement(db.quotes)
    while (ids.includes(quote._id)) {
      // If the quote was already added, pick another one
      quote = random.arrayElement(db.quotes)
    }
    ids.push(quote._id)
    sample.quotes.push(quote)
  }

  // Get the names of all authors in the sample data
  const authorNames = sample.quotes.reduce((acc, quote) => {
    return acc.includes(quote.author) ? acc : [...acc, quote.author]
  }, [])

  // Map author names to complete `Author` objects
  sample.authors = authorNames.map(name => {
    const author = findAuthorByName(name, db)
    const quoteCount = sample.quotes.filter(q => q.author === name).length
    return {
      ...author,
      quoteCount,
    }
  })

  shell.rm('-rf', DEST)
  fs.mkdirSync(DEST, { recursive: true })
  writeJSONFiles(DEST, sample)
  console.log(chalk.greenBright('\n ✨ Saved new sample data to...'))
  console.log(chalk.yellow(`==> ${DEST}\n`))
  console.log(createResultsTable(sample).toString())
})
