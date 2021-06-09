#!/usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const figures = require('figures')
const mapValues = require('lodash/mapValues')
const add = require('lodash/add')
const minimist = require('minimist')
const path = require('path')
const { parse } = require('json-source-map')
const { Author, AuthorSource } = require('../../schema/models/Author')
const { compile } = require('../../lib/ajv')
const { dataDir } = require('../../config')
const { isJSONFile } = require('../../lib/isJSONFile')
const { log } = require('../../lib/log')
const { Quote, QuoteSource } = require('../../schema/models/Quote')
const { run } = require('../../lib/run')
const { Tag, TagSource } = require('../../schema/models/Tag')
const { truncate } = require('../../lib/truncate')

const Errors = {
  invalidTarget: `Invalid CLI arguments <target> should be "source" | "generated"`,
}

/** Parses and validates CLI args */
function parseArgs() {
  const args = minimist(process.argv.slice(2))
  const DEBUG = args.b || args.debug
  const VERBOSE = args.v || args.verbose
  const TARGET = args._[0] || 'generated'
  if (!/^(source|generated)$/.test(TARGET)) {
    throw new Error(Errors.invalidTarget)
  }
  return { DEBUG, VERBOSE, TARGET }
}

const schemas = {
  source: compile({
    authors: AuthorSource,
    quotes: QuoteSource,
    tags: TagSource,
  }),
  generated: compile({ authors: Author, quotes: Quote, tags: Tag }),
}

/**
 * Returns an array of data files to validate. Each item in the array is object
 * containing the file name and corresponding validation function.
 *
 * @param {"source" | "generated"} TARGET the target data directory
 * @return {Array<{FILE: string, validate: Ajv.ValidateFunction}>}.
 */
function getDataFiles(TARGET) {
  const DIR = dataDir[TARGET]
  if (!fs.existsSync(DIR)) {
    throw new Error(`Data directory does not exist \n${DIR}`)
  }
  const files = fs.readdirSync(DIR).filter(isJSONFile)
  return files.reduce((acm, FILE) => {
    const validate = schemas[TARGET][path.basename(FILE, '.json')]
    return validate ? [...acm, { FILE, validate }] : acm
  }, [])
}

/**
 * Gets the location of a validation error
 * @param {Ajv.ValidationError} error
 * @param {number} index the index of the object in which the error occurred
 * @param {Object} pointers pointers returned by json-source-map
 * @return {{line: number, column: number}} location of the error
 */
function getErrorLocation(error, index, pointers) {
  const { dataPath, params } = error
  const { additionalProperty } = params
  const property = String(additionalProperty || dataPath).replace(/\./g, '')
  const pointer = pointers[property ? `/${index}/${property}` : `/${index}`]
  const { line, column } = pointer.value
  return { line: line + 1, column }
}

/**
 * @param {Ajv.ValidationError} error
 * @return {string} The message to be displayed for a given validation error
 */
function getMessage(error) {
  const { dataPath, params } = error
  const { additionalProperty } = params
  let { message } = error
  if (dataPath) message = `'${dataPath.slice(1)}' ${message}`
  if (additionalProperty) message = `${message}: '${additionalProperty}'`
  // Add syntax highlighting for strings contained within the error message.
  // This will highlight property names
  return `${message.replace(/'[a-z\s.]+'/i, match => chalk.cyan(match))}`
}

function validateCollection(PATH, validate, verbose) {
  log.header(`Checking ${path.basename(PATH, '.json')}...  `)
  const { data, pointers } = parse(fs.readFileSync(PATH, 'utf-8'))
  const { schema } = validate
  let errorCount = 0
  // Iterate through the items in this collection; validate each object to
  // check that it matches the schema for this object type.
  data.forEach((object, index) => {
    const isValid = validate(object)
    if (!isValid) {
      if (errorCount > 0) log[verbose ? 'divider' : 'newLine']()
      log.error(`Invalid ${schema.name}`)
      // If `VERBOSE` is true, also output the object where error occurred.
      if (verbose) log(mapValues(object, value => truncate(value)))
      // Out details for each validation error on this object
      validate.errors.forEach(error => {
        const { column, line } = getErrorLocation(error, index, pointers)
        log(getMessage(error))
        log.link(`${path.join(PATH)}:${line}:${column}`)
        errorCount += 1
      })
    }
  })
  if (!errorCount) {
    log.success(
      `${figures.tick} no validation errors in ${path.basename(PATH)}`
    )
  }
  return errorCount
}

run(async () => {
  const { TARGET, VERBOSE } = parseArgs()
  // Returns the number of validation errors in each file.
  const errorCounts = getDataFiles(TARGET).map(({ FILE, validate }) => {
    const PATH = path.join(dataDir[TARGET], FILE)
    return validateCollection(PATH, validate, VERBOSE)
  })
  // Total number of validation errors for all files.
  const totalErrors = add(...errorCounts)
  // If there were any errors, log a message and exit
  if (totalErrors) {
    log.newLine()
    log(`Validation failed`)
    log('Done')
    process.exit(1)
  }
})
