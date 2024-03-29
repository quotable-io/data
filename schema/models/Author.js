import { types } from '../types.js'

// Author properties
export const properties = {
  _id: types.id,
  name: types.nonEmptyString,
  aka: { type: 'array', items: types.nonEmptyString, default: [] },
  bio: types.nonEmptyString,
  description: { type: 'string', minLength: 1, maxLength: 50 },
  link: { type: 'string', format: 'uri', minLength: 1 },
}

// Computed properties
export const computedProperties = {
  slug: types.slug,
  quoteCount: { type: 'integer' },
  dateAdded: types.nonEmptyString,
  dateModified: types.nonEmptyString,
}

/**
 * Schema for a single `Author` (source)
 * This is the schema for authors in the source data (`data/source`). Source
 * data does not include computed properties.
 */
export const AuthorSource = {
  title: 'Author',
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
}

/**
 * Schema for a single `Author`
 * This is the schema for a single Author in the generated data files files
 * that are synced with the mongodb database. It includes additional computed
 * properties that not included in the source data.
 */
export const Author = {
  title: 'Author',
  type: 'object',
  properties: { ...properties, ...computedProperties },
  required: [...Object.keys(properties), ...Object.keys(computedProperties)],
  additionalProperties: false,
}

export const authors = { type: 'array', items: Author }
