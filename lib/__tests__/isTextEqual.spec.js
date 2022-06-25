import { isContentEqual } from '../isContentEqual.js'

describe('utils > isContentEqual', () => {
  it('Returns a boolean', () => {
    expect(isContentEqual('a', 'b')).toEqual(expect.any(Boolean))
  })

  it('Returns true if the strings are equal', () => {
    expect(isContentEqual('a rabbit', 'the rabbit')).toBe(true)
  })

  it(`Ignores punctuation, case, and stop words when comparing strings`, () => {
    // Ignores punctuation and case.
    expect(isContentEqual('Hello!', 'hello.')).toBe(true)
    // Ignores english stop words
    expect(
      isContentEqual(
        'All wisdom does not reside in Delhi.',
        "Wisdom doesn't reside in Delhi."
      )
    ).toBe(true)
  })
})
