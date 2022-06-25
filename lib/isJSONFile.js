const path = require('path')

/** Returns true if a file path has .json extension */
function isJSONFile(FILE) {
  return /\.jsonc?/.test(path.extname(FILE))
}

export { isJSONFile }
