import * as path from 'path'
import { toString, isEmpty } from 'lodash-es'
import { log } from '../log.js'
import { api } from './api.js'

const getFileName = title => {
  const str = toString(title)
  return str.startsWith('File:') ? str : `File:${str}`
}

/**
 * Gets the full URL for one or more wikipedia images.
 *
 * This can be used to get the full URL for various types of images in API
 * results.
 *
 * @param {string[]} titles An array of image titles
 * @param {any} customParams custom params for the wiki API
 * @return {Promise<Array<{
 *   title: string
 *   url: string
 *   width: number
 *   height: number
 *   size: number
 * }>>} Array of objects containing image info
 * @async
 * @see https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bimageinfo
 */
export async function getImageInfo(titles, customParams = {}) {
  try {
    const params = {
      prop: 'imageinfo',
      iiprop: 'url|canonicaltitle|size|mediatype',
      ...customParams,
    }
    const results = await api.getPagesByTitle(titles.map(getFileName), params)

    return results.map(({ imageinfo: imageInfo, title }) => {
      if (isEmpty(imageInfo)) {
        // If the image doesn't exist, return an object with error message
        return { title, error: `${title} does not exist` }
      }

      const format = (path.extname(title) || '').replace('.', '')
      return { title: title.replace(/file:/i, ''), format, ...imageInfo[0] }
    })
  } catch (error) {
    log.error(error)
    return []
  }
}
