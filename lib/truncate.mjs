import figures from 'figures'
import { isString } from 'lodash-es'

export function truncate(value, length = 70) {
  if (isString(value) && value.length > length) {
    return `${value.slice(0, length)} ${figures.ellipsis}`
  }
  return value
}
