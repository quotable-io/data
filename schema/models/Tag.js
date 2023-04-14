import { types } from '../types.js'

export const properties = {
  _id: types.id,
  name: types.title,
}

export const computedProperties = {
  slug: types.slug,
  quoteCount: { type: 'integer' },
  dateAdded: types.nonEmptyString,
  dateModified: types.nonEmptyString,
}

/**
 * Schema for a single `Tag` (source)
 * This is the schema for tags in the source data (`data/source`). Source
 * data does not include computed properties.
 */
export const TagSource = {
  title: 'Tag',
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
}

/**
 * Schema for a single `Tag`
 * This is the schema for a single Tag in the generated data files files
 * that are synced with the mongodb database. It includes additional computed
 * properties that not included in the source data.
 */
export const Tag = {
  title: 'Tag',
  type: 'object',
  properties: { ...properties, ...computedProperties },
  required: [...Object.keys(properties), ...Object.keys(computedProperties)],
  additionalProperties: false,
}

export const tags = {
  type: 'array',
  items: Tag,
}

// Named Exports
// export { TagSource }
// export { Tag }
// export { tags }
// export { properties }
// export { computedProperties }
