const pluralize = require('pluralize')
import { lowerCase } from 'lodash-es'
const { log } = require('../../lib/log')
const { entries } = require('../../lib/object')
const { logJSONTable } = require('../../lib/logJSONTable')

function logResults(authors, skipped, verbose, dryRun) {
  // Output info about authors that were skipped
  entries(skipped).forEach(([key, documents]) => {
    const count = documents.length
    const reason = lowerCase(key)
    if (count) {
      log.newLine()
      log.info(`Skipped ${count} ${pluralize('author', count)}: ${reason}`)
      if (verbose) logJSONTable(documents, { excludeKeys: ['_id'] })
    }
  })
  // Output info about the authors that were added
  if (authors.length) {
    const count = authors.length
    log.info(`Added ${count} new ${pluralize('author', authors)} `)
    if (verbose) logJSONTable(authors, { excludeKeys: '_id' })
  } else {
    log.info(`No new authors to add`)
  }

  if (dryRun) {
    log.newLine()
    log(`This was a dry run, changes were not saved`)
  }
}
export { logResults }
