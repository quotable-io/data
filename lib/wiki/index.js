import { findAuthorByName } from './findAuthorByName.js'
import { extractAuthorDetails } from './extractAuthorDetails.js'
import { getImageInfo } from './getImageInfo.js'
import { rateLimit } from './rateLimit.js'
import { api } from './api.js'

export const wiki = {
  api,
  findAuthorByName,
  extractAuthorDetails,
  getImageInfo,
  rateLimit,
}
