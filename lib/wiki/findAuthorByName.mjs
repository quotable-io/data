import { isEqual } from 'lodash-es'
import { extractAuthorDetails } from './extractAuthorDetails.mjs'
import { api } from './api.mjs'

/**
 * Check to see if a wikipedia page returned by api is for a person.
 * There is no official way to do this. We check for a "Births YYYY"
 * category.
 */
const isPerson = page => {
  const { categories = [] } = page
  return categories.some(({ title }) => /births/.test(title))
}

const normalizeName = str => {
  return str.replace(/\s*\(.+\)\s*/g, '').toLowerCase()
}

/**
 * Uses the wiki API to search for pages matching the given author name.
 * It returns an array of matching pages. Returns an empty array if no
 * matching pages are found.
 */
export async function findAuthorByName(name) {
  const rawResults = await api.search(name)
  // Search for pages matching the given author `name`
  const results = rawResults
    // 1. Filter the search results to only include pages for people
    .filter(isPerson)
    // 2. Extract author details from search results. This maps the results to
    // an array of `Author` objects, which can be used to create a new entry in
    // the authors collection.
    .map(extractAuthorDetails)

  // Only includes results that are an exact match for the author name
  const exactMatches = results.filter(result => {
    return isEqual(...[result.name, name].map(normalizeName))
  })
  // If any of the results were an exact match for the given name, we only
  // return those
  return exactMatches.length ? exactMatches : results
}

// ;(async () => {
//   const results = await findAuthorByName('Pete Seger')
//   console.log(results.map(r => r.name))
// })()
