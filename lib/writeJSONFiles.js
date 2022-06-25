const fs = require('fs')
const prettier = require('prettier')
const path = require('path')

/**
 * Writes JSON data to files on disk. The JSON is formatted using Prettier to
 * match to code formatting style of the project.
 *
 * @signature writeJSONFiles(files)
 *
 * @param {{[path: string]: any}} files An object map of files to create. Each
 *     key should be a file path and the value should be the JSON data that
 *     will be written to that file. File paths are resolved relative to the
 *     project root.
 * @return {void}
 *
 * @signature writeJSONFiles(dir, files)
 *
 * When called with two arguments, the first argument `dir` is the base
 * directory in which files will be created. The second argument is the files
 * object. In this case, file paths will be resolved relative to `dir`
 *
 * @param {string} dir The root directory in which files will be created. Each
 *     file path in the `files` object will be created relative to this
 *     directory.
 * @param {{[path: string]: any}} files A map of files to create. Each key
 *     should be a file path and the value the data that will be written to
 *     that file. The file paths are resolved relative to `dir`
 * @return {void}
 *
 * @signature writeJSONFiles(files)
 *
 *
 * @example
 * const DEST = 'some/path'
 * const data = { quotes: [], authors: [] }
 * writeJSONFiles(DEST, data)
 */
async function writeJSONFiles(...args) {
  const [files, DIR = ''] = args.length === 1 ? args : args.reverse()
  // Get the Prettier settings for the project
  const prettierBaseConfig = await prettier.resolveConfig(process.cwd())
  // Set the parser to 'json'
  const prettierConfig = { ...prettierBaseConfig, parser: 'json' }

  Object.entries(files).forEach(([NAME, data]) => {
    // If the file name doesn't have an extension, use '.json'
    const PATH = path.resolve(DIR, path.extname(NAME) ? NAME : `${NAME}.json`)
    // Create the directory recursively if it doesn't exist
    if (!fs.existsSync(path.dirname(PATH))) {
      fs.mkdirSync(path.dirname(PATH), { recursive: true })
    }
    const formattedJSON = prettier.format(JSON.stringify(data), prettierConfig)
    fs.writeFileSync(PATH, formattedJSON)
  })
}

export { writeJSONFiles }
