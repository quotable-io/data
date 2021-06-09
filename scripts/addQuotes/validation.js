const omit = require('lodash/omit')
const { ajv } = require('../../lib/ajv')
const { properties } = require('../../schema/models/Quote')

// Schema for the input data
const validateInput = ajv.compile({
  name: 'addQuotes inputs',
  type: 'array',
  items: {
    type: 'object',
    properties: omit(properties, ['_id']),
    required: ['author', 'content'],
    additionalProperties: false,
  },
})

exports.validateInput = validateInput
