import * as path from 'path'
import * as fs from 'fs'
import { isJSONFile } from './isJSONFile.js'

/**
 *  Reads and parses the database files.
 */
export function parseDataFiles(DIR) {
  if (!fs.existsSync(DIR)) {
    throw new Error(`Does not exist \n ${DIR}`)
  }
  const files = fs.readdirSync(DIR).filter(isJSONFile)
  return files.reduce((data, FILE) => {
    const documents = JSON.parse(fs.readFileSync(path.resolve(DIR, FILE)))
    return { ...data, [path.basename(FILE, '.json')]: documents }
  }, {})
}
