const toLower = require('lodash/toLower')
/**
 * Finds an author by name.
 *
 * @param {string} name
 * @param {{quotes: any[], authors: any[], tags: any[]}} db
 */
function findAuthorByName(name, db) {
  return db.authors.find(author => toLower(name) === toLower(author))
}
exports.findAuthorByName = findAuthorByName
