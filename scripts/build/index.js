#!/usr/bin/env node

const minimist = require('minimist')
const path = require('path')
const { dataDir } = require('../../config')
const { isEqual } = require('../../lib/isEqual')
const { log } = require('../../lib/log')
const { parseDataFiles } = require('../../lib/parseDataFiles')
const { run } = require('../../lib/run')
const { transforms } = require('./transforms')
const { writeJSONFiles } = require('../../lib/writeJSONFiles')

const DATE = new Date()
const { entries } = Object

/** Parses and validates CLI arguments */
function parseArgs() {
  const args = minimist(process.argv.slice(2))
  const SRC = path.resolve(args.src || args.s || dataDir.source)
  const DEST = path.resolve(args.dest || args.d || dataDir.generated)
  return { SRC, DEST }
}

function getTimeStamps(db, COLLECTION, object) {
  // See if this object exists in the current data
  const existingObject = db[COLLECTION].find(({ _id }) => _id === object._id)
  // Will be true if the object already exists and has not been modified
  const hasNotChanged = existingObject && isEqual(object, existingObject)
  const dateAdded = existingObject ? existingObject.dateAdded : DATE
  const dateModified = hasNotChanged ? existingObject.dateModified : DATE
  return { dateAdded, dateModified }
}

run(async () => {
  log.info('Generating data files')
  const { SRC, DEST } = parseArgs()
  // The source data.
  // @type { quotes: Quote[], authors: Author[], tags: Tag[] }
  const src = parseDataFiles(SRC)
  // The current version of generated data files.
  // @type { quotes: Quote[], authors: Author[], tags: Tag[] }
  const db = parseDataFiles(DEST)

  // Apply transforms to the source data to create the generated data files
  // This will add computed properties that are not included in the source
  // data files.
  // @type { quotes: Quote[], authors: Author[], tags: Tag[] }
  let data = transforms.reduce((result, transform) => transform(result), src)

  // Add timestamps to each object (dateAdded and dateModified)
  data = entries(data).reduce((result, [COLLECTION, objects]) => {
    const objectsWithTimeStamp = objects.map(object => {
      return { ...object, ...getTimeStamps(db, COLLECTION, object) }
    })
    return { ...result, [COLLECTION]: objectsWithTimeStamp }
  }, {})
  // Save the updated JSON to files in the `dist` directory.
  await writeJSONFiles(DEST, data)
})
