import { api } from '../api.js'

describe('wiki api > search', () => {
  it(`Returns an array of search results sorted by score`, async () => {
    const query = 'Fred Hampton'
    const results = await api.search(query)
    results.forEach(result => {
      expect(result.title).toEqual(expect.any(String))
      expect(result.pageid).toEqual(expect.any(Number))
    })
  })
})

describe('wiki > api > getPagesByTitle', () => {
  it(`Returns matching page each valid title. Titles can be normalized, 
  non-normalized, or the full page url.`, async () => {
    const titles = [
      // Normalized title
      'A._A._Milne',
      // Non-normalized title
      'Alexander the Great',
      // Canonical URL
      'https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam',
    ]
    const results = await api.getPagesByTitle(titles)
    expect(results.length).toEqual(titles.length)
  })
})
