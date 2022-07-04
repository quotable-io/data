import { parseDataFiles } from '../../lib/parseDataFiles.js'
import { dataDir } from '../../config.js'
import { client, testConnection } from './db.js'

try {
  await testConnection()

  const db = parseDataFiles(dataDir.generated)
  const collections = Object.keys(db)

  await client.connect()

  let results = {}

  for (const COLLECTION of collections) {
    const data = db[COLLECTION]
    const collection = client.db().collection(COLLECTION)
    console.log(`[${COLLECTION}] Adding ${data.length}`)
    await collection.deleteMany({})
    const output = await collection.insertMany(data, { ordered: false })

    const count = await collection.countDocuments()
    console.log(`${COLLECTION} Added ${count}`)
    results[COLLECTION] = output
  }

  await client.close()
  console.log('Disconnected')
} catch (error) {
  console.dir(error)
  process.exit(1)
}
