const isEqualWith = require('lodash/isEqualWith')
const omit = require('lodash/omit')
const isArray = require('lodash/isArray')
const sortBy = require('lodash/sortBy')

/**
 * Customized version of lodash isEqual.
 *
 * Compares two objects using deep equality. This is used to compare objects in
 * database collections to see if they have changed. It ignores timestamp
 * properties.
 */
function isEqual(...objects) {
  // Ignore timestamp properties
  const [a, b] = objects.map(obj => omit(obj, ['dateAdded', 'dateModified']))
  // Check if object `a` and `b` are deep equal.
  return isEqualWith(a, b, (value, otherValue) => {
    // Array properties are considered equal if they both contain the same
    // elements (order does not matter).
    if (isArray(value) && isArray(otherValue)) {
      return isEqualWith(...[value, otherValue].map(sortBy))
    }
  })
}

exports.isEqual = isEqual
