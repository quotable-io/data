#!/usr/bin/env node

const path = require('path')
const minimist = require('minimist')
const trim = require('lodash/trim')
const { writeJSONFiles } = require('../../lib/writeJSONFiles')
const { parseDataFiles } = require('../../lib/parseDataFiles')
const { log } = require('../../lib/log')
const { parseFile } = require('../../lib/parseFile')
const { run } = require('../../lib/run')
const { createAuthor } = require('../../lib/createAuthor')
const { validateInput } = require('./validation')
const { dataDir } = require('../../config')
const { logResults } = require('./logResults')

/**
 * Parses the CLI arguments
 */
function parseArgs() {
  const args = minimist(process.argv.slice(2))
  const VERBOSE = args.v || args.verbose
  const DRY_RUN = args.d || args.dryRun
  const DATA_DIR = path.resolve(args.dataDir || dataDir.source)
  const INPUT_FILE = path.resolve(args._[0] || 'input/authors.json')
  const NAME = args.name || args.n
  return { DATA_DIR, INPUT_FILE, DRY_RUN, NAME, VERBOSE }
}

function parseNameInput(NAME) {
  if (!NAME) return null
  return NAME.split(',').map(name => ({ name: trim(name) }))
}

run(async () => {
  const { DATA_DIR, INPUT_FILE, VERBOSE, DRY_RUN, NAME } = parseArgs()
  // The current database collections
  const db = parseDataFiles(DATA_DIR)

  // Get the input data (from an input file or the `--name` argument)
  const inputData = parseNameInput(NAME) || parseFile(INPUT_FILE)

  if (!validateInput(inputData)) {
    validateInput.errors.forEach(error => log.error(error))
    throw new Error('Input data does not match schema')
  }

  // Map the input data to an array of complete `Author` objects. We use the
  // wiki API to get the values for any author fields that are not defined in
  // the input data (ie `bio`, `description`, `link`).
  const authorEntries = []
  for (const input of inputData) {
    // The `createAuthor` function uses the wiki API and attempts to find the
    // matching page based on the given author name. 99% percent of the time
    authorEntries.push(await createAuthor(input))
  }
  // Filter out authors that are already in the collection.
  const newAuthors = authorEntries.filter(author => {
    return db.authors.every(({ name, link }) => {
      return link !== author.link && name !== author.name
    })
  })

  if (newAuthors.length && !DRY_RUN) {
    // Update the collections then save files to disk
    const authors = [...db.authors, ...newAuthors]
    writeJSONFiles(DATA_DIR, { authors })
  }
  // Output the results to the console
  logResults(inputData, newAuthors, VERBOSE, DRY_RUN)
})
