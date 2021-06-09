const { isContentEqual } = require('./isContentEqual')

/**
 * Finds a quote with equal or similar content
 *
 * @param {string} content
 * @param {{quotes: any[], authors: any[]}} db the database collections (JSON)
 */
function findQuoteByContent(content, db) {
  return db.quotes.find(quote => isContentEqual(quote.content, content))
}

exports.findQuoteByContent = findQuoteByContent
