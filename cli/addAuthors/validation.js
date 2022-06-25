import { omit } from 'lodash-es'
import { ajv } from '../../lib/ajv.js'
import { properties } from '../../schema/models/Author.js'

// Schema for the input data
const validateInput = ajv.compile({
  title: 'addAuthors input',
  type: 'array',
  items: {
    type: 'object',
    properties: omit(properties, ['_id']),
    required: ['name'],
    additionalProperties: false,
  },
})

export { validateInput }
