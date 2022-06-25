import { omit } from 'lodash-es'
const { ajv } = require('../../lib/ajv')
const { properties } = require('../../schema/models/Quote')

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
