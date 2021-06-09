const { stringify } = require('query-string')
const get = require('lodash/get')
const fetch = require('node-fetch')
const { log } = require('../log')

const BASE_URL = `https://en.wikipedia.org/w/api.php`

// The properties
// @see https://www.mediawiki.org/wiki/API:Properties
const pageProperties = [
  'pageimages',
  'description',
  'categories',
  'info',
  'extracts',
]

// Base params used on all wiki API requests
const baseParams = {
  origin: '*',
  format: 'json',
  action: 'query',
  formatversion: 2,
}

// These are the default params we use for page queries.
// https://www.mediawiki.org/wiki/API:Query
const defaultParams = {
  ...baseParams,
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
    const response = await fetch(url)
    const json = await response.json()
    const rawResults = get(json, 'query.pages', [])
    return rawResults.sort((a, b) => a.index - b.index)
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
   * We use this to get additional info about existing authors.
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
exports.api = api
