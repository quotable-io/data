import { extractAuthorDetails } from '../extractAuthorDetails.mjs'
import examplePage from '../__fixtures__/example-page.json'

describe('wiki.extractAuthorDetails', () => {
  it(`Returns the expected response`, async () => {
    const authorDetails = extractAuthorDetails(examplePage)
    expect(authorDetails).toMatchSnapshot()
  })
})
