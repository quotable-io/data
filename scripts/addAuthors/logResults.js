const pluralize = require('pluralize')
const { log } = require('../../lib/log')
const { logJSONTable } = require('../../lib/logJSONTable')

function logResults(inputData, newAuthors, verbose, dryRun) {
  const skipped = inputData.length - newAuthors.length
  const authors = newAuthors.length
  if (skipped) {
    log.newLine()
    log.info(`Skipped ${skipped} duplicate ${pluralize('author', skipped)}`)
  }
  log.newLine()
  if (authors) {
    log.info(`Added ${authors} new ${pluralize('author', authors)} `)
    if (verbose) logJSONTable(newAuthors, { excludeKeys: '_id' })
  } else {
    log.info(`No new authors to add`)
  }

  if (dryRun) {
    log.newLine()
    log(`This was a dry run, changes were not saved`)
  }
}
exports.logResults = logResults
