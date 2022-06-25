import * as path from 'path'
import level from 'level'
import { cacheDir } from '../../config.mjs'

// Create a data store
const db = level(path.join(cacheDir, 'wiki'), {})

export const cache = {
  /**
   * Checks if the data store contains a given key.
   * @param {string} key
   * @returns {boolean}
   */
  async has(key) {
    try {
      await db.get(key)
      return true
    } catch (error) {
      return false
    }
  },

  /**
   * If the given key exists, returns the corresponding data. Otherwise returns
   * `null`.
   * @param {string} key
   * @returns {any}
   */
  async get(key) {
    try {
      const value = await db.get(key)
      return JSON.parse(value)
    } catch (error) {
      return null
    }
  },

  /**
   * Adds a key value entry to the cache. The data can be any valid JSON data.
   *
   * @param {string} key
   * @param {any} data
   * @returns the `data` that was stored in the cache
   */
  async set(key, data) {
    await db.put(key, JSON.stringify(data))
    return data
  },

  /**
   * Delete an entry from the cache. If the key does not exist, this has not
   * effect.
   *
   * @param {string} key
   * @return void
   */
  async delete(key) {
    try {
      await db.del(key)
      /* eslint-disable-next-line */
    } catch (error) {}
  },

  /**
   * Clears the cache
   * @returns void
   */
  async clear() {
    db.clear()
  },
}
