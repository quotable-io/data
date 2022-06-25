import { lowerCase } from 'lodash-es'
import pluralize from 'pluralize'
import { log } from '../../lib/log.js'
import { entries } from '../../lib/object.js'
import { logJSONTable } from '../../lib/logJSONTable.js'

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
