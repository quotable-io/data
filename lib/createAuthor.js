const shortid = require('shortid')
const isString = require('lodash/isString')
const select = require('@inquirer/select')
const chalk = require('chalk')
const wrap = require('word-wrap')
const { wiki } = require('./wiki')

/**
 * Displays a command line select menu that allows the user to select the
 * correct person from a list of suggestions returned by the wiki API.
 *
 * @param {string} inputName the provided author name
 * @param {{name: string, description: string}[]} results the array of results
 * @return {Promise<number|false>} The index of the selected result. If the user
 *     selected "None", the promise will resolve to `false`.
 */
async function authorPrompt(inputName, results) {
  /**
   * This formats the `description` that is displayed below the list of choices.
   * It shows a description of currently highlighted author.
   */
  const formatDescription = value => {
    const width = Math.min(process.stdout.columns, 75)
    const description = wrap(chalk.dim(value || ''), { indent: '  ', width })
    const separator = chalk.dim(`  ${'—'.padEnd(73, '—')}`)
    return `${separator}\n${description}`
  }

  const choices = results.map(({ name, description }, idx) => {
    // Creates an input option for each
    return { name, description: formatDescription(description), value: idx }
  })

  // This choice can be used if none of the suggested pages are correct
  const none = { value: false, name: 'None of the above' }
  return select({
    name: 'author',
    message: `Select the wikipedia page for author "${inputName}": `,
    choices: [...choices, none],
  })
}

/**
 * Creates an `Author` entry from input. The only required input property is
 * the author name.  The remaining author properties will be pulled from
 * wikipedia using the wiki API.
 *
 * @async
 */
async function createAuthor(input) {
  const inputObject = isString(input) ? { name: input } : input
  const { name: inputName, ...otherInputFields } = inputObject
  // Find the author's wikipedia page. This will return multiple results if
  // A) There is more than one person on wikipedia with the given name
  // B) There is no person on wikipedia with this exact name. In this case,
  //    it will return the five closest matches.
  const wikiResults = await wiki.findAuthorByName(inputName)
  let [authorWiki] = wikiResults

  // If `wiki.findAuthorByName` returned multiple matches...
  if (wikiResults.length > 1) {
    // The script will prompt the user to select the correct person from the
    // list of possible matches.
    const selectedResultIndex = await authorPrompt(inputName, wikiResults)
    if (selectedResultIndex === false) {
      // If the user selected "None of the above" then we exit here.
      throw new Error(`Could not find wikipedia entry for for ${inputName}`)
    }
    authorWiki = wikiResults[selectedResultIndex]
  }

  // Create the `Author` entry. Any properties included on the input object
  // will take priority over values pulled from the wikipedia page.
  const Author = {
    _id: shortid(),
    name: authorWiki.name,
    bio: authorWiki.bio,
    description: authorWiki.description,
    link: authorWiki.link,
    ...otherInputFields,
  }

  return Author
}

exports.createAuthor = createAuthor
