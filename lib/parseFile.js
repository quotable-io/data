import * as fs from 'fs'

export function parseFile(PATH) {
  if (!fs.existsSync(PATH)) {
    throw new Error(`The specified file does not exist\n${PATH}`)
  }
  return JSON.parse(fs.readFileSync(PATH, 'utf-8'))
}
