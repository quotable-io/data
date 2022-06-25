#!/usr/bin/env node

const path = require('path')
const shell = require('shelljs')
const minimist = require('minimist')
import { uniq } from 'lodash-es'
import { uniqBy } from 'lodash-es'
import { kebabCase } from 'lodash-es'
import { remove } from 'lodash-es'
import { flatMap } from 'lodash-es'
const shortid = require('shortid')
const slugify = require('@lukepeavey/slugify')
const { createProgressBar } = require('../../lib/progressBar')
const { dataDir } = require('../../config')
const { entries, values } = require('../../lib/object')
const { findQuoteByContent } = require('../../lib/findQuoteByContent')
const { log } = require('../../lib/log')
const { logResults } = require('./logResults')
const { parseContent } = require('../../lib/parseContent')
const { parseDataFiles } = require('../../lib/parseDataFiles')
const { parseFile } = require('../../lib/parseFile')
const { run } = require('../../lib/run')
const { select } = require('../../lib/selectInput')
const { validateInput } = require('./validation')
const { wiki } = require('../../lib/wiki')
const { writeJSONFiles } = require('../../lib/writeJSONFiles')

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
 * Matches each author name found in the input data to a wikipedia page.
 * @param {Quote[]} input The array of quotes from the input file
 * @return {Object} An object that maps each author name found in the input
 *     data to a wikipedia page.
 */
async function getAuthorWikis(input) {
  // The array of unique author names found in the input data
  const inputNames = uniq(input.map(({ author }) => author))

  // An object that maps each author name in the input data to a wikipedia page.
  const authors = {}

  // Note: we have to throttle wiki API requests to avoid exceeding the rate
  // limit. When adding a large number of quotes, this step will take a few
  // minutes. We display a progress bar while to provide some feedback while
  // fetching data from wikipedia.
  const wikiProgressBar = createProgressBar({ title: 'Getting author info' })
  wikiProgressBar.start(inputNames.length, 0)

  let index = 0
  // 1. Use the wiki API to search for each author by name. In some cases
  // this function will return multiple results (if it doesn't find an an exact
  // match, or there are multiple people with the same name). So initially we
  // map each author name to an array of matching wikipedia pages.
  for (const inputName of inputNames) {
    await wiki.rateLimit(index, inputNames.length)
    const results = await wiki.findAuthorByName(inputName)
    wikiProgressBar.update((index += 1))
    authors[inputName] = results
  }
  wikiProgressBar.stop()

  // 2. Iterate through the authors map. If any of the authors have multiple
  // wikipedia results, we prompt the user to select the intended person from
  // the list of results.
  for (const [inputName, wikiResults] of entries(authors)) {
    // let `authorWiki` be the wikipedia page for this author
    let [authorWiki] = wikiResults
    // If there are multiple results, it means that A) we did not find an exact
    // match for this name, or B) there are multiple people on wikipedia with
    // this name.
    if (wikiResults.length > 1) {
      authorWiki = await select({
        message: `Select wikipedia page for author ${inputName}`,
        options: wikiResults,
      })
    }
    if (authorWiki) {
      authors[inputName] = authorWiki
    }
  }
  return authors
}

/**
 * Processes the raw input data (an array of quotes) and returns an object
 * containing the documents that will be added to each database collection.
 *
 * @param {{content: string, author: string, tags?: string[]}[]} rawInputData
 * @param {{quotes: any[], authors: any[]}} db The existing database collections
 */
async function processInputData(rawInputData, db) {
  // An object to store the documents that will be added to each collection.
  // @type { quotes: Quote[], authors: Author[], tags: Tag[] }
  const documents = {}
  // An object to store any quotes that are **not** added.
  // @type { duplicate: any[], invalidAuthor: any[] }
  const skipped = {}
  // The array of unique quotes from the input data
  const input = uniqBy(rawInputData, value => parseContent(value.content))

  // ==============================================================
  // Create Authors
  // ==============================================================
  // 1. Map each author found in the input data to a wikipedia page. We use
  // data from the wiki API to create author new author objects. We also use
  const authorWikis = await getAuthorWikis(input, db)
  // 2. Create the array of authors that will be added to the collection.
  documents.authors = uniqBy(values(authorWikis), author => author.name)
    // Filter out authors that are already in the collection
    .filter(author => db.authors.every(({ link }) => link !== author.link))
    // Create `Author` objects using data from the wiki API
    .map(authorWiki => ({
      _id: shortid(),
      name: authorWiki.name,
      bio: authorWiki.bio,
      description: authorWiki.description,
      link: authorWiki.link,
    }))

  // ==============================================================
  // Create Quotes
  // ==============================================================
  // 1. Remove any quotes that are already in the collection
  skipped.duplicate = remove(input, ({ content }) =>
    findQuoteByContent(content, db)
  )
  // 2. Remove any quotes by authors that do not have a wikipedia page
  skipped.invalidAuthor = remove(input, ({ author }) => !authorWikis[author])
  // 3. Create the array of new quotes that will be added to the collection.
  documents.quotes = input.map(({ author, content, tags = [] }) => ({
    _id: shortid(),
    author: authorWikis[author].name,
    content,
    tags,
  }))

  // ==============================================================
  // Create Tags
  // ==============================================================
  // 1. Get an array of all uniq tag names found in the input data
  const allTags = uniq(flatMap(input, quote => quote.tags))
  // 2. Create an array of **new** tags that will be added to the `tags`
  // collection
  documents.tags = allTags
    // Filter out tags that already exist
    .filter(tagName => db.tags.every(({ name }) => name !== slugify(tagName)))
    // Create a `Tag` object. Currently this just has an id and name.
    .map(tagName => ({ _id: shortid(), name: tagName }))

  return { added: documents, skipped }
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
  // Returns an object containing new documents that were added to each
  // collection, and an object containing quotes that were not added.
  const { added, skipped } = await processInputData(rawInputData, db)

  // 4. Update the collections
  if (!DRY_RUN) {
    // a. Add the new documents to the existing collections
    const quotes = [...db.quotes, ...added.quotes]
    const authors = [...db.authors, ...added.authors]
    const tags = [...db.tags, ...added.tags]
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
  logResults(added, skipped, VERBOSE, DRY_RUN)
})
