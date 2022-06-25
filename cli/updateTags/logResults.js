import pluralize from 'pluralize'
import { log } from '../../lib/log.js'
import { logJSONTable } from '../../lib/logJSONTable.js'

export function logResults(newTags, verbose, dryRun) {
  const tagsAdded = newTags.length
  if (tagsAdded) {
    log.info(`Added ${tagsAdded} new ${pluralize('tag', tagsAdded)} `)
    if (verbose) logJSONTable(newTags, { excludeKeys: '_id' })
  } else {
    log.info(`No new tags were added`)
  }

  if (dryRun) {
    log.newLine()
    log(`This was a dry run, changes were not saved`)
  }
}
