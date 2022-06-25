const figures = require('figures')
import { isString } from 'lodash-es'

function truncate(value, length = 70) {
  if (isString(value) && value.length > length) {
    return `${value.slice(0, length)} ${figures.ellipsis}`
  }
  return value
}

export { truncate }
