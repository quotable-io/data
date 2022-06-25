import pluralize from 'pluralize'
import { lowerCase } from 'lodash-es'
import { log } from '../../lib/log.mjs'
import { entries } from '../../lib/object.mjs'
import { logJSONTable } from '../../lib/logJSONTable.mjs'

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
