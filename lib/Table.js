const CLITable = require('cli-table3')
const kebabCase = require('lodash/kebabCase')
const mapKeys = require('lodash/mapKeys')

function Table({ styles = {}, chars = {}, items, ...rest } = {}) {
  const params = {
    styles: mapKeys(styles, (_, key) => kebabCase(key)),
    chars: mapKeys(chars, (_, key) => kebabCase(key)),
    ...rest,
  }
  const table = new CLITable(params)

  if (items) {
    table.push(...items)
  }

  return table
}

exports.Table = Table
