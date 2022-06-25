import Ajv from 'ajv'
import { mapValues } from 'lodash-es'
import addFormats from 'ajv-formats'

/**
 * A global instance of Ajv
 */
const ajv = new Ajv({ allErrors: true, useDefaults: true })
addFormats(ajv)
export { ajv }

/**
 * Takes an object in which the values are JSON schemas and compiles them
 * with ajv. The return value is a new object in which the values are the
 * the compiled schema.
 */
const compile = schemas => mapValues(schemas, schema => ajv.compile(schema))

export { compile }
