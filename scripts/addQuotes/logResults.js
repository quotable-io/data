const pluralize = require('pluralize')
const { log } = require('../../lib/log')
const { logJSONTable } = require('../../lib/logJSONTable')

function logResults(inputData, rawInputData, verbose, dryRun) {
  const skipped = rawInputData.length - inputData.quotes.length
  const counts = {
    quote: inputData.quotes.length,
    author: inputData.authors.length,
    tag: inputData.tags.length,
  }
  if (skipped) {
    log.newLine()
    log.warn(`Skipped ${skipped} duplicate ${pluralize('quote', skipped)}`)
  }

  Object.entries(counts).forEach(([MODEL, count]) => {
    log.newLine()
    if (count) {
      log.info(`Added ${count} new ${pluralize(MODEL, count)}`)
      if (verbose) {
        logJSONTable(inputData[`${MODEL}s`], { excludeKeys: ['_id'] })
      }
    } else {
      log.info(`No new ${pluralize(MODEL, count)} to add`)
    }
  })

  if (dryRun) {
    log.warn(`This was a dry run, changes were not saved`)
  }
}
exports.logResults = logResults
