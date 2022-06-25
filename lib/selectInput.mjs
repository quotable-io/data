import selectBase from '@inquirer/select'
import chalk from 'chalk'
import wrap from 'word-wrap'

export async function select({ message, options, none = true }) {
  /**
   * This formats the `description` that is displayed below the list of choices.
   * It shows a description of currently highlighted author.
   */
  const formatDescription = value => {
    const width = Math.min(process.stdout.columns, 75)
    const description = wrap(chalk.dim(value || ''), { indent: '  ', width })
    const separator = chalk.dim(`  ${'—'.padEnd(73, '—')}`)
    return `${separator}\n${description}`
  }

  const choices = [
    ...options.map(obj => ({
      name: obj.name || obj.title,
      description: formatDescription(obj.description),
      value: obj.value || obj,
    })),
    none && { name: 'None of the above', value: false },
  ]
  return selectBase({ name: 'select', message, choices })
}
