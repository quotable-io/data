import { omit } from 'lodash-es'
import { ajv } from '../../lib/ajv.js'
import { properties } from '../../schema/models/Quote.js'

// Schema for the input data
const validateInput = ajv.compile({
  title: 'addQuotes inputs',
  type: 'array',
  items: {
    type: 'object',
    properties: omit(properties, ['_id']),
    required: ['author', 'content'],
    additionalProperties: false,
  },
})

export { validateInput }
