import 'dotenv/config.js'
import { MongoClient } from 'mongodb'
// Connection URI
const uri = process.env.MONGODB_URI
// Create a new MongoClient

/** @type {MongoClient} */
export const client = new MongoClient(uri)

export async function testConnection() {
  try {
    console.log('Testing database connection')
    // Connect the client to the server
    await client.connect()
    // Establish and verify connection
    await client.db('admin').command({ ping: 1 })
    console.log('Test successful')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
