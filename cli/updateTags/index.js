#!/usr/bin/env node

import * as path from 'path'
import minimist from 'minimist'
import { uniq, kebabCase } from 'lodash-es'
import shortid from 'shortid'
import slugify from '@lukepeavey/slugify'
import { writeJSONFiles } from '../../lib/writeJSONFiles.js'
import { parseDataFiles } from '../../lib/parseDataFiles.js'
import { run } from '../../lib/run.js'
import { dataDir } from '../../config.js'
import { logResults } from './logResults.js'

/**
 * Parses the CLI arguments
 */
function parseArgs() {
  const args = minimist(process.argv.slice(2))
  const VERBOSE = args.v || args.verbose
  const DRY_RUN = args.d || args.dryRun
  const DATA_DIR = path.resolve(args.dataDir || dataDir.source)
  const INPUT_FILE = path.resolve('input', args._[0] || 'tags.json')
  const NAME = args.name || args.n
  return { DATA_DIR, INPUT_FILE, DRY_RUN, NAME, VERBOSE }
}

run(async () => {
  const { DATA_DIR, VERBOSE, DRY_RUN } = parseArgs()
  // The current database collections
  const db = parseDataFiles(DATA_DIR)

  const allTags = db.quotes.reduce((acm, { tags }) => {
    return uniq([...acm, ...tags.map(kebabCase)])
  }, [])

  const tags = allTags
    .filter(tag => !db.tags.find(({ name }) => name === tag))
    .map(tag => ({
      _id: shortid(),
      name: slugify(tag),
    }))

  if (tags.length && !DRY_RUN) {
    // Add the new tags to the existing collection, then write files to disk
    writeJSONFiles(DATA_DIR, { tags: [...db.tags, ...tags] })
  }
  // Output the results to the console
  logResults(tags, VERBOSE, DRY_RUN)
})
