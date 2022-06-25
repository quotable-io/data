import { getImageInfo } from '../getImageInfo.js'

const ImageInfo = {
  title: expect.any(String),
  url: expect.any(String),
  size: expect.any(Number),
  width: expect.any(Number),
  height: expect.any(Number),
}

const ImageInfoError = {
  error: expect.any(String),
  title: expect.any(String),
}

describe('wiki > getImageInfo', () => {
  it(`Returns an Array of n objects`, async () => {
    const results = await getImageInfo(['foo', 'bar'])
    expect(results.length).toBe(2)
    results.forEach(result => {
      expect(result).toEqual(
        expect.objectContaining({ title: expect.any(String) })
      )
    })
  })
  it(`For each valid image title, returns an object containing image info`, async () => {
    const titles = ['A._P._J._Abdul_Kalam.jpg']
    const results = await getImageInfo(titles)
    expect(results[0]).toEqual(expect.objectContaining(ImageInfo))
  })

  it(`For each image title that does not exist, returns an object containing error message`, async () => {
    const titles = ['does not exist']
    const results = await getImageInfo(titles)
    expect(results[0]).toEqual(expect.objectContaining(ImageInfoError))
  })
})
