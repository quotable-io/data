import { findAuthorByName } from '../findAuthorByName.mjs'

describe('wiki > findAuthorByName', () => {
  it(`Takes an author name and returns an array of matching wikipedia pages, sorted by score with the best match first`, async () => {
    const authorName = 'Fred Hampton'
    const results = await findAuthorByName(authorName)
    expect(results).toEqual(expect.any(Array))
    expect(results[0].name).toEqual(authorName)
  })

  it(`Returns an error object if no page could be found for the
  provided name`, async () => {
    // wiki API will not find any matching pages for this query
    const name = 'abcdaddf2edaffff2efasdf2'
    const results = await findAuthorByName(name)
    expect(results).toEqual([])
  })
})
