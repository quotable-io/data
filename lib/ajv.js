const Ajv = require('ajv')
const mapValues = require('lodash/mapValues')
const addFormats = require('ajv-formats')

/**
 * A global instance of Ajv
 */
const ajv = new Ajv({ allErrors: true, useDefaults: true })
addFormats(ajv)
exports.ajv = ajv

/**
 * Takes an object in which the values are JSON schemas and compiles them
 * with ajv. The return value is a new object in which the values are the
 * the compiled schema.
 */
const compile = schemas => mapValues(schemas, schema => ajv.compile(schema))

exports.compile = compile
