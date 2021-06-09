const { Bar, Presets } = require('cli-progress')

/**
 * @param {Object} config
 * @param {String} [config.title = ''] Text that will be displayed to the
 *     left of the progress bar. If omitted, no title will be shown.
 * @return {Bar}
 */
function createProgressBar({ title, ...options } = {}) {
  const baseFormat = `[{bar}] {percentage}% | {value}/{total}`
  const format = `${title || ''} ${baseFormat}`.trim()
  // Create a CLI progress bar
  return new Bar(
    {
      format: format.trim(),
      clearOnComplete: true,
      hideCursor: true,
      ...options,
    },
    Presets.shades_classic
  )
}

exports.createProgressBar = createProgressBar
