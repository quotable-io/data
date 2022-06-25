import pluralize from 'pluralize'
import { log } from '../../lib/log.js'
import { logJSONTable } from '../../lib/logJSONTable.js'

function logResults(inputData, newTags, verbose, dryRun) {
  const skipped = inputData.length - newTags.length
  const tags = newTags.length
  if (skipped) {
    log.newLine()
    log.info(`Skipped ${skipped} duplicate ${pluralize('tag', skipped)}`)
  }
  log.newLine()
  if (tags) {
    log.info(`Added ${tags} new ${pluralize('tag', tags)} `)
    if (verbose) logJSONTable(newTags, { excludeKeys: '_id' })
  } else {
    log.info(`No new tags to add`)
  }

  if (dryRun) {
    log.newLine()
    log(`This was a dry run, changes were not saved`)
  }
}
export { logResults }
