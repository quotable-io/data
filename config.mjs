import * as path from 'path'
import { fileURLToPath } from 'url'

export const rootDir = path.dirname(fileURLToPath(import.meta.url))

export const dataDir = {
  // The source data
  source: path.join(rootDir, 'data'),
  // Generated data
  generated: path.join(rootDir, '../generated'),
}

export const cacheDir = path.join(rootDir, '.cache')
