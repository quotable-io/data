import { findAuthorByName } from './findAuthorByName.mjs'
import { extractAuthorDetails } from './extractAuthorDetails.mjs'
import { getImageInfo } from './getImageInfo.mjs'
import { rateLimit } from './rateLimit.mjs'
import { api } from './api.mjs'

export const wiki = {
  api,
  findAuthorByName,
  extractAuthorDetails,
  getImageInfo,
  rateLimit,
}
