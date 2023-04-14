import { omit } from 'lodash-es'
import { ajv } from '../../lib/ajv.js'
import { properties } from '../../schema/models/Quote.js'
import { types } from '../../schema/types.js'

// Schema for the input data
const validateInput = ajv.compile({
  title: 'addQuotes inputs',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      ...omit(properties, ['_id']),
      tags: { type: 'array', items: types.nonEmptyString },
    },
    required: ['author', 'content'],
    additionalProperties: false,
  },
})

export { validateInput }
