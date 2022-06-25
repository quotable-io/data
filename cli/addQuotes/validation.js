import { omit } from 'lodash-es'
import { ajv } from '../../lib/ajv.mjs'
import { properties } from '../../schema/models/Quote.mjs'

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
