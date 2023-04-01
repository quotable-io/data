import { isEqual, isEmpty } from 'lodash-es'
import minimist from 'minimist'
import { parseDataFiles } from '../../lib/parseDataFiles.js'
import { dataDir } from '../../config.js'
import { client, testConnection } from './db.js'
import { log } from '../../lib/log.js'
import { help } from './help.js'

const args = minimist(process.argv.slice(2))
const VERBOSE = args.v || args.verbose
const HELP = args.h || args.help

function toObjectMap(arr) {
  return arr.reduce((obj, item) => ({ ...obj, [item._id]: item }), {})
}

if (HELP) {
  help()
  process.exit(0)
}

// An object to store the documents that will be inserted, updated, deleted
// in each collection
const allChanges = {}

// An object to track the number of documents that were successfully inserted,
// updated, and removed from each collection.
const allResults = {}

try {
  await testConnection()

  const dataFiles = parseDataFiles(dataDir.generated)

  // Connect to the database
  await client.connect()

  // Iterate through the collection names in the source data (JSON)
  for (const COLLECTION_NAME of Object.keys(dataFiles)) {
    // The number of documents that were successfully modified for the collection
    const results = { added: 0, updated: 0, removed: 0 }
    allResults[COLLECTION_NAME] = results

    // An object containing documents that will be inserted, updated, removed
    const changes = { added: [], updated: [], removed: [] }
    allChanges[COLLECTION_NAME] = changes

    // The mongoDB collection object
    const collection = client.db().collection(COLLECTION_NAME)

    // The source data for the current collection (JSON files)
    // The data is mapped to an object where the keys are the object _ids
    const sourceDocuments = toObjectMap(dataFiles[COLLECTION_NAME])

    // The live data for the current collection (MongoDB)
    // The data is mapped to an object where the keys are the object _ids
    const liveDocuments = toObjectMap(await collection.find({}).toArray())

    // Find objects in this collection that need to be added or updated
    Object.entries(sourceDocuments).forEach(([id, doc]) => {
      const existingDocument = liveDocuments[id]
      if (existingDocument) {
        // If there is an existing document with the same id...
        // See if the objets are equal, if not add it to the list of modified items
        if (!isEqual(existingDocument, doc)) {
          changes.updated = [...changes.updated, doc]
        }
      } else {
        // if there is no object with the same id, this is a new object that needs
        // to be added to the database.
        changes.added = [...changes.added, doc]
      }
    })

    // Find any objects in the MongoDb collection that have been removed from the
    // source data. These will be removed from the database.
    Object.entries(liveDocuments).forEach(([id, doc]) => {
      if (!sourceDocuments[id]) {
        changes.removed = [...changes.removed, doc]
      }
    })

    if (VERBOSE) {
      log.header(`Add ${COLLECTION_NAME}`)
      log(changes.added)
      log.header(`Update ${COLLECTION_NAME}`)
      log(changes.updated)
      log.header(`Delete ${COLLECTION_NAME}`)
      log(changes.removed)
    }

    if (!isEmpty(changes.added)) {
      // Add new objects to the MongoDB collection
      const insertResult = await collection.insertMany(changes.added, {
        ordered: false,
      })
      if (insertResult.acknowledged) {
        results.added += insertResult.insertedCount
      }
    }

    if (!isEmpty(changes.updated)) {
      // Update the objects that have been modified since last sync
      for (const { _id, ...doc } of changes.updated) {
        const updateResult = await collection.findOneAndUpdate(
          { _id },
          { $set: doc }
        )
        if (updateResult.ok) {
          results.updated += 1
        }
      }
    }

    if (!isEmpty(changes.removed)) {
      // Remove the items that have been deleted from the source data
      const deleteResults = await collection.deleteMany({
        _id: { $in: changes.removed.map(({ _id }) => _id) },
      })
      if (deleteResults.acknowledged) {
        results.removed += deleteResults.deletedCount
      }
    }
  }

  Object.entries(allResults).forEach(([COLLECTION_NAME, results]) => {
    const changes = allChanges[COLLECTION_NAME]
    log.header(COLLECTION_NAME)
    log.info(`Added: ${results.added} of ${changes.added.length}`)
    log.info(`Updated: ${results.updated} of ${changes.updated.length}`)
    log.info(`Deleted: ${results.removed} of ${changes.removed.length}`)
  })

  process.exit(0)
} catch (error) {
  log.error(error)
  process.exit(1)
}
