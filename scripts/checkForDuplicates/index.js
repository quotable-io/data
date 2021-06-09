#!/usr/bin/env node

const { createProgressBar } = require('../../lib/progressBar')
const { isContentEqual } = require('../../lib/isContentEqual')
const { logResults } = require('./logResults')
const { parseDataFiles } = require('../../lib/parseDataFiles')
const { run } = require('../../lib/run')
const { dataDir } = require('../../config')

run(() => {
  const db = parseDataFiles(dataDir.source)
  const cache = new WeakSet()
  const progressBar = createProgressBar({ title: 'Checking for Duplicates' })

  // Start the progress bar
  progressBar.start(db.quotes.length, 0)

  // Create an array of sets of duplicate quotes
  const duplicateGroups = db.quotes.reduce((result, quote, idx) => {
    progressBar.update(idx, {})
    if (cache.has(quote)) {
      return result
    }

    const duplicates = db.quotes.filter(compareQuote => {
      if (quote._id !== compareQuote._id) {
        if (isContentEqual(quote.content, compareQuote.content)) {
          cache.add(compareQuote)
          progressBar.update(idx, { duplicateCount: result.length })
          return true
        }
      }
    })

    if (duplicates.length) {
      return [...result, [quote, ...duplicates]]
    }
    return result
  }, [])
  // Stop the progress bar
  progressBar.stop()
  logResults(duplicateGroups)
})
