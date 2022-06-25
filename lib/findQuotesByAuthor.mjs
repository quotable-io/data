/**
 * Filter quotes by author name
 *
 * @param {string} author the author name
 * @param {{quotes: any[], authors: any[], tags: any[]}} db
 */
export function findQuotesByAuthor(author, db) {
  const name = typeof author === 'object' ? author.name : author
  return db.quotes.filter(quote => quote.author === name)
}
