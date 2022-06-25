const slugify = require('@lukepeavey/slugify')

function findQuotesByTag(tag, db) {
  const slug = slugify(tag)
  return db.quotes.filter(quote => quote.tags.includes(slug))
}
export { findQuotesByTag }
