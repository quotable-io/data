const path = require('path')
const fs = require('fs')
const { isJSONFile } = require('./isJSONFile')

/**
 *  Reads and parses the database files.
 */
function parseDataFiles(DIR) {
  if (!fs.existsSync(DIR)) {
    throw new Error(`Does not exist \n ${DIR}`)
  }
  const files = fs.readdirSync(DIR).filter(isJSONFile)
  return files.reduce((data, FILE) => {
    const documents = JSON.parse(fs.readFileSync(path.resolve(DIR, FILE)))
    return { ...data, [path.basename(FILE, '.json')]: documents }
  }, {})
}

export { parseDataFiles }
