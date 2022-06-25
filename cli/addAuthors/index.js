#!/usr/bin/env node

import * as path from 'path'
import minimist from 'minimist'
import { trim } from 'lodash-es'
import { uniq } from 'lodash-es'
import { remove } from 'lodash-es'
import shortid from 'shortid'
import { writeJSONFiles } from '../../lib/writeJSONFiles.mjs'
import { parseDataFiles } from '../../lib/parseDataFiles.mjs'
import { log } from '../../lib/log.mjs'
import { parseFile } from '../../lib/parseFile.mjs'
import { run } from '../../lib/run.mjs'
import { logResults } from './logResults.mjs'
import { select } from '../../lib/selectInput.mjs'
import { validateInput } from './validation.mjs'
import { dataDir } from '../../config.mjs'
import { wiki } from '../../lib/wiki.mjs'

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
  const inputData = uniq(parseNameInput(NAME) || parseFile(INPUT_FILE))

  if (!validateInput(inputData)) {
    validateInput.errors.forEach(error => log.error(error))
    throw new Error('Input data does not match schema')
  }

  // Map each author name found in the input data to an array of matching
  // wikipedia pages.
  // const newAuthors = []
  const skipped = { noWikipediaPage: [], duplicate: [] }
  const newAuthors = await Promise.all(
    inputData.map(async (input, index) => {
      // Find the wikipedia entry for this author
      await wiki.rateLimit(index, inputData.length)
      const results = await wiki.findAuthorByName(input.name)
      let [authorWiki] = results
      // If there are multiple results that match the given author name, the
      // script will prompt the user to select the intended person from the
      // list of results.
      if (results.length > 1) {
        authorWiki = await select({
          message: `Select the wikipedia page for author: ${input.name}`,
          options: results,
        })
      }
      // If the author does not have a wikipedia page, they will not be added
      if (!authorWiki) {
        return input
      }
      // Create an `Author` object using data from the wiki API and user input
      return {
        _id: shortid(),
        name: authorWiki.name,
        bio: input.bio || authorWiki.bio,
        description: input.description || authorWiki.description,
        link: authorWiki.link,
      }
    })
  )

  // Filter out authors that did not have a wikipedia page
  skipped.noWikipediaPage = remove(newAuthors, author => !author._id)

  // Filter out authors that are already in the collection.
  skipped.duplicate = remove(newAuthors, author => {
    return db.authors.some(({ name, link }) => {
      return link === author.link || name === author.name
    })
  })

  if (newAuthors.length && !DRY_RUN) {
    // Update the collections then save files to disk
    const authors = [...db.authors, ...newAuthors]
    writeJSONFiles(DATA_DIR, { authors })
  }
  // Output the results to the console
  logResults(newAuthors, skipped, VERBOSE, DRY_RUN)
})
