const { stringify } = require('query-string')
import { get } from 'lodash-es'
import { sortBy } from 'lodash-es'
const fetch = require('node-fetch')
const { log } = require('../log')
const { cache } = require('./cache')

const BASE_URL = `https://en.wikipedia.org/w/api.php`

// The list of properties to include for pages returned by the wiki API
// @see https://www.mediawiki.org/wiki/API:Properties
const pageProperties = [
  'pageimages',
  'description',
  'categories',
  'info',
  'extracts',
]

// These are the default params we use for all API requests
// https://www.mediawiki.org/wiki/API:Query
const defaultParams = {
  origin: '*',
  format: 'json',
  action: 'query',
  formatversion: 2,
  prop: pageProperties.join('|'),
  inprop: 'url',
  exintro: true,
  exsentences: 3,
  explaintext: false,
  gsrnamespace: 0,
  cllimit: 'max',
}

/**
 * Helper function that makes an API request and returns an array of results,
 * sorted by index.
 */
const request = async url => {
  try {
    // Return the cached response when present
    const cachedResponse = await cache.get(url)
    if (cachedResponse) return cachedResponse
    // Otherwise, make a request to the wiki API
    const response = await fetch(url)
    const json = await response.json()
    const results = sortBy(get(json, 'query.pages', []), ({ index }) => index)
    return cache.set(url, results)
  } catch (error) {
    log.error(error)
    return []
  }
}

/**
 * Wiki API Methods
 */
const api = {
  /**
   * Search for wikipedia pages matching the given query string. We use this to
   * find an author's wikipedia page from the person's name.
   *
   * @param {string} query the search string
   * @param {Object} [customParams = {}] custom query parameters
   */
  async search(query = '', customParams = {}) {
    // Search parameters
    const searchParams = {
      generator: 'search',
      gsrlimit: 5,
      gsrsearch: query,
    }
    const params = { ...defaultParams, ...searchParams, ...customParams }
    return request(`${BASE_URL}?${stringify(params)}`)
  },

  /**
   * Get one or more wikipedia pages by title. This can be used to batch
   * request a large number of pages with a single API call.
   *
   * We use this to get additional info about existing authors. For example,
   * when adding a new field like bio or description, we used this to batch
   * request data for all the existing authors, using the author's `link`
   * property as the `title` param.
   *
   * Titles can be any of the following formats:
   * 1. The normalized page title (example: 'A._A._Milne')
   * 2. The non-normalized page title (example: 'A. A. Milne')
   * 3. The full page url (example: 'https://en.wikipedia.org/wiki/A._A._Milne')
   *
   * @param {string[]} title An array of titles
   * @param {any} [customParams = {}] params for the wiki API
   */
  async getPagesByTitle(titles, customParams) {
    // if title is a full URL, extract the title from URL
    const parseTitle = str => String(str).replace(/[^/]+\/+/g, '')
    // The formatted `titles` param for the API
    const titlesParam = titles.map(parseTitle).join('|')
    // If title is a full URL, extract the title from URL
    const params = { ...defaultParams, titles: titlesParam, ...customParams }
    return request(`${BASE_URL}?${stringify(params)}`)
  },
}
export { api }
