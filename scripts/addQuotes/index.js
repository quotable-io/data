#!/usr/bin/env node

const path = require('path')
const shell = require('shelljs')
const minimist = require('minimist')
const uniq = require('lodash/uniq')
const kebabCase = require('lodash/kebabCase')
const flatMap = require('lodash/flatMap')
const shortid = require('shortid')
const slugify = require('@lukepeavey/slugify')
const { dataDir } = require('../../config')
const { log } = require('../../lib/log')
const { run } = require('../../lib/run')
const { findQuoteByContent } = require('../../lib/findQuoteByContent')
const { writeJSONFiles } = require('../../lib/writeJSONFiles')
const { parseDataFiles } = require('../../lib/parseDataFiles')
const { parseFile } = require('../../lib/parseFile')
const { createAuthor } = require('../../lib/createAuthor')
const { logResults } = require('./logResults')
const { validateInput } = require('./validation')

/**
 * Parses the CLI arguments
 */
function parseArgs() {
  const args = minimist(process.argv.slice(2))
  const INPUT_FILE = path.resolve(args._[0] || 'input/quotes.json')
  const DATA_DIR = args.dataDir || dataDir.source
  const VERBOSE = args.v || args.verbose
  const DRY_RUN = args.d || args.dryRun
  const CLEANUP = !DRY_RUN && (args.c || args.cleanup)
  return { DATA_DIR, INPUT_FILE, DRY_RUN, VERBOSE, CLEANUP }
}

/**
 * Process the raw input data (an array of quotes) and return an object
 * containing the documents that will be added to each database collection.
 *
 * - Duplicate quotes will **not** be added.
 * - Any authors that are not already in the database will be created. When
 *   creating new authors, we use the wiki API to get the values for fields
 *   like `description`, `bio`, and `link`.
 * - Any tags that are not already in the database will be created
 *
 * @param {{content: string, author: string, tags?: string[]}[]} rawInputData
 * @param {{quotes: any[], authors: any[]}} db The existing database collections
 */
async function processInputData(rawInputData, db) {
  // An array of all unique author names from the input data
  const inputAuthorNames = uniq(rawInputData.map(({ author }) => author))

  // Create a map of all authors in the input data.
  const allAuthors = {}
  for (const inputAuthorName of inputAuthorNames) {
    // NOTE: In some cases, createAuthor will prompt the user to select the
    // correct author from a list of possible matches. it has to be called
    // synchronously for each author to allow the CLI prompts to be handled
    // one at a time.
    allAuthors[inputAuthorName] = await createAuthor(inputAuthorName)
  }

  // ================================================================
  // New Authors
  // ================================================================
  // Filter out authors that are already in the collection
  const authors = Object.values(allAuthors).filter(author => {
    return db.authors.every(({ name, link }) => {
      return link !== author.link && name !== author.name
    })
  })

  // ================================================================
  // New Quotes
  // ================================================================
  const quotes = rawInputData
    .filter(quote => !findQuoteByContent(quote.content, db))
    .map(({ author: inputAuthorName, content, tags = [] }) => ({
      _id: shortid(),
      // We use the name that we got from the author's wikipedia page, not the
      // name that was used in the input data.
      author: allAuthors[inputAuthorName].name,
      content,
      tags,
    }))

  // ================================================================
  // New Tags
  // ================================================================
  const tags = uniq(flatMap(quotes, quote => quote.tags)).filter(tagName => {
    return db.tags.find(({ slug }) => slug === slugify(tagName))
  })

  // Return the objects to add to database collections
  return { quotes, authors, tags }
}

run(async () => {
  // 1. Parse and validate CLI arguments
  const { INPUT_FILE, DATA_DIR, DRY_RUN, VERBOSE, CLEANUP } = parseArgs()
  // Get the current database collections
  const db = parseDataFiles(DATA_DIR)

  // 2. Validate the input file...
  // Make sure the input file matches the required format
  const rawInputData = parseFile(INPUT_FILE)
  if (!validateInput(rawInputData)) {
    const { errors } = validateInput
    log.bgRed(' Invalid input data: ')
    errors.forEach(error => log.error(error))
    process.exit(1)
  }

  // 3. Process the input data...
  // Creates an object containing the new documents that will be added to each
  // database collection: quotes, authors, tags.
  const inputData = await processInputData(rawInputData, db)

  // 4. Update the collections
  if (!DRY_RUN) {
    // a. Add the new documents to the existing collections
    const quotes = [...db.quotes, ...inputData.quotes]
    const authors = [...db.authors, ...inputData.authors]
    const tags = [...db.tags, ...inputData.tags]
    // b. Save the collections to disk.
    writeJSONFiles(DATA_DIR, { quotes, authors, tags })
  }
  // 5. Cleanup
  if (CLEANUP) {
    const date = kebabCase(new Date().toISOString())
    const CACHE_DIR = path.resolve(`.cache/imported/${date}/`)
    shell.mkdir('-p', CACHE_DIR)
    shell.mv(INPUT_FILE, CACHE_DIR)
  }
  // 6. Output results to console
  logResults(inputData, rawInputData, VERBOSE, DRY_RUN)
})
