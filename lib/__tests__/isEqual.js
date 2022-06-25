import { isEqual } from '../isEqual.mjs'

describe('utils > isEqual', () => {
  it(`Returns true if object are deep equal`, () => {
    const a = { one: 'foo', two: 'bar', arr: [1, 2] }
    const b = { one: 'foo', two: 'bar', arr: [2, 1] }
    expect(isEqual(a, b)).toBe(true)
  })
})
