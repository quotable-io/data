const { extractAuthorDetails } = require('../extractAuthorDetails')
const examplePage = require('../__fixtures__/example-page.json')

describe('wiki.extractAuthorDetails', () => {
  it(`Returns the expected response`, async () => {
    const authorDetails = extractAuthorDetails(examplePage)
    expect(authorDetails).toMatchSnapshot()
  })
})
