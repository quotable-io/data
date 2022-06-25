#!/usr/bin/env node

import { createProgressBar } from '../../lib/progressBar.js'
import { parseContent } from '../../lib/parseContent.js'
import { logResults } from './logResults.js'
import { parseDataFiles } from '../../lib/parseDataFiles.js'
import { run } from '../../lib/run.js'
import { dataDir } from '../../config.js'

function isContentEqual(a, b) {
  return parseContent(a) === parseContent(b)
}

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
