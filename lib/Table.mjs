import CLITable from 'cli-table3'
import { kebabCase } from 'lodash-es'
import { mapKeys } from 'lodash-es'

export function Table({ styles = {}, chars = {}, items, ...rest } = {}) {
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
