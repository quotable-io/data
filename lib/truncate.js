const figures = require('figures')
const isString = require('lodash/isString')

function truncate(value, length = 70) {
  if (isString(value) && value.length > length) {
    return `${value.slice(0, length)} ${figures.ellipsis}`
  }
  return value
}

exports.truncate = truncate
