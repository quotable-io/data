import { lowerCase } from 'lodash-es'
const pluralize = require('pluralize')
const { log } = require('../../lib/log')
const { entries } = require('../../lib/object')
const { logJSONTable } = require('../../lib/logJSONTable')

function logResults(added, skipped, verbose, dryRun) {
  // Output info about the quotes that were skipped
  entries(skipped).forEach(([key, documents]) => {
    const count = documents.length
    const reason = lowerCase(key)
    if (count) {
      log.newLine()
      log.info(`Skipped ${count} ${pluralize('quote', count)}: ${reason}`)
      if (verbose) logJSONTable(documents, { excludeKeys: ['_id'] })
    }
  })

  // Log info about the objects that were added to each collection
  entries(added).forEach(([key, documents]) => {
    const count = documents.length
    const MODEL = key.replace(/s$/, '')
    log.newLine()
    if (count) {
      log.info(`Added ${count} new ${pluralize(MODEL, count)}`)
      if (verbose) logJSONTable(documents, { excludeKeys: ['_id'] })
    } else {
      log.info(`No new ${pluralize(MODEL, count)} to add`)
    }
  })

  if (dryRun) {
    log.warn(`This was a dry run, changes were not saved`)
  }
}
export { logResults }
