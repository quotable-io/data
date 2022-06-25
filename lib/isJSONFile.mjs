import * as path from 'path'

/** Returns true if a file path has .json extension */
export function isJSONFile(FILE) {
  return /\.jsonc?/.test(path.extname(FILE))
}
