const path = require('path')

exports.dataDir = {
  // The source data
  source: path.join(__dirname, '../data'),
  // Generated data
  generated: path.join(__dirname, '../../generated'),
}

exports.cacheDir = path.join(__dirname, '../.cache')

exports.rootDir = path.join(__dirname, '../')
